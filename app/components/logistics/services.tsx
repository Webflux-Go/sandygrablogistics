import Image from "next/image";
import Reveal from "../motion/reveal";
import { WHATSAPP_QUOTE_URL } from "@/lib/contact";
import { Plane, Ship, BadgeCheck, Globe, MapPin } from "lucide-react";

const SERVICES = [
  {
    icon: Plane,
    title: "Air Freight",
    // The transit window is the thing customers actually compare on, so it gets its own
    // prominent line rather than being buried in the description.
    detail: "4–7 Days",
    description:
      "The fast lane for urgent and high-value cargo, landing in under a week.",
  },
  {
    icon: Ship,
    title: "Sea Freight",
    detail: "45 Days",
    description:
      "The economical route for bulk and heavy shipments where timing is flexible.",
  },
  {
    icon: BadgeCheck,
    title: "Factory Inspection",
    detail: "Before dispatch",
    description:
      "We check your goods at the source, so faults are caught before they ship — not after.",
  },
  {
    icon: Globe,
    title: "Worldwide Shipping",
    detail: "Any destination",
    description:
      "Wherever your business is, we route your cargo there and handle the paperwork.",
  },
];

export default function Services() {
  return (
    <section id="solutions" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Reveal direction="left" className="max-w-md">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold-700">
              <MapPin size={14} strokeWidth={2} />
              Based in Turkey
            </span>
            <h2 className="mt-5 text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl">
              Reliable solutions to streamline your supply chain
            </h2>
            <a
              href={WHATSAPP_QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-all hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/25"
            >
              Get a Quote
            </a>
          </Reveal>

          <Reveal
            direction="right"
            className="group relative h-72 w-full overflow-hidden rounded-4xl sm:h-80 md:w-104"
          >
            <Image
              src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&q=80&auto=format&fit=crop"
              alt="Aerial view of a container port with cargo stacked beside loading cranes"
              fill
              sizes="(min-width: 768px) 26rem, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Reveal>
        </div>

        <Reveal
          stagger
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="group bg-white p-8 transition-colors duration-300 hover:bg-neutral-50"
            >
              <service.icon
                size={28}
                strokeWidth={1.5}
                className="text-gold-600 transition-transform duration-300 group-hover:-translate-y-1"
              />
              <h3 className="mt-5 text-lg font-medium text-neutral-900">
                {service.title}
              </h3>
              <p className="mt-1 text-sm font-semibold text-gold-600">
                {service.detail}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                {service.description}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
