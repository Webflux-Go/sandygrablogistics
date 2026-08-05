import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin dashboard and the API surface have nothing to index, and order-confirmation
      // URLs carry a payment reference that should never end up in a search result.
      disallow: ["/admin", "/api/", "/shop/order-confirmation"],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
