import HomeTeam from "./components/HomeTeam";
import HomeFootnote from "./components/HomeFootnote";
import { getHomepageContent } from "@/lib/strapi";
import AboutUs from "./components/homepage/AboutUs";
import Hero from "./components/homepage/Hero";
import CtaSection from "./components/homepage/CtaSection";

export default async function Home() {
  const homepageContent = await getHomepageContent();
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-light-blue py-16 md:py-24">
        <Hero media={homepageContent?.heroMedia} />
      </section>

      {/* About Us Section */}
      <section className="font-sans bg-dark-blue py-16 md:py-24 text-white">
        <AboutUs media={homepageContent?.aboutUsMedia} />
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-b from-dark-blue from-50% to-white to-50% text-text-light-blue">
        <HomeTeam />
      </section>

      <section className="py-16 md:py-24 text-white">
        <HomeFootnote />
      </section>

      <section className="bg-darker-light-blue">
        <CtaSection />
        
      </section>
    </div>
  );
}
