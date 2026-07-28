import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { markOrderPaid } from "@/lib/orders/mark-paid";

const secretKey = process.env.PAYSTACK_SECRET_KEY;

// POST: Paystack's server-to-server event push — the authoritative order-status writer. Must
// read the raw body before any parsing, since the HMAC is computed over the exact bytes sent.
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!secretKey || !signature) {
    return NextResponse.json({ error: "Not configured" }, { status: 400 });
  }

  const expectedSignature = createHmac("sha512", secretKey).update(rawBody).digest("hex");
  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success" && event.data?.reference) {
    await markOrderPaid(event.data.reference);
  }

  return NextResponse.json({ received: true });
}
