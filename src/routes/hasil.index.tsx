import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { FrameLabel, Mascot, StickerLabel, CommentBubble } from "@/components/decor";
import { PosterCard, ScoreBar } from "@/components/chrome";
import { EmptyState } from "@/components/empty";
import { getLastResult } from "@/lib/scoring";

export const Route = createFileRoute("/hasil/")({
  head: () => ({
    meta: [
      { title: "Hasil cek ide — ADIL" },
      { name: "description", content: "Lihat karya yang mirip dengan idemu, lengkap dengan skor teks dan konsep. Bukti, bukan vonis." },
      { property: "og:title", content: "Hasil cek ide — ADIL" },
      { property: "og:description", content: "Skor kemiripan teks dan konsep, lengkap dengan alasannya." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HasilPage,
});

const BANDS = {
  rendah: { title: "Aman, belum ada yang mirip", sub: "Tapi arsip kami masih kecil, jadi ini bukan jaminan. Coba cari juga di Google.", bg: "bg-adil-green text-white", mood: "senang" as const, mascot: "yellow" as const },
  sedang: { title: "Hmm, ada yang mirip nih", sub: "Bukan berarti plagiat. Yuk lihat bedanya.", bg: "bg-adil-yellow text-adil-ink", mood: "bingung" as const, mascot: "blue" as const },
  tinggi: { title: "Mirip banget, cek dulu ya", sub: "Tenang, ini bukan vonis. Lihat buktinya dan tentuin langkahmu.", bg: "bg-adil-red text-white", mood: "kaget" as const, mascot: "cyan" as const },
};

function HasilPage() {
  const result = getLastResult();
  const [showWhy, setShowWhy] = useState(false);

  if (!result) {
    return (
      <main className="bg-canvas-grid px-4">
        <EmptyState title="Belum ada yang dicek." sub="Hasil cek cuma disimpan sementara di memori, jadi hilang kalau halaman dimuat ulang. Itu disengaja biar idemu aman." />
      </main>
    );
  }

  const band = BANDS[result.band];
  const top = result.matches[0];
  const visible = result.matches.filter((m) => m.combined > 0.03);
  const google = `https://www.google.com/search?q=${encodeURIComponent(result.query.title + " lomba")}`;

  const nextSteps =
    result.band === "rendah"
      ? [
          { label: "Catat ideku", to: "/catat" as const },
          { label: "Cek ide lain", to: "/cek" as const },
        ]
      : [
          ...(top ? [{ label: "Lihat bedanya", to: "/hasil/$workId" as const, params: { workId: top.work.id } }] : []),
          { label: "Ubah deskripsi dan cek lagi", to: "/cek" as const },
          { label: "Catat ideku", to: "/catat" as const },
        ];

  return (
    <main className="bg-canvas-grid py-16">
      <div className="mx-auto max-w-5xl px-4">
        <FrameLabel>Hasil / Ringkasan</FrameLabel>

        <div className={`relative rounded-3xl p-8 shadow-poster-lg md:p-12 ${band.bg}`} style={{ transform: "rotate(-0.6deg)" }}>
          <Mascot color={band.mascot} mood={band.mood} className="absolute -top-6 right-8" />
          <p className="text-sm font-bold uppercase tracking-widest opacity-80">Untuk: “{result.query.title || "Ide tanpa judul"}”</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight md:text-6xl">{band.title}</h1>
          <p className="mt-3 max-w-xl text-lg opacity-90">{band.sub}</p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <PosterCard rotate={0.5} className="space-y-6">
            <ScoreBar label="Kemiripan teks" hint="Kata dan frasa yang sama" value={result.topText} color="blue" />
            <ScoreBar label="Kemiripan konsep" hint="Ide intinya yang sama" value={result.topConcept} color="green" />
            <div className="rounded-2xl bg-muted p-4 text-sm">
              <p className="font-bold">Skor gabungan = teks × 0,5 + konsep × 0,5</p>
              <p className="mt-1 text-muted-foreground">
                = {Math.round(result.topText * 100)}% × 0,5 + {Math.round(result.topConcept * 100)}% × 0,5 ={" "}
                <strong className="text-foreground">{Math.round((top?.combined ?? 0) * 100)}%</strong>
              </p>
            </div>
            <button onClick={() => setShowWhy(!showWhy)} className="text-sm font-bold text-adil-blue underline-offset-4 hover:underline" aria-expanded={showWhy}>
              Kok bisa segini?
            </button>
            {showWhy && (
              <p className="rounded-2xl border-2 border-adil-blue/30 bg-adil-blue/5 p-4 text-sm">
                Skor ini bukan peluang kamu dianggap plagiat. Ini cuma ukuran seberapa banyak kata dan konsep yang beririsan.
              </p>
            )}
          </PosterCard>

          <PosterCard rotate={-1} className="relative">
            <CommentBubble emoji="🙂" text="Ini bukan vonis ya" className="absolute -right-3 -top-4 rotate-3" />
            <h2 className="font-display text-2xl font-extrabold">Langkah selanjutnya</h2>
            <div className="mt-5 flex flex-col gap-3">
              {nextSteps.map((s) =>
                "params" in s ? (
                  <Link key={s.label} to={s.to} params={s.params} className="rounded-full bg-adil-blue px-5 py-3 text-center font-bold text-white transition-transform hover:scale-[1.03]">{s.label}</Link>
                ) : (
                  <Link key={s.label} to={s.to} className="rounded-full border-2 border-input px-5 py-3 text-center font-bold transition-colors hover:border-adil-blue">{s.label}</Link>
                ),
              )}
              <button onClick={() => window.print()} className="rounded-full border-2 border-input px-5 py-3 font-bold transition-colors hover:border-adil-blue">
                Unduh laporan buat dosen atau panitia
              </button>
              <a href={google} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-adil-yellow px-5 py-3 font-bold text-adil-ink transition-transform hover:scale-[1.03]">
                <Search className="h-4 w-4" /> Cari juga di Google <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </PosterCard>
        </div>

        <div className="mt-16">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-3xl font-extrabold">Karya yang paling mirip</h2>
            <StickerLabel color="green" rotate={2}>Arsip Pemenang</StickerLabel>
          </div>
          {visible.length === 0 ? (
            <EmptyState title="Belum ada yang cocok. Coba kata kunci lain." mood="senang" />
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {visible.map((m, i) => (
                <PosterCard key={m.work.id} rotate={i % 2 === 0 ? -1 : 1}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-extrabold leading-snug">{m.work.title}</h3>
                    <span className="shrink-0 rounded-full bg-adil-blue px-3 py-1 font-display text-sm font-extrabold text-white">{Math.round(m.combined * 100)}%</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{m.work.competition} · {m.work.year}</p>
                  {m.sharedPhrases.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.sharedPhrases.map((p) => (
                        <span key={p} className="rounded-full bg-adil-green/15 px-2.5 py-0.5 text-xs font-semibold text-adil-green">{p}</span>
                      ))}
                    </div>
                  )}
                  <Link to="/hasil/$workId" params={{ workId: m.work.id }} className="mt-4 inline-block text-sm font-bold text-adil-blue hover:underline">
                    Lihat bedanya →
                  </Link>
                </PosterCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
