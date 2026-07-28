import Image from "next/image";
import Navbar from "./navbar";

export default function Hero() {
  return (
    <section id="home">
      <div className="relative overflow-hidden bg-neutral-900">
        <Image
          src="https://images.unsplash.com/photo-1620455800201-7f00aeef12ed?w=1920&q=80&auto=format&fit=crop"
          alt="Sandygrabs drivers loading a delivery van with parcels"
          width={1920}
          height={1200}
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/50" />

        <div className="relative">
          <Navbar />

          <div className="flex flex-col gap-8 px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-40 md:flex-row md:items-end md:justify-between md:pt-56">
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
              Freight Solutions With On-Time Deliveries
            </h1>

            <div className="flex max-w-sm flex-col gap-5">
              <p className="text-sm leading-relaxed text-white/80">
                Sandygrabs offers a full range of freight services to
                optimize your supply chain, ensuring reliable, cost-effective,
                and on-time deliveries tailored to the needs of your
                business.
              </p>
              <a
                href="#contact"
                className="inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-white/90"
              >
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
