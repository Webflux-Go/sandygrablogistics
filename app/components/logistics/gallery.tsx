import Image from "next/image";
import Reveal from "../motion/reveal";

// TODO: replace these stand-ins with real photos of the founder at work.
const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1672380135241-c024f7fbfa13?w=1000&q=80&auto=format&fit=crop",
    alt: "Closing a supplier deal with a handshake",
    className: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1686771416282-3888ddaf249b?w=800&q=80&auto=format&fit=crop",
    alt: "Reviewing shipping paperwork with a partner",
  },
  {
    src: "https://images.unsplash.com/photo-1563132337-f159f484226c?w=800&q=80&auto=format&fit=crop",
    alt: "On a call coordinating a shipment",
  },
  {
    src: "https://images.unsplash.com/photo-1698047682091-782b1e5c6536?w=800&q=80&auto=format&fit=crop",
    alt: "Meeting with suppliers about a bulk order",
  },
  {
    src: "https://images.unsplash.com/photo-1696861273647-92dfe8bb697c?w=800&q=80&auto=format&fit=crop",
    alt: "Inspecting goods before they ship",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-xl">
          <h2 className="text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl">
            On the ground, doing the work
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            From supplier negotiations to final inspections — a look at the
            business transactions behind every shipment we handle.
          </p>
        </Reveal>

        <Reveal
          stagger
          className="mt-12 grid auto-rows-48 grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className={`group relative overflow-hidden rounded-2xl bg-neutral-100 ${photo.className ?? ""}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
