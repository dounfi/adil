import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/catat")({
  beforeLoad: () => {
    throw redirect({ to: "/cek" });
  },
  head: () => ({
    meta: [
      { title: "Catat idemu - ADIL" },
      { name: "description", content: "Simpan sidik jari digital (SHA-256) dan waktu idemu sebagai bukti catatan." },
      { property: "og:title", content: "Catat idemu, biar ada buktinya - ADIL" },
    ],
  }),
  component: () => null,
});
