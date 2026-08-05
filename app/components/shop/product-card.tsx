"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, Package } from "lucide-react";
import type { Product } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useModal } from "@/hooks/use-modal";
import { buildLineId } from "@/types/cart";

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = urlFor(product.images?.[0])?.width(600).height(600).url() ?? null;
  const { add } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { open } = useModal();
  const wishlisted = isWishlisted(product._id);
  const hasAddOns = (product.addOns?.length ?? 0) > 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {/* The overlay controls are siblings of the Link, not children: a button inside an anchor
          is invalid HTML and would navigate as well as firing its own handler. This wrapper is
          what they position against, so they track the image rather than the whole card. */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <Link
          href={`/shop/product/${product.slug}`}
          className="block h-full w-full"
          aria-label={product.name}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-neutral-300">
              <Package size={32} strokeWidth={1.5} />
            </span>
          )}
        </Link>

        {product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-gold-400 px-2.5 py-1 text-[11px] font-medium text-neutral-950 shadow-sm">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => open("quickView", product)}
          className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-1.5 rounded-full bg-neutral-900/90 py-2 text-xs font-medium text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Eye size={14} /> Quick View
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(product._id)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors ${
            wishlisted ? "text-gold-600" : "text-neutral-500 hover:text-gold-600"
          }`}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link
          href={`/shop/product/${product.slug}`}
          className="text-sm font-medium text-neutral-900 transition-colors hover:text-gold-700"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-neutral-900">
              {formatNaira(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                {formatNaira(product.compareAtPrice)}
              </span>
            )}
          </div>
          {/* A product with add-ons can't be added straight from the card — quick-adding it
              would silently commit the shopper to the base version. Send them to the picker
              instead; only add-on-free products keep the one-tap add. */}
          <button
            type="button"
            onClick={() =>
              hasAddOns
                ? open("quickView", product)
                : add({
                    lineId: buildLineId(product._id, []),
                    productId: product._id,
                    name: product.name,
                    slug: product.slug,
                    basePrice: product.price,
                    price: product.price,
                    addOns: [],
                    image: imageUrl,
                  })
            }
            disabled={product.stock <= 0}
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-gold-500 hover:bg-gold-500 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {product.stock <= 0 ? "Sold out" : hasAddOns ? "Options" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
