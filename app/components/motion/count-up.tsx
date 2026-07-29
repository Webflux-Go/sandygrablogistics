"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          if (!animate) return;

          const counter = { current: 0 };

          gsap.to(counter, {
            current: value,
            duration: 1.6,
            ease: "power2.out",
            snap: { current: 1 },
            onUpdate: () => {
              el.textContent = `${Math.round(counter.current)}${suffix}`;
            },
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        }
      );

      return () => mm.revert();
    },
    { scope: ref, dependencies: [value, suffix] }
  );

  // Rendered at its final value so SSR output, no-JS, and reduced-motion all read correctly;
  // the animation only ever rewrites it downward-then-up on capable clients.
  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
