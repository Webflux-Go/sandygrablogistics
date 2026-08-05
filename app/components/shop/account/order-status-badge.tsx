import type { FulfillmentStatus, PaymentStatus } from "@/types/order";

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  paid: "bg-green-50 text-green-700 ring-green-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  failed: "bg-red-50 text-red-700 ring-red-600/20",
  cancelled: "bg-neutral-100 text-neutral-600 ring-neutral-500/20",
};

const FULFILLMENT_STYLES: Record<FulfillmentStatus, string> = {
  unfulfilled: "bg-neutral-100 text-neutral-600 ring-neutral-500/20",
  processing: "bg-blue-50 text-blue-700 ring-blue-600/20",
  shipped: "bg-gold-50 text-gold-700 ring-gold-600/20",
  delivered: "bg-green-50 text-green-700 ring-green-600/20",
  cancelled: "bg-neutral-100 text-neutral-600 ring-neutral-500/20",
  refunded: "bg-purple-50 text-purple-700 ring-purple-600/20",
};

// Customer-facing wording. "unfulfilled" is internal jargon that means nothing to a shopper.
const FULFILLMENT_LABELS: Record<FulfillmentStatus, string> = {
  unfulfilled: "Preparing",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Awaiting payment",
  failed: "Payment failed",
  cancelled: "Cancelled",
};

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <Badge className={PAYMENT_STYLES[status]}>{PAYMENT_LABELS[status]}</Badge>;
}

export function FulfillmentBadge({ status }: { status: FulfillmentStatus }) {
  return (
    <Badge className={FULFILLMENT_STYLES[status]}>{FULFILLMENT_LABELS[status]}</Badge>
  );
}
