import { getFAQContent, getProcessContent } from '@/lib/strapi';
import FaqSection from '@/app/components/service/FaqSection';
import Roadmap from '../components/process/RoadMap';
import RoadmapShort from '../components/process/RoadmapShort';
import { redirect } from 'next/navigation';

export default async function ProcessPage() {
  const [faqs, processContent] = await Promise.all([
    getFAQContent(),
    getProcessContent(),
  ]);
  const hasFAQ = faqs && faqs.topics && faqs.topics.length > 0;
  const hasprocessContent = processContent && processContent.step && processContent.step.length > 0;

  if (!hasprocessContent || !hasFAQ) {
    redirect('/maintenance');
  }

  return (
    <main className="bg-white">
      <section className="container mx-auto px-6 xl:px-20 py-16 md:py-24">
        {/* --- PAGE TITLE --- */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-songer text-darker-bold-blue font-bold text-center uppercase tracking-wide mb-16">
          PROCESS
        </h1>
        {/* --- SUBTITLE --- */}
        <div className="text-center font-tenorite space-y-8 text-dark-blue ">
          <p className="text-xl md:text-2xl lg:text-3xl font-bold">
            A thoughtful, personalized approach to building max financial success
          </p>
          <p className="text-xl text-gray-700 max-w-8xl mx-auto">
            At Atlatl Advisers, we believe that great financial outcomes begin with a clear understanding of what matters most to you.
          </p>
          <p className="text-xl text-gray-700 max-w-8xl mx-auto">
            Our structured, collaborative process ensures that every decision is aligned with your goals; from discovery to review, so you can move forward with clarity, confidence, and purpose.
          </p>
        </div>
        {/** --- FIVE STEP SYMBOL --- */}
        <div>
          <RoadmapShort steps={processContent.step} />
        </div>
        {/** --- ROADMAP --- */}
        <div className="flex items-center">
          <Roadmap steps={processContent.step} />
        </div>
      </section>
      {
        /** FAQ */
        <section className="bg-white py-16 md:py-24">
          <FaqSection faqBlocks={faqs.topics} />
        </section>
      }
    </main>
  );
}