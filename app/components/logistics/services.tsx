import Image from "next/image";
import Reveal from "../motion/reveal";
import { WHATSAPP_QUOTE_URL } from "@/lib/contact";
import {
  Plane,
  Zap,
  Truck,
  Warehouse,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";

const SERVICES = [
  {
    icon: Plane,
    title: "Air Freight",
    description:
      "Fast and secure air freight solutions to ensure your goods reach their destination on time.",
  },
  {
    icon: Zap,
    title: "Express Freight",
    description:
      "Fast and reliable express freight services for quick delivery without compromising safety.",
  },
  {
    icon: Truck,
    title: "Land Freight",
    description:
      "Efficient land transportation for both local and international deliveries, ensuring the best rates.",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    description:
      "Flexible and secure storage for your goods, ensuring safe handling and easy access.",
  },
  {
    icon: ClipboardCheck,
    title: "Custom Clearance",
    description:
      "Expert handling of customs procedures to ensure a smooth and hassle-free shipping experience.",
  },
  {
    icon: ShieldCheck,
    title: "Freight Insurance",
    description:
      "Comprehensive freight insurance to protect your cargo against any unforeseen risks during transit.",
  },
];

export default function Services() {
  return (
    <section id="solutions" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Reveal direction="left" className="max-w-md">
            <h2 className="text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl">
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
              src="https://images.unsplash.com/photo-1612630741022-b29ec17d013d?w=1200&q=80&auto=format&fit=crop"
              alt="Sandygrabs worker loading boxes into a delivery van"
              fill
              sizes="(min-width: 768px) 26rem, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Reveal>
        </div>

        <Reveal
          stagger
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3"
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
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {service.description}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
