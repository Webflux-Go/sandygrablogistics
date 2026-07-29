import Image from "next/image";
import { Quote } from "lucide-react";
import Reveal from "../motion/reveal";
import { WHATSAPP_QUOTE_URL } from "@/lib/contact";

export default function Founder() {
  return (
    <section id="founder" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal
          direction="left"
          className="group relative aspect-4/5 w-full overflow-hidden rounded-4xl bg-neutral-100"
        >
          {/* TODO: replace with a real photo of the founder. */}
          <Image
            src="/sandygrabsceo.jpeg"
            alt="Founder and CEO of Sandygrabs Logistics"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Reveal>

        <Reveal direction="right">
          <p className="text-sm font-medium uppercase tracking-wide text-gold-700">
            Meet the Founder
          </p>

          <Quote size={36} strokeWidth={1.5} className="mt-6 text-gold-400" />

          <blockquote className="mt-4 text-2xl font-medium leading-snug tracking-tight text-neutral-900 sm:text-3xl">
            Scammed as a new businesswoman in Turkey, a shipping company took my
            money and almost broke me. This pain birthed SandyGrabs Logistics.
            Learn to ship yourself, because your business vision is worth
            fighting for.
          </blockquote>

          <div className="mt-8">
            {/* TODO: replace with the founder's real name. */}
            <p className="text-sm font-semibold text-neutral-900">OHIAERI SANDRA</p>
            <p className="text-sm text-neutral-500">Founder &amp; CEO</p>
          </div>

          <a
            href={WHATSAPP_QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-all hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/25"
          >
            Talk to Us
          </a>
        </Reveal>
      </div>
    </section>
  );
}
