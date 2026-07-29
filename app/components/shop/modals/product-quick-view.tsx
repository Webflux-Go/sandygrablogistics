"use client";

import Image from "next/image";
import { Package, X } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { useCart } from "@/hooks/use-cart";
import { urlFor } from "@/lib/sanity/image";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/lib/sanity/types";
import ModalShell, { useModalClose } from "../../motion/modal-shell";

function QuickViewPanel({ product }: { product: Product }) {
  const { add } = useCart();
  const close = useModalClose();
  const imageUrl = urlFor(product.images?.[0])?.width(800).height(800).url() ?? null;

  return (
    <div className="relative grid w-full max-w-2xl grid-cols-1 gap-6 rounded-3xl bg-white p-6 shadow-2xl sm:grid-cols-2">
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-4 top-4 text-neutral-400 transition-colors hover:text-neutral-900"
      >
        <X size={20} />
      </button>

      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={product.name} fill className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-neutral-300">
            <Package size={32} strokeWidth={1.5} />
          </span>
        )}
      </div>

      <div className="flex flex-col pr-6">
        <h2 id="quickview-title" className="text-xl font-medium text-neutral-900">
          {product.name}
        </h2>
        <p className="mt-2 text-lg font-semibold text-neutral-900">
          {formatNaira(product.price)}
        </p>
        {product.description && (
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            {product.description}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            add({
              productId: product._id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: imageUrl,
            });
            close();
          }}
          disabled={product.stock <= 0}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {product.stock > 0 ? "Add to Cart" : "Sold out"}
        </button>
      </div>
    </div>
  );
}

export default function ProductQuickView() {
  const { quickViewProduct, close } = useModal();

  if (!quickViewProduct) return null;

  return (
    <ModalShell onClose={close} labelledBy="quickview-title">
      <QuickViewPanel product={quickViewProduct} />
    </ModalShell>
  );
}
