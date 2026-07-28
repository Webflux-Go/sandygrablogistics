import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrderWithDetails } from "@/lib/orders/queries";
import { formatNaira } from "@/lib/format";
import { StatusBadge } from "../../status-badge";
import StatusForm from "./status-form";

export const dynamic = "force-dynamic";

const EMAIL_LABELS: Record<string, string> = {
  confirmation: "Order confirmation",
  status_update: "Status update",
  admin_alert: "New-order alert",
};

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderWithDetails(id);

  if (!order) notFound();

  return (
    <>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
          {order.shippingName ?? "Guest order"}
        </h1>
        <StatusBadge status={order.status} kind="payment" />
        <StatusBadge status={order.fulfillmentStatus} kind="fulfillment" />
      </div>
      <p className="mt-1 text-sm text-neutral-500">
        Placed {new Date(order.createdAt).toLocaleString()}
        {order.paystackReference && ` · ${order.paystackReference}`}
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-5">
          <Panel title="Items">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-neutral-100">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 text-neutral-900">
                      {item.productName}
                      <span className="text-neutral-400"> × {item.quantity}</span>
                    </td>
                    <td className="py-3 text-right text-neutral-900">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="pt-4 text-sm font-semibold text-neutral-900">Total</td>
                  <td className="pt-4 text-right text-sm font-semibold text-neutral-900">
                    {formatNaira(order.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Panel>

          <Panel title="Email history">
            {order.emails.length === 0 ? (
              <p className="text-sm text-neutral-400">Nothing sent yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {order.emails.map((email) => (
                  <li key={email.id} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-neutral-900">
                        {EMAIL_LABELS[email.kind] ?? email.kind}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {email.subject} → {email.recipient}
                      </p>
                      {email.error && (
                        <p className="mt-1 text-xs text-red-600">{email.error}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <span
                        className={`text-xs font-medium ${
                          email.status === "sent" ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {email.status}
                      </span>
                      <p className="text-xs text-neutral-400">
                        {new Date(email.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-5">
          <Panel title="Fulfillment">
            <StatusForm orderId={order.id} current={order.fulfillmentStatus} />
          </Panel>

          <Panel title="Customer">
            <dl className="flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-neutral-400">Email</dt>
                <dd className="text-neutral-900">{order.email}</dd>
              </div>
              {order.shippingPhone && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-neutral-400">Phone</dt>
                  <dd className="text-neutral-900">{order.shippingPhone}</dd>
                </div>
              )}
              {order.shippingAddress && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-neutral-400">
                    Delivery address
                  </dt>
                  <dd className="whitespace-pre-line text-neutral-900">
                    {order.shippingAddress}
                  </dd>
                </div>
              )}
            </dl>
          </Panel>
        </div>
      </div>
    </>
  );
}
