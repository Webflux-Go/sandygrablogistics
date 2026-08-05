"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function ImageLightbox({
  images,
  index,
  onIndexChange,
  onClose,
  alt,
}: {
  /** Full-resolution URLs, uncropped — the grid thumbnails are square, these are not. */
  images: string[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  alt: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const isClosing = useRef(false);

  const hasMultiple = images.length > 1;

  const goPrev = useCallback(
    () => onIndexChange((index - 1 + images.length) % images.length),
    [index, images.length, onIndexChange]
  );
  const goNext = useCallback(
    () => onIndexChange((index + 1) % images.length),
    [index, images.length, onIndexChange]
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          root.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.25, ease: "power2.out" }
        );
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const requestClose = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }

    gsap.to(root.current, {
      autoAlpha: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
      if (event.key === "ArrowLeft" && hasMultiple) goPrev();
      if (event.key === "ArrowRight" && hasMultiple) goNext();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [requestClose, goPrev, goNext, hasMultiple]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — enlarged image ${index + 1} of ${images.length}`}
    >
      {/* Backdrop click closes. It sits behind the image and controls, so clicking those
          doesn't bubble a close. */}
      <button
        type="button"
        onClick={requestClose}
        aria-label="Close image viewer"
        className="absolute inset-0 cursor-zoom-out"
        tabIndex={-1}
      />

      <button
        type="button"
        onClick={requestClose}
        aria-label="Close image viewer"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X size={22} />
      </button>

      {/* object-contain, not cover — the point of fullscreen is seeing the whole image. */}
      <div className="relative h-[85vh] w-[92vw] max-w-5xl">
        <Image
          src={images[index]}
          alt={`${alt} — image ${index + 1} of ${images.length}`}
          fill
          sizes="92vw"
          priority
          className="object-contain"
        />
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>

          <p className="absolute bottom-6 z-10 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            {index + 1} / {images.length}
          </p>
        </>
      )}
    </div>
  );
}
