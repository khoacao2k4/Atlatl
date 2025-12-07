"use client";
import React from "react";
import Link from "next/link";
import { FiFileText, FiPieChart, FiHome } from "react-icons/fi";
import { CiCalculator1 } from "react-icons/ci";

// --- MOCK DATA ---
const recentPosts = [
  { id: 1, title: "Understanding Market Volatility", tag: "Market", excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: 2, title: "Estate Planning Essentials", tag: "Planning", excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: 3, title: "The Future of Cryptocurrency", tag: "Crypto", excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
];

const toolsData = [
  { id: 1, title: "401(k) Calculator", tag: "Calculator", tagColor: "bg-orange-400", icon: <CiCalculator1 className="w-12 h-12" />, desc: "Calculate how much your 401(k) contributions will grow over time." },
  { id: 2, title: "401(k) Calculator", tag: "Calculator", tagColor: "bg-orange-400", icon: <FiPieChart className="w-12 h-12" />, desc: "Calculate how much your 401(k) contributions will grow over time." },
  { id: 3, title: "Monthly Excel Family Budget", tag: "Template", tagColor: "bg-red-500", icon: <FiFileText className="w-12 h-12" />, desc: "Track and manage your family's monthly expenses." },
  { id: 4, title: "Company Stock Distribution", tag: "Calculator", tagColor: "bg-orange-400", icon: <FiPieChart className="w-12 h-12" />, desc: "Analyze how your company's shares are distributed among stakeholders." },
  { id: 5, title: "Company Stock Distribution", tag: "Calculator", tagColor: "bg-orange-400", icon: <FiPieChart className="w-12 h-12" />, desc: "Analyze how your company's shares are distributed among stakeholders." },
  { id: 6, title: "Monthly Excel Family Budget", tag: "Template", tagColor: "bg-red-500", icon: <FiHome className="w-12 h-12" />, desc: "Track and manage your family's monthly expenses." },
];

export default function ResourcesPage() {
  return (
    <main className="bg-white min-h-screen pb-24">
      
      {/* --- PAGE TITLE --- */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-songer text-darker-bold-blue font-bold uppercase tracking-wide">
          RESOURCES
        </h1>
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 space-y-24">
        
        {/* --- SECTION 1: FEATURED & SPOTLIGHT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Featured Blog (Takes up 8 columns) */}
          <div className="lg:col-span-7 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-songer text-darker-bold-blue mb-6 uppercase">
              FEATURED BLOGS
            </h2>
            <div className="bg-gray-100 rounded-3xl w-full aspect-video mb-6 animate-pulse"></div> {/* Image Placeholder */}
            
            <div className="flex flex-col items-start gap-4">
              <span className="bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Tag
              </span>
              <h3 className="text-3xl font-songer text-darker-bold-blue font-bold">
                BLOG TITLE
              </h3>
              <p className="text-darker-bold-blue/80 font-tenorite max-w-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>

          {/* Right Column: Spotlight (Takes up 4 columns) */}
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-songer text-darker-bold-blue mb-6 uppercase">
              SPOTLIGHT
            </h2>

            {/* Quick Calculator Buttons */}
            <div className="flex gap-4 mb-10">
              <div className="bg-darker-bold-blue rounded-xl p-4 flex-1 text-white hover:bg-bold-blue transition-colors cursor-pointer">
                <h4 className="font-bold text-lg leading-tight">401(k)<br/>CALCULATOR</h4>
              </div>
              <div className="bg-white border-2 border-darker-bold-blue rounded-xl p-4 flex-1 text-darker-bold-blue hover:bg-gray-50 transition-colors cursor-pointer relative">
                {/* Tag pill floating above */}
                <span className="absolute -top-3 left-4 bg-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Calculator
                </span>
                <h4 className="font-bold text-lg leading-tight">401(k)<br/>CALCULATOR</h4>
              </div>
            </div>

            {/* Sidebar Blogs */}
            <div className="space-y-8">
              {[1, 2].map((item) => (
                <div key={item} className="flex gap-4 items-center group cursor-pointer">
                  <div className="w-32 h-24 bg-gray-200 rounded-xl flex-shrink-0 animate-pulse group-hover:bg-gray-300 transition-colors"></div>
                  <div>
                    <span className="bg-blue-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Tag
                    </span>
                    <h4 className="text-xl font-songer text-darker-bold-blue font-bold mt-1 group-hover:text-bold-blue transition-colors">
                      BLOG TITLE
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- SECTION 2: RECENT BLOGS --- */}
        <div>
          <h2 className="text-2xl md:text-3xl font-songer text-darker-bold-blue mb-8 uppercase">
            RECENT BLOG POSTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex flex-col group cursor-pointer">
                <div className="bg-gray-200 rounded-2xl w-full aspect-[4/3] mb-4 group-hover:bg-gray-300 transition-colors animate-pulse"></div>
                <div className="flex flex-col items-start gap-2">
                  <span className="bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {post.tag}
                  </span>
                  <h3 className="text-2xl font-songer text-darker-bold-blue font-bold group-hover:text-bold-blue transition-colors">
                    BLOG TITLE
                  </h3>
                  <p className="text-sm text-darker-bold-blue/80 font-tenorite line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- SECTION 3: TOOLS (Full Width Background) --- */}
      <div className="mt-24 bg-[#F0F6FF] py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-3xl md:text-4xl font-songer text-darker-bold-blue mb-12 uppercase">
            TOOLS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolsData.map((tool) => (
              <div key={tool.id} className="flex flex-col items-start gap-3">
                
                {/* The Tool Card */}
                <div className="w-full bg-darker-bold-blue rounded-2xl p-8 flex flex-col items-center justify-center text-center text-white h-[220px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                  <div className="mb-4 text-white/90 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold font-songer uppercase leading-tight max-w-[80%]">
                    {tool.title}
                  </h3>
                </div>

                {/* Description Below Card */}
                <div className="pl-2">
                  <span className={`${tool.tagColor} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase inline-block mb-2`}>
                    {tool.tag}
                  </span>
                  <h4 className="text-lg font-bold text-darker-bold-blue font-songer">
                    {tool.title}
                  </h4>
                  <p className="text-sm text-darker-bold-blue/80 font-tenorite mt-1">
                    {tool.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}