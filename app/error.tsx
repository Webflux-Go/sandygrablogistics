"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";
import Link from "next/link";
import { Mail, RotateCw } from "lucide-react";
import StatusScreen from "./components/status-screen";
import { SUPPORT_EMAIL, supportMailtoUrl } from "@/lib/contact";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  /**
   * Next 16.2's replacement for `reset()`. `reset()` only re-renders the boundary's children,
   * which would fail again instantly when the cause is a failed server fetch — `unstable_retry()`
   * re-fetches first, so "Try again" can genuinely recover from a transient outage.
   */
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      code="500"
      title="Something went wrong on our end"
      description={
        <>
          This one is on us, not you. Try again in a moment — if it keeps
          happening, email us at{" "}
          <a
            href={supportMailtoUrl(error.digest)}
            className="text-gold-300 underline underline-offset-4 hover:text-gold-200"
          >
            {SUPPORT_EMAIL}
          </a>{" "}
          and we&apos;ll take a look.
        </>
      }
      note={
        // Production hides the real message to avoid leaking server details, so the digest is
        // the only thread back to the log entry. Surfacing it turns a vague "it broke" report
        // into one support can actually trace.
        error.digest ? (
          <>
            Error reference:{" "}
            <span className="font-mono text-white/60">{error.digest}</span>
          </>
        ) : null
      }
    >
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-medium text-neutral-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-500/30"
      >
        <RotateCw size={16} />
        Try Again
      </button>
      <a
        href={supportMailtoUrl(error.digest)}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
      >
        <Mail size={16} />
        Email Support
      </a>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
      >
        Go Home
      </Link>
    </StatusScreen>
  );
}
