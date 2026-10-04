import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, FileText, Image as ImageIcon, X } from "lucide-react";
import { FrameLabel, Mascot, StickerLabel, Sparkle } from "@/components/decor";
import { PosterCard, ScoreBar } from "@/components/chrome";
import { EXAMPLE_IDEA } from "@/lib/works";
import { extractTextFromFile } from "@/utils/fileExtractor";
import { extractVisualFeatures } from "@/utils/visualFeatureExtractor";
import { extractIdeaWithGemini, extractTitleFromGeminiText } from "@/utils/cleanUserPdfText";
import { loadArsipData, matchAllInputs } from "@/utils/matchingService";
import { setLastResult } from "@/lib/scoring";
import type { MatchResult } from "@/types/arsip";

interface CheckerProps {
  showInlineResults?: boolean;
  onAnalysisComplete?: (result: MatchResult) => void;
}

const LOADING_STEPS_DOKUMEN = [
  "Membaca berkas dokumen & mengekstrak konten...",
  "Gemini AI menyaring dokumen & mengekstrak ide inti...",
  "Mencocokkan kata, topik, & makna dengan arsip...",
];

const LOADING_STEPS_POSTER = [
  "Membaca berkas poster...",
  "Menghitung sidik visual: dHash, tata letak, palet warna...",
  "Mencocokkan dengan arsip poster pemenang...",
];

