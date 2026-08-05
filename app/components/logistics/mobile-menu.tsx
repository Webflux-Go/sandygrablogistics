"use client";

import Image from "next/image";
import Link from "next/link";
import { Store, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import FullscreenMenu, { useMenuClose } from "../motion/fullscreen-menu";
import { WHATSAPP_CHAT_URL } from "@/lib/contact";

export interface NavLink {
  href: string;
  label: string;
}

function MenuContent({ links }: { links: readonly NavLink[] }) {
  const close = useMenuClose();

  return (
    <>
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
          onClick={close}
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
            onClick={close}
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
          onClick={close}
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
          onClick={close}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-4 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold-300"
        >
          <FaWhatsapp size={16} />
          WhatsApp Us
        </a>
      </div>
    </>
  );
}

export default function MobileMenu({
  links,
  onClose,
}: {
  links: readonly NavLink[];
  onClose: () => void;
}) {
  return (
    <FullscreenMenu
      onClose={onClose}
      label="Menu"
      className="md:hidden"
      panelClassName="bg-neutral-950/95 backdrop-blur-xl"
    >
      <MenuContent links={links} />
    </FullscreenMenu>
  );
}
