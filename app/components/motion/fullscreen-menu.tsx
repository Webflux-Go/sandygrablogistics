"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Lets nested links close the menu through the exit animation rather than unmounting instantly. */
const MenuCloseContext = createContext<() => void>(() => {});

export function useMenuClose() {
  return useContext(MenuCloseContext);
}

/**
 * Full-viewport navigation overlay: fades the panel in, then staggers anything marked with
 * `data-menu-item`, and reverses both on the way out. Shared by the logistics and shop menus,
 * which differ only in their theme and contents.
 */
export default function FullscreenMenu({
  children,
  onClose,
  /**
   * Classes for the fixed root — this is where the breakpoint guard (`md:hidden`) belongs.
   * On the panel it would hide the visible surface but leave the root covering the page and
   * swallowing clicks after a resize to desktop.
   */
  className,
  /** Panel classes — mainly the background, which differs between the two sites. */
  panelClassName,
  label,
}: {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  panelClassName?: string;
  label: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const isClosing = useRef(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline()
          .fromTo(
            panel.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.3, ease: "power2.out" }
          )
          // Items arrive after the panel has landed, so the eye follows them down the list
          // rather than seeing everything appear at once.
          .fromTo(
            "[data-menu-item]",
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.07,
              ease: "power3.out",
            },
            "-=0.1"
          );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  // Plays the exit before unmounting. Guarded so a double-tap can't fire onClose twice.
  const requestClose = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }

    const items = root.current?.querySelectorAll("[data-menu-item]") ?? [];

    gsap
      .timeline({ onComplete: onClose })
      .to(items, {
        autoAlpha: 0,
        y: -16,
        duration: 0.2,
        stagger: 0.03,
        ease: "power2.in",
      })
      .to(panel.current, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, "-=0.1");
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [requestClose]);

  return (
    <MenuCloseContext.Provider value={requestClose}>
      {/* dvh rather than vh so mobile browser chrome sliding in and out can't crop the panel. */}
      <div
        ref={root}
        className={`fixed inset-x-0 top-0 z-50 h-dvh ${className ?? ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <div
          ref={panel}
          className={`relative flex h-full flex-col overflow-hidden ${panelClassName ?? ""}`}
        >
          {children}
        </div>
      </div>
    </MenuCloseContext.Provider>
  );
}
