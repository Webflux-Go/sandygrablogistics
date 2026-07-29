import Image from "next/image";
import Navbar from "./navbar";
import Reveal from "../motion/reveal";
import HeroBackdrop from "../motion/hero-backdrop";
import { WHATSAPP_QUOTE_URL } from "@/lib/contact";

export default function Hero() {
  return (
    <section id="home">
      {/* No overflow-hidden on the outer box: the navbar's mobile menu panel drops below the
          header and would otherwise be clipped. */}
      <div className="relative bg-neutral-900">
        {/* The parallax layer does need clipping — it scales and drifts past its bounds. */}
        <div className="absolute inset-0 overflow-hidden">
          <HeroBackdrop className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1620455800201-7f00aeef12ed?w=1920&q=80&auto=format&fit=crop"
              alt="Sandygrabs drivers loading a delivery van with parcels"
              width={1920}
              height={1200}
              priority
              className="h-full w-full object-cover"
            />
          </HeroBackdrop>
        </div>
        {/* Warm-tinted scrim so the photo sits in the same family as the gold, rather than
            reading as a flat black overlay. */}
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950/90 via-neutral-950/40 to-neutral-950/60" />

        <div className="relative">
          <Navbar />

          <div className="flex flex-col gap-8 px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-40 md:flex-row md:items-end md:justify-between md:pt-56">
            <Reveal immediate delay={0.15}>
              <h1 className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
                Turkey&apos;s Trusted Sourcing & Shipping Partner
              </h1>
            </Reveal>

            <Reveal
              immediate
              stagger
              delay={0.35}
              className="flex max-w-sm flex-col gap-5"
            >
              <p className="text-sm leading-relaxed text-white/80">
                Sandygrabs offers a full range of freight services to
                optimize your supply chain, ensuring reliable, cost-effective,
                and on-time deliveries tailored to the needs of your
                business.
              </p>
              <a
                href={WHATSAPP_QUOTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center justify-center rounded-full bg-gold-400 px-6 py-3 text-sm font-medium text-neutral-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-500/30"
              >
                Get a Quote
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
