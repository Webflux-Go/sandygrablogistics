import Reveal from "../motion/reveal";
import { FaWhatsapp } from "react-icons/fa6";
import { WHATSAPP_CHAT_URL } from "@/lib/contact";

export default function Cta() {
  return (
    <section id="contact" className="px-4 pb-16 sm:px-6 sm:pb-24">
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-8 rounded-4xl bg-neutral-900 p-8 sm:p-12 md:flex-row md:items-center md:justify-between lg:p-16">
        <h2 className="max-w-lg text-2xl font-medium leading-snug tracking-tight text-white sm:text-3xl">
          We are a trusted freight and logistics company, delivering timely,
          secure deliveries
        </h2>

        <div className="flex shrink-0 flex-wrap gap-4">
          <a
            href="#solutions"
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            See Our Services
          </a>
          <a
            href={WHATSAPP_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-medium text-neutral-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-500/30"
          >
            <FaWhatsapp size={18} />
            WhatsApp Us
          </a>
        </div>
      </Reveal>
    </section>
  );
}
