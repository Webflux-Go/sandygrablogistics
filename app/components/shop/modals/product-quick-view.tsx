"use client";

import Image from "next/image";
import { Package, X } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { useCart } from "@/hooks/use-cart";
import { urlFor } from "@/lib/sanity/image";
import { formatNaira } from "@/lib/format";

export default function ProductQuickView() {
  const { quickViewProduct, close } = useModal();
  const { add } = useCart();

  if (!quickViewProduct) return null;

  const imageUrl =
    urlFor(quickViewProduct.images?.[0])?.width(800).height(800).url() ?? null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={close}
    >
      <div
        className="relative grid w-full max-w-2xl grid-cols-1 gap-6 rounded-3xl bg-white p-6 sm:grid-cols-2"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-900"
        >
          <X size={20} />
        </button>

        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={quickViewProduct.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-neutral-300">
              <Package size={32} strokeWidth={1.5} />
            </span>
          )}
        </div>

        <div className="flex flex-col pr-6">
          <h2 className="text-xl font-medium text-neutral-900">
            {quickViewProduct.name}
          </h2>
          <p className="mt-2 text-lg font-semibold text-neutral-900">
            {formatNaira(quickViewProduct.price)}
          </p>
          {quickViewProduct.description && (
            <p className="mt-4 text-sm leading-relaxed text-neutral-500">
              {quickViewProduct.description}
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              add({
                productId: quickViewProduct._id,
                name: quickViewProduct.name,
                slug: quickViewProduct.slug,
                price: quickViewProduct.price,
                image: imageUrl,
              });
              close();
            }}
            disabled={quickViewProduct.stock <= 0}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {quickViewProduct.stock > 0 ? "Add to Cart" : "Sold out"}
          </button>
        </div>
      </div>
    </div>
  );
}
