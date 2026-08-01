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

export default function Home() {
  return (
    <>
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
