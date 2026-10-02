import { Link } from "@tanstack/react-router";
import { Mascot } from "./decor";

export function EmptyState({ title, sub, mood = "bingung" }: { title: string; sub?: string; mood?: "bingung" | "kaget" | "senang" }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <Mascot color="red" mood={mood} />
      <p className="mt-6 font-display text-2xl font-extrabold">{title}</p>
      {sub && <p className="mt-2 max-w-md text-sm text-muted-foreground">{sub}</p>}
      <Link to="/cek" className="mt-6 rounded-full bg-adil-blue px-6 py-3 font-display font-extrabold text-white shadow-poster transition-transform hover:scale-105">
        Cek ide sekarang
      </Link>
    </div>
  );
}
