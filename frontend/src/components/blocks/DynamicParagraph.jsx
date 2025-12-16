"use client";
import React, { useState } from 'react';
import { getMediaComponent } from '@/lib/strapi';
import Link from 'next/link';
import { getButtonClasses, getTheme, BackgroundImages } from '@/lib/theme-config';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function DynamicParagraph({ title, media, button, Content, theme }) {
  const [activeTab, setActiveTab] = useState(0);
  const styles = getTheme(theme);

  return (
    <section className={`py-16 md:py-24 relative ${styles.bg}`}>
      <BackgroundImages images={styles.backgroundImages} />
      <div className="container mx-auto px-[10%] font-tenorite relative z-10">
        {/* Main Heading */}
        {title && (
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-songer
                      font-bold text-center uppercase tracking-wide mb-16 ${styles.title}`}>
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col justify-between h-full">
            {/* Left Column: Tabs & Content */}
            <div className="space-y-8">
              {/* Tab Navigation */}
              {Content && Content.length > 0 && (
                <div className="flex flex-nowrap overflow-x-auto gap-x-6 gap-y-2 border-b border-gray-300 pb-1 w-full justify-evenly">
                  {Content.map((content, idx) => (
                    <button
                      key={"content_tab_" + idx}
                      onClick={() => setActiveTab(idx)}
                      className={`flex-shrink-0 text-xl pb-3 transition-all font-bold duration-300 relative 
                      ${activeTab === idx
                          ? 'text-bold-blue font-semibold'
                          : `${styles.text} hover:text-bold-blue cursor-pointer`
                        }`}
                    >
                      {content.title}
                      <span
                        className={`absolute bottom-2.5 left-0 w-full h-[3px] bg-bold-blue transform transition-transform duration-300 origin-left
                        ${activeTab === idx ? "scale-x-100" : "scale-x-0"}`}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Tab Content Area */}
              {Content && Content.length > 0 && (
                <div className="lg:min-h-[210px]">
                  <div className={`text-lg leading-relaxed prose prose-lg max-w-none ${styles.text}`}>
                    <BlocksRenderer content={Content[activeTab].paragraph} />
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            {button && (
              <div className="pt-8 md:pt-4 flex justify-center font-songer">
                <Link href={button.link} className={getButtonClasses(button)}>
                  {button.title}
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Media */}
          {media && (
            <div className="flex justify-center lg:justify-end">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full max-h-[800px]">
                {getMediaComponent(
                  media,
                  title || "Dynamic Content",
                  false,
                  "object-cover w-full h-full aspect-[3/4] pointer-events-none"
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}