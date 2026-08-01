import { MapPin, ArrowUpRight } from "lucide-react";
import Reveal from "./motion/reveal";
import { LOCATIONS } from "@/lib/contact";

/** Shared by the logistics landing page and the shop, so the addresses can never drift apart. */
export default function Locations() {
  return (
    <section id="locations" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
            Our Locations
          </p>
          <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl">
            Find us in Lagos and Istanbul
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            We source from Turkey and receive in Nigeria. You can collect your
            goods from our Lagos warehouse, or have them delivered to you.
          </p>
        </Reveal>

        <Reveal stagger className="mt-12 grid gap-5 md:grid-cols-2">
          {LOCATIONS.map((location) => (
            <div
              key={location.label}
              className="group flex flex-col rounded-3xl border border-neutral-200 bg-white p-8 transition-colors duration-300 hover:border-gold-300"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <MapPin size={20} strokeWidth={1.5} />
              </span>

              <h3 className="mt-5 text-lg font-medium text-neutral-900">
                {location.label}
              </h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gold-600">
                {location.kind}
              </p>

              {/* <address> is the correct element here, and browsers italicise it by default. */}
              <address className="mt-4 text-sm not-italic leading-relaxed text-neutral-500">
                {location.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>

              <a
                href={location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-neutral-900 underline underline-offset-4 transition-colors hover:text-gold-700"
              >
                View on Google Maps
                <ArrowUpRight size={14} />
              </a>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
