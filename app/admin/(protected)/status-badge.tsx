import type { FulfillmentStatus, PaymentStatus } from "@/types/order";

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-neutral-100 text-neutral-500",
};

const FULFILLMENT_STYLES: Record<FulfillmentStatus, string> = {
  unfulfilled: "bg-neutral-100 text-neutral-600",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-neutral-100 text-neutral-500",
  refunded: "bg-orange-50 text-orange-700",
};

export function StatusBadge({
  status,
  kind,
}: {
  status: PaymentStatus | FulfillmentStatus;
  kind: "payment" | "fulfillment";
}) {
  const styles =
    kind === "payment"
      ? PAYMENT_STYLES[status as PaymentStatus]
      : FULFILLMENT_STYLES[status as FulfillmentStatus];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles}`}
    >
      {status}
    </span>
  );
}
