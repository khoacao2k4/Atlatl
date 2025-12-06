import { getFAQContent } from '@/lib/strapi';
import FaqSection from '@/app/components/service/FaqSection';
import { getMediaComponent } from "@/lib/helper";
import RoadmapConnector from '@/app/components/process/RoadmapConnector';

export function RoadmapTextSection({ stepNum, title, children }) {
  return (
    <div className="w-full lg:w-1/2 px-0 md:px-4 justify-center flex flex-col gap-4 md:gap-6 items-center md:items-start z-10 bg-white">
      <div className="flex flex-col space-y-4">
        {/* Header: Number and Title */}
        <div className="flex flex-row text-dark-blue font-bold font-songer items-baseline justify-center md:justify-start gap-3">
          {/* Responsive text sizes: smaller on mobile, larger on md+ */}
          <h1 className="text-5xl md:text-7xl leading-none">{stepNum}</h1>
          <h6 className="text-2xl md:text-3xl leading-none">{title}</h6>
        </div>
        
        {/* Description Text */}
        <div className="font-work-sans w-full text-center md:text-left text-base md:text-lg text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}

export function RoadmapImageSection({ imageUrl }) {
  return (
    <div className={`w-full lg:w-1/2 flex justify-center z-10 bg-white`}>
      {/* <img src={imageUrl} alt="Roadmap Step Image" /> */}
        <div className="flex items-center justify-center">
          {getMediaComponent(
            null,
            "SYMBOL",
            true,
            "rounded-[50px] w-[250px] lg:max-w-md shadow-2xl object-cover"
          )}
        </div>
    </div>
  );
}

export function RoadmapSection({stepNum, title, children, imageUrl, reverse}) { 
    const className = `flex flex-col-reverse ${reverse ? "md:flex-row-reverse" : "md:flex-row"} mx-auto gap-8`;
    return (
        <div className={className}>
            <RoadmapTextSection stepNum={stepNum} title={title}>
                {children}
            </RoadmapTextSection>
            <RoadmapImageSection imageUrl={imageUrl} />
        </div>
    )
}

export function Roadmap() {
    return (
        // Added 'w-full' and adjusted spacing/padding
        <div className="flex flex-col w-full mt-12 md:mt-20 px-4 md:px-10 gap-12 items-center justify-center">
            
            {/* STEP 1 */}
            <RoadmapSection stepNum="01" title="DISCOVER">
                Our process begins with a personalized discovery meeting, where we take the time to understand you—your goals, priorities, and long-term vision. Through in-depth conversations, we explore what matters most to you while also introducing you to Atlatl Advisers and how we can help guide your financial journey.
            </RoadmapSection>

            {/* CONNECTOR: Step 1 (Right Image) -> Step 2 (Left Image) = RTL */}
            <RoadmapConnector direction="rtl" />

            {/* STEP 2 */}
            <RoadmapSection stepNum="02" title="PLAN" reverse={true}>
                In our second meeting, we’ll review your initial financial plan, providing personalized recommendations to optimize your overall strategy. This includes guidance on estate planning, tax efficiency, and insurance solutions to help protect and grow your wealth.
            </RoadmapSection>

            {/* CONNECTOR: Step 2 (Left Image) -> Step 3 (Right Image) = LTR */}
            <RoadmapConnector direction="ltr" />

            {/* STEP 3 */}
            <RoadmapSection stepNum="03" title="AGREE">
                Together, we develop a comprehensive strategy that balances both sides of your financial picture, providing solutions to help you achieve your goals at every stage of life.
            </RoadmapSection>

            {/* CONNECTOR: Step 3 (Right Image) -> Step 4 (Left Image) = RTL */}
            <RoadmapConnector direction="rtl" />

            {/* STEP 4 */}
            <RoadmapSection stepNum="04" title="IMPLEMENT" reverse={true}>
                Once we establish the framework of our partnership, we’ll guide you through a seamless onboarding process, integrating you into our client portals and putting your tailored financial plan into action.
            </RoadmapSection>

            {/* CONNECTOR: Step 4 (Left Image) -> Step 5 (Right Image) = LTR */}
            <RoadmapConnector direction="ltr" />

            {/* STEP 5 */}
            <RoadmapSection stepNum="05" title="REVIEW">
                Once your comprehensive financial plan is in place, we will meet regularly to review your investments and address key areas such as tax strategies, estate planning, and insurance to ensure your plan remains aligned with your goals.
            </RoadmapSection>        
        </div>
    )
}

export function RoadmapShortSection({title, imageUrl}) {
  return (
    <div className={`flex items-center flex-col mx-4 gap-4`}>
      {/* <img src={imageUrl} alt="Roadmap Step Image" /> */}
        <div>
          {getMediaComponent(
            null,
            "SYMBOL",
            true,
            "rounded-[20px] lg:rounded-[50px] w-[80px] md:w-[100px] lg:w-[160px] lg:max-w-md shadow-2xl object-cover"
          )}
        </div>
        <h3 className="sm:text-md md:text-xl text-center font-songer text-dark-blue">
            {title}
        </h3>
    </div>
  );    
}

export function RoadmapShort() {
    return (
        <div className="flex flex-wrap flex-row justify-evenly mt-12">
            <RoadmapShortSection title="DISCOVER" />
            <RoadmapShortSection title="PLAN" />
            <RoadmapShortSection title="AGREE" />
            <RoadmapShortSection title="IMPLEMENT" />
            <RoadmapShortSection title="REVIEW" />
        </div>
    )
}

export default async function ProcessPage() {
    const faqs = await getFAQContent();
    const hasFAQ = faqs && faqs.topics && faqs.topics.length > 0;

  return (
    <main className="bg-white">
      <section className="container mx-auto px-6 xl:px-20 py-16 md:py-24">
        {/* --- PAGE TITLE --- */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-songer text-darker-bold-blue font-bold text-center uppercase tracking-wide mb-16">
          PROCESS
        </h1>
        {/* --- SUBTITLE --- */}
        <div className="text-center font-work-sans space-y-8 text-dark-blue ">
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
            <RoadmapShort />
        </div>
        {/** --- ROADMAP --- */}
        <div className="flex items-center">
            <Roadmap />
        </div>
      </section>
      {
          /** FAQ */
          hasFAQ && (
              <section className="bg-white py-16 md:py-24">
                  <FaqSection faqBlocks={faqs.topics} />
              </section>
          )
      }
    </main>
  );
}