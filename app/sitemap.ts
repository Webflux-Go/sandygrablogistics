import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sanity/queries";
import { SITE_ORIGIN } from "@/lib/site-url";

// Re-generated hourly rather than pinned at build time, so products added in the Studio appear
// to crawlers without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, categories } = await getSitemapEntries();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_ORIGIN, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_ORIGIN}/shop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_ORIGIN}/shop?category=${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_ORIGIN}/shop/product/${product.slug}`,
    // Sanity's _updatedAt is the real signal of when the page's content last changed.
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
