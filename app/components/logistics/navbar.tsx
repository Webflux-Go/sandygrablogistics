"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Store, X } from "lucide-react";
import { WHATSAPP_QUOTE_URL } from "@/lib/contact";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#solutions", label: "Solutions" },
  { href: "#founder", label: "Our Story" },
  { href: "#gallery", label: "Gallery" },
  { href: "#use-cases", label: "Use Cases" },
  { href: "#testimonials", label: "Testimonials" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30 px-4 py-4 sm:px-6 sm:py-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="#home" className="flex shrink-0 items-center">
          <Image
            src="/sandygrabslogo.png"
            alt="Sandygrabs"
            width={149}
            height={100}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-6 rounded-full border border-white/15 bg-white/10 px-6 py-2.5 backdrop-blur-md md:flex lg:gap-8 lg:px-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/90 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold-300"
          >
            <Store size={16} />
            Shop
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Anchored to the header's bottom edge rather than a fixed offset, so the panel can't
          overlap the logo row as the logo scales between breakpoints. */}
      {open && (
        <div className="absolute inset-x-4 top-full z-30 flex flex-col gap-1 rounded-2xl border border-white/15 bg-neutral-900/95 p-4 shadow-xl backdrop-blur-md sm:inset-x-6 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-white/90 hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
          <a
            href={WHATSAPP_QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-gold-400 px-4 py-2.5 text-center text-sm font-medium text-neutral-950"
          >
            Get a Quote
          </a>
        </div>
      )}
    </header>
  );
}
