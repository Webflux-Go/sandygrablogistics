import Reveal from "../motion/reveal";
import CountUp from "../motion/count-up";

const STATS = [
  { value: 98, suffix: "%", label: "On-Time Delivery Rate" },
  { value: 95, suffix: "%", label: "Customer Satisfaction" },
  { value: 99, suffix: "%", label: "Cargo Safety Rate" },
  { value: 90, suffix: "%", label: "Client Retention Rate" },
];

export default function Stats() {
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

      <Reveal
        stagger
        className="mt-14 grid grid-cols-2 divide-neutral-200 sm:grid-cols-4 sm:divide-x"
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="px-2 py-4 sm:px-8 sm:py-0">
            <CountUp
              value={stat.value}
              suffix={stat.suffix}
              className="block text-4xl font-semibold tracking-tight text-gold-600 tabular-nums sm:text-5xl"
            />
            <p className="mt-2 text-sm text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
