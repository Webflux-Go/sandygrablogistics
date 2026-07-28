import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative h-104 overflow-hidden bg-neutral-900 sm:h-120">
      <Image
        src="https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?w=1920&q=80&auto=format&fit=crop"
        alt="Factory-sourced Turkish home goods styled in a living room"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-sm">
          Sandygrabs SourceHub
        </p>
        <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
          Source Authentic Turkish Products at Factory Prices
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
          We connect you directly to trusted Turkish manufacturers, cutting
          out the middleman so you get genuine quality at factory-direct
          pricing.
        </p>
        <a
          href="#catalog"
          className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-white/90"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}
