"use client";
import { useState, useEffect } from "react";
import AccordionItem from "../AccordionItem";


export default function FaqSection({ faqBlocks }) {
  const [activeTab, setActiveTab] = useState(0); //track active tab
  const [openIndex, setOpenIndex] = useState(null); // track open accordion item
  
  // Reset open accordion when tab changes
  useEffect(() => {
    setOpenIndex(null);
  }, [activeTab]);

  return (
    <div className="container mx-auto px-10 lg:px-20">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-songer text-darker-bold-blue font-bold uppercase mb-6">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-darker-bold-blue font-work-sans max-w-4xl mx-auto leading-relaxed">
          Explore our FAQ page to find insightful answers to commonly asked
          questions about financial advisers, investment strategies, portfolio
          management, and financial planning.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-12 gap-y-4 mb-8 border-b border-gray-200 pb-1">
        {faqBlocks.map((block, idx) => (
          <button
            key={"faq_tab_" + idx}
            onClick={() => setActiveTab(idx)}
            className={`font-songer text-lg font-bold uppercase pb-3 transition-all duration-300 relative
              ${activeTab === idx
                ? 'text-bold-blue font-semibold'
                : 'text-darker-bold-blue hover:text-black cursor-pointer'
              }`}
          >
            {block.name}
            {/* Active Underline */}
            <span
              className={`absolute bottom-2.5 left-0 w-full h-[3px] bg-bold-blue transform transition-transform duration-300 origin-left
              ${activeTab === idx ? "scale-x-100" : "scale-x-0"}`}
            />
          </button>
        ))}
      </div>
      {/* Accordion List */}
      <div className="max-w-4xl mx-auto">
        {faqBlocks[activeTab].questionblocks.map((item, idx) => (
          <AccordionItem 
            key={"faq_item_" + faqBlocks[activeTab].name + "_" + idx}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)} // Toggle on click
          />
        ))}
      </div>
    </div>
  );
}