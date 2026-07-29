import ShopNavbar from "@/app/components/shop/navbar";
import Hero from "@/app/components/shop/hero";
import FeaturedCollections from "@/app/components/shop/featured-collections";
import LifestyleBanners from "@/app/components/shop/lifestyle-banners";
import HowItWorks from "@/app/components/shop/how-it-works";
import CatalogSection from "@/app/components/shop/catalog/catalog-section";
import PromoBanner from "@/app/components/shop/promo-banner";
import ShopFooter from "@/app/components/shop/footer";
import { getCurrentUser } from "@/lib/auth/user";

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
            <PromoBanner />
          </>
        )}
      </main>
      <ShopFooter />
    </>
  );
}
