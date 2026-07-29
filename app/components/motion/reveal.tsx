"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Direction = "up" | "left" | "right";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animate each direct child in sequence instead of the wrapper as one block. */
  stagger?: boolean;
  /** Play on mount rather than when scrolled into view — for above-the-fold content. */
  immediate?: boolean;
  direction?: Direction;
  delay?: number;
  /** Render as a different element so this wrapper doesn't break grid/flex parents. */
  as?: "div" | "section" | "ul";
}

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
};

export default function Reveal({
  children,
  className,
  stagger = false,
  immediate = false,
  direction = "up",
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // matchMedia keeps this honest for people who've asked their OS to reduce motion —
      // GSAP reverts to the "reduce" branch automatically, leaving content plainly visible.
      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };
          if (!animate) return;

          const targets = stagger
            ? (gsap.utils.toArray(scope.current?.children ?? []) as HTMLElement[])
            : [scope.current as HTMLElement];
          if (!targets.length) return;

          const { x, y } = OFFSET[direction];

          // fromTo (not from) inside useGSAP's useLayoutEffect sets the start state before the
          // browser paints, so there's no flash of the final position on hydration.
          gsap.fromTo(
            targets,
            { autoAlpha: 0, x, y },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              duration: 0.8,
              delay,
              ease: "power2.out",
              stagger: stagger ? 0.1 : 0,
              ...(immediate
                ? {}
                : {
                    scrollTrigger: {
                      trigger: scope.current,
                      start: "top 85%",
                      once: true,
                    },
                  }),
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope }
  );

  return (
    <Tag ref={scope as React.Ref<never>} className={className}>
      {children}
    </Tag>
  );
}
