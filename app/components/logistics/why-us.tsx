import Image from "next/image";
import Reveal from "../motion/reveal";
import { WHATSAPP_CHAT_URL } from "@/lib/contact";
import { ShieldCheck, Globe2, Headset } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Reliability",
    description:
      "Our commitment to on-time deliveries keeps your business running smoothly without delays.",
  },
  {
    icon: Globe2,
    title: "Global Reach",
    description:
      "With partners worldwide, we offer global solutions for your freight needs, reaching every major market.",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    description:
      "A team that's always on call, resolving issues before they turn into delays.",
  },
];

export default function WhyUs() {
  return (
    <section id="use-cases" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-4xl bg-neutral-900">
        <Image
          src="https://images.unsplash.com/photo-1620388640785-892616248ec8?w=1920&q=80&auto=format&fit=crop"
          alt="Forklift moving pallets in a Sandygrabs warehouse"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-neutral-950/90 via-neutral-950/60 to-neutral-950/25" />

        <div className="relative flex flex-col gap-10 p-8 sm:p-12 md:min-h-128 md:flex-row md:items-end md:justify-between lg:p-16">
          <Reveal direction="left" className="max-w-sm">
            <h2 className="text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl">
              Why Our Clients Trust Sandygrabs for Their Logistics Needs
            </h2>
            <a
              href={WHATSAPP_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-medium text-neutral-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-500/30"
            >
              <FaWhatsapp size={18} />
              WhatsApp Us
            </a>
          </Reveal>

          <Reveal stagger direction="right" className="flex w-full max-w-sm flex-col gap-4">
            {REASONS.map((reason) => (
              <div
                key={reason.title}
                className="rounded-2xl bg-white p-5 shadow-lg transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100">
                    <reason.icon size={20} className="text-gold-700" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      {reason.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
