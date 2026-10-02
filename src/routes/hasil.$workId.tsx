import { createFileRoute, Link } from "@tanstack/react-router";
import { FrameLabel, StickerLabel, Mascot } from "@/components/decor";
import { PosterCard } from "@/components/chrome";
import { EmptyState } from "@/components/empty";
import { getLastResult, tokenize } from "@/lib/scoring";
import { WORKS } from "@/lib/works";

export const Route = createFileRoute("/hasil/$workId")({
  head: () => ({
    meta: [
      { title: "Perbandingan ide — ADIL" },
      { name: "description", content: "Bandingkan idemu dengan karya pembanding: frasa sama disorot, kata kunci konsep, dan bedanya di mana." },
      { property: "og:title", content: "Perbandingan ide — ADIL" },
      { property: "og:description", content: "Ini yang bikin skornya segitu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Compare,
});

function HighlightedText({ text, words }: { text: string; words: Set<string> }) {
  const parts = text.split(/(\s+)/);
  return (
    <p className="leading-relaxed">
      {parts.map((p, i) => {
        const clean = tokenize(p)[0];
        return clean && words.has(clean) ? (
          <mark key={i} className="rounded bg-adil-yellow px-0.5 text-adil-ink">{p}</mark>
        ) : (
          <span key={i}>{p}</span>
        );
      })}
    </p>
  );
}

function Compare() {
  const { workId } = Route.useParams();
  const result = getLastResult();
  const work = WORKS.find((w) => w.id === workId);
  const match = result?.matches.find((m) => m.work.id === workId);

  if (!result || !work || !match) {
    return (
      <main className="bg-canvas-grid px-4">
        <EmptyState title="Waduh, perbandingannya nggak ketemu." sub="Hasil cek cuma ada di memori. Coba cek ulang idemu ya." />
      </main>
    );
  }

  const shared = new Set(match.sharedWords);
  const inputText = `${result.query.title}. ${result.query.description}`;
  const missing = work.keyphrases.filter((k) => !match.sharedPhrases.includes(k));

  return (
    <main className="bg-canvas-grid py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Link to="/hasil" className="text-sm font-bold text-adil-blue hover:underline">← Balik ke hasil</Link>
        <FrameLabel className="mt-4">Perbandingan / Berdampingan</FrameLabel>
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">Ini yang bikin skornya segitu</h1>

        <div className="mt-6 rounded-2xl bg-adil-ink px-5 py-3 text-sm font-semibold text-white">
          Indikatif, bukan putusan. Tetap perlu mata manusia.
        </div>

        <p className="mt-6 font-display text-xl font-extrabold">
          {match.sharedPhrases.length} dari {work.keyphrases.length} kata kunci inti sama · {match.sharedWords.length} kata penting beririsan
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* KOLOM KIRI: IDE KAMU */}
          <div className="flex flex-col gap-6">
            <PosterCard rotate={-1} className="flex-1">
              <StickerLabel color="blue" rotate={-2}>Ide kamu</StickerLabel>
              <div className="mt-5 text-sm"><HighlightedText text={inputText} words={shared} /></div>
              <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
                <mark className="rounded bg-adil-yellow px-1 text-adil-ink">Sorotan kuning</mark> = frasa yang sama persis di kedua teks.
              </p>
            </PosterCard>
          </div>

          {/* KOLOM KANAN: KARYA PEMBANDING */}
          <div className="flex flex-col gap-6">
            <PosterCard rotate={1} className="flex-1">
              <StickerLabel color="red" rotate={2}>Karya pembanding</StickerLabel>
              <h2 className="mt-5 font-display text-lg font-extrabold">{work.title}</h2>
              <div className="mt-2 text-sm"><HighlightedText text={work.summary} words={shared} /></div>
              
              <div className="mt-6 border-t border-border pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kata kunci konsep karya ini</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {work.keyphrases.map((k) => (
                    <span key={k} className={`rounded-full px-3 py-1 text-xs font-bold ${match.sharedPhrases.includes(k) ? "bg-adil-green text-white" : "bg-muted text-muted-foreground"}`}>
                      {match.sharedPhrases.includes(k) ? "✓ " : ""}{k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Info sumber</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {work.competition} · {work.institution} · {work.year} · {work.category}
                </p>
                <a href={work.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-adil-blue hover:underline">Lihat sumber asli ↗</a>
              </div>
            </PosterCard>
          </div>
        </div>

        {/* KESIMPULAN / BEDANYA */}
        <div className="mt-8">
          <PosterCard rotate={-0.5} className="relative bg-adil-yellow">
            <Mascot color="green" mood="senang" className="absolute -right-3 -top-5 hidden md:block" />
            <h3 className="font-display text-2xl font-extrabold text-adil-ink">Kesimpulan: Bedanya di mana?</h3>
            {missing.length ? (
              <p className="mt-3 text-base leading-relaxed text-adil-ink">
                Karya pembanding menargetkan konsep <strong>{missing.join(", ")}</strong> — hal yang nggak muncul di idemu. Kamu bisa tonjolkan pembeda kamu sendiri di bagian proposal agar tidak dianggap sama.
              </p>
            ) : (
              <p className="mt-3 text-base leading-relaxed text-adil-ink">Semua kata kunci intinya muncul di idemu. Hati-hati, idemu sangat mirip! Coba pikirkan sudut pandang, target pengguna, atau fitur utama yang benar-benar berbeda.</p>
            )}
          </PosterCard>
        </div>
      </div>
    </main>
  );
}
