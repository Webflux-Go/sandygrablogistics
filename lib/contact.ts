// Local number 07026805260 → international E.164 without the leading 0 or "+", which is the
// format wa.me requires.
export const WHATSAPP_NUMBER = "2347026805260";

export const WHATSAPP_QUOTE_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Sandygrabs, I'd like to get a quote."
)}`;

// For buttons labelled "WhatsApp Us" rather than "Get a Quote" — prefilling a pricing request
// under a general contact button would put words in the visitor's mouth.
export const WHATSAPP_CHAT_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Sandygrabs, I'd like to know more about your services."
)}`;

// TODO(sandygrabs): confirm this mailbox exists — assumed from the sandygrabslogistics.com domain.
export const SUPPORT_EMAIL = "support@sandygrabslogistics.com";

/**
 * Error-page "email us" link. The error digest goes in the body so support can match the report
 * to the server log without asking the customer to describe what they saw.
 */
export function supportMailtoUrl(digest?: string) {
  const subject = digest
    ? `Website error (ref ${digest})`
    : "Website error report";

  const body = digest
    ? `Hi Sandygrabs,\n\nI hit an error on your website.\n\nError reference: ${digest}\n\nWhat I was doing:\n`
    : `Hi Sandygrabs,\n\nI hit an error on your website.\n\nWhat I was doing:\n`;

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
