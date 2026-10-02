import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Printer } from "lucide-react";
import { FrameLabel, Mascot, StickerLabel, Sparkle, CursorTag } from "@/components/decor";
import { PosterCard } from "@/components/chrome";
import { sha256, saveRecord, type Record } from "@/lib/hash";

export const Route = createFileRoute("/catat")({
  head: () => ({
    meta: [
      { title: "Catat idemu — ADIL" },
      { name: "description", content: "Simpan sidik jari digital (SHA-256) dan waktu idemu sebagai bukti catatan. Isi ide nggak harus disimpan." },
      { property: "og:title", content: "Catat idemu, biar ada buktinya — ADIL" },
      { property: "og:description", content: "Sidik jari digital dan waktu catatan untuk idemu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Catat,
});

function Catat() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [rec, setRec] = useState<Record | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length + desc.trim().length < 30) {
      setError("Agak kurang panjang nih. Tambahin dikit biar sidik jarinya unik.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const timestamp = new Date().toISOString();
      const hash = await sha256(`${title}\n${desc}\n${timestamp}`);
      const r = { code: hash.slice(0, 8).toUpperCase(), hash, title, name: name || "Anonim", timestamp };
      saveRecord(r);
      setRec(r);
    } catch {
      setError("Waduh, ada yang error. Coba lagi ya.");
    } finally {
      setBusy(false);
    }
  }

  if (rec) {
    return (
      <main className="bg-canvas-grid py-16">
        <div className="mx-auto max-w-2xl px-4">
          <div className="relative rounded-3xl bg-adil-blue p-8 text-white shadow-poster-lg md:p-10" style={{ transform: "rotate(-1deg)" }}>
            <Sparkle color="yellow" className="absolute right-6 top-6" />
            <Mascot color="yellow" mood="senang" className="absolute -bottom-6 -left-4" />
            <StickerLabel color="yellow" rotate={-3}>Sertifikat catatan</StickerLabel>
            <h1 className="mt-5 font-display text-4xl font-extrabold">Beres! Idemu tercatat.</h1>
            <dl className="mt-6 space-y-3 text-sm">
              <div><dt className="opacity-70">Judul</dt><dd className="font-bold">{rec.title}</dd></div>
              <div><dt className="opacity-70">Atas nama</dt><dd className="font-bold">{rec.name}</dd></div>
              <div><dt className="opacity-70">Waktu</dt><dd className="font-bold">{new Date(rec.timestamp).toLocaleString("id-ID")}</dd></div>
              <div><dt className="opacity-70">Kode verifikasi</dt><dd className="font-display text-3xl font-extrabold tracking-widest">{rec.code}</dd></div>
              <div><dt className="opacity-70">Sidik jari SHA-256</dt><dd className="break-all font-mono text-xs">{rec.hash}</dd></div>
            </dl>
            <p className="mt-6 rounded-2xl bg-white/15 p-3 text-xs">Ini bukti catatan waktu, bukan hak cipta resmi.</p>
            <CursorTag name="Peserta Jujur" color="green" className="absolute -right-4 bottom-10" />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-adil-ink px-6 py-3 font-bold text-white transition-transform hover:scale-105">
              <Printer className="h-4 w-4" /> Unduh / cetak
            </button>
            <Link to="/verifikasi" className="rounded-full border-2 border-input px-6 py-3 font-bold hover:border-adil-blue">Coba verifikasi</Link>
            <button onClick={() => setRec(null)} className="rounded-full border-2 border-input px-6 py-3 font-bold hover:border-adil-blue">Catat ide lain</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-canvas-grid py-16">
      <div className="mx-auto max-w-2xl px-4">
        <FrameLabel>Catat Ide / Form</FrameLabel>
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">Catat idemu, biar ada buktinya</h1>
        <p className="mt-3 text-muted-foreground">Kami simpan sidik jari digital dan waktunya. Isi ideku nggak harus disimpan.</p>

        <PosterCard rotate={0.5} className="mt-8">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="nama" className="text-sm font-bold">Nama atau tim (opsional)</label>
              <input id="nama" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Tim Kopi Senja" className="mt-1.5 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-sm outline-none focus:border-adil-blue" />
            </div>
            <div>
              <label htmlFor="judul-catat" className="text-sm font-bold">Judul ide</label>
              <input id="judul-catat" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Aplikasi tutor sebaya buat daerah minim guru" className="mt-1.5 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-sm outline-none focus:border-adil-blue" />
            </div>
            <div>
              <label htmlFor="desk-catat" className="text-sm font-bold">Deskripsi</label>
              <textarea id="desk-catat" value={desc} onChange={(e) => setDesc(e.target.value)} rows={5} placeholder="Ide kamu buat apa, buat siapa, dan gimana caranya?" className="mt-1.5 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-sm outline-none focus:border-adil-blue" />
            </div>
            {error && <p role="alert" className="rounded-2xl bg-adil-red/10 px-4 py-3 text-sm font-semibold text-adil-red">{error}</p>}
            <button type="submit" disabled={busy} className="rounded-full bg-adil-green px-8 py-4 font-display text-lg font-extrabold text-white shadow-poster transition-transform hover:scale-105 hover:-rotate-1 disabled:opacity-60">
              {busy ? "Lagi bikin sidik jari..." : "Catat sekarang"}
            </button>
          </form>
        </PosterCard>
      </div>
    </main>
  );
}
