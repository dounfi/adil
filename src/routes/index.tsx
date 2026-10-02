import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowDown, HelpCircle, AlertCircle, MoreHorizontal, Search, FileText, CheckCircle2 } from "lucide-react";
import { useSpring, useTrail, animated, useInView } from "@react-spring/web";
import { StickerLabel, CursorTag, SelectionBox, CommentBubble, FrameLabel, Mascot, Sparkle, GoogleDots } from "@/components/decor";
import { PosterCard } from "@/components/chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ADIL — Ide kamu beneran baru?" },
      { name: "description", content: "Cek dulu sebelum berminggu-minggu ngerjain. Tempel idemu, kami carikan yang mirip. Gratis, tanpa login." },
      { property: "og:title", content: "ADIL — Ide kamu beneran baru?" },
      { property: "og:description", content: "Tempel idemu, kami carikan yang mirip. Gratis, tanpa login." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const heroSpring = useSpring({
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 20 },
  });

  const cards = [
    {
      id: "card1",
      rotate: -2,
      className: "relative",
      icon: <HelpCircle className="h-12 w-12 text-adil-red" strokeWidth={3} />,
      title: "Karya kamu dijiplak, eh mereka yang menang?",
      desc: "Dugaan kasus ini sempat ramai di media sosial. Yang punya karya asli sering tahu belakangan.",
      bubble: true
    },
    {
      id: "card2",
      rotate: 1.5,
      className: "relative bg-adil-yellow",
      icon: <AlertCircle className="h-12 w-12 text-adil-ink" strokeWidth={3} />,
      title: "Idemu murni, ternyata udah ada.",
      desc: "Kamu nggak niat niru. Tapi nggak ada cara buat ngecek sebelum mulai ngerjain.",
      mascot: true
    },
    {
      id: "card3",
      rotate: -1,
      className: "relative",
      icon: <MoreHorizontal className="h-12 w-12 text-adil-green" strokeWidth={3} />,
      title: "Juri cuma punya ingatan.",
      desc: "Ratusan karya masuk. Siapa yang inget semuanya?"
    }
  ];

  const [cardsRef, cardsInView] = useInView({ once: true, rootMargin: '-10% 0px' });
  const trail = useTrail(cards.length, {
    opacity: cardsInView ? 1 : 0,
    transform: cardsInView ? "scale(1) translateY(0)" : "scale(0.9) translateY(40px)",
    config: { tension: 200, friction: 15 },
  });

  const steps = [
    { n: "1", t: "Tempel idemu", d: "Judul dan deskripsi singkat aja.", c: "bg-adil-yellow text-adil-ink", icon: <FileText className="mb-2 h-8 w-8 text-adil-ink" /> },
    { n: "2", t: "Kami cari yang mirip", d: "Kami bandingin teks dan konsepnya sama arsip karya.", c: "bg-adil-red text-white", icon: <Search className="mb-2 h-8 w-8 text-white" /> },
    { n: "3", t: "Kamu yang mutusin", d: "Kami kasih bukti, bukan vonis.", c: "bg-adil-green text-white", icon: <CheckCircle2 className="mb-2 h-8 w-8 text-white" /> },
  ];

  const [stepsRef, stepsInView] = useInView({ once: true, rootMargin: '-10% 0px' });
  const stepTrail = useTrail(steps.length, {
    opacity: stepsInView ? 1 : 0,
    transform: stepsInView ? "translateY(0)" : "translateY(30px)",
    config: { tension: 200, friction: 20 },
    delay: 200
  });

  const [compareRef, compareInView] = useInView({ once: true, rootMargin: '-10% 0px' });
  const compareSprings = useSpring({
    opacity: compareInView ? 1 : 0,
    transform: compareInView ? "translateY(0)" : "translateY(40px)",
    config: { tension: 200, friction: 20 },
    delay: 100
  });

  const faqs = [
    { q: "Ideku disimpan nggak?", a: "Nggak, kalau mode cek privat nyala. Dan dia nyala dari awal.", c: "blue" as const },
    { q: "Mirip berarti plagiat?", a: "Nggak. Dua orang bisa punya ide yang sama tanpa saling tahu. Yang penting kamu tahu dan bisa jelasin bedanya.", c: "green" as const },
    { q: "Kok arsipnya masih sedikit?", a: "Masih awal. Kami mulai dari karya pemenang yang udah publik. Makanya 'nggak ketemu' belum tentu 'pasti baru'.", c: "red" as const },
    { q: "Skornya bisa dipercaya?", a: "Dia petunjuk, bukan hakim. Setiap angka ada alasan yang bisa kamu klik.", c: "yellow" as const },
  ];

  const [faqRef, faqInView] = useInView({ once: true, rootMargin: '-10% 0px' });
  const faqTrail = useTrail(faqs.length, {
    opacity: faqInView ? 1 : 0,
    transform: faqInView ? "translateX(0)" : "translateX(-30px)",
    config: { tension: 200, friction: 15 },
  });

  return (
    <main className="bg-canvas-grid">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <Sparkle color="yellow" className="absolute left-[8%] top-16 hidden md:block" />
        <Sparkle color="green" className="absolute right-[12%] top-40 hidden md:block" />
        <span className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-adil-yellow/60" aria-hidden />
        <span className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-adil-cyan/40" aria-hidden />

        <animated.div style={heroSpring} className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 text-center md:pt-24">
          <FrameLabel className="text-center">Hero / Desktop</FrameLabel>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <StickerLabel color="green" rotate={-3}>Gratis</StickerLabel>
            <StickerLabel color="red" rotate={2}>Tanpa ribet</StickerLabel>
            <StickerLabel color="blue" rotate={-2}>Ide kamu nggak disimpan</StickerLabel>
          </div>

          <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-8xl">
            <SelectionBox className="outline-adil-red">Ide kamu</SelectionBox>{" "}
            <span className="relative inline-block -rotate-2 rounded-2xl bg-adil-blue px-4 py-1 text-white shadow-poster">
              beneran
            </span>{" "}
            baru?
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Cek dulu sebelum berminggu-minggu ngerjain. Tempel idemu, kami carikan yang mirip. Gratis, tanpa login.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/cek"
              className="inline-flex items-center gap-2 rounded-full bg-adil-blue px-8 py-4 font-display text-lg font-extrabold text-white shadow-poster-lg transition-transform hover:scale-105 hover:-rotate-1"
            >
              Cek ide aku <ArrowRight className="h-5 w-5" />
            </Link>
            <span className="relative">
              <a
                href="#cara-kerja"
                className="inline-flex items-center gap-2 rounded-full border-2 border-adil-ink bg-card px-8 py-4 font-display text-lg font-extrabold transition-transform hover:scale-105 hover:rotate-1"
              >
                Gimana caranya? <ArrowDown className="h-5 w-5" />
              </a>
              <CursorTag name="Kamu" color="yellow" className="absolute -bottom-4 -right-4 z-10" />
            </span>
          </div>

          <div className="pointer-events-none absolute left-[6%] top-1/3 hidden lg:block">
            <CursorTag name="Peserta Jujur" color="blue" />
          </div>
          <div className="pointer-events-none absolute right-[8%] top-1/2 hidden lg:block">
            <CursorTag name="Juri" color="green" />
          </div>
          <div className="pointer-events-none absolute bottom-10 left-[15%] hidden lg:block">
            <CursorTag name="Panitia" color="red" />
          </div>
          <Mascot color="cyan" mood="senang" className="absolute bottom-8 right-[10%] hidden md:inline-block" />
        </animated.div>
      </section>

      {/* ============ MASALAH ============ */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-4">
          <FrameLabel>Masalah / 3 Kartu</FrameLabel>
          <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-tight md:text-5xl">
            Udah capek-capek bikin,{" "}
            <SelectionBox>ternyata</SelectionBox>{" "}
            ada yang sama?
          </h2>

          <div ref={cardsRef} className="mt-12 grid gap-8 md:grid-cols-3">
            {trail.map((style, index) => {
              const card = cards[index]!;
              return (
                <animated.div style={style} key={card.id}>
                  <PosterCard rotate={card.rotate} className={card.className}>
                    {card.bubble && <CommentBubble emoji="😮" text="Sempat ramai lho" className="absolute -right-3 -top-4 rotate-3" />}
                    {card.icon}
                    <h3 className={`mt-3 font-display text-xl font-extrabold leading-snug ${card.className.includes("bg-adil-yellow") ? "text-adil-ink" : ""}`}>
                      {card.title}
                    </h3>
                    <p className={`mt-2 text-sm ${card.className.includes("bg-adil-yellow") ? "text-adil-ink/70" : "text-muted-foreground"}`}>
                      {card.desc}
                    </p>
                    {card.mascot && <Mascot color="blue" mood="bingung" className="absolute -bottom-4 -right-3" />}
                  </PosterCard>
                </animated.div>
              );
            })}
          </div>

          <p className="mt-14 text-center font-display text-2xl font-extrabold md:text-3xl">
            Lomba nggak punya memori.{" "}
            <span className="inline-block rotate-1 rounded-xl bg-adil-green px-3 py-0.5 text-white">ADIL</span>{" "}
            yang jadi ingatannya.
          </p>
        </div>
      </section>

      {/* ============ CARA KERJA ============ */}
      <section id="cara-kerja" className="relative overflow-hidden bg-adil-blue py-20">
        <span className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-adil-cyan/50" aria-hidden />
        <span className="absolute -bottom-10 right-10 hidden font-display text-[12rem] font-extrabold text-white/10 md:block" aria-hidden>?</span>
        <div className="relative mx-auto max-w-6xl px-4">
          <FrameLabel className="text-white/60">Cara Kerja / 3 Langkah</FrameLabel>
          <h2 className="font-display text-4xl font-extrabold text-white md:text-5xl">Gampang kok, cuma 3 langkah.</h2>

          <div ref={stepsRef} className="mt-12 grid gap-8 md:grid-cols-3">
            {stepTrail.map((style, i) => {
              const s = steps[i]!;
              return (
                <animated.div style={style} key={s.n}>
                  <PosterCard rotate={i % 2 === 0 ? -1.5 : 1.5}>
                    {s.icon}
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl font-display text-2xl font-extrabold ${s.c}`}>
                      {s.n}
                    </span>
                    <h3 className="mt-4 font-display text-xl font-extrabold">{s.t}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                  </PosterCard>
                </animated.div>
              );
            })}
          </div>

          <div className="mt-10">
            <Link to="/cara-kerja" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-display font-extrabold text-adil-blue shadow-poster transition-transform hover:scale-105">
              Baca versi jujurnya <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ KENAPA BEDA ============ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <FrameLabel>Bandingkan / 2 Kolom</FrameLabel>
          <h2 className="font-display text-4xl font-extrabold md:text-5xl">
            Kenapa <SelectionBox className="outline-adil-green">ADIL</SelectionBox> beda?
          </h2>

          <animated.div ref={compareRef} style={compareSprings} className="mt-12 grid gap-8 md:grid-cols-2">
            <PosterCard rotate={-1}>
              <StickerLabel color="red" rotate={-2}>Cek teks biasa</StickerLabel>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                <li>✕ Cuma cocokin kata persis</li>
                <li>✕ Skor tanpa alasan</li>
                <li>✕ Terasa kayak vonis</li>
                <li>✕ Idemu entah disimpan ke mana</li>
              </ul>
            </PosterCard>
            <PosterCard rotate={1} className="bg-adil-green">
              <StickerLabel color="yellow" rotate={2}>ADIL</StickerLabel>
              <ul className="mt-5 space-y-3 text-sm font-semibold text-white">
                <li>✓ Cocokin teks + konsep inti</li>
                <li>✓ Setiap angka ada alasan yang bisa diklik</li>
                <li>✓ Bukti, bukan vonis — kamu yang mutusin</li>
                <li>✓ Mode privat nyala dari awal</li>
              </ul>
            </PosterCard>
          </animated.div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="relative py-20">
        <GoogleDots className="absolute left-6 top-16 hidden md:flex" />
        <div className="mx-auto max-w-3xl px-4">
          <FrameLabel>FAQ / Sering Ditanya</FrameLabel>
          <h2 className="font-display text-4xl font-extrabold md:text-5xl">Yang sering ditanyain.</h2>

          <div ref={faqRef} className="mt-10 space-y-5">
            {faqTrail.map((style, i) => {
              const f = faqs[i]!;
              return (
                <animated.div style={style} key={f.q}>
                  <PosterCard rotate={i % 2 === 0 ? -0.8 : 0.8}>
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 h-3 w-3 shrink-0 rounded-full bg-adil-${f.c}`} aria-hidden />
                      <div>
                        <h3 className="font-display text-lg font-extrabold">{f.q}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
                      </div>
                    </div>
                  </PosterCard>
                </animated.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CTA PENUTUP ============ */}
      <section className="relative overflow-hidden bg-adil-yellow py-24">
        <Sparkle color="red" className="absolute left-[10%] top-10" />
        <Sparkle color="blue" className="absolute bottom-10 right-[15%]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <Mascot color="red" mood="senang" className="mx-auto mb-6" />
          <h2 className="font-display text-4xl font-extrabold leading-tight text-adil-ink md:text-6xl">
            Mending tahu sekarang daripada pas udah jadi.
          </h2>
          <Link
            to="/cek"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-adil-ink px-10 py-5 font-display text-xl font-extrabold text-white shadow-poster-lg transition-transform hover:scale-105 hover:-rotate-1"
          >
            Cek ide aku <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>
    </main>
  );
}
