import ShopNavbar from "@/app/components/shop/navbar";
import Hero from "@/app/components/shop/hero";
import FeaturedCollections from "@/app/components/shop/featured-collections";
import LifestyleBanners from "@/app/components/shop/lifestyle-banners";
import HowItWorks from "@/app/components/shop/how-it-works";
import CatalogSection from "@/app/components/shop/catalog/catalog-section";
import PromoBanner from "@/app/components/shop/promo-banner";
import Locations from "@/app/components/locations";
import ShopFooter from "@/app/components/shop/footer";
import { getCurrentUser } from "@/lib/auth/user";
import { getCategories } from "@/lib/sanity/queries";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}): Promise<Metadata> {
  const { category, search } = await searchParams;

  // A search results page is thin, duplicate-ish content — indexing it competes with the real
  // category pages for the same terms, so it's excluded while staying crawlable for its links.
  if (search) {
    return {
      title: `Search: ${search}`,
      robots: { index: false, follow: true },
    };
  }

  if (category) {
    const categories = await getCategories();
    const match = categories.find((item) => item.slug === category);

    if (match) {
      return {
        title: `${match.name} from Turkey`,
        description: `Shop ${match.name.toLowerCase()} sourced direct from Turkish factories by Sandygrabs. Factory prices, inspection before shipping, and delivery to Nigeria and worldwide.`,
        alternates: { canonical: `/shop?category=${category}` },
      };
    }
  }

  return {
    title: "Shop Turkish Furniture, Doors & Lighting",
    description:
      "Browse Sandygrabs SourceHub — authentic Turkish furniture, bedroom sets, dining, doors and lighting at factory prices, inspected before shipping and delivered worldwide.",
    alternates: { canonical: "/shop" },
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const [{ category, search }, user] = await Promise.all([
    searchParams,
    getCurrentUser(),
  ]);

  // With a category or search active the visitor is browsing, not landing — drop the marketing
  // sections so the results are the whole page.
  const isBrowsing = Boolean(category || search);

  return (
    <>
      <ShopNavbar email={user?.email ?? null} />
      <main>
        {isBrowsing ? (
          <CatalogSection category={category} search={search} />
        ) : (
          <>
            <Hero />
            <FeaturedCollections />
            <LifestyleBanners />
            <HowItWorks />
            <CatalogSection />
            <Locations />
            <PromoBanner />
          </>
        )}
      </main>
      <ShopFooter />
    </>
  );
}
