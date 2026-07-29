"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User } from "lucide-react";
import { signOut } from "@/actions/auth";
import { useModal } from "@/hooks/use-modal";

export default function AccountMenu({ email }: { email: string | null }) {
  const router = useRouter();
  const { open } = useModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  if (!email) {
    return (
      <button
        type="button"
        onClick={() => open("auth")}
        className="hidden items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700 transition-colors hover:border-gold-400 hover:text-gold-700 sm:inline-flex"
      >
        <User size={16} />
        Sign in
      </button>
    );
  }

  const initial = email.charAt(0).toUpperCase();

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-neutral-200 py-1.5 pl-1.5 pr-3 transition-colors hover:border-gold-400"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-xs font-semibold text-neutral-950">
          {initial}
        </span>
        <span className="max-w-32 truncate text-sm text-neutral-700">{email}</span>
        <ChevronDown
          size={14}
          className={`text-neutral-400 transition-transform duration-200 ${
            menuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl"
        >
          <div className="px-3 py-2">
            <p className="text-xs text-neutral-400">Signed in as</p>
            <p className="truncate text-sm font-medium text-neutral-900">{email}</p>
          </div>
          <div className="my-1 border-t border-neutral-100" />
          <button
            type="button"
            role="menuitem"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await signOut();
                setMenuOpen(false);
                // Re-runs the server components so the navbar drops back to "Sign in".
                router.refresh();
              })
            }
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-50"
          >
            <LogOut size={15} />
            {isPending ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