export function Checker({ showInlineResults = false, onAnalysisComplete }: CheckerProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [privat, setPrivat] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const [inputType, setInputType] = useState<"teks" | "file">("teks");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inlineResult, setInlineResult] = useState<MatchResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImageFile = (f: File | null) =>
    !!(f && (f.type.startsWith("image/") || /\.(png|jpe?g|webp|bmp)$/i.test(f.name)));
  const LOADING_STEPS = isImageFile(selectedFile) ? LOADING_STEPS_POSTER : LOADING_STEPS_DOKUMEN;

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setStep((s) => (s + 1) % LOADING_STEPS.length), 1000);
    return () => clearInterval(t);
  }, [loading, LOADING_STEPS.length]);

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
      // Buat preview URL untuk gambar/poster
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (file.type.startsWith("image/") || /\.(png|jpe?g|webp|bmp)$/i.test(file.name)) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  }

  function removeSelectedFile(e: React.MouseEvent) {
    e.stopPropagation();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (inputType === "teks") {
      if (title.trim().length + desc.trim().length < 40) {
        setError("Agak kurang panjang nih. Tambahin dikit biar hasilnya akurat.");
        return;
      }
    } else {
      if (!selectedFile) {
        setError("Silakan pilih berkas dokumen atau poster terlebih dahulu.");
        return;
      }
    }

    setError("");
    setLoading(true);

    try {
      const arsipData = await loadArsipData();
      let extractedText = "";
      let visualFeatures = null;
      let finalTitle = title;
      let finalDesc = desc;

      // Jika input dari Berkas (PDF, DOCX, TXT, Gambar/Poster)
      // Pemrosesan dan ekstraksi dijalankan sekarang di latar belakang tanpa reload/pindah tab
      if (inputType === "file" && selectedFile) {
        const isImage = selectedFile.type.startsWith("image/") || /\.(png|jpe?g|webp|bmp)$/i.test(selectedFile.name);

        if (isImage) {
          // 1. Ekstrak Tanda Tangan Visual (dHash, Layout, Color Histogram)
          try {
            visualFeatures = await extractVisualFeatures(selectedFile);
          } catch (visErr) {
            console.warn("Gagal mengekstrak fitur visual poster:", visErr);
          }

          // 2. Ekstrak OCR Teks dari Gambar
          try {
            extractedText = await extractTextFromFile(selectedFile);
          } catch (ocrErr) {
            console.warn("Gagal ekstraksi OCR dari gambar:", ocrErr);
          }
        } else {
          // Dokumen Teks (.pdf, .docx, .txt)
          const rawDocText = await extractTextFromFile(selectedFile);

          // Saring sampah dokumen (daftar isi, bab, dll.) dan ekstrak ide inti via Gemini AI
          // (Dilengkapi multi-key fallback & local fallback otomatis)
          extractedText = await extractIdeaWithGemini(rawDocText);
        }

        const autoDetectedTitle = extractTitleFromGeminiText(extractedText);
        finalTitle = title.trim() || autoDetectedTitle || selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim();
        finalDesc = desc.trim() || extractedText;
      }

      const isImg = isImageFile(selectedFile);
      // Untuk poster: judul = nama file, desc = teks OCR (bukan disematkan ke query esai)
      if (isImg) {
        finalTitle = title.trim() || selectedFile!.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim();
        finalDesc = "";
      }

      // Hitung perbandingan dan kemiripan terhadap data arsip static
      const matchResult = await matchAllInputs({
        title: finalTitle,
        description: finalDesc,
        file: selectedFile,
        extractedText: isImg ? extractedText : finalDesc,
        visualFeatures,
        arsipData,
        isPoster: isImg,
        userPosterUrl: previewUrl,
      });

      // Simpan ke scoring memory untuk rute /hasil
      setLastResult(matchResult);

      if (onAnalysisComplete) {
        onAnalysisComplete(matchResult);
      }

      // Beri jeda transisi halus untuk loading animasi
      setTimeout(() => {
        setLoading(false);
        if (showInlineResults) {
          setInlineResult(matchResult);
        } else {
          navigate({ to: "/hasil" });
        }
      }, 1600);
    } catch (err: unknown) {
      console.error("Gagal memproses pencocokan:", err);
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses.";
      setError(`Gagal menganalisis berkas: ${msg}`);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="bg-canvas-grid flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="text-center">
          <Mascot color="blue" mood="bingung" className="mx-auto" />
          <div className="mt-8 flex items-center justify-center gap-2">
            {LOADING_STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i <= step ? "bg-adil-blue" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="mt-4 font-display text-2xl font-extrabold" aria-live="polite">
            {LOADING_STEPS[step]}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-canvas-grid relative overflow-hidden py-16">
      <Sparkle color="yellow" className="absolute left-[10%] top-10 hidden md:block" />
      <span
        className="absolute -right-20 top-20 h-52 w-52 rounded-full bg-adil-green/20"
        aria-hidden
      />
      <div className="relative mx-auto max-w-2xl px-4">
        <FrameLabel>Form Cek / Privat</FrameLabel>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">Ceritain ide kamu</h1>
          <Mascot color="cyan" mood="senang" />
        </div>
        <p className="mt-3 text-muted-foreground">
          Judul dan deskripsi singkat aja, atau upload poster/proposalmu.
        </p>

        <PosterCard rotate={-0.5} className="mt-8">
          <form onSubmit={submit} className="space-y-5">
            {/* TABS */}
            <div className="mb-6 flex rounded-xl bg-muted p-1">
              <button
                type="button"
                onClick={() => {
                  setInputType("teks");
                  setError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${
                  inputType === "teks"
                    ? "bg-white shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tulis Teks
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputType("file");
                  setError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${
                  inputType === "file"
                    ? "bg-white shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Upload File / Gambar
              </button>
            </div>

            {inputType === "teks" ? (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <label htmlFor="judul" className="text-sm font-bold">
                    Judul ide
                  </label>
                  <input
                    id="judul"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Aplikasi tutor sebaya buat daerah minim guru"
                    className="mt-1.5 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-sm outline-none focus:border-adil-blue focus:ring-2 focus:ring-adil-blue/30"
                  />
                </div>
                <div>
                  <label htmlFor="deskripsi" className="text-sm font-bold">
                    Deskripsi singkat
                  </label>
                  <textarea
                    id="deskripsi"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Ide kamu buat apa, buat siapa, dan gimana caranya?"
                    rows={5}
                    className="mt-1.5 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-sm outline-none focus:border-adil-blue focus:ring-2 focus:ring-adil-blue/30"
                  />
                </div>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:border-adil-blue hover:bg-adil-blue/5 animate-in fade-in">
                <input
                  type="file"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  accept=".pdf,.docx,.txt,image/png,image/jpeg,image/webp"
                  onChange={handleFileSelected}
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center text-center w-full">
                    {previewUrl ? (
                      /* ── PREVIEW POSTER ── */
                      <div className="relative mb-3 w-full max-w-xs">
                        <img
                          src={previewUrl}
                          alt="Preview poster"
                          className="w-full rounded-2xl border-2 border-adil-blue/30 object-contain shadow-md"
                          style={{ maxHeight: 220 }}
                        />
                        <span className="absolute -right-2 -top-2 rounded-full bg-adil-blue px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow">
                          POSTER
                        </span>
                      </div>
                    ) : (
                      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-adil-blue/15 text-adil-blue shadow-sm">
                        <FileText className="h-7 w-7" />
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground max-w-xs truncate">
                        {selectedFile.name}
                      </p>
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Hapus berkas"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB ·{" "}
                      {previewUrl ? "Akan dicek visual + OCR" : "Akan diekstrak teksnya"}
                    </p>
                    {previewUrl && (
                      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                        <span className="rounded-full bg-adil-blue/10 px-2.5 py-1 text-[11px] font-semibold text-adil-blue">⬛ dHash</span>
                        <span className="rounded-full bg-adil-green/10 px-2.5 py-1 text-[11px] font-semibold text-adil-green">📐 Tata Letak</span>
                        <span className="rounded-full bg-adil-yellow/20 px-2.5 py-1 text-[11px] font-semibold text-adil-ink">🎨 Palet Warna</span>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">📝 OCR Teks</span>
                      </div>
                    )}
                    <p className="mt-3 text-xs font-semibold text-adil-blue underline underline-offset-2">
                      Klik untuk mengganti berkas
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="text-adil-blue"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </span>
                    <p className="text-sm font-bold">Tarik poster atau proposal ke sini</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      PNG/JPG → cek visual poster (dHash, tata letak, warna, OCR).
                      <br />
                      PDF/DOCX/TXT → cek kemiripan teks & konsep ide.

                      Teks akan diekstrak secara otomatis di browser.
                    </p>
                  </>
                )}
              </div>
            )}

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-muted p-4">
              <button
                type="button"
                role="switch"
                aria-checked={privat}
                onClick={() => setPrivat(!privat)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  privat ? "bg-adil-green" : "bg-input"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                    privat ? "left-6" : "left-1"
                  }`}
                />
              </button>
              <span>
                <span className="flex items-center gap-1.5 text-sm font-bold">
                  <ShieldCheck className="h-4 w-4 text-adil-green" /> Cek privat
                </span>
                <span className="text-xs text-muted-foreground">
                  Ide kamu nggak disimpan. Aman.
                </span>
              </span>
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-2xl bg-adil-red/10 px-4 py-3 text-sm font-semibold text-adil-red"
              >
                {error}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-adil-blue px-8 py-4 font-display text-lg font-extrabold text-white shadow-poster transition-transform hover:scale-105 hover:-rotate-1"
              >
                Cek sekarang <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputType("teks");
                  setTitle(EXAMPLE_IDEA.title);
                  setDesc(EXAMPLE_IDEA.description);
                  setError("");
                }}
                className="rounded-full border-2 border-input px-5 py-3 text-sm font-bold transition-colors hover:border-adil-blue"
              >
                Isi contoh dulu
              </button>
            </div>
          </form>
        </PosterCard>

        {/* INLINE RESULTS (jika showInlineResults aktif) */}
        {showInlineResults && inlineResult && (
          <div className="mt-12 space-y-6 animate-in fade-in">
            <PosterCard rotate={0.5} className="space-y-4">
              <h2 className="font-display text-2xl font-extrabold">Hasil Analisis Indikatif</h2>
              <div className="rounded-2xl bg-muted p-4 text-sm">
                <span className="font-bold uppercase tracking-wider text-xs">Kualifikasi Band: </span>
                <strong className="text-adil-blue uppercase">{inlineResult.band}</strong>
              </div>
              <ScoreBar
                label="Kemiripan Teks"
                hint="TF-IDF Cosine Similarity"
                value={inlineResult.topText}
                color="blue"
              />
              <ScoreBar
                label="Kemiripan Konsep"
                hint="Jaccard Keyphrase Intersection"
                value={inlineResult.topConcept}
                color="green"
              />
              <div className="mt-4">
                <h3 className="text-sm font-bold mb-2">Karya Serupa Teratas:</h3>
                {inlineResult.matches.slice(0, 3).map((m) => (
                  <div key={m.work.id} className="border-b py-2 text-sm flex justify-between">
                    <span>{m.work.title}</span>
                    <span className="font-bold text-adil-blue">{Math.round(m.combined * 100)}%</span>
                  </div>
                ))}
              </div>
            </PosterCard>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <StickerLabel color="green" rotate={-2}>
            Gratis
          </StickerLabel>
          <StickerLabel color="blue" rotate={2}>
            Tanpa login
          </StickerLabel>
        </div>
      </div>
    </main>
  );
}
