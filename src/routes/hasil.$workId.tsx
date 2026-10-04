import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Fingerprint,
  LayoutGrid,
  Palette,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Sparkles,
  Info,
} from "lucide-react";
import { FrameLabel, StickerLabel, Mascot, CommentBubble } from "@/components/decor";
import { PosterCard, ScoreBar } from "@/components/chrome";
import { EmptyState } from "@/components/empty";
import { getLastResult, tokenize } from "@/lib/scoring";
import { WORKS } from "@/lib/works";

export const Route = createFileRoute("/hasil/$workId")({
  head: () => ({
    meta: [
      { title: "Perbandingan karya - ADIL" },
      { name: "description", content: "Bandingkan karyamu dengan karya pembanding: fitur visual, tata letak, warna, dan teks. Bukti, bukan vonis." },
      { property: "og:title", content: "Perbandingan karya - ADIL" },
      { property: "og:description", content: "Perbandingan berdampingan secara detail dan objektif." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ComparePage,
});

function cleanOcrDisplay(rawText?: string): string {
  if (!rawText) return "";
  return rawText
    .replace(/[—–]/g, "-")
    .replace(/[|~^$*#_]/g, " ")
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.length <= 2 && !/^[a-zA-Z0-9]{2}$/.test(trimmed)) return "";
      const alphaCount = (trimmed.match(/[a-zA-Z0-9]/g) || []).length;
      if (alphaCount < 3 && trimmed.length > 4) return "";
      return trimmed.replace(/[-.]{2,}/g, " ").replace(/\s+/g, " ").trim();
    })
    .filter((line) => line.length > 0)
    .join("\n");
}

function HighlightedText({ text, words }: { text: string; words: Set<string> }) {
  const parts = text.split(/(\s+)/);
  return (
    <p className="leading-relaxed">
      {parts.map((p, i) => {
        const clean = tokenize(p)[0];
        return clean && words.has(clean) ? (
          <mark key={i} className="rounded bg-adil-yellow px-1 font-semibold text-adil-ink">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        );
      })}
    </p>
  );
}

function PosterImage({ src, alt, title }: { src?: string | undefined; alt: string; title: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="flex aspect-[3/4] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-gradient-to-br from-muted/50 via-muted/20 to-muted/60 p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-adil-blue/10 text-adil-blue shadow-inner">
          <Palette className="h-8 w-8" />
        </div>
        <p className="mt-4 line-clamp-2 font-display text-sm font-bold text-foreground">{title}</p>
        <span className="mt-1 text-xs text-muted-foreground">Arsip Poster Lomba</span>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-border bg-black/5 shadow-md">
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="aspect-[3/4] w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </div>
  );
}

function ComparePage() {
  const { workId } = Route.useParams();
  const result = getLastResult();
  const match = result?.matches.find((m) => m.work.id === workId);
  const work = match?.work || WORKS.find((w) => w.id === workId);

  if (!result || !work || !match) {
    return (
      <main className="bg-canvas-grid px-4 py-16">
        <EmptyState
          title="Waduh, perbandingannya nggak ketemu."
          sub="Hasil cek cuma disimpan di memori privat per sesi browser agar karyamu aman. Silakan lakukan pengecekan ulang."
        />
      </main>
    );
  }

  const isPoster = result.isPoster === true || !!match.poster;
  const shared = new Set(match.sharedWords || []);

  if (isPoster) {
    const poster = match.poster;
    const hamming = poster?.hammingDistance ?? 64;
    const dhashScore = poster?.dhashScore ?? 0;
    const layoutScore = poster?.layoutScore ?? 0;
    const colorScore = poster?.colorScore ?? 0;
    const ocrScore = poster?.ocrScore ?? 0;
    const combinedPct = Math.round(match.combined * 100);

    const hammingStatus =
      hamming <= 4
        ? { label: "Hampir Identik", color: "bg-adil-red text-white" }
        : hamming <= 10
        ? { label: "Sangat Mirip", color: "bg-adil-yellow text-adil-ink" }
        : hamming <= 20
        ? { label: "Kemiripan Sedang", color: "bg-adil-blue text-white" }
        : { label: "Berbeda Struktural", color: "bg-adil-green text-white" };

    const userOcrClean = cleanOcrDisplay(result.query.extractedText);
    const arsipOcrClean = cleanOcrDisplay(poster?.ocrTeksArsip);

    return (
      <main className="bg-canvas-grid py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Link to="/hasil" className="inline-flex items-center gap-1.5 text-sm font-bold text-adil-blue hover:underline">
            <ArrowLeft className="h-4 w-4" /> Balik ke daftar hasil
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 font-display text-xs font-extrabold uppercase ${hammingStatus.color}`}>
              {hammingStatus.label} ({combinedPct}%)
            </span>
          </div>

          <h1 className="mt-2 font-display text-3xl font-extrabold md:text-5xl">
            Bandingkan Visual Berdampingan
          </h1>
          <p className="mt-2 max-w-3xl text-base text-muted-foreground">
            Perbandingan objektif dari bentuk visual, tata letak objek, spektrum palet warna, dan teks desain.
          </p>

          <div className="mt-6 rounded-2xl bg-adil-ink px-5 py-3 text-sm font-semibold text-white">
            Indikatif, bukan putusan. Kemiripan visual wajar terjadi karena konvensi tema atau format infografis poster.
          </div>

          {/* ── DUAL COLUMN POSTER COMPARISON ── */}
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* KOLOM KIRI: POSTER PENGGUNA */}
            <PosterCard rotate={-0.6} className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <StickerLabel color="blue" rotate={-2}>Poster Kamu</StickerLabel>
              </div>

              <PosterImage
                src={result.userPosterUrl}
                alt="Poster Pengguna"
                title={result.query.title || result.query.fileName || "Poster Input"}
              />

              <div>
                <h2 className="font-display text-lg font-extrabold">
                  {result.query.title || result.query.fileName || "Poster Kamu"}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">Karya yang kamu unggah untuk pengecekan</p>
              </div>

              {/* TEKS OCR POSTER KAMU */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-adil-blue" />
                    <span>Teks Terdeteksi pada Postermu</span>
                  </div>
                  <span className="text-[11px] font-normal normal-case text-muted-foreground">Ekstraksi OCR</span>
                </div>
                {userOcrClean ? (
                  <div className="mt-3 max-h-40 overflow-y-auto rounded-lg bg-card/60 p-3 text-xs leading-relaxed text-foreground shadow-inner">
                    <HighlightedText text={userOcrClean} words={shared} />
                  </div>
                ) : (
                  <p className="mt-2 text-xs italic text-muted-foreground">
                    Tidak ada teks yang diekstrak dari gambar ini.
                  </p>
                )}
              </div>
            </PosterCard>

            {/* KOLOM KANAN: POSTER ARSIP PEMBANDING */}
            <PosterCard rotate={0.6} className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <StickerLabel color="red" rotate={2}>Poster Arsip Pembanding</StickerLabel>
              </div>

              <PosterImage
                src={poster?.gambar_url || (work as any).posterUrl}
                alt={work.title}
                title={work.title}
              />

              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h2 className="font-display text-lg font-extrabold">{work.title}</h2>
                  {(work as any).rank && (
                    <span className="rounded-full bg-adil-yellow/20 px-2 py-0.5 font-display text-xs font-bold text-adil-ink">
                      {(work as any).rank}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {work.competition} · {work.institution} · {work.year}
                </p>
                {work.sourceUrl && (
                  <a
                    href={work.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-adil-blue hover:underline"
                  >
                    Buka tautan arsip resmi <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* TEKS OCR ARSIP */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-adil-red" />
                    <span>Teks Terdeteksi pada Poster Arsip</span>
                  </div>
                  <span className="text-[11px] font-normal normal-case text-muted-foreground">Arsip Pemenang</span>
                </div>
                {arsipOcrClean ? (
                  <div className="mt-3 max-h-40 overflow-y-auto rounded-lg bg-card/60 p-3 text-xs leading-relaxed text-foreground shadow-inner">
                    <HighlightedText text={arsipOcrClean} words={shared} />
                  </div>
                ) : (
                  <p className="mt-2 text-xs italic text-muted-foreground">
                    Arsip ini tidak memiliki rekaman teks OCR.
                  </p>
                )}
              </div>
            </PosterCard>
          </div>

          {/* ── 4 DIMENSI FITUR VISUAL ── */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-extrabold md:text-3xl">
              Dimensi Analisis Visual
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Perbandingan karakteristik visual antara kedua karya:
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* DIMENSI 1: BENTUK VISUAL */}
              <PosterCard rotate={-0.5} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-adil-blue/15 text-adil-blue">
                      <Fingerprint className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-extrabold">1. Bentuk & Struktur Visual</h3>
                      <p className="text-xs text-muted-foreground">Analisis sidik visual perseptual</p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-extrabold text-adil-blue">
                    {Math.round(dhashScore * 100)}%
                  </span>
                </div>

                <ScoreBar
                  label="Kemiripan Bentuk & Struktur"
                  hint="Kesamaan bentuk objek dan pola siluet utama"
                  value={dhashScore}
                  color="blue"
                />

                <div className="rounded-xl bg-muted/40 p-3.5 text-xs text-muted-foreground leading-relaxed">
                  {dhashScore >= 0.8
                    ? "Struktur bentuk visual dan komposisi utama sangat serupa dengan arsip pembanding."
                    : dhashScore >= 0.5
                    ? "Terdapat beberapa kesamaan siluet dan objek visual, namun masih memiliki variasi."
                    : "Struktur bentuk dan siluet visual berbeda jelas dari karya pembanding."}
                </div>
              </PosterCard>

              {/* DIMENSI 2: LAYOUT */}
              <PosterCard rotate={0.5} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-adil-green/15 text-adil-green">
                      <LayoutGrid className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-extrabold">2. Tata Letak (Komposisi)</h3>
                      <p className="text-xs text-muted-foreground">Analisis distribusi spasial elemen</p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-extrabold text-adil-green">
                    {Math.round(layoutScore * 100)}%
                  </span>
                </div>

                <ScoreBar
                  label="Kesesuaian Tata Letak"
                  hint="Kesamaan letak focal point dan blok konten"
                  value={layoutScore}
                  color="green"
                />

                <div className="rounded-xl bg-muted/40 p-3.5 text-xs text-muted-foreground leading-relaxed">
                  {layoutScore >= 0.75
                    ? "Pola komposisi dan penempatan elemen grafis sangat serupa."
                    : layoutScore >= 0.5
                    ? "Komposisi dan letak focal point memiliki kemiripan."
                    : "Susunan elemen grafis dan penataan teks berbeda secara signifikan."}
                </div>
              </PosterCard>

              {/* DIMENSI 3: WARNA */}
              <PosterCard rotate={0.3} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                      <Palette className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-extrabold">3. Spektrum Palet Warna</h3>
                      <p className="text-xs text-muted-foreground">Analisis proporsi dan keselarasan warna</p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-extrabold text-amber-600">
                    {Math.round(colorScore * 100)}%
                  </span>
                </div>

                <ScoreBar
                  label="Keselarasan Palet Warna"
                  hint="Kemiripan pemilihan tema warna dominan"
                  value={colorScore}
                  color="yellow"
                />

                <div className="rounded-xl bg-muted/40 p-3.5 text-xs text-muted-foreground leading-relaxed">
                  {colorScore >= 0.7
                    ? "Palet warna dominan dan nuansa visual hampir serupa."
                    : colorScore >= 0.4
                    ? "Terdapat nuansa warna turunan yang sejenis."
                    : "Skema warna kontras dan berbeda."}
                </div>
              </PosterCard>

              {/* DIMENSI 4: OCR TEKS */}
              <PosterCard rotate={-0.3} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-extrabold">4. Kesamaan Teks Terbaca</h3>
                      <p className="text-xs text-muted-foreground">Pencocokan kata penting pada poster</p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-extrabold text-indigo-600">
                    {Math.round(ocrScore * 100)}%
                  </span>
                </div>

                <ScoreBar
                  label="Irisan Teks & Tipografi"
                  hint={`${match.sharedWords?.length ?? 0} kata beririsan terdeteksi`}
                  value={ocrScore}
                  color="blue"
                />

                <div className="rounded-xl bg-muted/40 p-3.5 text-xs">
                  {match.sharedWords && match.sharedWords.length > 0 ? (
                    <div>
                      <span className="font-semibold text-foreground">Kata beririsan di kedua poster:</span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {match.sharedWords.map((w) => (
                          <span key={w} className="rounded-md bg-adil-yellow px-2 py-0.5 text-xs font-bold text-adil-ink">
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Tidak ditemukan kesamaan kata signifikan pada teks yang terbaca.
                    </p>
                  )}
                </div>
              </PosterCard>
            </div>
          </div>

          {/* ── REKOMENDASI ORISINALITAS DESAIN ── */}
          <div className="mt-12">
            <PosterCard rotate={-0.4} className="relative bg-adil-yellow/20 border-2 border-adil-yellow">
              <Mascot color="yellow" mood="senang" className="absolute -right-3 -top-6 hidden md:block" />
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-adil-ink" />
                <h3 className="font-display text-2xl font-extrabold text-adil-ink">
                  Saran Orisinalitas untuk Desain Postermu
                </h3>
              </div>

              <div className="mt-4 grid gap-4 text-sm leading-relaxed text-adil-ink md:grid-cols-2">
                <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <h4 className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-adil-green" /> Eksplorasi Tata Letak & Grid
                  </h4>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {layoutScore >= 0.6
                      ? "Skor layout cukup tinggi. Coba geser focal point (elemen utama) dari tengah ke sudut asimetris, atau ubah hierarki judul agar strukturnya unik."
                      : "Struktur layout postermu sudah memiliki ciri khas dan pembeda yang baik dari karya pembanding."}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <h4 className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-adil-green" /> Variasi Palet & Mood Warna
                  </h4>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {colorScore >= 0.6
                      ? "Gunakan harmoni warna alternatif (seperti triadic atau split-complementary) agar mood visual postermu tampak lebih segar di mata dewan juri."
                      : "Kombinasi palet warna postermu sudah berbeda dari karya pembanding ini."}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <h4 className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-adil-green" /> Ilustrasi & Bentuk Visual
                  </h4>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {hamming <= 10
                      ? "Perceptual dHash mendeteksi kontur visual yang mirip. Buat gaya ilustrasi atau aset 3D/vektor yang lebih khas agar sidik visual tidak menyerupai arsip lomba terdahulu."
                      : "Bentuk dan ilustrasi visual postermu tidak memiliki indikasi duplikasi langsung."}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <h4 className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-adil-green" /> Copywriting & Headline Poster
                  </h4>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Gunakan tagline yang kreatif dan kontekstual dengan solusi yang kamu tawarkan, hindari slogan klise yang sering dipakai di kompetisi sejenis.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-adil-ink/10 pt-4">
                <p className="text-xs text-muted-foreground">
                  Simpan bukti analisis ini sebagai arsip mandiri sebelum karya kamu disubmit ke panitia lomba.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-adil-ink bg-transparent px-4 py-2 text-xs font-bold text-adil-ink transition-transform hover:scale-105"
                  >
                    <Printer className="h-3.5 w-3.5" /> Cetak Bukti Analisis
                  </button>
                  <Link
                    to="/cek"
                    className="inline-flex items-center gap-1.5 rounded-full bg-adil-ink px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105"
                  >
                    Cek Poster Lain →
                  </Link>
                </div>
              </div>
            </PosterCard>
          </div>
        </div>
      </main>
    );
  }

  // ── MODE TEKS: PERBANDINGAN PROPOSAL / ESAI ──
  const inputText = `${result.query.title}. ${result.query.description}`;
  const missing = work.keyphrases.filter((k) => !match.sharedPhrases.includes(k));

  return (
    <main className="bg-canvas-grid py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Link to="/hasil" className="inline-flex items-center gap-1.5 text-sm font-bold text-adil-blue hover:underline">
          <ArrowLeft className="h-4 w-4" /> Balik ke daftar hasil
        </Link>
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
                <mark className="rounded bg-adil-yellow px-1 font-semibold text-adil-ink">Sorotan kuning</mark> = frasa atau kata yang beririsan di kedua teks.
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
                    <span
                      key={k}
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        match.sharedPhrases.includes(k)
                          ? "bg-adil-green text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
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
                {work.sourceUrl && (
                  <a href={work.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-bold text-adil-blue hover:underline">
                    Lihat sumber asli ↗
                  </a>
                )}
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
                Karya pembanding menargetkan konsep <strong>{missing.join(", ")}</strong> - hal yang nggak muncul di idemu. Kamu bisa tonjolkan pembeda kamu sendiri di bagian proposal agar tidak dianggap sama.
              </p>
            ) : (
              <p className="mt-3 text-base leading-relaxed text-adil-ink">
                Semua kata kunci intinya muncul di idemu. Hati-hati, idemu sangat mirip! Coba pikirkan sudut pandang, target pengguna, atau fitur utama yang benar-benar berbeda.
              </p>
            )}
          </PosterCard>
        </div>
      </div>
    </main>
  );
}
