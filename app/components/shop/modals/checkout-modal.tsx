"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useModal } from "@/hooks/use-modal";
import { createCheckoutSession } from "@/actions/checkout";
import { formatNaira } from "@/lib/format";

export default function CheckoutModal() {
  const { items, subtotal } = useCart();
  const { close } = useModal();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", name: "", phone: "", address: "" });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createCheckoutSession(items, form);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result?.authorizationUrl) {
        window.location.href = result.authorizationUrl;
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={close}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-neutral-900">Checkout</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="text-neutral-400 hover:text-neutral-900"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-1 text-sm text-neutral-500">
          {items.length} item{items.length === 1 ? "" : "s"} · {formatNaira(subtotal)}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
          />
          <input
            required
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
          />
          <input
            required
            type="tel"
            placeholder="Phone number"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
          />
          <textarea
            required
            placeholder="Delivery address"
            rows={3}
            value={form.address}
            onChange={(event) => setForm({ ...form, address: event.target.value })}
            className="resize-none rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isPending || items.length === 0}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {isPending ? "Redirecting to Paystack…" : `Pay ${formatNaira(subtotal)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
