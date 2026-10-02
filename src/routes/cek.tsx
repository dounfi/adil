import { createFileRoute } from "@tanstack/react-router";
import { Checker } from "@/components/Checker";

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

function CekPage() {
  return <Checker />;
}
