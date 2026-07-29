import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { getOrderByReference } from "@/lib/orders/queries";
import { formatNaira } from "@/lib/format";
import OrderConfirmationClient from "./order-confirmation-client";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; status?: string }>;
}) {
  const { reference, status } = await searchParams;

  // Looked up by an unguessable reference token before any user session necessarily exists
  // (guest checkout) — same reasoning as actions/checkout.ts and the callback route.
  const order = reference ? await getOrderByReference(reference) : null;

  const orderStatus = order?.status ?? (status === "error" ? "failed" : "unknown");
  const success = orderStatus === "paid";

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center gap-4 px-4 py-16 text-center">
      {success ? (
        <CheckCircle2 size={48} className="text-emerald-500" />
      ) : (
        <XCircle size={48} className="text-neutral-400" />
      )}
      <h1 className="text-2xl font-medium text-neutral-900">
        {success
          ? "Payment successful"
          : orderStatus === "pending"
            ? "Payment processing"
            : "We couldn't confirm this order"}
      </h1>
      <p className="text-sm text-neutral-500">
        {success
          ? "Thank you for your order — a confirmation has been sent to your email."
          : orderStatus === "pending"
            ? "We're still confirming your payment with Paystack. This can take a moment — refresh in a few seconds."
            : "If you were charged, contact support with your payment reference and we'll sort it out."}
      </p>

      {order && order.items.length > 0 && (
        <div className="mt-4 w-full rounded-2xl border border-neutral-200 p-5 text-left">
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
                <td className="pt-4 font-semibold text-neutral-900">Total</td>
                <td className="pt-4 text-right font-semibold text-neutral-900">
                  {formatNaira(order.totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {reference && <p className="text-xs text-neutral-400">Reference: {reference}</p>}
      <Link
        href="/shop"
        className="mt-4 inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold-400"
      >
        Back to shop
      </Link>
      {success && <OrderConfirmationClient />}
    </main>
  );
}
