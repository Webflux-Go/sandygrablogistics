"use client";

import { useState, useTransition } from "react";
import { Lock, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useModal } from "@/hooks/use-modal";
import { createCheckoutSession } from "@/actions/checkout";
import { formatNaira } from "@/lib/format";
import ModalShell, { useModalClose } from "../../motion/modal-shell";

const FIELD_CLASS =
  "w-full rounded-xl border border-neutral-200 px-4 py-3 text-base text-neutral-900 transition-colors placeholder:text-neutral-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-wide text-neutral-500"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function CheckoutPanel({ defaultEmail }: { defaultEmail: string }) {
  const { items, subtotal } = useCart();
  const close = useModalClose();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: defaultEmail,
    name: "",
    phone: "",
    address: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createCheckoutSession(items, form);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.authorizationUrl) {
        // A real external navigation — Paystack's hosted page is off-origin, so router.push
        // would not work here.
        window.location.href = result.authorizationUrl;
      }
    });
  };

  return (
    <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5 sm:px-8">
        <div>
          <h2 id="checkout-title" className="text-xl font-medium text-neutral-900">
            Checkout
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            Where should we send your order?
          </p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="shrink-0 text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <X size={22} />
        </button>
      </div>

      {/* The whole body scrolls, so a long cart or a small laptop screen can't push the pay
          button out of reach. */}
      <div className="grid flex-1 grid-cols-1 gap-8 overflow-y-auto p-6 sm:p-8 md:grid-cols-[1.3fr_1fr]">
        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <Field label="Email address" htmlFor="checkout-email">
            <input
              id="checkout-email"
              required
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className={FIELD_CLASS}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="checkout-name">
              <input
                id="checkout-name"
                required
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className={FIELD_CLASS}
              />
            </Field>

            <Field label="Phone number" htmlFor="checkout-phone">
              <input
                id="checkout-phone"
                required
                type="tel"
                autoComplete="tel"
                placeholder="0800 000 0000"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className={FIELD_CLASS}
              />
            </Field>
          </div>

          <Field label="Delivery address" htmlFor="checkout-address">
            <textarea
              id="checkout-address"
              required
              rows={5}
              autoComplete="street-address"
              placeholder="Street, city, state — plus any landmark that helps the driver find you."
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              className={`${FIELD_CLASS} resize-none leading-relaxed`}
            />
          </Field>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
        </form>

        <aside className="flex flex-col rounded-2xl bg-neutral-50 p-5">
          <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Order summary
          </h3>

          <ul className="mt-4 flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.lineId} className="flex justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-neutral-900">
                    {item.name}
                  </p>
                  {item.addOns.map((addOn) => (
                    <p key={addOn.key} className="truncate text-xs text-neutral-500">
                      + {addOn.name}
                    </p>
                  ))}
                  <p className="text-xs text-neutral-400">Qty {item.quantity}</p>
                </div>
                <p className="shrink-0 text-neutral-700">
                  {formatNaira(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-baseline justify-between border-t border-neutral-200 pt-4">
            <span className="text-sm font-medium text-neutral-900">Total</span>
            <span className="text-lg font-semibold text-neutral-900">
              {formatNaira(subtotal)}
            </span>
          </div>
        </aside>
      </div>

      {/* Pinned outside the scroll area so the pay button is always visible. */}
      <div className="border-t border-neutral-200 px-6 py-5 sm:px-8">
        <button
          type="submit"
          form="checkout-form"
          disabled={isPending || items.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-4 text-base font-medium text-neutral-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Lock size={16} />
          {isPending
            ? "Redirecting to Paystack…"
            : `Pay ${formatNaira(subtotal)}`}
        </button>
        <p className="mt-3 text-center text-xs text-neutral-500">
          You&apos;ll be redirected to Paystack to complete payment securely.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutModal({ email }: { email?: string | null }) {
  const { close } = useModal();

  return (
    <ModalShell onClose={close} labelledBy="checkout-title">
      <CheckoutPanel defaultEmail={email ?? ""} />
    </ModalShell>
  );
}
