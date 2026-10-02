import { WORKS, type Work } from "./works";

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

const STOPWORDS = new Set(
  "yang dan di ke dari untuk dengan adalah ini itu pada atau sebagai dalam akan bisa ada tidak juga sudah lebih agar supaya oleh karena bagi para serta antara seperti telah kepada yaitu yakni ialah pun hanya sangat pula lagi per secara mereka kita kamu dia saya aku nya mu ku lah kah tah".split(" "),
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9à-ÿ\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function tfidfCosine(queryTokens: string[], docTokens: string[], df: Map<string, number>, nDocs: number): number {
  if (!queryTokens.length || !docTokens.length) return 0;
  const idf = (t: string) => Math.log(1 + nDocs / (1 + (df.get(t) ?? 0)));
  const qtf = new Map<string, number>();
  const dtf = new Map<string, number>();
  for (const t of queryTokens) qtf.set(t, (qtf.get(t) ?? 0) + 1);
  for (const t of docTokens) dtf.set(t, (dtf.get(t) ?? 0) + 1);
  let dot = 0, qn = 0, dn = 0;
  qtf.forEach((c, t) => { const w = c * idf(t); qn += w * w; });
  dtf.forEach((c, t) => { const w = c * idf(t); dn += w * w; });
  qtf.forEach((c, t) => {
    if (dtf.has(t)) dot += c * idf(t) * (dtf.get(t)! * idf(t));
  });
  return dot / (Math.sqrt(qn) * Math.sqrt(dn) || 1);
}

function conceptMatches(inputText: string, work: Work): string[] {
  const lower = ` ${inputText.toLowerCase()} `;
  return work.keyphrases.filter((kp) => {
    const words = kp.toLowerCase().split(/\s+/);
    // frasa penuh cocok, atau semua kata kunci frasa muncul di input
    return lower.includes(kp.toLowerCase()) || words.every((w) => lower.includes(w));
  });
}

export function checkIdea(title: string, description: string): CheckResult {
  const inputText = `${title} ${description}`;
  const queryTokens = tokenize(inputText);
  const docTokensList = WORKS.map((w) => tokenize(`${w.title} ${w.summary}`));
  const df = new Map<string, number>();
  for (const tokens of docTokensList) {
    for (const t of new Set(tokens)) df.set(t, (df.get(t) ?? 0) + 1);
  }

  const matches: MatchResult[] = WORKS.map((work, i) => {
    const textScore = tfidfCosine(queryTokens, docTokensList[i] ?? [], df, WORKS.length);
    const sharedPhrases = conceptMatches(inputText, work);
    const conceptScore = work.keyphrases.length ? sharedPhrases.length / work.keyphrases.length : 0;
    const workWords = new Set(tokenize(`${work.title} ${work.summary}`));
    const sharedWords = [...new Set(queryTokens)].filter((t) => workWords.has(t)).slice(0, 12);
    const combined = 0.5 * textScore + 0.5 * conceptScore;
    return { work, textScore, conceptScore, combined, sharedPhrases, sharedWords };
  })
    .sort((a, b) => b.combined - a.combined)
    .slice(0, 5);

  const top = matches[0];
  const topScore = top?.combined ?? 0;
  const band: CheckResult["band"] = topScore >= 0.4 ? "tinggi" : topScore >= 0.18 ? "sedang" : "rendah";

  return {
    query: { title, description },
    matches,
    band,
    topText: top?.textScore ?? 0,
    topConcept: top?.conceptScore ?? 0,
  };
}

// Penyimpanan hasil cek terakhir — hanya di memori (mode privat), tidak ke localStorage.
let lastResult: CheckResult | null = null;
export function setLastResult(r: CheckResult) { lastResult = r; }
export function getLastResult(): CheckResult | null { return lastResult; }
