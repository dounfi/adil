import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { FrameLabel, Mascot, StickerLabel, Sparkle } from "@/components/decor";
import { PosterCard } from "@/components/chrome";
import { checkIdea, setLastResult } from "@/lib/scoring";
import { EXAMPLE_IDEA } from "@/lib/works";

export const Route = createFileRoute("/cek")({
  head: () => ({
    meta: [
      { title: "Ceritain ide kamu — ADIL" },
      { name: "description", content: "Tempel judul dan deskripsi singkat idemu. Mode privat nyala dari awal: ide kamu nggak disimpan." },
      { property: "og:title", content: "Ceritain ide kamu — ADIL" },
      { property: "og:description", content: "Tempel idemu, kami carikan yang mirip. Gratis, tanpa login." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CekPage,
});

const LOADING_STEPS = [
  "Baca ide kamu dulu...",
  "Nyari kata kunci pentingnya...",
  "Ngobrol sama 12 karya di arsip...",
];

function CekPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [privat, setPrivat] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const [inputType, setInputType] = useState<"teks" | "file">("teks");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setStep((s) => (s + 1) % LOADING_STEPS.length), 1000);
    return () => clearInterval(t);
  }, [loading]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (inputType === "teks" && title.trim().length + desc.trim().length < 40) {
      setError("Agak kurang panjang nih. Tambahin dikit biar hasilnya akurat.");
      return;
    }
    if (inputType === "file" && !title) {
      setError("Kamu belum upload file atau teksnya belum diekstrak.");
      return;
    }
    setError("");
    setLoading(true);
    // Simulasi proses bertahap; skor dihitung beneran di client.
    setTimeout(() => {
      const result = checkIdea(title, desc);
      setLastResult(result);
      navigate({ to: "/hasil" });
    }, 3200);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setError("");
      // Simulate OCR / Text Extraction
      setTimeout(() => {
        setTitle("Ide dari " + file.name);
        setDesc("Sistem berhasil mengekstrak teks dari file yang diupload. Ini adalah deskripsi otomatis berdasarkan isi dokumenmu.");
        setFileName("");
        setInputType("teks"); // Switch back to text so user can review
      }, 1500);
    }
  }

  if (loading) {
    return (
      <main className="bg-canvas-grid flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="text-center">
          <Mascot color="blue" mood="bingung" className="mx-auto" />
          <div className="mt-8 flex items-center justify-center gap-2">
            {LOADING_STEPS.map((_, i) => (
              <span key={i} className={`h-2.5 w-2.5 rounded-full transition-colors ${i <= step ? "bg-adil-blue" : "bg-muted"}`} />
            ))}
          </div>
          <p className="mt-4 font-display text-2xl font-extrabold" aria-live="polite">{LOADING_STEPS[step]}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-canvas-grid relative overflow-hidden py-16">
      <Sparkle color="yellow" className="absolute left-[10%] top-10 hidden md:block" />
      <span className="absolute -right-20 top-20 h-52 w-52 rounded-full bg-adil-green/20" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-4">
        <FrameLabel>Form Cek / Privat</FrameLabel>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">Ceritain ide kamu</h1>
          <Mascot color="cyan" mood="senang" />
        </div>
        <p className="mt-3 text-muted-foreground">Judul dan deskripsi singkat aja, atau upload poster/proposalmu.</p>

        <PosterCard rotate={-0.5} className="mt-8">
          <form onSubmit={submit} className="space-y-5">
            {/* TABS */}
            <div className="mb-6 flex rounded-xl bg-muted p-1">
              <button 
                type="button" 
                onClick={() => setInputType("teks")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${inputType === "teks" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Tulis Teks
              </button>
              <button 
                type="button" 
                onClick={() => setInputType("file")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${inputType === "file" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Upload File / Gambar
              </button>
            </div>

            {inputType === "teks" ? (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <label htmlFor="judul" className="text-sm font-bold">Judul ide</label>
                  <input
                    id="judul"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Aplikasi tutor sebaya buat daerah minim guru"
                    className="mt-1.5 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-sm outline-none focus:border-adil-blue focus:ring-2 focus:ring-adil-blue/30"
                  />
                </div>
                <div>
                  <label htmlFor="deskripsi" className="text-sm font-bold">Deskripsi singkat</label>
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
              <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-14 text-center transition-colors hover:border-adil-blue hover:bg-adil-blue/5 animate-in fade-in">
                <input 
                  type="file" 
                  className="absolute inset-0 cursor-pointer opacity-0" 
                  accept=".pdf,image/png,image/jpeg" 
                  onChange={handleFileUpload} 
                />
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-adil-blue" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </span>
                <p className="text-sm font-bold">Tarik poster atau proposal ke sini</p>
                <p className="mt-2 text-xs text-muted-foreground">Support PDF, PNG, JPG (Maks. 5MB).<br/>Teks akan diekstrak secara otomatis.</p>
                {fileName && (
                  <p className="mt-4 inline-block rounded-full bg-adil-yellow px-3 py-1 text-xs font-bold text-adil-ink animate-pulse">
                    Mengekstrak teks dari {fileName}...
                  </p>
                )}
              </div>
            )}

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-muted p-4">
              <button
                type="button"
                role="switch"
                aria-checked={privat}
                onClick={() => setPrivat(!privat)}
                className={`relative h-7 w-12 rounded-full transition-colors ${privat ? "bg-adil-green" : "bg-input"}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${privat ? "left-6" : "left-1"}`} />
              </button>
              <span>
                <span className="flex items-center gap-1.5 text-sm font-bold"><ShieldCheck className="h-4 w-4 text-adil-green" /> Cek privat</span>
                <span className="text-xs text-muted-foreground">Ide kamu nggak disimpan. Aman.</span>
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-2xl bg-adil-red/10 px-4 py-3 text-sm font-semibold text-adil-red">{error}</p>
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
                onClick={() => { setTitle(EXAMPLE_IDEA.title); setDesc(EXAMPLE_IDEA.description); setError(""); }}
                className="rounded-full border-2 border-input px-5 py-3 text-sm font-bold transition-colors hover:border-adil-blue"
              >
                Isi contoh dulu
              </button>
            </div>
          </form>
        </PosterCard>

        <div className="mt-6 flex justify-center gap-3">
          <StickerLabel color="green" rotate={-2}>Gratis</StickerLabel>
          <StickerLabel color="blue" rotate={2}>Tanpa login</StickerLabel>
        </div>
      </div>
    </main>
  );
}
