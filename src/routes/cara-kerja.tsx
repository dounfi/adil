import { createFileRoute, Link } from "@tanstack/react-router";
import { FrameLabel, StickerLabel, Mascot } from "@/components/decor";
import { PosterCard } from "@/components/chrome";

export const Route = createFileRoute("/cara-kerja")({
  head: () => ({
    meta: [
      { title: "Cara kerja ADIL - versi jujurnya" },
      { name: "description", content: "Dari mana arsipnya, apa yang dihitung, apa yang belum bisa, kenapa skor bukan vonis, dan bagaimana privasimu dijaga." },
      { property: "og:title", content: "Cara kerja ADIL - versi jujurnya" },
      { property: "og:description", content: "Penjelasan jujur cara ADIL menghitung kemiripan ide." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaraKerja,
});

const SECTIONS = [
  { t: "Arsipnya dari mana?", d: "Dari karya pemenang lomba yang udah dipublikasikan. Saat ini isinya masih data contoh, jadi 'nggak ketemu' belum tentu 'pasti baru'.", c: "blue" as const },
  { t: "Apa yang dihitung?", d: "Dua hal. Kemiripan teks (TF-IDF + cosine similarity: kata dan frasa yang sama). Kemiripan konsep (irisan kata kunci inti). Skor gabungan = teks × 0,5 + konsep × 0,5.", c: "green" as const },
  { t: "Apa yang belum bisa?", d: "Kemiripan visual (desain, poster, UI) belum dihitung. Itu masuk roadmap. Parafrase yang sangat jauh juga bisa lolos.", c: "red" as const },
  { t: "Kenapa skor bukan vonis?", d: "Dua orang bisa punya ide sama tanpa saling tahu. Angka cuma petunjuk. Keputusan tetap di tangan manusia: kamu, juri, panitia.", c: "yellow" as const },
  { t: "Privasimu gimana?", d: "Mode cek privat nyala dari awal. Idemu cuma diproses di browser kamu dan hilang saat halaman ditutup. Nggak ada login, nggak ada penyimpanan.", c: "cyan" as const },
];

const BADGE = {
  blue: "bg-adil-blue", green: "bg-adil-green", red: "bg-adil-red", yellow: "bg-adil-yellow", cyan: "bg-adil-cyan",
};

function CaraKerja() {
  return (
    <main className="bg-canvas-grid py-16">
      <div className="mx-auto max-w-3xl px-4">
        <FrameLabel>Cara Kerja / Versi Jujur</FrameLabel>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl font-extrabold md:text-6xl">Cara kerjanya,</h1>
          <StickerLabel color="red" rotate={-4} className="text-lg">tanpa basa-basi</StickerLabel>
        </div>
        <div className="mt-12 space-y-8">
          {SECTIONS.map((s, i) => (
            <PosterCard key={s.t} rotate={i % 2 === 0 ? -1 : 1}>
              <div className="flex items-start gap-4">
                <span className={`mt-1 h-10 w-10 shrink-0 rounded-2xl ${BADGE[s.c]}`} aria-hidden />
                <div>
                  <h2 className="font-display text-2xl font-extrabold">{s.t}</h2>
                  <p className="mt-2 text-muted-foreground">{s.d}</p>
                </div>
              </div>
            </PosterCard>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center text-center">
          <Mascot color="green" mood="senang" />
          <Link to="/cek" className="mt-6 rounded-full bg-adil-blue px-8 py-4 font-display text-lg font-extrabold text-white shadow-poster transition-transform hover:scale-105">
            Oke, cek ide aku
          </Link>
        </div>
      </div>
    </main>
  );
}
