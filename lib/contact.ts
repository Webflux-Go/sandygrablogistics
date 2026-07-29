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
