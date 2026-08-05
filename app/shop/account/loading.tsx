import { Box } from "@/app/components/shop/skeletons";

/**
 * Renders inside the account layout, which already supplies the navbar, heading and tabs — so
 * this only stands in for the list itself.
 */
export default function AccountLoading() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-neutral-200 bg-white"
        >
          <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-5 py-4">
            <div className="flex flex-col gap-2">
              <Box className="h-4 w-28" />
              <Box className="h-3 w-40" />
            </div>
            <Box className="h-6 w-20 rounded-full" />
          </div>

          <div className="flex flex-col gap-3 px-5 py-4">
            <Box className="h-4 w-2/3" />
            <Box className="h-4 w-1/2" />
            <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-4">
              <Box className="h-4 w-14" />
              <Box className="h-5 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
