import {
  Box,
  NavbarSkeleton,
  ProductCardSkeleton,
} from "@/app/components/shop/skeletons";

/**
 * Without this, the parent /shop loading skeleton (a full landing page, hero and all) would
 * flash while a product page loads.
 */
export default function ProductLoading() {
  return (
    <>
      <NavbarSkeleton />

      <main className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Box className="h-4 w-12" />
            <Box className="h-4 w-20" />
            <Box className="h-4 w-32" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="flex flex-col gap-3">
              <Box className="aspect-square w-full rounded-3xl" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Box key={index} className="h-20 w-20 rounded-2xl" />
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <Box className="h-10 w-3/4" />
              <Box className="mt-5 h-4 w-full" />
              <Box className="mt-2 h-4 w-5/6" />
              <Box className="mt-2 h-4 w-2/3" />

              <div className="mt-8 border-t border-neutral-200 pt-8">
                <Box className="h-8 w-40" />
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Box className="h-12 w-32 rounded-full" />
                  <Box className="h-12 flex-1 rounded-full" />
                  <Box className="h-12 w-12 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <Box className="h-8 w-56" />
            <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
