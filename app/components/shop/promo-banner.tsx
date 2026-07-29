import Image from "next/image";
import Reveal from "../motion/reveal";

export default function PromoBanner() {
  return (
    <section id="promo" className="px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="relative mx-auto h-80 max-w-6xl overflow-hidden rounded-4xl bg-neutral-900 sm:h-96">
        <Image
          src="https://images.unsplash.com/photo-1614597445336-8a67e9314d91?w=1920&q=80&auto=format&fit=crop"
          alt="A modern kitchen and dining space with warm wood furniture"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-neutral-950/85 via-neutral-950/45 to-transparent" />

        <div className="relative flex h-full max-w-md flex-col justify-center gap-5 p-8 sm:p-12">
          <h2 className="text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl">
            Refresh your home with elegant furniture.
          </h2>
          <p className="text-sm leading-relaxed text-white/80">
            Discover a curated collection of timeless pieces designed to bring
            comfort and sophistication into every corner of your home.
          </p>
          <a
            href="#catalog"
            className="inline-flex w-fit items-center justify-center rounded-full bg-gold-400 px-6 py-3 text-sm font-medium text-neutral-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-500/30"
          >
            Shop Now
          </a>
        </div>
      </Reveal>
    </section>
  );
}
