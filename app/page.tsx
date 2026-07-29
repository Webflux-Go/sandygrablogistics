import Hero from "./components/logistics/hero";
import Stats from "./components/logistics/stats";
import Services from "./components/logistics/services";
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
        <Stats />
        <Services />
        <Founder />
        <Gallery />
        <WhyUs />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
