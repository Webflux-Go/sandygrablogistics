import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/paystack/client";
import { markOrderPaid } from "@/lib/orders/mark-paid";

export const dynamic = "force-dynamic";

// GET: Paystack redirects the browser here after hosted checkout. The webhook is the reliable
// path (a browser redirect can be interrupted or skipped), but this one usually arrives first —
// markOrderPaid is race-safe, so whichever gets here first transitions the order and sends the
// confirmation, and the loser is a no-op.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(`${origin}/shop/order-confirmation?status=error`);
  }

  try {
    const transaction = await verifyTransaction(reference);
    if (transaction.status === "success") {
      await markOrderPaid(reference);
    }
  } catch (error) {
    console.warn("[paystack] callback verification failed:", error);
  }

  return NextResponse.redirect(
    `${origin}/shop/order-confirmation?reference=${encodeURIComponent(reference)}`
  );
}
