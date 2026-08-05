import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const emailFrom = process.env.EMAIL_FROM || "noreply@sandygrabslogistics.com";
export const adminAlertEmail = process.env.ADMIN_ALERT_EMAIL || "";

let client: Resend | null | undefined;

// Fails closed when unconfigured (same pattern as lib/supabase/admin.ts) so a missing API key
// degrades to "no email sent" rather than crashing a payment webhook.
export function getResendClient(): Resend | null {
  if (client !== undefined) return client;

  if (!apiKey || !emailFrom) {
    client = null;
    return client;
  }

  try {
    client = new Resend(apiKey);
  } catch (error) {
    console.warn("[email] failed to create Resend client:", error);
    client = null;
  }

  return client;
}
