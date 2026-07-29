"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateFulfillmentStatus } from "@/actions/admin";
import { FULFILLMENT_STATUSES, type FulfillmentStatus } from "@/types/order";

export default function StatusForm({
  orderId,
  current,
}: {
  orderId: string;
  current: FulfillmentStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<FulfillmentStatus>(current);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateFulfillmentStatus(orderId, status);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value as FulfillmentStatus)}
        className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm capitalize focus:border-neutral-900 focus:outline-none"
      >
        {FULFILLMENT_STATUSES.map((value) => (
          <option key={value} value={value} className="capitalize">
            {value}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending || status === current}
        className="inline-flex items-center justify-center rounded-full bg-gold-500 px-5 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold-400 disabled:opacity-40"
      >
        {isPending ? "Updating…" : "Update & notify customer"}
      </button>
      <p className="text-xs text-neutral-400">
        Changing the status emails the customer automatically.
      </p>
    </form>
  );
}
