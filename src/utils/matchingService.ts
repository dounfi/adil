import {
  ArsipData,
  KaryaTeks,
  MatchResult,
  MatchedPosterResult,
  MatchedTextResult,
  VisualFeatures,
} from '../types/arsip';
import {
  calculateHammingDistance,
  calculateHistogramIntersection,
  calculateLayoutSimilarity,
} from './visualFeatureExtractor';
import { WORKS } from '../lib/works';
import { cosineSimilarity, generateTextEmbedding } from './embeddingService';

/**
 * Fallback Arsip Data jika file static /arsip_features.json belum tersedia atau gagal dimuat.
 */
export const FALLBACK_ARSIP_DATA: ArsipData = {
  versi: '2026-10-03-fallback',
  config: {
    bobot: {
      teks: 0.35,
      konsep: 0.35,
      semantic: 0.3,
      ocr: 0.5,
      dhash: 0.4,
      layout: 0.4,
      color: 0.2,
    },
    ambang_band: {
      rendah_maks: 0.35,
      sedang_maks: 0.6,
    },
    ambang_hash: {
      hampir_identik_maks: 4,
      mirip_maks: 10,
    },
    ambang_layout: {
      mirip_min: 0.7,
    },
  },
  stopwords: [
    'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'dengan', 'adalah', 'ini', 'itu',
    'pada', 'atau', 'sebagai', 'dalam', 'akan', 'bisa', 'ada', 'tidak', 'juga',
    'sudah', 'lebih', 'agar', 'supaya', 'oleh', 'karena', 'bagi', 'para', 'serta',
    'antara', 'seperti', 'telah', 'kepada', 'yaitu', 'yakni', 'ialah', 'pun',
    'hanya', 'sangat', 'pula', 'lagi', 'per', 'secara', 'mereka', 'kita', 'kamu',
    'dia', 'saya', 'aku', 'nya', 'mu', 'ku', 'lah', 'kah', 'tah',
  ],
  teks: WORKS.map((w) => ({
    id: w.id,
    judul: w.title,
    tahun: w.year,
    lomba: w.competition,
    institusi: w.institution,
    kategori: w.category,
    ringkasan: w.summary,
    keyphrases: w.keyphrases,
    sumber_url: w.sourceUrl,
  })),
  gambar: [
    {
      id: 'A001',
      judul: 'Poster Edukasi Inovasi Gemastik',
      tahun: 2024,
      lomba: 'Gemastik XVII',
      institusi: 'Universitas Indonesia',
      kategori: 'POSTER',
      dhash: 'f0e1d2c3b4a59687',
      layout: Array(256).fill(128),
      color_hist: Array(64).fill(1 / 64),
      ocr_teks: 'Model klasifikasi laporan masyarakat berbasis multimodal transformer CRM Jakarta',
      sumber_url: 'https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik',
    },
  ],
};

let cachedArsipData: ArsipData | null = null;

/**
 * Memuat database arsip static dari /arsip_features.json.
 * Jika berkas belum ada di server, otomatis mengembalikan fallback state yang aman.
 */
export async function loadArsipData(): Promise<ArsipData> {
  if (cachedArsipData) return cachedArsipData;

  try {
    const response = await fetch('/arsip_features.json');
    if (response.ok) {
      const data: ArsipData = await response.json();
      if (data && Array.isArray(data.teks) && data.teks.length > 0) {
        cachedArsipData = data;
        return data;
      }
    }
  } catch (error) {
    console.warn('Gagal memuat /arsip_features.json, menggunakan fallback data lokal:', error);
  }

  cachedArsipData = FALLBACK_ARSIP_DATA;
  return FALLBACK_ARSIP_DATA;
}

// Kata-kata umum dalam domain lomba/aplikasi yang tidak boleh memicu kemiripan konsep palsu
export const GENERIC_DOMAIN_WORDS = new Set([
  'aplikasi',
  'sistem',
  'platform',
  'model',
  'metode',
  'berbasis',
  'untuk',
  'dengan',
  'pengembangan',
  'rancang',
  'bangun',
  'teknologi',
  'fitur',
  'solusi',
  'inovasi',
  'buat',
  'lewat',
  'media',
]);

