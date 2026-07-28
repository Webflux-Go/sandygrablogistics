"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/actions/auth";

export default function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await signOut();
          router.push("/admin/login");
          router.refresh();
        })
      }
      className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 disabled:opacity-50"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
