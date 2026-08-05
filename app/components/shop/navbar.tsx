"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useModal } from "@/hooks/use-modal";
import AccountMenu from "./account-menu";
import ShopMobileMenu from "./mobile-menu";

const LINKS = [
  { href: "/shop", label: "Home" },
  { href: "/shop?category=furniture", label: "Furniture" },
  { href: "/shop?category=bedroom", label: "Bedroom" },
  { href: "/shop?category=lighting", label: "Lighting" },
  { href: "/shop?category=doors", label: "Doors" },
];

export default function ShopNavbar({ email }: { email: string | null }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { open: openModal } = useModal();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      {/* Generous vertical padding so the stacked logo (mark above wordmark) has room to
          render at a legible size instead of being squashed into the bar. */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/shop" className="flex shrink-0 items-center">
          <Image
            src="/sandygrabslogo.png"
            alt="Sandygrabs"
            width={149}
            height={100}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-600 transition-colors hover:text-gold-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <AccountMenu email={email} />

          <button
            type="button"
            onClick={() => openModal("cart")}
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-gold-50 hover:text-gold-700"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-medium text-neutral-950">
                {count}
              </span>
            )}
          </button>

          {/* The overlay covers this button and carries its own close control, so it only ever
              needs to show the "open" state. */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-gold-50 hover:text-gold-700 lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {open && (
        <ShopMobileMenu
          links={LINKS}
          email={email}
          onClose={() => setOpen(false)}
        />
      )}
    </header>
  );
}
