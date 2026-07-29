"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Lets nested content (close buttons, "continue shopping" links) trigger the exit animation
 * rather than unmounting instantly — without every modal having to thread a callback down.
 */
const ModalCloseContext = createContext<() => void>(() => {});

export function useModalClose() {
  return useContext(ModalCloseContext);
}

export default function ModalShell({
  children,
  onClose,
  variant = "center",
  className,
  labelledBy,
}: {
  children: React.ReactNode;
  onClose: () => void;
  /** "center" scales in from the middle; "drawer" slides in from the right edge. */
  variant?: "center" | "drawer";
  className?: string;
  labelledBy?: string;
}) {
  const backdrop = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const isClosing = useRef(false);

  useGSAP(() => {
    const reduced = gsap.matchMedia();
    let animate = true;

    reduced.add("(prefers-reduced-motion: reduce)", () => {
      animate = false;
    });

    if (!animate) return;

    gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });

    gsap.fromTo(
      panel.current,
      variant === "drawer" ? { xPercent: 100 } : { opacity: 0, y: 16, scale: 0.97 },
      variant === "drawer"
        ? { xPercent: 0, duration: 0.35, ease: "power3.out" }
        : { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.4)" }
    );
  });

  // Plays the exit, then unmounts. Guarded so a double-click can't fire onClose twice.
  const requestClose = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }

    gsap.to(backdrop.current, { opacity: 0, duration: 0.2, ease: "power2.in" });
    gsap.to(panel.current, {
      ...(variant === "drawer" ? { xPercent: 100 } : { opacity: 0, y: 12, scale: 0.98 }),
      duration: 0.22,
      ease: "power2.in",
      onComplete: onClose,
    });
  }, [onClose, variant]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Stop the page behind the modal from scrolling while it's open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [requestClose]);

  return (
    <ModalCloseContext.Provider value={requestClose}>
      <div
        className={`fixed inset-0 z-50 flex ${
          variant === "drawer" ? "justify-end" : "items-center justify-center p-4"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <div
          ref={backdrop}
          onClick={requestClose}
          className="absolute inset-0 bg-neutral-950/50 backdrop-blur-[2px]"
        />
        <div ref={panel} className={`relative ${className ?? ""}`}>
          {children}
        </div>
      </div>
    </ModalCloseContext.Provider>
  );
}
