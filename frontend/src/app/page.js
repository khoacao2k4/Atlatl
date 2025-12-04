import HomeTeam from "./components/homepage/HomeTeam";
import HomeFootnote from "./components/homepage/ProcessTable";
import { getHomepageContent } from "@/lib/strapi";
import AboutUs from "./components/homepage/AboutUs";
import Hero from "./components/homepage/Hero";
import CtaSection from "./components/homepage/CtaSection";

export default async function Home() {
  const homepageContent = await getHomepageContent();
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24">
        <Hero media={homepageContent?.heroMedia} />
      </section>

      {/* About Us Section */}
      <section className="font-sans bg-dark-blue py-16 md:py-24 text-white">
        <AboutUs media={homepageContent?.aboutUsMedia} />
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-b from-dark-blue from-55% to-white to-55% text-dark-blue">
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
