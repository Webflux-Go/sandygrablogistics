import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Store } from "lucide-react";
import StatusScreen from "./components/status-screen";

export const metadata: Metadata = {
  title: "Page Not Found — Sandygrabs",
  description: "The page you were looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title="We couldn't find that page"
      description="The link may be out of date, or the page may have moved. Everything else is still where you left it."
    >
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-medium text-neutral-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-500/30"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
      <Link
        href="/shop"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
      >
        <Store size={16} />
        Browse the Shop
      </Link>
    </StatusScreen>
  );
}
