import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, Search, Palette } from "lucide-react";
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
  const isPoster = result.isPoster === true;

  const nextSteps =
    result.band === "rendah"
      ? [
        { label: "Catat ideku", to: "/catat" as const },
        { label: "Cek ide lain", to: "/cek" as const },
      ]
      : [
        ...(top ? [{ label: "Lihat bedanya", to: "/hasil/$workId" as const, params: { workId: top.work.id } }] : []),
        { label: "Ubah dan cek lagi", to: "/cek" as const },
        { label: "Catat ideku", to: "/catat" as const },
      ];

  return (
    <main className="bg-canvas-grid py-16">
      <div className="mx-auto max-w-5xl px-4">
        <FrameLabel>Hasil / {isPoster ? "Poster Visual" : "Ringkasan"}</FrameLabel>

        {/* ── BANNER HASIL ── */}
        <div className={`relative rounded-3xl p-8 shadow-poster-lg md:p-12 ${band.bg}`} style={{ transform: "rotate(-0.6deg)" }}>
          <Mascot color={band.mascot} mood={band.mood} className="absolute -top-6 right-8" />
          <p className="text-sm font-bold uppercase tracking-widest opacity-80">
            {isPoster ? "Poster:" : "Untuk:"} "{result.query.title || "Karya tanpa judul"}"
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight md:text-6xl">{band.title}</h1>
          <p className="mt-3 max-w-xl text-lg opacity-90">{band.sub}</p>
          {isPoster && (
            <p className="mt-2 text-sm opacity-70">
              Poster dicek dari 4 sisi: kemiripan bentuk visual (dHash), tata letak, palet warna, dan teks terbaca (OCR).
            </p>
          )}
        </div>

        {/* ── PRATINJAU POSTER VS ARSIP TERDEKAT ── */}
        {isPoster && result.userPosterUrl && (
          <div className="mt-8 rounded-3xl border-2 border-border bg-card p-6 shadow-poster">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-adil-blue/15 px-3 py-1 font-display text-xs font-bold text-adil-blue">
                  Pratinjau Visual Berdampingan
                </span>
                <span className="text-xs text-muted-foreground">
                  (Dihitung 100% di browser — privat & aman)
                </span>
              </div>
              {top && (
                <Link
                  to="/hasil/$workId"
                  params={{ workId: top.work.id }}
                  className="text-xs font-bold text-adil-blue hover:underline"
                >
                  Bandingkan Detail Lengkap →
                </Link>
              )}
            </div>

            <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
              {/* Kolom Kiri: Poster Pengguna */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="relative aspect-[3/4] max-h-56 w-full max-w-[190px] overflow-hidden rounded-xl border-2 border-border bg-black/5 shadow-sm">
                  <img
                    src={result.userPosterUrl}
                    alt="Poster Pengguna"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <p className="font-display text-xs font-bold">Poster Kamu</p>
                  {result.visualFeatures?.dhash && (
                    <p className="font-mono text-[10px] text-muted-foreground">
                      dHash: {result.visualFeatures.dhash}
                    </p>
                  )}
                </div>
              </div>

              {/* VS Badge */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted font-display text-xs font-black text-muted-foreground shadow-sm">
                  VS
                </div>
                <span className="mt-2 font-display text-sm font-extrabold text-adil-blue">
                  {Math.round((top?.combined ?? 0) * 100)}%
                </span>
                <span className="text-[10px] text-muted-foreground">mirip</span>
              </div>

              {/* Kolom Kanan: Arsip Terdekat */}
              {top ? (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="relative flex aspect-[3/4] max-h-56 w-full max-w-[190px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-border bg-muted/40 p-3 text-center shadow-sm">
                    {top.work.posterUrl ? (
                      <img
                        src={top.work.posterUrl}
                        alt={top.work.title}
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-adil-blue/10 text-adil-blue">
                          <Palette className="h-5 w-5" />
                        </div>
                        <p className="line-clamp-2 font-display text-xs font-bold">{top.work.title}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="line-clamp-1 max-w-[200px] font-display text-xs font-bold">
                      {top.work.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Hamming: {top.poster?.hammingDistance ?? "?"} bit · {top.work.competition}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* ── GRID SKOR + LANGKAH ── */}
        <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_1fr] print:grid-cols-1">
          <PosterCard rotate={0.5} className="space-y-6">
            {isPoster ? (
              <>
                <ScoreBar
                  label="Kemiripan sidik visual (dHash)"
                  hint={`Jarak Hamming: ${result.topHamming ?? "?"} bit — 0-4 hampir identik, 5-10 sangat mirip`}
                  value={result.topHash ?? 0}
                  color="blue"
                />
                <ScoreBar
                  label="Kemiripan tata letak (16×16)"
                  hint="Korelasi Pearson pola terang-gelap. Makin mendekati 1 = susunan elemen poster serupa"
                  value={result.topLayout ?? 0}
                  color="green"
                />
                <ScoreBar
                  label="Kemiripan palet warna"
                  hint="Histogram Intersection 64 bin. Makin mendekati 1 = palet warna hampir sama"
                  value={result.topColor ?? 0}
                  color="yellow"
                />
                {(result.topOcr ?? 0) > 0 && (
                  <ScoreBar
                    label="Kesamaan teks terbaca (OCR)"
                    hint="Jaccard similarity antara kata-kata yang bisa dibaca di kedua poster"
                    value={result.topOcr ?? 0}
                    color="blue"
                  />
                )}
                <div className="rounded-2xl bg-muted p-4 text-sm">
                  <p className="font-bold">Skor gabungan = dHash × 0,4 + Layout × 0,4 + Warna × 0,2</p>
                  <p className="mt-1 text-muted-foreground">
                    = {Math.round((result.topHash ?? 0) * 100)}% × 0,4 + {Math.round((result.topLayout ?? 0) * 100)}% × 0,4 + {Math.round((result.topColor ?? 0) * 100)}% × 0,2
                    {" "}= <strong className="text-foreground">{Math.round((top?.combined ?? 0) * 100)}%</strong>
                  </p>
                </div>
              </>
            ) : (
              <>
                <ScoreBar label="Kesamaan kata" hint="Ada berapa kata yang persis sama" value={result.topText} color="blue" />
                <ScoreBar label="Kesamaan topik" hint="Apakah bahas bidang yang sama" value={result.topConcept} color="green" />
                {result.topSemantic !== undefined && (
                  <ScoreBar label="Kesamaan arti" hint="Walau beda kata, artinya mirip nggak" value={result.topSemantic} color="yellow" />
                )}
                <div className="rounded-2xl bg-muted p-4 text-sm">
                  <p className="font-bold">
                    {result.topSemantic !== undefined
                      ? "Skor gabungan = kata × 0,35 + topik × 0,35 + arti × 0,3"
                      : "Skor gabungan = kata × 0,5 + topik × 0,5"}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {result.topSemantic !== undefined ? (
                      <>= {Math.round(result.topText * 100)}% × 0,35 + {Math.round(result.topConcept * 100)}% × 0,35 + {Math.round(result.topSemantic * 100)}% × 0,3 ={" "}
                        <strong className="text-foreground">{Math.round((top?.combined ?? 0) * 100)}%</strong></>
                    ) : (
                      <>= {Math.round(result.topText * 100)}% × 0,5 + {Math.round(result.topConcept * 100)}% × 0,5 ={" "}
                        <strong className="text-foreground">{Math.round((top?.combined ?? 0) * 100)}%</strong></>
                    )}
                  </p>
                </div>
              </>
            )}
            <button onClick={() => setShowWhy(!showWhy)} className="text-sm font-bold text-adil-blue underline-offset-4 hover:underline" aria-expanded={showWhy}>
              Kok bisa segini?
            </button>
            {showWhy && (
              <p className="rounded-2xl border-2 border-adil-blue/30 bg-adil-blue/5 p-4 text-sm">
                {isPoster
                  ? "Skor ini bukan vonis plagiat visual. Ini ukuran seberapa mirip bentuk, susun, dan warna postermu dibanding arsip. Poster dengan tema sama wajar punya skor tata letak mirip."
                  : "Skor ini bukan peluang kamu dianggap plagiat. Ini cuma ukuran seberapa banyak kata dan konsep yang beririsan."}
              </p>
            )}
          </PosterCard>

          <PosterCard rotate={-1} className="relative print:hidden">
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

        {/* ── DAFTAR KARYA MIRIP ── */}
        <div className="mt-16">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-3xl font-extrabold">
              {isPoster ? "Poster arsip yang paling mirip" : "Karya yang paling mirip"}
            </h2>
            <StickerLabel color="green" rotate={2}>{isPoster ? "Arsip Poster" : "Arsip Pemenang"}</StickerLabel>
          </div>
          {visible.length === 0 ? (
            <EmptyState title="Belum ada yang cocok. Coba kata kunci lain." mood="senang" />
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {visible.map((m, i) => (
                <PosterCard key={m.work.id} rotate={i % 2 === 0 ? -1 : 1}>
                  {isPoster ? (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg font-extrabold leading-snug">{m.work.title}</h3>
                        <span className="shrink-0 rounded-full bg-adil-blue px-3 py-1 font-display text-sm font-extrabold text-white">
                          {Math.round(m.combined * 100)}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {m.work.competition} · {m.work.institution} · {m.work.year}
                        {m.work.rank ? ` · ${m.work.rank}` : ""}
                      </p>
                      {m.poster && (
                        <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-muted/60 p-3">
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground">dHash</p>
                            <p className="font-display text-sm font-extrabold text-adil-blue">
                              {Math.round((m.poster.dhashScore ?? 0) * 100)}%
                            </p>
                            <p className="text-[10px] text-muted-foreground">{m.poster.hammingDistance ?? "?"} bit</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground">Layout</p>
                            <p className="font-display text-sm font-extrabold text-adil-green">
                              {Math.round((m.poster.layoutScore ?? 0) * 100)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground">Warna</p>
                            <p className="font-display text-sm font-extrabold" style={{ color: "var(--adil-yellow, #f5c518)" }}>
                              {Math.round((m.poster.colorScore ?? 0) * 100)}%
                            </p>
                          </div>
                        </div>
                      )}
                      {m.poster?.ocrScore !== undefined && m.poster.ocrScore > 0 && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">OCR {Math.round(m.poster.ocrScore * 100)}%</span> · kesamaan teks terbaca
                        </p>
                      )}
                      {m.poster?.ocrTeksArsip && m.poster.ocrTeksArsip.length > 0 && (
                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground italic">
                          "{m.poster.ocrTeksArsip.slice(0, 120)}{m.poster.ocrTeksArsip.length > 120 ? "..." : ""}"
                        </p>
                      )}
                    </>
                  ) : (
                    <>
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
                    </>
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

