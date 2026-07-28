"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useModal } from "@/hooks/use-modal";
import { formatNaira } from "@/lib/format";

export default function CartDrawer() {
  const { items, remove, updateQuantity, subtotal } = useCart();
  const { close, open } = useModal();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={close}>
      <div
        className="flex h-full w-full max-w-md flex-col bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 p-5">
          <h2 className="text-lg font-medium text-neutral-900">Your Cart</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="text-neutral-400 hover:text-neutral-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-neutral-400">
              Your cart is empty.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                      <button
                        type="button"
                        onClick={() => remove(item.productId)}
                        aria-label={`Remove ${item.name}`}
                        className="text-neutral-400 hover:text-neutral-900"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-sm text-neutral-500">{formatNaira(item.price)}</p>
                    <div className="mt-1 inline-flex w-fit items-center gap-3 rounded-full border border-neutral-200 px-2 py-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="text-neutral-500 hover:text-neutral-900"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-medium text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="text-neutral-500 hover:text-neutral-900"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-neutral-200 p-5">
          <div className="flex items-center justify-between text-sm font-medium text-neutral-900">
            <span>Subtotal</span>
            <span>{formatNaira(subtotal)}</span>
          </div>
          <button
            type="button"
            onClick={() => open("checkout")}
            disabled={items.length === 0}
            className="mt-4 w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