/**
 * Tokenisasi teks Bahasa Indonesia dengan menghapus tanda baca dan stopwords.
 */
export function tokenizeText(text: string, stopwordsList?: string[]): string[] {
  const stops = new Set([
    ...(stopwordsList && stopwordsList.length > 0
      ? stopwordsList
      : FALLBACK_ARSIP_DATA.stopwords),
    ...GENERIC_DOMAIN_WORDS,
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9à-ÿ\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stops.has(w));
}

/**
 * Menghitung TF-IDF Cosine Similarity antara kueri dan dokumen arsip.
 */
function calculateTfidfCosine(
  queryTokens: string[],
  docTokens: string[],
  df: Map<string, number>,
  nDocs: number
): number {
  if (!queryTokens.length || !docTokens.length) return 0;
  const idf = (t: string) => Math.log(1 + nDocs / (1 + (df.get(t) ?? 0)));

  const qtf = new Map<string, number>();
  const dtf = new Map<string, number>();
  for (const t of queryTokens) qtf.set(t, (qtf.get(t) ?? 0) + 1);
  for (const t of docTokens) dtf.set(t, (dtf.get(t) ?? 0) + 1);

  let dot = 0;
  let qn = 0;
  let dn = 0;

  qtf.forEach((c, t) => {
    const w = c * idf(t);
    qn += w * w;
  });

  dtf.forEach((c, t) => {
    const w = c * idf(t);
    dn += w * w;
  });

  qtf.forEach((c, t) => {
    if (dtf.has(t)) {
      dot += c * idf(t) * (dtf.get(t)! * idf(t));
    }
  });

  const norm = Math.sqrt(qn) * Math.sqrt(dn);
  return norm ? Number((dot / norm).toFixed(4)) : 0;
}

/**
 * Mencari irisan keyphrase antara teks pengguna dan keyphrase karya arsip.
 * Menggunakan boundary word regex agar substring sembarangan (misal "ai" di dalam "sains") tidak cocok palsu.
 */
function findSharedPhrases(inputText: string, keyphrases: string[]): string[] {
  if (!keyphrases || !keyphrases.length || !inputText) return [];
  const cleanInput = inputText.toLowerCase();

  return keyphrases.filter((kp) => {
    const cleanKp = kp.trim().toLowerCase();
    if (!cleanKp || cleanKp.length < 2) return false;

    // Abaikan kata generik tunggal seperti "aplikasi", "sistem", dll.
    if (GENERIC_DOMAIN_WORDS.has(cleanKp)) return false;

    // Boundary check untuk kata/frasa utuh agar "ai" tidak cocok dengan "sains", "pantai", dll.
    const escaped = cleanKp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wholePhraseRegex = new RegExp(`(^|[^a-z0-9à-ÿ])${escaped}($|[^a-z0-9à-ÿ])`, 'i');
    if (wholePhraseRegex.test(cleanInput)) return true;

    // Multi-kata (misal: "lapor warga", "klasifikasi multimodal")
    const words = cleanKp.split(/\s+/).filter((w) => w.length > 2 && !GENERIC_DOMAIN_WORDS.has(w));
    if (words.length > 1) {
      return words.every((w) => {
        const wEscaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`(^|[^a-z0-9à-ÿ])${wEscaped}($|[^a-z0-9à-ÿ])`, 'i').test(cleanInput);
      });
    }

    return false;
  });
}

/**
 * Menghitung Jaccard Word Similarity sederhana.
 */
export function calculateWordSimilarity(textA: string, textB: string): number {
  if (!textA || !textB) return 0;
  const setA = new Set(tokenizeText(textA));
  const setB = new Set(tokenizeText(textB));
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  setA.forEach((word) => {
    if (setB.has(word)) intersection++;
  });

  const union = new Set([...setA, ...setB]).size;
  return Number((intersection / union).toFixed(4));
}

/**
 * 1. PENCOCOKAN TEKS (Dokumen / Ketikan vs arsipData.teks)
 * Menghitung TF-IDF Cosine Similarity, Jaccard Concept Similarity, & Semantic Embedding Similarity.
 */
