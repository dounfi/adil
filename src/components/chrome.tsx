import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CursorTag, GoogleDots } from "./decor";
import type { ReactNode } from "react";

export function Logo() {
  return (
    <Link to="/" className="font-display text-2xl font-extrabold tracking-tight" aria-label="ADIL - beranda">
      <span className="text-adil-blue">A</span>
      <span className="text-adil-red">D</span>
      <span className="text-adil-yellow">I</span>
      <span className="text-adil-green">L</span>
    </Link>
  );
}

export function Navbar() {
  const links = [
    { to: "/cek", label: "Cek Ide" },
    { to: "/arsip", label: "Arsip" },
    { to: "/catat", label: "Catat Ide" },
    { to: "/cara-kerja", label: "Cara Kerja" },
  ] as const;
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-adil-blue" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          to="/cek"
          className="inline-flex items-center gap-1.5 rounded-full bg-adil-blue px-5 py-2.5 text-sm font-bold text-white shadow-poster transition-transform hover:scale-105 hover:-rotate-1"
        >
          Cek ide aku <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-canvas-grid">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 font-display text-xl font-extrabold">ADIL: bantu lomba punya ingatan.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Hasil bersifat indikatif dan perlu ditinjau manusia. Arsip awal berisi 12 karya publik (data contoh).
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm font-semibold">
            <Link to="/cek" className="hover:text-adil-blue">Cek Ide</Link>
            <Link to="/arsip" className="hover:text-adil-blue">Arsip</Link>
            <Link to="/catat" className="hover:text-adil-blue">Catat Ide</Link>
            <Link to="/verifikasi" className="hover:text-adil-blue">Verifikasi</Link>
            <Link to="/cara-kerja" className="hover:text-adil-blue">Cara Kerja</Link>
          </div>
          <div className="flex flex-col items-end gap-4">
            <GoogleDots />
            <CursorTag name="Panitia" color="red" />
            <CursorTag name="Juri" color="green" />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- ScoreBar ---------- */
export function ScoreBar({
  label,
  hint,
  value,
  color,
}: {
  label: string;
  hint: string;
  value: number; // 0..1
  color: "blue" | "green";
}) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-bold">{label}</p>
        <p className="font-display text-lg font-extrabold">{pct}%</p>
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <div className="mt-2 h-4 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div
          className={cn("h-full rounded-full transition-all duration-700", color === "blue" ? "bg-adil-blue" : "bg-adil-green")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ---------- PosterCard ---------- */
export function PosterCard({
  children,
  rotate = -1.5,
  className,
}: {
  children: ReactNode;
  rotate?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-card p-6 shadow-poster transition-all duration-300 hover:rotate-0 hover:-translate-y-1 hover:shadow-poster-lg",
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}
