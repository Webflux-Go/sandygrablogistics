"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useModal } from "@/hooks/use-modal";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#collections", label: "Collections" },
  { href: "#catalog", label: "Catalog" },
  { href: "#promo", label: "About" },
];

export default function ShopNavbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { open: openModal } = useModal();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="#home" className="flex items-center">
          <Image
            src="/sandygrabslogo.png"
            alt="Sandygrabs"
            width={149}
            height={100}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openModal("auth")}
            aria-label="Account"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 sm:inline-flex"
          >
            <User size={20} />
          </button>

          <button
            type="button"
            onClick={() => openModal("cart")}
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-medium text-white">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-neutral-200 px-4 py-3 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openModal("auth");
            }}
            className="rounded-lg px-3 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-100"
          >
            Account
          </button>
        </div>
      )}
    </header>
  );
}
