// Local number 07026805260 → international E.164 without the leading 0 or "+", which is the
// format wa.me requires.
export const WHATSAPP_NUMBER = "2347026805260";

export const WHATSAPP_QUOTE_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Sandygrabs, I'd like to get a quote."
)}`;
