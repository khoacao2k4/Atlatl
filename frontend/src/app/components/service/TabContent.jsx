"use client";
import React, { useState } from 'react';
import { getMediaComponent } from '@/lib/helper';

export default function TabContent({ tabContent }) {
    const keywords = tabContent.keywords;
    // State to track which tab is currently open
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-20 font-work-sans">
                {/* --- Main Heading --- */}
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-songer text-darker-bold-blue
                            font-bold text-center uppercase tracking-wide mb-16">
                    {tabContent.name}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="flex flex-col justify-between h-full">
                        {/* --- Left Column: Tabs & Text --- */}
                        <div className="space-y-8">
                            {/* Tab Navigation */}
                            <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-gray-300 pb-1 w-full justify-evenly">
                                {keywords.map((keyword_info, idx) => (
                                    <button
                                        key={"keyword " + keyword_info.id}
                                        onClick={() => setActiveTab(idx)}
                                        className={`text-xl pb-3 transition-all duration-300 relative 
                                        ${activeTab === idx
                                                ? 'text-bold-blue font-semibold underline underline-offset-5'
                                                : 'text-darker-bold-blue hover:text-black cursor-pointer'
                                            }`}
                                    >
                                        {keyword_info.name}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content Area */}
                            <div className="lg:min-h-[210px]"> {/* min-height prevents layout jump when text length varies */}
                                <p className="text-bold-blue text-lg leading-relaxed">
                                    {keywords[activeTab].description}
                                </p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-8 md:pt-4 flex justify-center font-songer">
                            <button className="bg-bold-blue text-white font-bold py-3 px-8 shadow-md rounded-full
                                hover:bg-white hover:text-bold-blue hover:shadow-xl 
                                transition-all duration-300 transform hover:-translate-y-0.5 hover:cursor-pointer">
                                Schedule a Call
                            </button>
                        </div>
                    </div>

                    {/* --- Right Column: Image --- */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full max-h-[800px]">
                            {/* Note: Using a placeholder image from Unsplash that matches the 'balance' theme */}
                            {getMediaComponent(keywords[activeTab].image, keywords[activeTab].name,
                                false,
                                "object-cover w-full h-full aspect-[3/4] pointer-events-none"
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};