import { Link } from "@tanstack/react-router";
import type { Work } from "@/lib/works";
import { PosterCard } from "./chrome";
import { cn } from "@/lib/utils";

const CAT_COLORS: Record<string, string> = {
  Pendidikan: "bg-adil-blue text-white",
  Lingkungan: "bg-adil-green text-white",
  "Kecerdasan Buatan": "bg-adil-red text-white",
  Pertanian: "bg-adil-yellow text-adil-ink",
  Kesehatan: "bg-adil-cyan text-adil-ink",
  Bisnis: "bg-adil-yellow text-adil-ink",
};

export function WorkCard({ work, rotate = -1, score }: { work: Work; rotate?: number; score?: number }) {
  return (
    <PosterCard rotate={rotate} className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2">
        <span className={cn("rounded-full px-3 py-1 text-[11px] font-bold", CAT_COLORS[work.category] ?? "bg-muted")}>
          {work.category}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">{work.year}</span>
      </div>
      <h3 className="mt-3 font-display text-lg font-extrabold leading-snug">{work.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{work.summary}</p>
      {typeof score === "number" && (
        <p className="mt-3 text-sm font-bold text-adil-blue">Skor kemiripan: {Math.round(score * 100)}%</p>
      )}
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Sumber publik · Data contoh
        </span>
        <Link to="/arsip/$id" params={{ id: work.id }} className="text-sm font-bold text-adil-blue hover:underline">
          Detail →
        </Link>
      </div>
    </PosterCard>
  );
}
