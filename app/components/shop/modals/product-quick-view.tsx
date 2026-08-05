"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Package, X } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { useCart } from "@/hooks/use-cart";
import { urlFor } from "@/lib/sanity/image";
import { formatNaira } from "@/lib/format";
import { buildLineId } from "@/types/cart";
import type { Product } from "@/lib/sanity/types";
import ModalShell, { useModalClose } from "../../motion/modal-shell";

function QuickViewPanel({ product }: { product: Product }) {
  const { add } = useCart();
  const close = useModalClose();

  const images = useMemo(
    () =>
      (product.images ?? [])
        .map((image) => urlFor(image)?.width(800).height(800).url() ?? null)
        .filter((url): url is string => url !== null),
    [product.images]
  );

  const addOns = product.addOns ?? [];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const selectedAddOns = addOns.filter((addOn) => selectedKeys.includes(addOn._key));
  const addOnTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const unitPrice = product.price + addOnTotal;

  const toggleAddOn = (key: string) =>
    setSelectedKeys((keys) =>
      keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]
    );

  return (
    <div className="relative grid max-h-[85vh] w-full max-w-3xl grid-cols-1 gap-6 overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:grid-cols-2">
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-1 text-neutral-400 backdrop-blur-sm transition-colors hover:text-neutral-900"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col gap-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
          {images.length > 0 ? (
            <Image
              src={images[activeImage]}
              alt={`${product.name} — image ${activeImage + 1} of ${images.length}`}
              fill
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-neutral-300">
              <Package size={32} strokeWidth={1.5} />
            </span>
          )}

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveImage((i) => (i - 1 + images.length) % images.length)
                }
                aria-label="Previous image"
                className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md transition-colors hover:bg-white hover:text-gold-700"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                aria-label="Next image"
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md transition-colors hover:bg-white hover:text-gold-700"
              >
                <ChevronRight size={18} />
              </button>

              <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900/75 px-2.5 py-0.5 text-[11px] font-medium text-white">
                {activeImage + 1} / {images.length}
              </p>
            </>
          )}
        </div>

        {/* Only worth showing when there's actually a choice to make. */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((url, index) => (
              <button
                key={url}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeImage}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                  index === activeImage
                    ? "border-gold-500"
                    : "border-transparent hover:border-neutral-300"
                }`}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <h2 id="quickview-title" className="text-xl font-medium text-neutral-900">
          {product.name}
        </h2>

        <p className="mt-2 text-lg font-semibold text-neutral-900">
          {formatNaira(unitPrice)}
          {addOnTotal > 0 && (
            <span className="ml-2 text-sm font-normal text-neutral-500">
              {formatNaira(product.price)} + {formatNaira(addOnTotal)} extras
            </span>
          )}
        </p>

        {product.description && (
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            {product.description}
          </p>
        )}

        {addOns.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Add extras
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {addOns.map((addOn) => {
                const checked = selectedKeys.includes(addOn._key);

                return (
                  <li key={addOn._key}>
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                        checked
                          ? "border-gold-500 bg-gold-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddOn(addOn._key)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          checked
                            ? "border-gold-500 bg-gold-500 text-neutral-950"
                            : "border-neutral-300"
                        }`}
                      >
                        {checked && <Check size={11} strokeWidth={3} />}
                      </span>

                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-medium text-neutral-900">
                            {addOn.name}
                          </span>
                          <span className="shrink-0 text-sm font-medium text-gold-700">
                            +{formatNaira(addOn.price)}
                          </span>
                        </span>
                        {addOn.description && (
                          <span className="mt-0.5 block text-xs leading-relaxed text-neutral-500">
                            {addOn.description}
                          </span>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            add({
              lineId: buildLineId(product._id, selectedKeys),
              productId: product._id,
              name: product.name,
              slug: product.slug,
              basePrice: product.price,
              price: unitPrice,
              addOns: selectedAddOns.map((addOn) => ({
                key: addOn._key,
                name: addOn.name,
                price: addOn.price,
              })),
              image: images[0] ?? null,
            });
            close();
          }}
          disabled={product.stock <= 0}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {product.stock > 0 ? `Add to Cart` : "Sold out"}
        </button>

        <Link
          href={`/shop/product/${product.slug}`}
          onClick={close}
          className="mt-3 inline-flex items-center justify-center gap-1 text-sm font-medium text-neutral-600 underline underline-offset-4 transition-colors hover:text-gold-700"
        >
          View full details
          <ArrowRight size={14} />
        </Link>
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
