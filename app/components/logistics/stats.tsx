const STATS = [
  { value: "98%", label: "On-Time Delivery Rate" },
  { value: "95%", label: "Customer Satisfaction" },
  { value: "99%", label: "Cargo Safety Rate" },
  { value: "90%", label: "Client Retention Rate" },
];

export default function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          Who We Are
        </h2>
        <p className="max-w-2xl text-2xl font-medium leading-snug tracking-tight text-neutral-900 sm:text-3xl">
          We are a trusted freight and logistics company, delivering timely,
          secure, and cost-effective solutions for businesses of all sizes,
          worldwide.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 divide-neutral-200 sm:grid-cols-4 sm:divide-x">
        {STATS.map((stat) => (
          <div key={stat.label} className="px-2 py-4 sm:px-8 sm:py-0">
            <p className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
