"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogOut, Menu, ShoppingBag, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useModal } from "@/hooks/use-modal";
import { signOut } from "@/actions/auth";
import AccountMenu from "./account-menu";

const LINKS = [
  { href: "/shop", label: "Home" },
  { href: "/shop?category=furniture", label: "Furniture" },
  { href: "/shop?category=bedroom", label: "Bedroom" },
  { href: "/shop?category=lighting", label: "Lighting" },
  { href: "/shop?category=doors", label: "Doors" },
];

export default function ShopNavbar({ email }: { email: string | null }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
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

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-gold-50 hover:text-gold-700 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-neutral-200 px-4 py-3 lg:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-gold-50 hover:text-gold-700"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-2 border-t border-neutral-100 pt-2">
            {email ? (
              <>
                <p className="px-3 py-1 text-xs text-neutral-400">Signed in as</p>
                <p className="truncate px-3 pb-2 text-sm font-medium text-neutral-900">
                  {email}
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    setOpen(false);
                    await signOut();
                    router.refresh();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openModal("auth");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-100"
              >
                <User size={15} /> Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
