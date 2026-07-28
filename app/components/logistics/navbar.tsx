"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Store, X } from "lucide-react";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#solutions", label: "Solutions" },
  { href: "#use-cases", label: "Use Cases" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#pricing", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
      <Link href="#home" className="flex items-center">
        <Image
          src="/sandygrabslogo.png"
          alt="Sandygrabs"
          width={149}
          height={100}
          priority
          className="h-12 w-auto sm:h-14"
        />
      </Link>

      <nav className="hidden items-center gap-8 rounded-full border border-white/15 bg-white/10 px-8 py-2.5 backdrop-blur-md md:flex">
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

<a href="#contact"
  className="inline-flex items-center gap-2 rounded-full bg-white p-3 text-sm font-medium text-neutral-900 no-underline transition-colors hover:bg-white/90"
>
  <Store size={16} />
  Shop
</a>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white md:hidden"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute inset-x-4 top-16 flex flex-col gap-1 rounded-2xl border border-white/15 bg-neutral-900/95 p-4 backdrop-blur-md md:hidden">
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
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-white px-4 py-2.5 text-center text-sm font-medium text-neutral-900"
          >
            Contact Us
          </a>
        </div>
      )}
    </div>
  );
}
