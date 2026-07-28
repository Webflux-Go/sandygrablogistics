import Link from "next/link";
import { listOrders, getOrderStats } from "@/lib/orders/queries";
import { formatNaira } from "@/lib/format";
import type { PaymentStatus } from "@/types/order";
import { StatusBadge } from "./status-badge";

export const dynamic = "force-dynamic";

const FILTERS: { label: string; value?: PaymentStatus }[] = [
  { label: "All" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

const PAYMENT_STATUSES: PaymentStatus[] = ["paid", "pending", "failed", "cancelled"];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter = PAYMENT_STATUSES.find((s) => s === status);

  const [orders, stats] = await Promise.all([
    listOrders(activeFilter),
    getOrderStats(),
  ]);

  return (
    <>
      <h1 className="text-2xl font-medium tracking-tight text-neutral-900">Orders</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Revenue" value={formatNaira(stats.totalRevenue)} />
        <Stat label="Paid orders" value={String(stats.paidCount)} />
        <Stat label="Pending" value={String(stats.pendingCount)} />
        <Stat label="Awaiting fulfillment" value={String(stats.unfulfilledCount)} />
      </div>

      <div className="mt-8 flex gap-2">
        {FILTERS.map((filter) => {
          const isActive = filter.value === activeFilter;
          return (
            <Link
              key={filter.label}
              href={filter.value ? `/admin?status=${filter.value}` : "/admin"}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-400">
            <tr>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Payment</th>
              <th className="px-5 py-3 font-medium">Fulfillment</th>
              <th className="px-5 py-3 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-neutral-50">
                <td className="px-5 py-4">
                  <Link href={`/admin/orders/${order.id}`} className="block">
                    <span className="font-medium text-neutral-900">
                      {order.shippingName ?? "Guest"}
                    </span>
                    <span className="block text-xs text-neutral-500">{order.email}</span>
                  </Link>
                </td>
                <td className="px-5 py-4 text-neutral-900">
                  {formatNaira(order.totalAmount)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={order.status} kind="payment" />
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={order.fulfillmentStatus} kind="fulfillment" />
                </td>
                <td className="px-5 py-4 text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-neutral-400">
            No orders yet.
          </p>
        )}
      </div>
    </>
  );
}
