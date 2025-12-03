"use client";
import { useState, useEffect } from "react";
import AccordionItem from "../AccordionItem";

const faqData = {
  "GENERAL": [
    {
      question: "What are some common misconceptions about the role of financial advisers?",
      answer: "A common misconception is that advisers only pick stocks. In reality, we provide comprehensive holistic planning including tax strategy, estate planning, and risk management to ensure your entire financial picture is cohesive."
    },
    {
      question: "Is it better to have a financial adviser or do it myself?",
      answer: "While DIY is possible, a fiduciary adviser offers objective expertise, emotional discipline during market volatility, and specialized knowledge in complex areas like tax-loss harvesting and succession planning."
    },
    {
      question: "What is the difference between a broker and a fiduciary?",
      answer: "A fiduciary is legally bound to act in your best interest at all times. A broker is only required to recommend products that are 'suitable,' even if they aren't the best option for you."
    }
  ],
  "RIA": [
    {
      question: "What does RIA stand for?",
      answer: "RIA stands for Registered Investment Advisor. As an RIA, we have a fiduciary duty to our clients, meaning we are legally obligated to always put your interests first."
    }
  ],
  "FINANCIAL PLANNING": [
    {
      question: "When should I start financial planning?",
      answer: "The best time to start is now. Whether you are building wealth, planning for retirement, or managing an inheritance, having a clear roadmap is essential for success."
    }
  ],
  "ESTATE PLANNING": [
    {
      question: "Do you help with wills and trusts?",
      answer: "Yes, we coordinate closely with estate attorneys to ensure your assets are structured correctly to minimize taxes and ensure your legacy is preserved according to your wishes."
    }
  ],
  "CRYPTOCURRENCY": [
    {
      question: "Can you manage crypto assets?",
      answer: "We view digital assets as part of a diversified portfolio. We can help advise on proper allocation and custody of cryptocurrency assets within your broader strategy."
    }
  ],
  "TAX PLANNING": [
    {
      question: "How do you minimize tax liability?",
      answer: "We utilize strategies such as tax-loss harvesting, asset location, and charitable giving strategies to improve your after-tax returns."
    }
  ]
};

export default function FaqSection() {
  const [activeTab, setActiveTab] = useState("GENERAL"); //track active tab
  const [openIndex, setOpenIndex] = useState(null); // track open accordion item

  // Reset open accordion when tab changes
  useEffect(() => {
    setOpenIndex(null);
  }, [activeTab]);

  const handleAccordionClick = (index) => {
    // If clicking the one already open, close it (null). Otherwise open the new index.
    setOpenIndex(openIndex === index ? null : index);
  };

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
        {Object.keys(faqData).map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`font-songer text-lg font-bold uppercase pb-3 transition-all duration-300 relative
              ${activeTab === category
                ? 'text-bold-blue font-semibold'
                : 'text-darker-bold-blue hover:text-black cursor-pointer'
              }`}
          >
            {category}
            {/* Active Underline */}
            <span
              className={`absolute bottom-2.5 left-0 w-full h-[3px] bg-bold-blue transform transition-transform duration-300 origin-left
              ${activeTab === category ? "scale-x-100" : "scale-x-0"}`}
            />
          </button>
        ))}
      </div>
      {/* Accordion List */}
      <div className="max-w-4xl mx-auto">
        {faqData[activeTab].map((item, index) => (
          <AccordionItem 
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)} // Toggle on click
          />
        ))}
      </div>
    </div>
  );
}