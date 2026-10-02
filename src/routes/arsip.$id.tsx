import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FrameLabel, StickerLabel } from "@/components/decor";
import { PosterCard } from "@/components/chrome";
import { EmptyState } from "@/components/empty";
import { WORKS } from "@/lib/works";

export const Route = createFileRoute("/arsip/$id")({
  loader: ({ params }) => {
    const work = WORKS.find((w) => w.id === params.id);
    if (!work) throw notFound();
    return { work };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Karya tidak ditemukan — ADIL" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.work.title} — Arsip ADIL`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.work.summary.slice(0, 155) },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.work.summary.slice(0, 155) },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: WorkNotFound,
  component: Detail,
});

function WorkNotFound() {
  return <main className="bg-canvas-grid px-4"><EmptyState title="Karya ini nggak ada di arsip." mood="kaget" /></main>;
}

function Detail() {
  const { work } = Route.useLoaderData();
  return (
    <main className="bg-canvas-grid py-16">
      <div className="mx-auto max-w-3xl px-4">
        <Link to="/arsip" className="text-sm font-bold text-adil-blue hover:underline">← Balik ke arsip</Link>
        <FrameLabel className="mt-4">Arsip / Detail</FrameLabel>
        <PosterCard rotate={-0.8}>
          <div className="flex flex-wrap gap-2">
            <StickerLabel color="green" rotate={-2}>Sumber publik</StickerLabel>
            <StickerLabel color="cyan" rotate={2}>Data contoh</StickerLabel>
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight md:text-4xl">{work.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{work.competition} · {work.institution} · {work.year}</p>
          <p className="mt-6 leading-relaxed">{work.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {work.keyphrases.map((k) => (
              <span key={k} className="rounded-full bg-muted px-3 py-1 text-xs font-bold">{k}</span>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Sumber: {work.sourceUrl}</p>
        </PosterCard>
      </div>
    </main>
  );
}
