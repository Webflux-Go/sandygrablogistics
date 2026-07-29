import Reveal from "../motion/reveal";
import {
  Send,
  Factory,
  ScanSearch,
  ThumbsUp,
  PackageCheck,
  Truck,
} from "lucide-react";

const STEPS = [
  {
    icon: Send,
    title: "Send us your request",
    description:
      "Tell us what you're looking for — the product, the quantity, and any specs that matter to you.",
  },
  {
    icon: Factory,
    title: "We source from trusted Turkish suppliers",
    description:
      "We take your request to manufacturers we already work with and come back with factory-direct pricing.",
  },
  {
    icon: ScanSearch,
    title: "We inspect the products",
    description:
      "Every item is checked at the factory before it leaves, so nothing reaches you unverified.",
  },
  {
    icon: ThumbsUp,
    title: "You approve the order",
    description:
      "We share exactly what we found and what it costs. Nothing moves forward until you confirm.",
  },
  {
    icon: PackageCheck,
    title: "We package and ship",
    description:
      "Your goods are packed for the journey and dispatched by air or sea, whichever you choose.",
  },
  {
    icon: Truck,
    title: "Delivery to your destination",
    description:
      "We handle the route from the factory floor through to your door, wherever in the world that is.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl">
            From your request to your doorstep, in six steps
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            You never deal with the factory, the paperwork, or the freight
            forwarder. You tell us what you need — we handle everything between
            that message and the delivery.
          </p>
        </Reveal>

        <Reveal
          stagger
          as="ul"
          className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3"
        >
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="group relative bg-white p-8 transition-colors duration-300 hover:bg-neutral-50"
            >
              {/* The step number is the primary wayfinding cue here, so it stays visually
                  louder than the icon rather than competing with it. */}
              <span
                aria-hidden
                className="absolute right-6 top-6 text-4xl font-semibold leading-none text-neutral-100 transition-colors duration-300 group-hover:text-gold-100"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600 transition-transform duration-300 group-hover:-translate-y-1">
                <step.icon size={20} strokeWidth={1.5} />
              </span>

              <h3 className="relative mt-5 text-base font-medium text-neutral-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {step.description}
              </p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
