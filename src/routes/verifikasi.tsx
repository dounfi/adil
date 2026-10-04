import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FrameLabel, Mascot } from "@/components/decor";
import { PosterCard } from "@/components/chrome";
import { findRecord, type Record } from "@/lib/hash";

export const Route = createFileRoute("/verifikasi")({
  head: () => ({
    meta: [
      { title: "Verifikasi catatan ide - ADIL" },
      { name: "description", content: "Masukkan kode verifikasi untuk mengecek kapan sebuah ide dicatat di ADIL." },
      { property: "og:title", content: "Verifikasi catatan ide - ADIL" },
      { property: "og:description", content: "Cek kode verifikasi catatan ide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Verifikasi,
});

function Verifikasi() {
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "found" | "none">("idle");
  const [rec, setRec] = useState<Record | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = findRecord(code);
    setRec(r ?? null);
    setState(r ? "found" : "none");
  }

  return (
    <main className="bg-canvas-grid py-16">
      <div className="mx-auto max-w-xl px-4">
        <FrameLabel>Verifikasi / Kode</FrameLabel>
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">Cek kode catatan</h1>
        <p className="mt-3 text-muted-foreground">Masukin 8 karakter kode dari sertifikat.</p>
        <form onSubmit={submit} className="mt-8 flex gap-3">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Contoh: 3FA9C21B" aria-label="Kode verifikasi" className="flex-1 rounded-full border-2 border-input bg-card px-5 py-3 font-mono uppercase outline-none focus:border-adil-blue" />
          <button className="rounded-full bg-adil-blue px-6 py-3 font-bold text-white transition-transform hover:scale-105">Cek</button>
        </form>

        {state === "found" && rec && (
          <PosterCard rotate={-1} className="mt-10 bg-adil-green">
            <p className="font-display text-2xl font-extrabold text-white">Ketemu! Catatannya valid.</p>
            <p className="mt-2 text-sm text-white">“{rec.title}” · {rec.name}</p>
            <p className="text-sm text-white">{new Date(rec.timestamp).toLocaleString("id-ID")}</p>
            <p className="mt-3 break-all font-mono text-xs text-white/80">{rec.hash}</p>
          </PosterCard>
        )}
        {state === "none" && (
          <div className="mt-10 flex flex-col items-center text-center">
            <Mascot color="red" mood="kaget" />
            <p className="mt-5 font-display text-xl font-extrabold">Kode ini belum ketemu.</p>
            <p className="mt-1 text-sm text-muted-foreground">Ini versi demo: catatan cuma tersimpan selama tab ini terbuka.</p>
          </div>
        )}
      </div>
    </main>
  );
}
