import { WORKS, type Work } from "./works";
import {
  tokenizeText,
  matchTextWithArsip,
  FALLBACK_ARSIP_DATA,
  getLastMatchResult,
  setLastMatchResult,
} from "@/utils/matchingService";
import type { MatchResult as FullMatchResult, MatchedTextResult } from "@/types/arsip";

export interface MatchResult {
  work: Work;
  textScore: number; // 0..1 cosine TF-IDF
  conceptScore: number; // 0..1 Jaccard keyphrases
  combined: number; // 0..1
  sharedPhrases: string[]; // keyphrases ditemukan di input
  sharedWords: string[]; // kata penting yang sama
}

export interface CheckResult {
  query: { title: string; description: string };
  matches: MatchResult[];
  band: "rendah" | "sedang" | "tinggi";
  topText: number;
  topConcept: number;
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
      combined: m.combinedScore,
      sharedPhrases: m.sharedPhrases,
      sharedWords: m.sharedWords,
    };
  });

  const top = matches[0];
  const topScore = top?.combined ?? 0;
  const band: CheckResult["band"] =
    topScore >= 0.4 ? "tinggi" : topScore >= 0.18 ? "sedang" : "rendah";

  const result: CheckResult = {
    query: { title, description },
    matches,
    band,
    topText: top?.textScore ?? 0,
    topConcept: top?.conceptScore ?? 0,
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
      query: { title: r.query.title, description: r.query.description },
      matches: r.matches.map((m) => {
        const found = WORKS.find((w) => w.id === m.work.id) || m.work;
        return {
          work: found,
          textScore: m.textScore,
          conceptScore: m.conceptScore,
          combined: m.combined,
          sharedPhrases: m.sharedPhrases,
          sharedWords: m.sharedWords,
        };
      }),
      band: r.band,
      topText: r.topText,
      topConcept: r.topConcept,
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
      query: { title: matchRes.query.title, description: matchRes.query.description },
      matches: matchRes.matches.map((m) => {
        const found = WORKS.find((w) => w.id === m.work.id) || m.work;
        return {
          work: found,
          textScore: m.textScore,
          conceptScore: m.conceptScore,
          combined: m.combined,
          sharedPhrases: m.sharedPhrases,
          sharedWords: m.sharedWords,
        };
      }),
      band: matchRes.band,
      topText: matchRes.topText,
      topConcept: matchRes.topConcept,
    };
  }
  return null;
}
