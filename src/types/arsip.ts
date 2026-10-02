/**
 * Interface type definitions untuk sistem ADIL (Analisis Duplikasi Karya Lomba)
 * Seluruh analisis berjalan 100% di browser pengguna (Privat / Client-Side).
 */

export interface ConfigData {
  bobot: {
    teks: number;
    konsep: number;
    ocr?: number | undefined;
    dhash?: number | undefined;
    layout?: number | undefined;
    color?: number | undefined;
  };
  ambang_band: {
    rendah_maks: number;
    sedang_maks: number;
  };
  ambang_hash: {
    hampir_identik_maks: number;
    mirip_maks: number;
  };
  ambang_layout: {
    mirip_min: number;
  };
}

export interface KaryaTeks {
  id: string;
  judul: string;
  tahun?: number | undefined;
  lomba?: string | undefined;
  penyelenggara?: string | undefined;
  institusi?: string | undefined;
  tim?: string | undefined;
  kategori?: string | undefined;
  peringkat?: string | undefined;
  ringkasan: string;
  ringkasan_sumber?: string | undefined;
  keyphrases: string[];
  sumber_url?: string | undefined;
  sumber_pendukung?: string | undefined;
  status?: string | undefined;
  catatan?: string | undefined;
}

export interface ArsipGambar {
  id: string;
  judul: string;
  tahun?: number | undefined;
  lomba?: string | undefined;
  institusi?: string | undefined;
  tim?: string | undefined;
  kategori?: string | undefined;
  peringkat?: string | undefined;
  dhash: string;
  layout?: number[] | undefined;
  color_hist?: number[] | undefined;
  ocr_teks: string;
  sumber_url?: string | undefined;
  status?: string | undefined;
}

export interface VisualFeatures {
  dhash: string;
  layout: number[];
  colorHist: number[];
}

export interface ArsipData {
  versi?: string | undefined;
  config: ConfigData;
  stopwords: string[];
  teks: KaryaTeks[];
  gambar: ArsipGambar[];
}

export interface MatchedPosterResult {
  id: string;
  judul: string;
  ocrScore?: number | undefined;
  ocrTeksArsip?: string | undefined;
  dhashScore?: number | undefined;
  layoutScore?: number | undefined;
  colorScore?: number | undefined;
  combinedScore: number;
  hammingDistance?: number | undefined;
  sumber_url?: string | undefined;
}

export interface MatchedTextResult {
  id: string;
  judul: string;
  textScore: number;
  conceptScore: number;
  combinedScore: number;
  sharedPhrases: string[];
  sharedWords: string[];
  karya?: KaryaTeks | undefined;
}

export interface MatchResult {
  matchedPosters: MatchedPosterResult[];
  matchedTexts: MatchedTextResult[];
  band: "rendah" | "sedang" | "tinggi";
  topScore: number;
  topText: number;
  topConcept: number;
  query: {
    title: string;
    description: string;
    extractedText?: string | undefined;
    fileName?: string | undefined;
    inputType?: "teks" | "file" | undefined;
  };
  matches: Array<{
    work: {
      id: string;
      title: string;
      year: number;
      competition: string;
      institution: string;
      category: string;
      summary: string;
      keyphrases: string[];
      sourceUrl: string;
    };
    textScore: number;
    conceptScore: number;
    combined: number;
    sharedPhrases: string[];
    sharedWords: string[];
  }>;
}