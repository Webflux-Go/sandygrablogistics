// Local number 07026805260 → international E.164 without the leading 0 or "+", which is the
// format wa.me requires.
export const WHATSAPP_NUMBER = "2348121487539";

export const WHATSAPP_QUOTE_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Sandygrabs, I'd like to get a quote."
)}`;

// For buttons labelled "WhatsApp Us" rather than "Get a Quote" — prefilling a pricing request
// under a general contact button would put words in the visitor's mouth.
export const WHATSAPP_CHAT_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Sandygrabs, I'd like to know more about your services."
)}`;

// TODO(sandygrabs): confirm this mailbox exists — assumed from the sandygrabslogistics.com domain.
export const SUPPORT_EMAIL = "Sandygrabslogistics@gmail.com";

/**
 * Shared by both footers so the two can't drift apart.
 *
 * The share URLs these came from carried per-share tracking parameters (`utm_source=share_via`,
 * TikTok's `_r`/`_t`); those are stripped here — they identify the share session, not the
 * profile, and don't belong in a link served to every visitor.
 */
export const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/sandygrabs_logistics",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@sandygrabslogistics",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sandygrabs-logistics-sandygrabs-686163232",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/sandygrabs_logistics",
  },
  {
    label: "X",
    href: "https://www.x.com/sandygrabs_logistics",
  },
] as const;

export interface Location {
  label: string;
  /** Short qualifier under the label — what this address is for. */
  kind: string;
  lines: string[];
  mapUrl: string;
}

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
}

const LAGOS_ADDRESS =
  "No 7, Jaiyeola Ajatta Street, off Ekundayo Adetunji Babaniji Street, Opposite Green Point Hotel, off Fatai Irawo Street, Airport Junction, Ajao Estate, Lagos";

const TURKEY_ADDRESS =
  "İbibik Sokak No 2, Hürriyet Mahallesi, Kıraç, Esenyurt, Istanbul, Turkey";

export const LOCATIONS: Location[] = [
  {
    label: "Lagos, Nigeria",
    kind: "Warehouse & pickup",
    // Broken at the street boundaries so this long address stays readable on a phone rather
    // than reflowing into an unreadable block.
    lines: [
      "No 7, Jaiyeola Ajatta Street,",
      "off Ekundayo Adetunji Babaniji Street,",
      "Opposite Green Point Hotel,",
      "off Fatai Irawo Street, Airport Junction,",
      "Ajao Estate, Lagos.",
    ],
    mapUrl: mapsUrl(LAGOS_ADDRESS),
  },
  {
    label: "Istanbul, Turkey",
    kind: "Sourcing office",
    lines: [
      "İbibik Sokak No 2,",
      "Hürriyet Mahallesi, Kıraç,",
      "Esenyurt, Istanbul, Turkey.",
    ],
    mapUrl: mapsUrl(TURKEY_ADDRESS),
  },
];

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
