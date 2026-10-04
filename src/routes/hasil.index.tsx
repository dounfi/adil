import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Search, Palette, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Mascot, StickerLabel } from "@/components/decor";
import { PosterCard, ScoreBar } from "@/components/chrome";
import { EmptyState } from "@/components/empty";
import { getLastResult } from "@/lib/scoring";

export const Route = createFileRoute("/hasil/")({
  head: () => ({
    meta: [
      { title: "Hasil cek ide - ADIL" },
      { name: "description", content: "Lihat karya yang mirip dengan idemu, lengkap dengan skor teks dan konsep. Bukti, bukan vonis." },
      { property: "og:title", content: "Hasil cek ide - ADIL" },
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
        { label: "Cek ide lain", to: "/cek" as const },
      ]
      : [
        ...(top ? [{ label: "Lihat bedanya", to: "/hasil/$workId" as const, params: { workId: top.work.id } }] : []),
        { label: "Ubah dan cek lagi", to: "/cek" as const },
      ];

  return (
    <main className="bg-canvas-grid py-16">
      <div className="mx-auto max-w-5xl px-4">
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
              Poster dianalisis dari bentuk visual, komposisi tata letak, palet warna, dan teks desain.
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
                  (Privat & aman di browser)
                </span>
              </div>
              {top && (top.combined > 0.15) && (
                <Link
                  to="/hasil/$workId"
                  params={{ workId: top.work.id }}
                  className="text-xs font-bold text-adil-blue hover:underline"
                >
                  Bandingkan Detail Lengkap →
                </Link>
              )}
            </div>

            {/* Kalau aman (< 15%) - tampilkan 50-50 grid: kiri gambar poster, kanan keterangan profesional tanpa emoji */}
            {(!top || top.combined <= 0.15) ? (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Kolom Kiri: Poster Pengguna (50%) */}
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-border bg-muted/20 p-5 text-center">
                  <div className="relative aspect-[3/4] w-full max-h-80 overflow-hidden rounded-xl border border-border bg-black/5 shadow-sm">
                    <img
                      src={result.userPosterUrl}
                      alt="Poster Pengguna"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="mt-3">
                    <p className="font-display text-sm font-bold">Poster Kamu</p>
                  </div>
                </div>

                {/* Kolom Kanan: Keterangan Tanpa Emoji (50%) */}
                <div className="flex flex-col justify-center rounded-2xl border-2 border-border bg-card p-6 md:p-8 text-left">
                  <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-adil-green/30 bg-adil-green/10 px-3 py-1 font-display text-xs font-bold text-adil-green">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Karya Visual Orisinal</span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-black text-foreground md:text-2xl">
                    Tidak ada karya yang mirip di arsip
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Skor kemiripan visual postermu terhadap seluruh karya di basis data arsip berada di bawah 15% (tingkat kesamaan sangat rendah).
                  </p>

                  <div className="mt-6 space-y-2 rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>Status Deteksi Visual</span>
                      <span className="text-adil-green font-semibold">Aman / Tidak Ada Indikasi</span>
                    </div>
                    <p className="leading-relaxed">
                      Komparasi bentuk visual, tata letak bidang, dan spektrum warna tidak menemukan kesamaan signifikan dengan karya poster lain di arsip lomba.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch relative">
                {/* Floating VS Badge di tengah desktop */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col items-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full font-display text-xs font-black shadow-md border-2 border-background ${
                    top.combined >= 0.6 ? 'bg-adil-red text-white' :
                    top.combined >= 0.35 ? 'bg-adil-yellow text-adil-ink' :
                    'bg-adil-blue text-white'
                  }`}>
                    VS
                  </div>
                  <span className={`mt-1.5 rounded-full bg-card px-3 py-0.5 font-display text-xs font-black shadow-sm border border-border ${
                    top.combined >= 0.6 ? 'text-adil-red' :
                    top.combined >= 0.35 ? 'text-amber-600' :
                    'text-adil-blue'
                  }`}>
                    {Math.round(top.combined * 100)}% mirip
                  </span>
                </div>

                {/* Kolom Kiri: Poster Pengguna (50%) */}
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-border bg-card p-5 text-center">
                  <div className="relative aspect-[3/4] w-full max-h-80 overflow-hidden rounded-xl border border-border bg-black/5 shadow-sm">
                    <img
                      src={result.userPosterUrl}
                      alt="Poster Pengguna"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="mt-3">
                    <p className="font-display text-sm font-bold">Poster Kamu</p>
                  </div>
                </div>

                {/* Mobile VS Badge */}
                <div className="flex md:hidden flex-col items-center justify-center py-1">
                  <span className={`rounded-full px-3 py-1 font-display text-xs font-black shadow-sm border border-border ${
                    top.combined >= 0.6 ? 'bg-adil-red/15 text-adil-red' :
                    top.combined >= 0.35 ? 'bg-adil-yellow/30 text-adil-ink' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    VS · {Math.round(top.combined * 100)}% mirip
                  </span>
                </div>

                {/* Kolom Kanan: Arsip Terdekat (50%) */}
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-border bg-card p-5 text-center">
                  <div className="relative flex aspect-[3/4] w-full max-h-80 flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40 p-2 shadow-sm">
                    {top.work.posterUrl ? (
                      <img
                        src={top.work.posterUrl}
                        alt={top.work.title}
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-adil-blue/10 text-adil-blue">
                          <Palette className="h-6 w-6" />
                        </div>
                        <p className="line-clamp-2 font-display text-xs font-bold">{top.work.title}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 w-full px-2">
                    <p className="line-clamp-1 font-display text-sm font-bold">
                      {top.work.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {top.work.competition}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── GRID SKOR + LANGKAH ── */}
        <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_1fr] print:grid-cols-1">
          <PosterCard rotate={0.5} className="space-y-6">
            <h2 className="font-display text-xl font-extrabold">
              {isPoster ? "Indikator Visual" : "Indikator Kesamaan"}
            </h2>
            {isPoster ? (
              <>
                <ScoreBar
                  label="Kemiripan bentuk visual"
                  hint="Analisis kesamaan bentuk dan struktur visual utama"
                  value={result.topHash ?? 0}
                  color="blue"
                />
                <ScoreBar
                  label="Kemiripan tata letak"
                  hint="Analisis susunan elemen grafis dan penempatan objek"
                  value={result.topLayout ?? 0}
                  color="green"
                />
                <ScoreBar
                  label="Kemiripan palet warna"
                  hint="Analisis keselarasan spektrum dan harmoni warna"
                  value={result.topColor ?? 0}
                  color="yellow"
                />
                {(result.topOcr ?? 0) > 0 && (
                  <ScoreBar
                    label="Kesamaan teks terbaca (OCR)"
                    hint="Kata-kata yang terbaca sama pada kedua poster"
                    value={result.topOcr ?? 0}
                    color="blue"
                  />
                )}
              </>
            ) : (
              <>
                <ScoreBar label="Kesamaan kata" hint="Kata-kata spesifik yang serupa dengan arsip" value={result.topText} color="blue" />
                <ScoreBar label="Kesamaan topik" hint="Kesesuaian ranah dan bidang bahasan" value={result.topConcept} color="green" />
                {result.topSemantic !== undefined && (
                  <ScoreBar label="Kesamaan arti" hint="Makna konteks walau menggunakan susunan kata berbeda" value={result.topSemantic} color="yellow" />
                )}
              </>
            )}
          </PosterCard>

          <PosterCard rotate={-1} className="relative print:hidden">
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
            <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-adil-green" />
              <span>Hasil analisis bersifat indikatif untuk evaluasi mandiri</span>
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

