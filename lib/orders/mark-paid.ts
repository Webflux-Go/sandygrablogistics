import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getOrderWithDetails } from "./queries";
import { sendOrderConfirmation, sendNewOrderAlert } from "@/lib/email/notifications";

// Both the Paystack webhook and the browser-redirect callback can arrive first, and either may
// arrive more than once. The conditional pending → paid update is the race winner's flag: only
// the caller whose UPDATE actually matched a row gets a non-null result and sends the emails,
// so the customer is emailed exactly once regardless of ordering or retries.
export async function markOrderPaid(reference: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  const { data: updated, error } = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("paystack_reference", reference)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    console.warn("[orders] markOrderPaid failed:", error);
    return;
  }
  if (!updated) return; // Already paid — another path handled it.

  const order = await getOrderWithDetails(updated.id);
  if (!order) return;

  await sendOrderConfirmation(order, order.items);
  await sendNewOrderAlert(order, order.items);
}
