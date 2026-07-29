"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Store } from "lucide-react";
import MobileMenu from "./mobile-menu";

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

          {/* The overlay covers this button and carries its own close control, so it only ever
              needs to show the "open" state. */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {open && <MobileMenu links={LINKS} onClose={() => setOpen(false)} />}
    </header>
  );
}
