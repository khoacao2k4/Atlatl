import HomeTeam from "./components/homepage/HomeTeam";
import ProcessTable from "./components/homepage/ProcessTable";
import { getHomepageContent, getProcessContent } from "@/lib/strapi";
import AboutUs from "./components/homepage/AboutUs";
import Hero from "./components/homepage/Hero";
import CtaSection from "./components/homepage/CtaSection";
import ChatbotWidget from "./components/chatbot/Chatbot";
import ServiceCarousel from "./components/homepage/ServiceCarousel";
import { redirect } from 'next/navigation';

export default async function Home() {
  const [homepageContent, processContent] = await Promise.all([
      getHomepageContent(),
      getProcessContent(),
    ]);
  
  if (!homepageContent || !processContent) {
    redirect('/maintenance');
  }

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

      <section className="py-16 md:py-24 bg-dark-blue text-white">
        <HomeTeam half_toggle={false} />
      </section>

      <section className="py-16 md:py-24 text-white">
        <ServiceCarousel />
      </section>
      
      <section className="py-16 md:py-24 text-white">
        <ProcessTable steps={processContent.step} />
      </section>

      <section className="bg-darker-light-blue">
        <CtaSection />
      </section>

      <section>
        <ChatbotWidget />
      </section>
    </div>
  );
}
