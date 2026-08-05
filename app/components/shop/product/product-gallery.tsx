"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Package } from "lucide-react";
import ImageLightbox from "./image-lightbox";

export default function ProductGallery({
  images,
  fullImages,
  alt,
}: {
  /** Square, cropped — for the main frame and thumbnails. */
  images: string[];
  /** Uncropped and larger — for the fullscreen viewer. */
  fullImages: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasMultiple = images.length > 1;

  const goPrev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setActive((i) => (i + 1) % images.length);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-3xl bg-neutral-100 text-neutral-300">
        <Package size={40} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* The arrows and counter are siblings of the zoom button, not children — a button inside
          a button is invalid HTML, and clicking an arrow would also open the lightbox. */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-3xl bg-neutral-100">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="View image full screen"
          className="block h-full w-full cursor-zoom-in"
        >
          <Image
            src={images[active]}
            alt={`${alt} — image ${active + 1} of ${images.length}`}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
            className="object-cover"
          />
        </button>

        <span className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-neutral-700 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <Expand size={18} />
        </span>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-gold-700"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-gold-700"
            >
              <ChevronRight size={20} />
            </button>

            <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900/75 px-3 py-1 text-xs font-medium text-white">
              {active + 1} / {images.length}
            </p>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === active}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-colors ${
                index === active
                  ? "border-gold-500"
                  : "border-transparent hover:border-neutral-300"
              }`}
            >
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <ImageLightbox
          images={fullImages}
          index={active}
          onIndexChange={setActive}
          onClose={() => setLightboxOpen(false)}
          alt={alt}
        />
      )}
    </div>
  );
}
