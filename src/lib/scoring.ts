import { WORKS, type Work } from "./works";
import {
  tokenizeText,
  matchTextWithArsip,
  FALLBACK_ARSIP_DATA,
  getLastMatchResult,
  setLastMatchResult,
} from "@/utils/matchingService";
import type { MatchResult as FullMatchResult, MatchedPosterResult, MatchedTextResult, VisualFeatures } from "@/types/arsip";

export interface MatchResult {
  work: Work & {
    rank?: string | undefined;
    license?: string | undefined;
    posterUrl?: string | undefined;
  };
  textScore: number; // 0..1 cosine TF-IDF / OCR
  conceptScore: number; // 0..1 Jaccard keyphrases / Layout
  semanticScore?: number | undefined; // 0..1 semantic embedding / Color
  combined: number; // 0..1
  sharedPhrases: string[]; // keyphrases ditemukan di input
  sharedWords: string[]; // kata penting yang sama
  poster?: MatchedPosterResult | undefined;
}

export interface CheckResult {
  isPoster?: boolean | undefined;
  userPosterUrl?: string | undefined;
  visualFeatures?: VisualFeatures | null | undefined;
  query: {
    title: string;
    description: string;
    extractedText?: string | undefined;
    fileName?: string | undefined;
    inputType?: "teks" | "file" | undefined;
    fileType?: "image" | "document" | undefined;
  };
  matches: MatchResult[];
  matchedPosters?: MatchedPosterResult[] | undefined;
  matchedTexts?: MatchedTextResult[] | undefined;
  band: "rendah" | "sedang" | "tinggi";
  topScore?: number | undefined;
  topText: number;
  topConcept: number;
  topSemantic?: number | undefined;
  topLayout?: number | undefined;
  topColor?: number | undefined;
  topHash?: number | undefined;
  topOcr?: number | undefined;
  topHamming?: number | undefined;
}

export function tokenize(text: string): string[] {
  return tokenizeText(text);
}

export function checkIdea(title: string, description: string): CheckResult {
  const inputText = `${title} ${description}`;
  const matchedTexts: MatchedTextResult[] = matchTextWithArsip(inputText, FALLBACK_ARSIP_DATA);

  const matches: MatchResult[] = matchedTexts.slice(0, 6).map((m: MatchedTextResult) => {
    const foundWork = WORKS.find((w) => w.id === m.id) || {
      id: m.karya?.id ?? m.id,
      title: m.karya?.judul ?? m.judul,
      year: m.karya?.tahun ?? 2024,
      competition: m.karya?.lomba ?? "Kompetisi",
      institution: m.karya?.institusi ?? "Institusi",
      category: m.karya?.kategori ?? "Umum",
      summary: m.karya?.ringkasan ?? "",
      keyphrases: m.karya?.keyphrases ?? [],
      sourceUrl: m.karya?.sumber_url ?? "",
    };

    return {
      work: foundWork,
      textScore: m.textScore,
      conceptScore: m.conceptScore,
      semanticScore: m.semanticScore,
      combined: m.combinedScore,
      sharedPhrases: m.sharedPhrases,
      sharedWords: m.sharedWords,
    };
  });

  const top = matches[0];
  const topScore = top?.combined ?? 0;
  const band: CheckResult["band"] =
    topScore >= 0.6 ? "tinggi" : topScore >= 0.35 ? "sedang" : "rendah";

  const result: CheckResult = {
    isPoster: false,
    query: { title, description },
    matches,
    band,
    topScore,
    topText: top?.textScore ?? 0,
    topConcept: top?.conceptScore ?? 0,
    topSemantic: top?.semanticScore,
  };

  setLastResult(result);
  return result;
}

// Penyimpanan hasil cek terakhir — hanya di memori RAM (mode privat), tidak ke localStorage/server.
let localLastResult: CheckResult | null = null;

export function setLastResult(r: CheckResult | FullMatchResult) {
  if ("matchedPosters" in r) {
    setLastMatchResult(r);
    localLastResult = {
      isPoster: r.isPoster,
      userPosterUrl: r.userPosterUrl,
      visualFeatures: r.visualFeatures,
      query: {
        title: r.query.title,
        description: r.query.description,
        extractedText: r.query.extractedText,
        fileName: r.query.fileName,
        inputType: r.query.inputType,
        fileType: r.query.fileType,
      },
      matches: r.matches.map((m) => {
        const found = WORKS.find((w) => w.id === m.work.id) || m.work;
        return {
          work: {
            ...found,
            rank: m.work.rank,
            license: m.work.license,
            posterUrl: m.work.posterUrl,
          },
          textScore: m.textScore,
          conceptScore: m.conceptScore,
          semanticScore: m.semanticScore,
          combined: m.combined,
          sharedPhrases: m.sharedPhrases,
          sharedWords: m.sharedWords,
          poster: m.poster,
        };
      }),
      matchedPosters: r.matchedPosters,
      matchedTexts: r.matchedTexts,
      band: r.band,
      topScore: r.topScore,
      topText: r.topText,
      topConcept: r.topConcept,
      topSemantic: r.topSemantic,
      topLayout: r.topLayout,
      topColor: r.topColor,
      topHash: r.topHash,
      topOcr: r.topOcr,
      topHamming: r.topHamming,
    };
  } else {
    localLastResult = r;
  }
}

export function getLastResult(): CheckResult | null {
  if (localLastResult) return localLastResult;
  const matchRes = getLastMatchResult();
  if (matchRes) {
    return {
      isPoster: matchRes.isPoster,
      userPosterUrl: matchRes.userPosterUrl,
      visualFeatures: matchRes.visualFeatures,
      query: {
        title: matchRes.query.title,
        description: matchRes.query.description,
        extractedText: matchRes.query.extractedText,
        fileName: matchRes.query.fileName,
        inputType: matchRes.query.inputType,
        fileType: matchRes.query.fileType,
      },
      matches: matchRes.matches.map((m) => {
        const found = WORKS.find((w) => w.id === m.work.id) || m.work;
        return {
          work: {
            ...found,
            rank: m.work.rank,
            license: m.work.license,
            posterUrl: m.work.posterUrl,
          },
          textScore: m.textScore,
          conceptScore: m.conceptScore,
          semanticScore: m.semanticScore,
          combined: m.combined,
          sharedPhrases: m.sharedPhrases,
          sharedWords: m.sharedWords,
          poster: m.poster,
        };
      }),
      matchedPosters: matchRes.matchedPosters,
      matchedTexts: matchRes.matchedTexts,
      band: matchRes.band,
      topScore: matchRes.topScore,
      topText: matchRes.topText,
      topConcept: matchRes.topConcept,
      topSemantic: matchRes.topSemantic,
      topLayout: matchRes.topLayout,
      topColor: matchRes.topColor,
      topHash: matchRes.topHash,
      topOcr: matchRes.topOcr,
      topHamming: matchRes.topHamming,
    };
  }
  return null;
}
