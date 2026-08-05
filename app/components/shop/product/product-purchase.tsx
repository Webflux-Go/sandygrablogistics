"use client";

import { useState } from "react";
import { Check, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useModal } from "@/hooks/use-modal";
import { useWishlist } from "@/hooks/use-wishlist";
import { formatNaira } from "@/lib/format";
import { buildLineId } from "@/types/cart";
import type { Product } from "@/lib/sanity/types";

export default function ProductPurchase({
  product,
  image,
}: {
  product: Product;
  /** Thumbnail stored on the cart line. */
  image: string | null;
}) {
  const { add } = useCart();
  const { open } = useModal();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const addOns = product.addOns ?? [];
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const selectedAddOns = addOns.filter((addOn) => selectedKeys.includes(addOn._key));
  const addOnTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const unitPrice = product.price + addOnTotal;
  const wishlisted = isWishlisted(product._id);

  const toggleAddOn = (key: string) =>
    setSelectedKeys((keys) =>
      keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]
    );

  const handleAdd = () => {
    add(
      {
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
        image,
      },
      quantity
    );
    open("cart");
  };

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <p className="text-2xl font-semibold text-neutral-900">
          {formatNaira(unitPrice)}
        </p>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <p className="text-base text-neutral-400 line-through">
            {formatNaira(product.compareAtPrice)}
          </p>
        )}
      </div>

      {addOnTotal > 0 && (
        <p className="mt-1 text-sm text-neutral-500">
          {formatNaira(product.price)} base + {formatNaira(addOnTotal)} extras
        </p>
      )}

      {addOns.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Add extras
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {addOns.map((addOn) => {
              const checked = selectedKeys.includes(addOn._key);

              return (
                <li key={addOn._key}>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
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

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-4 rounded-full border border-neutral-200 px-3 py-2.5">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            className="text-neutral-500 transition-colors hover:text-gold-700 disabled:opacity-30"
          >
            <Minus size={14} />
          </button>
          <span className="min-w-4 text-center text-sm font-medium text-neutral-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className="text-neutral-500 transition-colors hover:text-gold-700"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={product.stock <= 0}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ShoppingBag size={16} />
          {product.stock > 0
            ? `Add to Cart`
            : "Sold out"}
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(product._id)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-neutral-200 transition-colors ${
            wishlisted
              ? "text-gold-600"
              : "text-neutral-500 hover:border-gold-400 hover:text-gold-600"
          }`}
        >
          <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="mt-4 text-xs text-neutral-500">
        {product.stock > 0
          ? `${product.stock} in stock`
          : "Currently unavailable — check back soon."}
      </p>
    </div>
  );
}
