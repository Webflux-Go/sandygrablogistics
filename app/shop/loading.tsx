import {
  Box,
  NavbarSkeleton,
  ProductGridSkeleton,
  SectionHeadingSkeleton,
} from "@/app/components/shop/skeletons";

/**
 * Mirrors the shop landing page's real structure and spacing, so content lands in place instead
 * of shifting when the skeleton is swapped out.
 */
export default function ShopLoading() {
  return (
    <>
      <NavbarSkeleton />

      <main>
        {/* Full-bleed, matching the hero's own height at both breakpoints. */}
        <section className="relative h-104 overflow-hidden bg-neutral-900 sm:h-120">
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-10">
            <Box className="h-4 w-40 bg-white/15" />
            <Box className="h-10 w-full max-w-xl bg-white/15 sm:h-12" />
            <Box className="h-4 w-full max-w-sm bg-white/10" />
            <Box className="mt-2 h-11 w-32 rounded-full bg-white/20" />
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeadingSkeleton />
            <div className="mt-10">
              <ProductGridSkeleton count={3} />
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-5">
            <Box className="h-64 rounded-3xl sm:h-80" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Box className="h-64 rounded-3xl sm:h-80" />
              <Box className="h-64 rounded-3xl sm:h-80" />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeadingSkeleton withAction />

            {/* Category tiles */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-neutral-200">
                  <Box className="aspect-square rounded-none" />
                  <div className="p-3">
                    <Box className="mx-auto h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar + product grid, matching the catalog's two-column split. */}
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[14rem_1fr]">
              <div className="hidden flex-col gap-2 md:flex">
                <Box className="h-3 w-24" />
                {Array.from({ length: 7 }).map((_, index) => (
                  <Box key={index} className="h-9 w-full rounded-lg" />
                ))}
              </div>
              <ProductGridSkeleton count={6} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
