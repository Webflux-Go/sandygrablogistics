import Image from "next/image";
import Reveal from "../motion/reveal";
import HeroBackdrop from "../motion/hero-backdrop";

export default function Hero() {
  return (
    <section id="home" className="relative h-104 overflow-hidden bg-neutral-900 sm:h-120">
      <HeroBackdrop className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?w=1920&q=80&auto=format&fit=crop"
          alt="Factory-sourced Turkish home goods styled in a living room"
          fill
          priority
          className="object-cover"
        />
      </HeroBackdrop>
      <div className="absolute inset-0 bg-linear-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />

      <Reveal
        immediate
        stagger
        delay={0.2}
        className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-10"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 sm:text-sm">
          Sandygrabs SourceHub
        </p>
        <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
          Source Authentic Turkish Products at Factory Prices
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
          We connect you directly to trusted Turkish manufacturers, cutting
          out the middleman so you get genuine quality at factory-direct
          pricing.
        </p>
        <a
          href="#catalog"
          className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-gold-400 px-6 py-3 text-sm font-medium text-neutral-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-500/30"
        >
          Shop Now
        </a>
      </Reveal>
    </section>
  );
}
