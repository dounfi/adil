import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FrameLabel, StickerLabel } from "@/components/decor";
import { WorkCard } from "@/components/work-card";
import { Mascot } from "@/components/decor";
import { WORKS } from "@/lib/works";

export const Route = createFileRoute("/arsip/")({
  head: () => ({
    meta: [
      { title: "Arsip karya — ADIL" },
      { name: "description", content: "Jelajahi arsip karya lomba publik yang dipakai ADIL sebagai pembanding." },
      { property: "og:title", content: "Arsip karya — ADIL" },
      { property: "og:description", content: "Arsip karya lomba publik untuk pembanding ide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Arsip,
});

function Arsip() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");
  const cats = ["Semua", ...new Set(WORKS.map((w) => w.category))];
  const list = useMemo(
    () =>
      WORKS.filter(
        (w) =>
          (cat === "Semua" || w.category === cat) &&
          `${w.title} ${w.summary} ${w.keyphrases.join(" ")}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [q, cat],
  );

  return (
    <main className="bg-canvas-grid py-16">
      <div className="mx-auto max-w-6xl px-4">
        <FrameLabel>Arsip / Grid</FrameLabel>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">Arsip karya</h1>
          <StickerLabel color="green" rotate={3}>Sumber publik</StickerLabel>
        </div>
        <p className="mt-2 text-muted-foreground">{WORKS.length} karya publik pemenang lomba resmi.</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari judul atau kata kunci..."
            aria-label="Cari arsip"
            className="flex-1 rounded-full border-2 border-input bg-card px-5 py-3 text-sm outline-none focus:border-adil-blue"
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            aria-label="Filter kategori"
            className="rounded-full border-2 border-input bg-card px-5 py-3 text-sm font-semibold outline-none focus:border-adil-blue"
          >
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Mascot color="blue" mood="bingung" />
            <p className="mt-6 font-display text-2xl font-extrabold">Belum ada yang cocok. Coba kata kunci lain.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((w, i) => <WorkCard key={w.id} work={w} rotate={[-1.5, 1, -0.5][i % 3] ?? 0} />)}
          </div>
        )}
      </div>
    </main>
  );
}
