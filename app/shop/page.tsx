import ShopNavbar from "@/app/components/shop/navbar";
import Hero from "@/app/components/shop/hero";
import FeaturedCollections from "@/app/components/shop/featured-collections";
import LifestyleBanners from "@/app/components/shop/lifestyle-banners";
import CatalogSection from "@/app/components/shop/catalog/catalog-section";
import PromoBanner from "@/app/components/shop/promo-banner";
import ShopFooter from "@/app/components/shop/footer";

export default function ShopPage() {
  return (
    <>
      <ShopNavbar />
      <main>
        <Hero />
        <FeaturedCollections />
        <LifestyleBanners />
        <CatalogSection />
        <PromoBanner />
      </main>
      <ShopFooter />
    </>
  );
}
