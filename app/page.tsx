import type { Metadata } from "next";
import Hero from "./components/logistics/hero";
import Advantages from "./components/logistics/advantages";
import Services from "./components/logistics/services";
import Locations from "./components/locations";
import Founder from "./components/logistics/founder";
import Gallery from "./components/logistics/gallery";
import WhyUs from "./components/logistics/why-us";
import Testimonials from "./components/logistics/testimonials";
import Faq from "./components/logistics/faq";
import Cta from "./components/logistics/cta";
import Footer from "./components/logistics/footer";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
  FaqJsonLd,
} from "./components/seo/json-ld";
import { FAQS } from "@/lib/faqs";

export const metadata: Metadata = {
  // Overrides the template so the homepage isn't titled "Sandygrabs — Sandygrabs".
  title: {
    absolute:
      "Sandygrabs — Import Turkish Furniture & Goods to Nigeria | Freight & Logistics",
  },
  description:
    "Source authentic Turkish furniture, doors and lighting at factory prices. Air freight in 4–7 days, sea freight in 45 days, factory inspection before shipping, and door-to-door delivery from Istanbul to Lagos and worldwide.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <FaqJsonLd faqs={FAQS} />

      <main>
        <Hero />
        <Advantages />
        <Services />
        <Founder />
        <Gallery />
        <WhyUs />
        <Testimonials />
        <Locations />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
