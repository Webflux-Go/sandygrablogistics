import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

function Banner({
  src,
  alt,
  label,
  className,
}: {
  src: string;
  alt: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href="#catalog"
      className={`group relative block h-64 overflow-hidden rounded-3xl sm:h-80 ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent" />
      <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white">
        <span className="text-lg font-medium">{label}</span>
        <span className="flex h-8 items-center gap-1 rounded-full bg-white/15 px-3 text-xs font-medium backdrop-blur-sm">
          View all products
          <ArrowUpRight size={14} />
        </span>
      </div>
    </a>
  );
}

export default function LifestyleBanners() {
  return (
    <section className="px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <Banner
          src="https://images.unsplash.com/photo-1600210491305-7396500b5b31?w=1600&q=80&auto=format&fit=crop"
          alt="A minimalist bedroom styled with warm wood tones and soft linens"
          label="Minimalist Bedroom"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Banner
            src="https://images.unsplash.com/photo-1658280024253-34cafdfbb002?w=1200&q=80&auto=format&fit=crop"
            alt="A dining area with a wooden table and modern chairs"
            label="Dining Area"
          />
          <Banner
            src="https://images.unsplash.com/photo-1673563932832-a0c9e0ed26f8?w=1200&q=80&auto=format&fit=crop"
            alt="A japandi-style living room with natural light and wooden accents"
            label="Japandi Living Room"
          />
        </div>
      </div>
    </section>
  );
}
