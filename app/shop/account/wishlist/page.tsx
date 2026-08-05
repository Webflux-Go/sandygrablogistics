import Link from "next/link";
import { HeartOff } from "lucide-react";
import ProductCard from "@/app/components/shop/product-card";
import { getWishlistProductIds } from "@/lib/wishlist/queries";
import { getProductsByIds } from "@/lib/sanity/queries";

export default async function AccountWishlistPage() {
  const productIds = await getWishlistProductIds();
  const products = await getProductsByIds(productIds);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-neutral-300 py-20 text-center">
        <HeartOff size={32} strokeWidth={1.5} className="text-neutral-300" />
        <p className="text-sm text-neutral-500">
          Your wishlist is empty. Tap the heart on any product to save it here.
        </p>
        <Link
          href="/shop"
          className="mt-2 inline-flex items-center rounded-full bg-gold-500 px-5 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold-400"
        >
          Browse products
        </Link>
      </div>
    );
  }

  // Sanity returns matches in its own order, so re-sort to the wishlist's newest-first order.
  const ordered = productIds
    .map((id) => products.find((product) => product._id === id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <>
      <p className="mb-6 text-sm text-neutral-500">
        {ordered.length} saved item{ordered.length === 1 ? "" : "s"}
      </p>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {ordered.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </>
  );
}