export function matchTextWithArsip(
  queryText: string,
  arsipData: ArsipData,
  userEmbedding?: number[] | null
): MatchedTextResult[] {
  const queryTokens = tokenizeText(queryText, arsipData.stopwords);
  const works = arsipData.teks || [];
  if (!works.length || !queryTokens.length) return [];

  // Hitung Document Frequency (DF)
  const docTokensList = works.map((w) =>
    tokenizeText(`${w.judul} ${w.ringkasan}`, arsipData.stopwords)
  );

  const df = new Map<string, number>();
  for (const tokens of docTokensList) {
    for (const t of new Set(tokens)) {
      df.set(t, (df.get(t) ?? 0) + 1);
    }
  }

  const weightTeks = arsipData.config?.bobot?.teks ?? 0.35;
  const weightKonsep = arsipData.config?.bobot?.konsep ?? 0.35;
  const weightSemantic = arsipData.config?.bobot?.semantic ?? 0.3;

  return works
    .map((karya, idx) => {
      const docTokens = docTokensList[idx] ?? [];
      const textScore = calculateTfidfCosine(queryTokens, docTokens, df, works.length);
      const sharedPhrases = findSharedPhrases(queryText, karya.keyphrases || []);
      const conceptScore = karya.keyphrases?.length
        ? Number((sharedPhrases.length / karya.keyphrases.length).toFixed(4))
        : 0;

      // Hitung skor kemiripan semantik menggunakan embedding jika tersedia
      let semanticScore = 0;
      if (userEmbedding && Array.isArray(karya.embedding) && karya.embedding.length > 0) {
        semanticScore = cosineSimilarity(userEmbedding, karya.embedding);
      }

      const karyaWordsSet = new Set(docTokens);
      const sharedWords = [...new Set(queryTokens)]
        .filter((w) => karyaWordsSet.has(w))
        .slice(0, 12);

      let combinedScore: number;
      if (userEmbedding && Array.isArray(karya.embedding) && karya.embedding.length > 0) {
        combinedScore = Number(
          (weightTeks * textScore + weightKonsep * conceptScore + weightSemantic * semanticScore).toFixed(4)
        );
      } else {
        const totalWeight = weightTeks + weightKonsep;
        combinedScore = Number(
          ((weightTeks / totalWeight) * textScore + (weightKonsep / totalWeight) * conceptScore).toFixed(4)
        );
      }

      return {
        id: karya.id,
        judul: karya.judul,
        textScore,
        conceptScore,
        semanticScore: userEmbedding ? semanticScore : undefined,
        combinedScore,
        sharedPhrases,
        sharedWords,
        karya,
      };
    })
    .sort((a, b) => b.combinedScore - a.combinedScore);
}

/**
 * 2. PENCOCOKAN VISUAL POSTER (Gambar vs arsipData.gambar)
 * Menghitung dHash Hamming Distance, Layout Similarity (16x16), dan Color Histogram.
 */
