'use client'

import ContactForm from "@/app/components/contact/ContactForm";
import CtaSection from "@/app/components/homepage/CtaSection";
import { getFAQContent } from '@/lib/strapi';
import FaqSection from '@/app/components/service/FaqSection';
import { getMediaComponent } from "@/lib/helper";
import Link from "next/link";
import { useState } from "react";

export function RoadmapTextSection({stepNum, title, children }) {
    return (
        <div className="w-full lg:w-1/2 px-4 justify-center flex flex-col gap-6 items-center">
            <div>
                <div className="flex flex-row text-dark-blue text-bold font-songer items-end gap-3">
                    <h1 className="text-7xl">{stepNum}</h1>
                    <span><h6 className="text-3xl">{title}</h6></span>
                </div>
                <div className="font-work-sans lg:max-w-5/6 text-center md:text-left">
                    {children}
                </div>
            </div>
        </div>
    )
}

export function RoadmapImageSection({ imageUrl }) {
  return (
    <div className={`w-full lg:w-1/2 flex justify-center`}>
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

export function Roadmap() {  // Hardcoded for now
    return (
        <div className="flex flex-col space-y-16 mt-16 px-20 mt-20 items-center justify-center">
            <RoadmapSection stepNum="01" title="DISCOVER">Our process begins with a personalized discovery meeting, where we take the time to understand you—your goals, priorities, and long-term vision. Through in-depth conversations, we explore what matters most to you while also introducing you to Atlatl Advisers and how we can help guide your financial journey.</RoadmapSection>
            <RoadmapSection stepNum="02" title="PLAN" reverse={true}>In our second meeting, we’ll review your initial financial plan, providing personalized recommendations to optimize your overall strategy. This includes guidance on estate planning, tax efficiency, and insurance solutions to help protect and grow your wealth.</RoadmapSection>
            <RoadmapSection stepNum="03" title="AGREE">Together, we develop a comprehensive strategy that balances both sides of your financial picture, providing solutions to help you achieve your goals at every stage of life.</RoadmapSection>
            <RoadmapSection stepNum="04" title="IMPLEMENT" reverse={true}>Once we establish the framework of our partnership, we’ll guide you through a seamless onboarding process, integrating you into our client portals and putting your tailored financial plan into action.</RoadmapSection>
            <RoadmapSection stepNum="05" title="REVIEW">Once your comprehensive financial plan is in place, we will meet regularly to review your investments and address key areas such as tax strategies, estate planning, and insurance to ensure your plan remains aligned with your goals.</RoadmapSection>        
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

    const [hasFAQ, setHasFAQ] = useState(true); 
    const faqs = await getFAQContent();
    if (!faqs || !faqs.topics || faqs.topics.length === 0) {
        setHasFAQ(() => false);
    }    

  return (
    <main className="bg-white">
      <section className="container mx-auto px-6 xl:px-20 py-16 md:py-24">
        {/* --- PAGE TITLE --- */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-songer text-darker-bold-blue font-bold text-center uppercase tracking-wide mb-16">
          PROCESS
        </h1>
        {/* --- SUBTITLE --- */}
        <div className="text-center font-work-sans space-y-8 text-dark-blue ">
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold">
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

        {
            /** FAQ */
            hasFAQ && (
                <section className="bg-white py-16 md:py-24">
                    <FaqSection faqBlocks={faqs.topics} />
                </section>
            )
        }
      </section>
    </main>
  );
}