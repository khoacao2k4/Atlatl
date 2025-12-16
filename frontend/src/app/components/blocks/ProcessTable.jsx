"use client";

import { FiPlusCircle } from "react-icons/fi";
import { useState } from "react";
import { getTheme, BackgroundImages } from "@/lib/theme-config";

function Flashcard({ title, children, isOpen, onToggle }) {
  return (
    <div className="text-dark-blue border-b border-dark-blue py-[40px] sm:py-[50px] last:border-b-0">
      <div
        className="flex justify-between items-center cursor-pointer gap-4"
        onClick={onToggle}
      >
        <h2 className="font-songer text-4xl sm:text-5xl font-bold">
          {title}
        </h2>
        <div className="text-4xl sm:text-5xl flex-shrink-0">
          {isOpen ? (
            <FiPlusCircle className="transform rotate-45 transition-transform duration-300" />
          ) : (
            <FiPlusCircle className="transform rotate-0 transition-transform duration-300" />
          )}
        </div>
      </div>
      <div
        className={`origin-top overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen
            ? "max-h-[500px] opacity-100 pt-6"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-base sm:text-lg font-tenorite">{children}</div>
      </div>
    </div>
  );
}

export default function ProcessTable({ title, description, text, theme, step, leftTable, rightTable }) {
  const [openCard, setOpenCard] = useState(null);
  const styles = getTheme(theme);
  const leftStyles = getTheme(leftTable);
  const rightStyles = getTheme(rightTable);

  const handleToggle = (title) => {
    setOpenCard(openCard === title ? null : title);
  };

  return (
    <div className={`py-12 lg:py-20 relative ${styles.bg}`}>
      {/* Main section background images */}
      <BackgroundImages images={styles.backgroundImages} />

      <div
        className="container font-tenorite flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-stretch
                  gap-5 xl:gap-12 mx-auto px-[5%] relative z-10"
      >
        {/* Left Panel - Accordion */}
        <div
          className={`w-full max-w-[600px] lg:max-w-[750px] rounded-[30px] border border-gray-300 ${leftStyles.bg}
          overflow-hidden order-last lg:order-first relative`}
        >
          {/* Left panel background images */}
          <BackgroundImages images={leftStyles.backgroundImages} />
          
          <div className="h-full px-5 sm:px-10 relative z-10">
            {step?.map((item, idx) => (
              <Flashcard
                key={item.id || `flashcard-${idx}`}
                title={item.title}
                isOpen={openCard === item.title}
                onToggle={() => handleToggle(item.title)}
              >
                {item.description}
              </Flashcard>
            ))}
          </div>
        </div>

        {/* Right Panel - Info */}
        <div
          className={`w-full max-w-[600px] lg:max-w-[600px] ${rightStyles.bg} ${rightStyles.text} rounded-[30px] 
          p-5 sm:p-10 order-first lg:order-last relative overflow-hidden`}
        >
          {/* Right panel background images */}
          <BackgroundImages images={rightStyles.backgroundImages} />
          
          <div className="relative z-10">
            <h1 className="font-songer font-bold text-4xl sm:text-5xl lg:text-6xl border-b-2 border-white py-5 uppercase tracking-wide">
              {title}
            </h1>
            <h3 className="font-songer font-bold text-2xl sm:text-3xl lg:text-4xl my-10 uppercase">
              {description}
            </h3>
            {text?.map((block, index) => (
              <div key={index}>
                {block.children?.map((child, childIndex) => (
                  child.text && (
                    <p key={childIndex} className="text-base sm:text-lg my-6">
                      {child.text}
                    </p>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}