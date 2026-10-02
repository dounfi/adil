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

/**
 * Fallback Arsip Data jika file static /arsip_features.json belum tersedia atau gagal dimuat.
 */
export const FALLBACK_ARSIP_DATA: ArsipData = {
  versi: '2026-10-03-fallback',
  config: {
    bobot: {
      teks: 0.5,
      konsep: 0.5,
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

/**
 * Tokenisasi teks Bahasa Indonesia dengan menghapus tanda baca dan stopwords.
 */
export function tokenizeText(text: string, stopwordsList?: string[]): string[] {
  const stops = new Set(
    stopwordsList && stopwordsList.length > 0
      ? stopwordsList
      : FALLBACK_ARSIP_DATA.stopwords
  );

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
 */
function findSharedPhrases(inputText: string, keyphrases: string[]): string[] {
  if (!keyphrases || !keyphrases.length) return [];
  const lowerInput = ` ${inputText.toLowerCase()} `;
  return keyphrases.filter((kp) => {
    const cleanKp = kp.trim().toLowerCase();
    if (!cleanKp) return false;
    if (lowerInput.includes(cleanKp)) return true;
    const words = cleanKp.split(/\s+/).filter((w) => w.length > 2);
    return words.length > 1 && words.every((w) => lowerInput.includes(w));
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
 * Menghitung TF-IDF Cosine Similarity & Jaccard Concept Similarity.
 */
export function matchTextWithArsip(
  queryText: string,
  arsipData: ArsipData
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

  const weightTeks = arsipData.config?.bobot?.teks ?? 0.5;
  const weightKonsep = arsipData.config?.bobot?.konsep ?? 0.5;

  return works
    .map((karya, idx) => {
      const docTokens = docTokensList[idx] ?? [];
      const textScore = calculateTfidfCosine(queryTokens, docTokens, df, works.length);
      const sharedPhrases = findSharedPhrases(queryText, karya.keyphrases || []);
      const conceptScore = karya.keyphrases?.length
        ? Number((sharedPhrases.length / karya.keyphrases.length).toFixed(4))
        : 0;

      const karyaWordsSet = new Set(docTokens);
      const sharedWords = [...new Set(queryTokens)]
        .filter((w) => karyaWordsSet.has(w))
        .slice(0, 12);

      const combinedScore = Number(
        (weightTeks * textScore + weightKonsep * conceptScore).toFixed(4)
      );

      return {
        id: karya.id,
        judul: karya.judul,
        textScore,
        conceptScore,
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
  arsipData: ArsipData
): MatchedPosterResult[] {
  const posters = arsipData.gambar || [];
  if (!posters.length || !userFeatures) return [];

  const weightHash = arsipData.config?.bobot?.dhash ?? 0.4;
  const weightLayout = arsipData.config?.bobot?.layout ?? 0.4;
  const weightColor = arsipData.config?.bobot?.color ?? 0.2;

  return posters
    .map((poster) => {
      // Hamming Distance (0..64) -> Konversi ke skor kemiripan 0..1
      const hamming = calculateHammingDistance(userFeatures.dhash, poster.dhash);
      const dhashScore = Math.max(0, Number((1 - hamming / 32).toFixed(4)));

      // Layout Similarity (16x16) -> 0..1
      const layoutScore = poster.layout
        ? calculateLayoutSimilarity(userFeatures.layout, poster.layout)
        : 0;

      // Color Histogram (64 bin) -> 0..1
      const colorScore = poster.color_hist
        ? calculateHistogramIntersection(userFeatures.colorHist, poster.color_hist)
        : 0;

      const combinedScore = Number(
        (
          weightHash * dhashScore +
          weightLayout * layoutScore +
          weightColor * colorScore
        ).toFixed(4)
      );

      return {
        id: poster.id,
        judul: poster.judul,
        dhashScore,
        layoutScore,
        colorScore,
        combinedScore,
        hammingDistance: hamming,
        ocrTeksArsip: poster.ocr_teks,
        sumber_url: poster.sumber_url,
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
}): Promise<MatchResult> {
  const arsip = params.arsipData || (await loadArsipData());
  const combinedText = `${params.title} ${params.description} ${params.extractedText || ''}`.trim();

  // 1. Jalankan Text Matching
  const matchedTexts = matchTextWithArsip(combinedText, arsip);

  // 2. Jalankan Visual Matching bila ada fitur gambar
  let matchedPosters: MatchedPosterResult[] = [];
  if (params.visualFeatures) {
    matchedPosters = matchVisualWithArsip(params.visualFeatures, arsip);
  }

  // 3. Jika ada teks hasil OCR, gabungkan ke skor poster
  if (params.extractedText && matchedPosters.length > 0) {
    matchedPosters = matchedPosters
      .map((poster) => {
        const ocrSim = calculateWordSimilarity(params.extractedText!, poster.ocrTeksArsip || '');
        const ocrWeight = arsip.config?.bobot?.ocr ?? 0.3;
        const newCombined = Number(
          ((1 - ocrWeight) * poster.combinedScore + ocrWeight * ocrSim).toFixed(4)
        );
        return {
          ...poster,
          ocrScore: ocrSim,
          combinedScore: newCombined,
        };
      })
      .sort((a, b) => b.combinedScore - a.combinedScore);
  }

  const topText = matchedTexts[0];
  const topPoster = matchedPosters[0];
  const topScore = Math.max(topText?.combinedScore ?? 0, topPoster?.combinedScore ?? 0);

  const band =
    topScore >= 0.4 ? 'tinggi' : topScore >= 0.18 ? 'sedang' : 'rendah';

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
    combined: m.combinedScore,
    sharedPhrases: m.sharedPhrases,
    sharedWords: m.sharedWords,
  }));

  const result: MatchResult = {
    matchedPosters,
    matchedTexts,
    band,
    topScore,
    topText: topText?.textScore ?? 0,
    topConcept: topText?.conceptScore ?? 0,
    query: {
      title: params.title,
      description: params.description,
      extractedText: params.extractedText,
      fileName: params.file?.name,
      inputType: params.file ? 'file' : 'teks',
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