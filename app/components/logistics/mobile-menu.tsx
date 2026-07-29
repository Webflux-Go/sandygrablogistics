"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { Store, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { WHATSAPP_CHAT_URL } from "@/lib/contact";

gsap.registerPlugin(useGSAP);

export interface NavLink {
  href: string;
  label: string;
}

export default function MobileMenu({
  links,
  onClose,
}: {
  links: readonly NavLink[];
  onClose: () => void;
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
          // Links arrive after the backdrop has landed, so the eye follows them down the list
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

    // Stop the page behind the overlay from scrolling while it's open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [requestClose]);

  return (
    // dvh rather than vh so mobile browser chrome sliding in and out can't crop the panel.
    <div
      ref={root}
      className="fixed inset-x-0 top-0 z-50 h-dvh md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div
        ref={panel}
        className="relative flex h-full flex-col overflow-hidden bg-neutral-950/95 backdrop-blur-xl"
      >
        {/* Warms the flat black with the brand gold without competing with the links. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl"
        />

        {/* Mirrors the real header's spacing so the logo doesn't appear to jump on open. */}
        <div className="relative flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-6">
          <Image
            src="/sandygrabslogo.png"
            alt="Sandygrabs"
            width={149}
            height={100}
            className="h-12 w-auto sm:h-14"
          />
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="relative flex flex-1 flex-col justify-center px-6">
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              data-menu-item
              onClick={requestClose}
              className="group flex items-baseline gap-4 border-b border-white/10 py-4 text-2xl font-medium text-white"
            >
              <span className="text-xs tabular-nums text-gold-400/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                {link.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="relative flex flex-col gap-3 px-6 pb-10 pt-6">
          <Link
            href="/shop"
            data-menu-item
            onClick={requestClose}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <Store size={16} />
            Shop
          </Link>
          <a
            href={WHATSAPP_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-menu-item
            onClick={requestClose}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-4 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold-300"
          >
            <FaWhatsapp size={16} />
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
