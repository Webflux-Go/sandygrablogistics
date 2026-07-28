import "server-only";
import { getResendClient, emailFrom, adminAlertEmail } from "./client";
import {
  orderConfirmationEmail,
  statusUpdateEmail,
  newOrderAlertEmail,
  type EmailContent,
} from "./templates";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { OrderItemRecord, OrderRecord, OrderEmailKind } from "@/types/order";

// Sends and logs the attempt to order_emails. Never throws: an email outage must not fail a
// payment webhook or block an admin status update.
async function send(
  orderId: string,
  kind: OrderEmailKind,
  recipient: string,
  content: EmailContent
): Promise<void> {
  const resend = getResendClient();
  const supabase = getSupabaseAdminClient();

  if (!resend || !recipient) {
    console.warn(`[email] skipping ${kind}: email not configured`);
    return;
  }

  let status: "sent" | "failed" = "sent";
  let errorMessage: string | null = null;

  try {
    const { error } = await resend.emails.send({
      from: emailFrom,
      to: recipient,
      subject: content.subject,
      html: content.html,
    });
    if (error) {
      status = "failed";
      errorMessage = error.message;
      console.warn(`[email] ${kind} send failed:`, error);
    }
  } catch (error) {
    status = "failed";
    errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`[email] ${kind} threw:`, error);
  }

  if (!supabase) return;

  // A duplicate-key rejection here is expected and harmless: the partial unique index on
  // (order_id) where kind='confirmation' is what makes webhook retries non-duplicating.
  const { error: logError } = await supabase.from("order_emails").insert({
    order_id: orderId,
    kind,
    recipient,
    subject: content.subject,
    status,
    error: errorMessage,
  });

  if (logError) console.warn(`[email] failed to log ${kind}:`, logError);
}

export async function sendOrderConfirmation(order: OrderRecord, items: OrderItemRecord[]) {
  await send(order.id, "confirmation", order.email, orderConfirmationEmail(order, items));
}

export async function sendStatusUpdate(order: OrderRecord) {
  await send(order.id, "status_update", order.email, statusUpdateEmail(order));
}

export async function sendNewOrderAlert(order: OrderRecord, items: OrderItemRecord[]) {
  if (!adminAlertEmail) return;
  await send(order.id, "admin_alert", adminAlertEmail, newOrderAlertEmail(order, items));
}