export function matchVisualWithArsip(
  userFeatures: VisualFeatures,
  arsipData: ArsipData,
  extractedOcrText?: string
): MatchedPosterResult[] {
  const posters = arsipData.gambar || [];
  if (!posters.length || !userFeatures) return [];

  const weightHash = arsipData.config?.bobot?.dhash ?? 0.4;
  const weightLayout = arsipData.config?.bobot?.layout ?? 0.4;
  const weightColor = arsipData.config?.bobot?.color ?? 0.2;

  const userOcrTokens = extractedOcrText
    ? new Set(tokenizeText(extractedOcrText, arsipData.stopwords))
    : null;

  return posters
    .map((poster) => {
      // Hamming Distance (0..64) -> Konversi ke skor kemiripan 0..1
      const hamming = calculateHammingDistance(userFeatures.dhash, poster.dhash);
      const dhashScore = Math.max(0, Number((1 - hamming / 32).toFixed(4)));

      // Layout Similarity (16x16) -> 0..1 (Pearson correlation)
      const layoutScore = poster.layout
        ? calculateLayoutSimilarity(userFeatures.layout, poster.layout)
        : 0;

      // Color Histogram (64 bin) -> 0..1 (Histogram Intersection)
      const colorScore = poster.color_hist
        ? calculateHistogramIntersection(userFeatures.colorHist, poster.color_hist)
        : 0;

      let ocrScore = 0;
      let sharedWords: string[] = [];
      if (extractedOcrText && poster.ocr_teks) {
        ocrScore = calculateWordSimilarity(extractedOcrText, poster.ocr_teks);
        if (userOcrTokens) {
          const archiveTokens = tokenizeText(poster.ocr_teks, arsipData.stopwords);
          sharedWords = [...new Set(archiveTokens.filter((w) => userOcrTokens.has(w)))].slice(0, 10);
        }
      }

      // Gabungkan skor visual (dHash 40% + Layout 40% + Warna 20%)
      let combinedScore = Number(
        (
          weightHash * dhashScore +
          weightLayout * layoutScore +
          weightColor * colorScore
        ).toFixed(4)
      );

      // Jika ada kesamaan teks OCR di kedua poster, pertimbangkan sedikit bobot OCR
      if (ocrScore > 0) {
        combinedScore = Number((0.85 * combinedScore + 0.15 * ocrScore).toFixed(4));
      }

      return {
        id: poster.id,
        judul: poster.judul,
        tahun: poster.tahun,
        lomba: poster.lomba,
        institusi: poster.institusi,
        tim: poster.tim,
        kategori: poster.kategori || "POSTER",
        peringkat: poster.peringkat,
        lisensi: (poster as { lisensi?: string }).lisensi,
        gambar_url: (poster as { gambar_url?: string }).gambar_url,
        dhash: poster.dhash,
        layout: poster.layout,
        color_hist: poster.color_hist,
        dhashScore,
        layoutScore,
        colorScore,
        ocrScore: ocrScore > 0 ? ocrScore : undefined,
        combinedScore,
        hammingDistance: hamming,
        ocrTeksArsip: poster.ocr_teks,
        sumber_url: poster.sumber_url,
        sharedWords,
      };
    })
    .sort((a, b) => b.combinedScore - a.combinedScore);
}

/**
 * 3. PENCOCOKAN OCR (Cross-Check Poster vs Poster & Poster vs Ide Karya Teks)
 */
export function matchOCRWithArsip(
  ocrTextUser: string,
  arsipData: ArsipData | null
): MatchResult {
  const data = arsipData || FALLBACK_ARSIP_DATA;
  if (!ocrTextUser || !ocrTextUser.trim()) {
    return {
      matchedPosters: [],
      matchedTexts: [],
      band: 'rendah',
      topScore: 0,
      topText: 0,
      topConcept: 0,
      query: { title: '', description: '' },
      matches: [],
    };
  }

  // A. Poster vs Poster (Pencocokan teks OCR antar poster arsip)
  const matchedPosters: MatchedPosterResult[] = (data.gambar || [])
    .map((item) => {
      const score = calculateWordSimilarity(ocrTextUser, item.ocr_teks || '');
      return {
        id: item.id,
        judul: item.judul,
        tahun: item.tahun,
        lomba: item.lomba,
        institusi: item.institusi,
        kategori: item.kategori || "POSTER",
        peringkat: item.peringkat,
        ocrScore: score,
        combinedScore: score,
        ocrTeksArsip: item.ocr_teks,
        sumber_url: item.sumber_url,
      };
    })
    .filter((res) => res.ocrScore && res.ocrScore > 0)
    .sort((a, b) => b.combinedScore - a.combinedScore);

  // B. Poster vs Ide Karya Teks (Pencocokan teks OCR ke arsip teks karya)
  const matchedTexts = matchTextWithArsip(ocrTextUser, data);

  const topTextMatch = matchedTexts[0];
  const topPosterMatch = matchedPosters[0];
  const topScore = Math.max(
    topTextMatch?.combinedScore ?? 0,
    topPosterMatch?.combinedScore ?? 0
  );

  const band =
    topScore >= 0.4 ? 'tinggi' : topScore >= 0.18 ? 'sedang' : 'rendah';

  const matches = matchedTexts.slice(0, 5).map((m) => ({
    work: {
      id: m.karya?.id ?? m.id,
      title: m.karya?.judul ?? m.judul,
      year: m.karya?.tahun ?? 2024,
      competition: m.karya?.lomba ?? 'Kompetisi Nasional',
      institution: m.karya?.institusi ?? 'Institusi Terkait',
      category: m.karya?.kategori ?? 'Umum',
      summary: m.karya?.ringkasan ?? '',
      keyphrases: m.karya?.keyphrases ?? [],
      sourceUrl: m.karya?.sumber_url ?? '',
    },
    textScore: m.textScore,
    conceptScore: m.conceptScore,
    combined: m.combinedScore,
    sharedPhrases: m.sharedPhrases,
    sharedWords: m.sharedWords,
  }));

  return {
    matchedPosters,
    matchedTexts,
    band,
    topScore,
    topText: topTextMatch?.textScore ?? 0,
    topConcept: topTextMatch?.conceptScore ?? 0,
    query: {
      title: 'Hasil Ekstraksi OCR Poster',
      description: ocrTextUser.slice(0, 200),
      extractedText: ocrTextUser,
    },
    matches,
  };
}

