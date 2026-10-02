import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type AdilColor = "blue" | "red" | "yellow" | "green" | "cyan";

const solid: Record<AdilColor, string> = {
  blue: "bg-adil-blue text-white",
  red: "bg-adil-red text-white",
  yellow: "bg-adil-yellow text-adil-ink",
  green: "bg-adil-green text-white",
  cyan: "bg-adil-cyan text-adil-ink",
};

/* ---------- StickerLabel: pill solid miring ---------- */
export function StickerLabel({
  children,
  color = "blue",
  rotate = -3,
  className,
}: {
  children: ReactNode;
  color?: AdilColor;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-wide shadow-poster animate-pop-in",
        solid[color],
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)`, ["--pop-rotate" as string]: `${rotate}deg` }}
    >
      {children}
    </span>
  );
}

/* ---------- CursorTag: panah kursor + label nama ala Figma ---------- */
export function CursorTag({
  name,
  color = "blue",
  className,
}: {
  name: string;
  color?: AdilColor;
  className?: string;
}) {
  const arrow: Record<AdilColor, string> = {
    blue: "fill-adil-blue",
    red: "fill-adil-red",
    yellow: "fill-adil-yellow",
    green: "fill-adil-green",
    cyan: "fill-adil-cyan",
  };
  return (
    <span className={cn("inline-flex items-end animate-drift select-none", className)} aria-hidden>
      <svg width="18" height="22" viewBox="0 0 18 22" className={arrow[color]}>
        <path d="M2 1 L16 11 L9.5 12.5 L12.5 20 L9.5 21.5 L6.5 13.5 L2 17 Z" stroke="white" strokeWidth="1.2" />
      </svg>
      <span className={cn("-ml-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold", solid[color])}>{name}</span>
    </span>
  );
}

/* ---------- SelectionBox: outline biru + 4 handle ---------- */
export function SelectionBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("relative inline-block outline-2 outline-adil-blue outline-offset-4", className)}>
      {children}
      {["-top-1.5 -left-1.5", "-top-1.5 -right-1.5", "-bottom-1.5 -left-1.5", "-bottom-1.5 -right-1.5"].map((pos) => (
        <span key={pos} className={cn("absolute h-2.5 w-2.5 border-2 border-adil-blue bg-white", pos)} aria-hidden />
      ))}
    </span>
  );
}

/* ---------- CommentBubble: gelembung komentar ala Figma ---------- */
export function CommentBubble({
  emoji,
  text,
  className,
}: {
  emoji: string;
  text: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-2xl rounded-bl-sm border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-poster",
        className,
      )}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-adil-yellow text-sm">{emoji}</span>
      {text}
    </span>
  );
}

/* ---------- FrameLabel: label nama frame Figma ---------- */
export function FrameLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", className)}>
      {children}
    </p>
  );
}

/* ---------- Mascot: blob kecil dengan 2 mata ---------- */
export function Mascot({
  color = "blue",
  mood = "senang",
  className,
}: {
  color?: AdilColor;
  mood?: "senang" | "bingung" | "kaget";
  className?: string;
}) {
  return (
    <span
      className={cn("relative inline-block h-14 w-14 rounded-[40%_60%_55%_45%/50%_45%_55%_50%] animate-float-slow", solid[color], className)}
      role="img"
      aria-label={`Maskot ADIL ${mood}`}
    >
      <span className="absolute left-1/2 top-4 flex -translate-x-1/2 gap-2.5">
        <span className={cn("rounded-full bg-adil-ink", mood === "kaget" ? "h-3 w-3" : "h-2.5 w-2.5")} />
        <span className={cn("rounded-full bg-adil-ink", mood === "kaget" ? "h-3 w-3" : "h-2.5 w-2.5")} />
      </span>
      {mood === "senang" && <span className="absolute left-1/2 top-8 h-2 w-4 -translate-x-1/2 rounded-b-full border-b-2 border-adil-ink" />}
      {mood === "bingung" && <span className="absolute left-1/2 top-8 h-0.5 w-4 -translate-x-1/2 -rotate-6 rounded-full bg-adil-ink" />}
      {mood === "kaget" && <span className="absolute left-1/2 top-8 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-adil-ink" />}
    </span>
  );
}

/* ---------- Dekorasi bentuk ---------- */
export function Sparkle({ color = "yellow", className }: { color?: AdilColor; className?: string }) {
  const fill: Record<AdilColor, string> = {
    blue: "fill-adil-blue", red: "fill-adil-red", yellow: "fill-adil-yellow", green: "fill-adil-green", cyan: "fill-adil-cyan",
  };
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" className={cn(fill[color], className)} aria-hidden>
      <path d="M14 0 C15 8 20 13 28 14 C20 15 15 20 14 28 C13 20 8 15 0 14 C8 13 13 8 14 0 Z" />
    </svg>
  );
}

export function GoogleDots({ className }: { className?: string }) {
  return (
    <span className={cn("flex flex-col gap-1.5", className)} aria-hidden>
      <span className="h-2.5 w-2.5 rounded-full bg-adil-blue" />
      <span className="h-2.5 w-2.5 rounded-full bg-adil-red" />
      <span className="h-2.5 w-2.5 rounded-full bg-adil-yellow" />
      <span className="h-2.5 w-2.5 rounded-full bg-adil-green" />
    </span>
  );
}
