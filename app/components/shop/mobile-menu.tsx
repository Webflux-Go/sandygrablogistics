"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LogOut, Package, ShoppingBag, User, X } from "lucide-react";
import FullscreenMenu, { useMenuClose } from "../motion/fullscreen-menu";
import { useCart } from "@/hooks/use-cart";
import { useModal } from "@/hooks/use-modal";
import { signOut } from "@/actions/auth";

export interface ShopNavLink {
  href: string;
  label: string;
}

function MenuContent({
  links,
  email,
}: {
  links: readonly ShopNavLink[];
  email: string | null;
}) {
  const close = useMenuClose();
  const router = useRouter();
  const { count } = useCart();
  const { open: openModal } = useModal();

  return (
    <>
      {/* Keeps the white panel from reading as a blank page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl"
      />

      {/* Mirrors the navbar's spacing so the logo doesn't appear to jump on open. */}
      <div className="relative flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Image
          src="/sandygrabslogo.png"
          alt="Sandygrabs"
          width={149}
          height={100}
          className="h-14 w-auto sm:h-16"
        />
        <button
          type="button"
          onClick={close}
          aria-label="Close menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-gold-50 hover:text-gold-700"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="relative flex flex-1 flex-col justify-center px-6">
        {links.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            data-menu-item
            onClick={close}
            className="group flex items-baseline gap-4 border-b border-neutral-200 py-4 text-2xl font-medium text-neutral-900"
          >
            <span className="text-xs tabular-nums text-gold-600/70">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              {link.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="relative flex flex-col gap-3 px-6 pb-10 pt-6">
        {/* The navbar's cart button is behind the overlay, so the cart needs a way in here. */}
        <button
          type="button"
          data-menu-item
          onClick={() => {
            close();
            openModal("cart");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-gold-50 hover:text-gold-700"
        >
          <ShoppingBag size={16} />
          View Cart{count > 0 ? ` (${count})` : ""}
        </button>

        {email ? (
          <div data-menu-item className="flex flex-col gap-2">
            <p className="text-xs text-neutral-400">Signed in as</p>
            <p className="truncate text-sm font-medium text-neutral-900">{email}</p>

            <div className="mt-1 grid grid-cols-2 gap-2">
              <Link
                href="/shop/account"
                onClick={close}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-gold-50 hover:text-gold-700"
              >
                <Package size={15} />
                Orders
              </Link>
              <Link
                href="/shop/account/wishlist"
                onClick={close}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-gold-50 hover:text-gold-700"
              >
                <Heart size={15} />
                Wishlist
              </Link>
            </div>

            <button
              type="button"
              onClick={async () => {
                close();
                await signOut();
                router.refresh();
              }}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        ) : (
          <button
            type="button"
            data-menu-item
            onClick={() => {
              close();
              openModal("auth");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-4 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold-300"
          >
            <User size={16} />
            Sign in
          </button>
        )}
      </div>
    </>
  );
}

export default function ShopMobileMenu({
  links,
  email,
  onClose,
}: {
  links: readonly ShopNavLink[];
  email: string | null;
  onClose: () => void;
}) {
  return (
    <FullscreenMenu
      onClose={onClose}
      label="Menu"
      className="lg:hidden"
      panelClassName="bg-white"
    >
      <MenuContent links={links} email={email} />
    </FullscreenMenu>
  );
}
