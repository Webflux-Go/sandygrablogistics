import Image from "next/image";
import Link from "next/link";

/**
 * Shared full-screen shell for the 404 and error pages. Kept free of server-only imports so
 * `error.tsx` (which must be a Client Component) can use it too.
 */
export default function StatusScreen({
  code,
  title,
  description,
  children,
  note,
}: {
  /** Large watermark behind the copy — "404", "500". */
  code: string;
  title: string;
  description: React.ReactNode;
  /** Action buttons. */
  children: React.ReactNode;
  /** Optional small print under the actions. */
  note?: React.ReactNode;
}) {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-neutral-950 px-6 py-20 text-center">
      {/* Two offset gold pools keep the flat black from reading as a browser error screen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-gold-600/10 blur-3xl"
      />

      {/* Sits behind the copy rather than above it, so the message stays the thing you read
          first and the code is context. aria-hidden because the heading already says it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute select-none text-[9rem] font-bold leading-none text-white/4 sm:text-[14rem]"
      >
        {code}
      </span>

      <div className="relative flex max-w-lg flex-col items-center">
        <Link href="/" className="mb-10">
          <Image
            src="/sandygrabslogo.png"
            alt="Sandygrabs"
            width={149}
            height={100}
            className="h-14 w-auto"
          />
        </Link>

        <h1 className="text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl">
          {title}
        </h1>

        <div className="mt-4 text-sm leading-relaxed text-white/70">
          {description}
        </div>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">{children}</div>

        {note && <div className="mt-8 text-xs text-white/40">{note}</div>}
      </div>
    </main>
  );
}
