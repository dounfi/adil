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
      { title: "Perbandingan karya — ADIL" },
      { name: "description", content: "Bandingkan karyamu dengan karya pembanding: fitur visual, tata letak, warna, dan teks. Bukti, bukan vonis." },
      { property: "og:title", content: "Perbandingan karya — ADIL" },
      { property: "og:description", content: "Perbandingan berdampingan secara detail dan objektif." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ComparePage,
});

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

function PosterImage({ src, alt, title }: { src?: string; alt: string; title: string }) {
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
        ? { label: "Hampir Identik", color: "bg-adil-red text-white", desc: "Jarak Hamming 0-4 bit menandakan sidik visual hampir sama persis (potensi turunan/modifikasi langsung)." }
        : hamming <= 10
        ? { label: "Sangat Mirip", color: "bg-adil-yellow text-adil-ink", desc: "Jarak Hamming 5-10 bit menandakan struktur bentuk dan pola gradien poster memiliki kemiripan tinggi." }
        : hamming <= 20
        ? { label: "Kemiripan Sedang", color: "bg-adil-blue text-white", desc: "Beberapa fitur bentuk mirip, namun secara keseluruhan memiliki variasi yang cukup jelas." }
        : { label: "Berbeda Struktural", color: "bg-adil-green text-white", desc: "Sidik jari visual berbeda jauh. Karakteristik visual utama tidak beririsan." };

    return (
      <main className="bg-canvas-grid py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Link to="/hasil" className="inline-flex items-center gap-1.5 text-sm font-bold text-adil-blue hover:underline">
            <ArrowLeft className="h-4 w-4" /> Balik ke daftar hasil
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <FrameLabel>Perbandingan Visual Poster</FrameLabel>
            <span className={`rounded-full px-3 py-1 font-display text-xs font-extrabold uppercase ${hammingStatus.color}`}>
              {hammingStatus.label} ({combinedPct}%)
            </span>
          </div>

          <h1 className="mt-2 font-display text-3xl font-extrabold md:text-5xl">
            Bandingkan Visual Berdampingan
          </h1>
          <p className="mt-2 max-w-3xl text-base text-muted-foreground">
            Sistem menganalisis 4 dimensi visual: <strong>sidik jari perseptual (dHash)</strong>, <strong>tata letak 16×16</strong>, <strong>spektrum palet warna</strong>, dan <strong>teks terbaca (OCR)</strong>.
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
                {result.visualFeatures?.dhash && (
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    dHash: {result.visualFeatures.dhash}
                  </span>
                )}
              </div>

              <PosterImage
                src={result.userPosterUrl}
                alt="Poster Pengguna"
                title={result.query.title || result.query.fileName || "Poster Input"}
              />

              <div>
                <h2 className="font-display text-lg font-extrabold">
                  {result.query.title || result.query.fileName || "Karya Poster yang Dicek"}
                </h2>
                {result.query.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{result.query.description}</p>
                )}
              </div>

              {/* TEKS OCR POSTER KAMU */}
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 text-adil-blue" />
                  <span>Teks Terbaca pada Postermu (OCR)</span>
                </div>
                {result.query.extractedText && result.query.extractedText.trim().length > 0 ? (
                  <div className="mt-2.5 max-h-36 overflow-y-auto text-xs leading-relaxed text-muted-foreground">
                    <HighlightedText text={result.query.extractedText} words={shared} />
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
                {poster?.dhash && (
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    dHash: {poster.dhash}
                  </span>
                )}
              </div>

              <PosterImage
                src={poster?.gambar_url || work.posterUrl}
                alt={work.title}
                title={work.title}
              />

              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h2 className="font-display text-lg font-extrabold">{work.title}</h2>
                  {work.rank && (
                    <span className="rounded-full bg-adil-yellow/20 px-2 py-0.5 font-display text-xs font-bold text-adil-ink">
                      {work.rank}
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
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 text-adil-red" />
                  <span>Teks Terbaca pada Poster Arsip</span>
                </div>
                {poster?.ocrTeksArsip && poster.ocrTeksArsip.trim().length > 0 ? (
                  <div className="mt-2.5 max-h-36 overflow-y-auto text-xs leading-relaxed text-muted-foreground">
                    <HighlightedText text={poster.ocrTeksArsip} words={shared} />
                  </div>
                ) : (
                  <p className="mt-2 text-xs italic text-muted-foreground">
                    Arsip ini tidak memiliki teks OCR tercatat.
                  </p>
                )}
              </div>
            </PosterCard>
          </div>

          {/* ── 4 DIMENSI FITUR VISUAL ── */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-extrabold md:text-3xl">
              Rincian Analisis 4 Dimensi Visual
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Berikut perhitungan matematis di balik skor kemiripan visual:
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* DIMENSI 1: dHash */}
              <PosterCard rotate={-0.5} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-adil-blue/15 text-adil-blue">
                      <Fingerprint className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-extrabold">1. Sidik Jari Visual (dHash)</h3>
                      <p className="text-xs text-muted-foreground">Bobot algoritma: 40%</p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-extrabold text-adil-blue">
                    {Math.round(dhashScore * 100)}%
                  </span>
                </div>

                <ScoreBar
                  label="Tingkat Kemiripan Hash"
                  hint={`Jarak Hamming: ${hamming} bit dari 64 bit`}
                  value={dhashScore}
                  color="blue"
                />

                <div className="rounded-xl bg-muted/60 p-3.5 text-xs space-y-1.5">
                  <div className="flex justify-between font-mono">
                    <span className="text-muted-foreground">Hash Kamu:</span>
                    <span className="font-bold text-foreground">{result.visualFeatures?.dhash || "-"}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-muted-foreground">Hash Arsip:</span>
                    <span className="font-bold text-foreground">{poster?.dhash || "-"}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1.5">
                    <span className="text-muted-foreground">Perbedaan Bit:</span>
                    <span className="font-bold text-adil-blue">{hamming} bit</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {hammingStatus.desc}
                </p>
              </PosterCard>

              {/* DIMENSI 2: LAYOUT */}
              <PosterCard rotate={0.5} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-adil-green/15 text-adil-green">
                      <LayoutGrid className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-extrabold">2. Tata Letak (16×16 Grid)</h3>
                      <p className="text-xs text-muted-foreground">Bobot algoritma: 40%</p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-extrabold text-adil-green">
                    {Math.round(layoutScore * 100)}%
                  </span>
                </div>

                <ScoreBar
                  label="Korelasi Tata Letak Spasial"
                  hint="Korelasi Pearson 256 zona intensitas terang-gelap"
                  value={layoutScore}
                  color="green"
                />

                <div className="rounded-xl bg-muted/60 p-3.5 text-xs">
                  <p className="font-semibold text-foreground">
                    {layoutScore >= 0.75
                      ? "Pola komposisi sangat serupa."
                      : layoutScore >= 0.5
                      ? "Komposisi dan letak focal point mirip."
                      : "Susunan elemen grafis dan teks berbeda secara signifikan."}
                  </p>
                  <p className="mt-1 text-muted-foreground leading-relaxed">
                    Sistem membagi poster ke dalam 256 blok intensitas untuk mengukur apakah penempatan header, ilustrasi utama, dan footer berada di kuadran kanvas yang serupa.
                  </p>
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
                      <p className="text-xs text-muted-foreground">Bobot algoritma: 20%</p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-extrabold text-amber-600">
                    {Math.round(colorScore * 100)}%
                  </span>
                </div>

                <ScoreBar
                  label="Irisan Histogram Warna (64 Bin)"
                  hint="Histogram Intersection proporsi sebaran RGB"
                  value={colorScore}
                  color="yellow"
                />

                <div className="rounded-xl bg-muted/60 p-3.5 text-xs">
                  <p className="font-semibold text-foreground">
                    {colorScore >= 0.7
                      ? "Palet warna dominan dan mood visual hampir serupa."
                      : colorScore >= 0.4
                      ? "Terdapat nuansa warna turunan yang sejenis."
                      : "Skema warna kontras dan berbeda."}
                  </p>
                  <p className="mt-1 text-muted-foreground leading-relaxed">
                    Menghitung distribusi 64 zona spektrum warna RGB untuk mendeteksi kesamaan pemilihan mood warna (misal: nuansa biru teknologi vs hijau lingkungan).
                  </p>
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
                      <h3 className="font-display text-base font-extrabold">4. Kesamaan Teks Terbaca (OCR)</h3>
                      <p className="text-xs text-muted-foreground">Jaccard token similarity</p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-extrabold text-indigo-600">
                    {Math.round(ocrScore * 100)}%
                  </span>
                </div>

                <ScoreBar
                  label="Irisan Kata Terbaca"
                  hint={`${match.sharedWords?.length ?? 0} kata beririsan terdeteksi`}
                  value={ocrScore}
                  color="blue"
                />

                <div className="rounded-xl bg-muted/60 p-3.5 text-xs">
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
                Karya pembanding menargetkan konsep <strong>{missing.join(", ")}</strong> — hal yang nggak muncul di idemu. Kamu bisa tonjolkan pembeda kamu sendiri di bagian proposal agar tidak dianggap sama.
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
