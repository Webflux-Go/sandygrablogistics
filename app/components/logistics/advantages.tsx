import Reveal from "../motion/reveal";
import {
  BadgeCheck,
  Truck,
  Video,
  UserRoundCheck,
  Boxes,
} from "lucide-react";

const ADVANTAGES = [
  {
    icon: BadgeCheck,
    title: "Factory Inspection Before Shipping",
    description:
      "We check your goods at the factory before they leave, so problems are caught at the source.",
  },
  {
    icon: Truck,
    title: "Door-to-Door Delivery",
    description:
      "From the supplier's floor to your address — you don't coordinate a single handover.",
  },
  {
    icon: Video,
    title: "Live Factory Video Calls",
    description:
      "Join us on a call from the factory and see exactly what you're buying, in real time.",
  },
  {
    icon: UserRoundCheck,
    title: "Personal Shopping Assistance",
    description:
      "Tell us what you need and we'll find it, compare options, and advise you honestly.",
  },
  {
    icon: Boxes,
    title: "Cargo Consolidation",
    description:
      "We combine your orders from several suppliers into one shipment, so you pay freight once.",
  },
];

export default function Advantages() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gold-700">
          Who We Are
        </h2>
        <p className="max-w-2xl text-2xl font-medium leading-snug tracking-tight text-neutral-900 sm:text-3xl">
          We are a trusted freight and logistics company, delivering timely,
          secure, and cost-effective solutions for businesses of all sizes,
          worldwide.
        </p>
      </Reveal>

      {/* Five items don't divide evenly into a grid, so the first two take a wider column on
          desktop and the remaining three sit beneath — avoids a lone orphan on the last row. */}
      <Reveal
        stagger
        as="ul"
        className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-6"
      >
        {ADVANTAGES.map((item, index) => (
          <li
            key={item.title}
            className={`group bg-white p-8 transition-colors duration-300 hover:bg-neutral-50 ${
              index < 2 ? "lg:col-span-3" : "lg:col-span-2"
            }`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600 transition-transform duration-300 group-hover:-translate-y-1">
              <item.icon size={20} strokeWidth={1.5} />
            </span>
            <h3 className="mt-5 text-base font-medium text-neutral-900">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              {item.description}
            </p>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
