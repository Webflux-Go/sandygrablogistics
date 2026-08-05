/**
 * Shared skeleton primitives for the shop's loading states.
 *
 * `motion-safe:` so the pulse is dropped for anyone who has asked their OS to reduce motion —
 * a full page of pulsing blocks is exactly the kind of thing that setting exists for.
 */
export function Box({ className }: { className?: string }) {
  return (
    <div
      className={`motion-safe:animate-pulse rounded-xl bg-neutral-200/70 ${className ?? ""}`}
    />
  );
}

/**
 * Mirrors the real navbar's height. The navbar is rendered by each page rather than the shop
 * layout, so without a stand-in it disappears during navigation and the whole page jumps.
 */
export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Box className="h-14 w-32 sm:h-16 sm:w-36" />

        <div className="hidden items-center gap-6 lg:flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <Box key={index} className="h-4 w-16" />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Box className="h-10 w-10 rounded-full" />
          <Box className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </header>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <Box className="aspect-square rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Box className="h-4 w-3/4" />
        <div className="mt-1 flex items-center justify-between gap-2">
          <Box className="h-4 w-20" />
          <Box className="h-7 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

/** Heading + optional trailing control, the shape most sections on the shop share. */
export function SectionHeadingSkeleton({ withAction = false }: { withAction?: boolean }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Box className="h-9 w-64 max-w-full" />
      {withAction && <Box className="h-11 w-full rounded-full sm:w-64" />}
    </div>
  );
}
