"use client";
import { useState, useEffect } from "react";
import AccordionItem from "../AccordionItem";
import { getTheme, BackgroundImages } from "@/lib/theme-config";
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function FAQ({ title, description, topic, theme }) {
  const [activeTab, setActiveTab] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const styles = getTheme(theme);
  
  // Reset open accordion when tab changes
  useEffect(() => {
    setOpenIndex(null);
  }, [activeTab]);

  return (
    <div className={`py-16 md:py-24 relative ${styles.bg}`}>
      <BackgroundImages images={styles.backgroundImages} />
      
      <div className="container mx-auto px-10 lg:px-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          {title && (
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-songer font-bold uppercase mb-6 ${styles.text}`}>
              {title}
            </h2>
          )}
          {description && (
            <div className={`text-lg font-tenorite max-w-4xl mx-auto leading-relaxed prose prose-lg ${styles.text}`}>
              <BlocksRenderer content={description} />
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        {topic && topic.length > 0 && (
          <div className="flex flex-row flex-nowrap overflow-x-auto justify-start md:justify-center gap-x-6 md:gap-x-12 gap-y-4 mb-8 border-b border-gray-200 pb-1">
            {topic.map((topicItem, idx) => (
              <button
                key={"faq_tab_" + idx}
                onClick={() => setActiveTab(idx)}
                className={`font-songer text-lg font-bold uppercase pb-3 transition-all duration-300 relative flex-shrink-0
                  ${activeTab === idx
                    ? 'text-bold-blue font-semibold'
                    : `${styles.text} hover:text-bold-blue cursor-pointer`
                  }`}
              >
                {topicItem.name}
                {/* Active Underline */}
                <span
                  className={`absolute bottom-2.5 left-0 w-full h-[3px] bg-bold-blue transform transition-transform duration-300 origin-left
                  ${activeTab === idx ? "scale-x-100" : "scale-x-0"}`}
                />
              </button>
            ))}
          </div>
        )}

        {/* Accordion List */}
        {topic && topic.length > 0 && topic[activeTab].questionblocks && (
          <div className="max-w-4xl mx-auto">
            {topic[activeTab].questionblocks.map((item, idx) => (
              <AccordionItem 
                key={"faq_item_" + topic[activeTab].name + "_" + idx}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === idx}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}