/**
 * FUNGSI UTAMA ENGINE: Menjalankan kalkulasi pencocokan komprehensif
 * Mendukung teks langsung, teks dokumen diekstrak, dan fitur visual poster.
 */
export async function matchAllInputs(params: {
  title: string;
  description: string;
  file?: File | null;
  extractedText?: string;
  visualFeatures?: VisualFeatures | null;
  arsipData?: ArsipData | null;
  userEmbedding?: number[] | null;
  userPosterUrl?: string | null;
  isPoster?: boolean;
}): Promise<MatchResult> {
  const arsip = params.arsipData || (await loadArsipData());
  const isPoster =
    params.isPoster ||
    !!params.visualFeatures ||
    (params.file
      ? params.file.type.startsWith("image/") || /\.(png|jpe?g|webp|bmp)$/i.test(params.file.name)
      : false);

  // ========================================================
  // JALUR A: ANALISIS POSTER / GAMBAR VISUAL
  // ========================================================
  if (isPoster && params.visualFeatures) {
    const matchedPosters = matchVisualWithArsip(params.visualFeatures, arsip, params.extractedText);
    const topPoster = matchedPosters[0];
    const topScore = topPoster?.combinedScore ?? 0;

    const lowMax = arsip.config?.ambang_band?.rendah_maks ?? 0.35;
    const midMax = arsip.config?.ambang_band?.sedang_maks ?? 0.6;
    const band = topScore >= midMax ? "tinggi" : topScore >= lowMax ? "sedang" : "rendah";

    const posterMatches = matchedPosters.slice(0, 6).map((p) => ({
      work: {
        id: p.id,
        title: p.judul,
        year: p.tahun ?? 2024,
        competition: p.lomba ?? "Lomba Desain Poster Nasional",
        institution: p.institusi ?? "Institusi Terkait",
        category: p.kategori ?? "POSTER",
        summary: p.ocrTeksArsip
          ? `Teks terbaca dalam poster: "${p.ocrTeksArsip.slice(0, 160)}${p.ocrTeksArsip.length > 160 ? '...' : ''}"`
          : `Poster pemenang ${p.lomba || 'lomba desain poster'}.`,
        keyphrases: p.sharedWords && p.sharedWords.length > 0
          ? p.sharedWords
          : ["desain visual", "komposisi poster", "tata letak", "palet warna"],
        sourceUrl: p.sumber_url ?? "",
        rank: p.peringkat,
        license: p.lisensi,
        posterUrl: p.gambar_url,
      },
      textScore: p.ocrScore ?? 0,
      conceptScore: p.layoutScore ?? 0,
      semanticScore: p.colorScore ?? 0,
      combined: p.combinedScore,
      sharedPhrases: p.sharedWords ?? [],
      sharedWords: p.sharedWords ?? [],
      poster: p,
    }));

    const result: MatchResult = {
      isPoster: true,
      userPosterUrl: params.userPosterUrl || (params.file ? URL.createObjectURL(params.file) : undefined),
      visualFeatures: params.visualFeatures,
      matchedPosters,
      matchedTexts: [],
      band,
      topScore,
      topText: topPoster?.ocrScore ?? 0,
      topConcept: topPoster?.layoutScore ?? 0,
      topSemantic: topPoster?.colorScore ?? 0,
      topLayout: topPoster?.layoutScore ?? 0,
      topColor: topPoster?.colorScore ?? 0,
      topHash: topPoster?.dhashScore ?? 0,
      topOcr: topPoster?.ocrScore ?? 0,
      topHamming: topPoster?.hammingDistance ?? 0,
      query: {
        title: params.title || (params.file?.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ") ?? "Poster Unggahan"),
        description: params.description || params.extractedText || "Analisis berkas poster visual",
        extractedText: params.extractedText,
        fileName: params.file?.name,
        inputType: "file",
        fileType: "image",
      },
      matches: posterMatches,
    };

    setLastMatchResult(result);
    return result;
  }

  // ========================================================
  // JALUR B: ANALISIS TEKS / DOKUMEN (PDF, DOCX, TXT, KETIKAN)
  // ========================================================
  const combinedText = `${params.title} ${params.description} ${params.extractedText || ''}`.trim();

  // Ekstrak On-Device Semantic Embedding jika belum disediakan
  let userEmbedding = params.userEmbedding;
  if (userEmbedding === undefined && combinedText) {
    try {
      userEmbedding = await generateTextEmbedding(combinedText);
    } catch (embErr) {
      console.warn('Fallback: skipping embedding generation', embErr);
    }
  }

  // 1. Jalankan Text Matching dengan dukungan semantic embedding
  const matchedTexts = matchTextWithArsip(combinedText, arsip, userEmbedding);

  const topText = matchedTexts[0];
  const topScore = topText?.combinedScore ?? 0;
  const lowMax = arsip.config?.ambang_band?.rendah_maks ?? 0.35;
  const midMax = arsip.config?.ambang_band?.sedang_maks ?? 0.6;

  const band =
    topScore >= midMax ? 'tinggi' : topScore >= lowMax ? 'sedang' : 'rendah';

  const matches = matchedTexts.slice(0, 6).map((m) => ({
    work: {
      id: m.karya?.id ?? m.id,
      title: m.karya?.judul ?? m.judul,
      year: m.karya?.tahun ?? 2024,
      competition: m.karya?.lomba ?? 'Kompetisi Terkait',
      institution: m.karya?.institusi ?? 'Institusi Contoh',
      category: m.karya?.kategori ?? 'Umum',
      summary: m.karya?.ringkasan ?? '',
      keyphrases: m.karya?.keyphrases ?? [],
      sourceUrl: m.karya?.sumber_url ?? '',
    },
    textScore: m.textScore,
    conceptScore: m.conceptScore,
    semanticScore: m.semanticScore,
    combined: m.combinedScore,
    sharedPhrases: m.sharedPhrases,
    sharedWords: m.sharedWords,
  }));

  const result: MatchResult = {
    isPoster: false,
    matchedPosters: [],
    matchedTexts,
    band,
    topScore,
    topText: topText?.textScore ?? 0,
    topConcept: topText?.conceptScore ?? 0,
    topSemantic: topText?.semanticScore,
    query: {
      title: params.title,
      description: params.description,
      extractedText: params.extractedText,
      fileName: params.file?.name,
      inputType: params.file ? 'file' : 'teks',
      fileType: 'document',
    },
    matches,
  };

  // Simpan hasil ke session memory
  setLastMatchResult(result);
  return result;
}

// Penyimpanan sementara hasil cek di RAM browser (Mode privat: zero backend & zero disk persistence)
let currentSessionResult: MatchResult | null = null;

export function setLastMatchResult(r: MatchResult) {
  currentSessionResult = r;
}

export function getLastMatchResult(): MatchResult | null {
  return currentSessionResult;
}