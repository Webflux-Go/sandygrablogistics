"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Slow ken-burns on mount plus a gentle parallax drift as the hero scrolls away. Wraps the
 * image rather than owning it, so the caller keeps control of next/image's props (priority,
 * sizes, etc.).
 */
export default function HeroBackdrop({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          if (!animate) return;

          gsap.fromTo(
            scope.current,
            { scale: 1.12 },
            { scale: 1, duration: 2.4, ease: "power2.out" }
          );

          gsap.to(scope.current, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: scope.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      );

      return () => mm.revert();
    },
    { scope }
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
