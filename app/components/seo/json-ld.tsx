import { LOCATIONS, SOCIALS, SUPPORT_EMAIL, WHATSAPP_NUMBER } from "@/lib/contact";
import { SITE_ORIGIN } from "@/lib/site-url";

/**
 * Renders a JSON-LD block. Search engines read this to build rich results (business info,
 * product price/availability, breadcrumb trails) that plain HTML can't express.
 *
 * The payload is our own serialised object, not user input, so dangerouslySetInnerHTML is the
 * standard and safe way to emit it — React would otherwise escape the JSON into nonsense.
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Identity of the business itself — name, logo, socials, both physical locations. */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: "Sandygrabs",
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/sandygrabslogo.png`,
        description:
          "Turkish product sourcing, factory inspection and worldwide freight, with a warehouse in Lagos and a sourcing office in Istanbul.",
        email: SUPPORT_EMAIL,
        telephone: `+${WHATSAPP_NUMBER}`,
        sameAs: SOCIALS.map((social) => social.href),
        address: LOCATIONS.map((location) => ({
          "@type": "PostalAddress",
          streetAddress: location.lines.join(" ").replace(/\.$/, ""),
          addressLocality: location.label.split(",")[0]?.trim(),
          addressCountry: location.label.split(",")[1]?.trim(),
        })),
      }}
    />
  );
}

/** Marks the site as searchable, which is what enables a sitelinks search box. */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: "Sandygrabs",
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_ORIGIN}/shop?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  images,
  priceKobo,
  inStock,
  slug,
  category,
}: {
  name: string;
  description?: string | null;
  images: string[];
  priceKobo: number;
  inStock: boolean;
  slug: string;
  category?: string | null;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description: description ?? undefined,
        image: images,
        category: category ?? undefined,
        brand: { "@type": "Brand", name: "Sandygrabs" },
        offers: {
          "@type": "Offer",
          url: `${SITE_ORIGIN}/shop/product/${slug}`,
          priceCurrency: "NGN",
          // Prices are stored in kobo; schema.org expects major units.
          price: (priceKobo / 100).toFixed(2),
          availability: inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: { "@id": `${SITE_ORIGIN}/#organization` },
        },
      }}
    />
  );
}

/** Drives the expandable FAQ rich result in Google. */
export function FaqJsonLd({
  faqs,
}: {
  faqs: readonly { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${SITE_ORIGIN}${item.path}`,
        })),
      }}
    />
  );
}
