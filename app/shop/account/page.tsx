import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/user";
import { getOrdersForUser, getItemsForOrders } from "@/lib/orders/queries";
import { formatNaira } from "@/lib/format";
import {
  PaymentBadge,
  FulfillmentBadge,
} from "@/app/components/shop/account/order-status-badge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AccountOrdersPage() {
  // The layout already redirected signed-out visitors; this is just to read the identity.
  const user = await getCurrentUser();
  if (!user) return null;

  const orders = await getOrdersForUser({
    userId: user.id,
    email: user.email ?? "",
  });

  // One batched query for every order's line items, rather than one query per order.
  const itemsByOrder = await getItemsForOrders(orders.map((order) => order.id));

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-neutral-300 py-20 text-center">
        <PackageSearch size={32} strokeWidth={1.5} className="text-neutral-300" />
        <p className="text-sm text-neutral-500">You haven&apos;t placed any orders yet.</p>
        <Link
          href="/shop"
          className="mt-2 inline-flex items-center rounded-full bg-gold-500 px-5 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold-400"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-5">
      {orders.map((order) => {
        const items = itemsByOrder[order.id] ?? [];

        return (
          <li
            key={order.id}
            className="overflow-hidden rounded-3xl border border-neutral-200 bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-5 py-4">
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {formatDate(order.createdAt)}
                </p>
                {order.paystackReference && (
                  <p className="mt-0.5 font-mono text-xs text-neutral-400">
                    {order.paystackReference}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <PaymentBadge status={order.status} />
                {/* Fulfillment only means something once the money has arrived. */}
                {order.status === "paid" && (
                  <FulfillmentBadge status={order.fulfillmentStatus} />
                )}
              </div>
            </div>

            <div className="px-5 py-4">
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span className="text-neutral-700">
                      {item.productName}
                      <span className="text-neutral-400"> × {item.quantity}</span>
                    </span>
                    <span className="shrink-0 text-neutral-600">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="text-sm text-neutral-400">
                    Item details unavailable for this order.
                  </li>
                )}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                <span className="text-sm font-medium text-neutral-900">Total</span>
                <span className="text-base font-semibold text-neutral-900">
                  {formatNaira(order.totalAmount)}
                </span>
              </div>

              {order.shippingAddress && (
                <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                  Delivering to: {order.shippingAddress}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
