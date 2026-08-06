import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

const DEFAULT_FROM = "noreply@sandygrabslogistics.com";

/**
 * Resend accepts `email@example.com` or `Name <email@example.com>` and rejects anything else at
 * send time — which surfaces as a failed email long after the bad value was set, with the cause
 * recorded only in the order's email log. Validating here turns that into a startup-time warning
 * naming the offending value.
 *
 * The specific trap: Resend's onboarding docs show `<anything>@your-domain.resend.app`, where
 * `<anything>` is a placeholder for a local part you choose. Pasted literally, the angle brackets
 * make Resend read it as the `Name <email>` form and reject it.
 */
function resolveFrom(): string {
  const configured = process.env.EMAIL_FROM?.trim();
  if (!configured) return DEFAULT_FROM;

  const plainAddress = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
  const namedAddress = /^[^<>]+<[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+>$/;

  if (plainAddress.test(configured) || namedAddress.test(configured)) {
    return configured;
  }

  console.warn(
    `[email] EMAIL_FROM is not a valid sender ("${configured}"). Expected ` +
      `"email@example.com" or "Name <email@example.com>". Falling back to ${DEFAULT_FROM}.`
  );
  return DEFAULT_FROM;
}

export const emailFrom = resolveFrom();
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
