"use client";

import { FiPlusCircle } from "react-icons/fi";
import { useState } from "react";


function Flashcard({ title, children, isOpen, onToggle }) {
  return (
    // .flashcard
    <div
      className="
      text-dark-blue border-b border-dark-blue
      py-[40px] sm:py-[50px] 
      last:border-b-0"
    >
      {/* .flashcard-title */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle} // Toggle is handled by the parent
      >
        {/* .flashcard h2 */}
        <h2 className="font-songer text-4xl sm:text-5xl font-bold">
          {title}
        </h2>
        {/* .flashcard-button*/}
        <div
          className="text-4xl sm:text-5xl"
        >
          {isOpen ? <FiPlusCircle className="transform rotate-45" /> : <FiPlusCircle className="transform rotate-0" />}
        </div>
      </div>
      {/* .flashcard-content */}
      <div
        className={`
        origin-top overflow-hidden 
        transition-all duration-500 ease-in-out
        ${
          isOpen
            ? "max-h-[500px] opacity-100 pt-6" // Open state
            : "max-h-0 opacity-0" // Closed state
        }
        `}
      >
        {/* Content is passed as children */}
        <div className="text-base sm:text-lg font-tenorite">{children}</div>
      </div>
    </div>
  );
}

export default function ProcessTable({steps}) {
  // State to track which card is open (by its title)
  const [openCard, setOpenCard] = useState(null);

  const handleToggle = (title) => {
    // If the clicked card is already open, close it (set to null).
    // Otherwise, open the clicked card.
    setOpenCard(openCard === title ? null : title);
  };

  return (
    <div
      className="container font-tenorite flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-stretch
                gap-5 xl:gap-12 mx-auto px-[5%]"
    >
      <div
        className="
        w-full max-w-[600px] lg:max-w-[750px] 
        rounded-[30px] border border-gray-300 bg-darker-light-blue
        overflow-hidden
        order-last lg:order-first
        "
      >
        <div className="h-full px-5 sm:px-10">
          {steps.map((step, idx) => (
            <Flashcard
              key={`flashcard-${idx}`}
              title={step.title}
              isOpen={openCard === step.title} // Pass down if it's open
              onToggle={() => handleToggle(step.title)} // Pass down the handler
            >
              {step.description}
            </Flashcard>
          ))}
        </div>
      </div>

      <div
        className="
        w-full max-w-[600px] lg:max-w-[550px] 
        bg-dark-blue text-white rounded-[30px] 
        p-5 sm:p-10 order-first lg:order-last 
        "
      >
        <h1
          className="
          font-songer font-bold 
          text-4xl sm:text-5xl lg:text-6xl
          border-b-2 border-white py-5"
        >
          THE PROCESS
        </h1>
        <h3
          className="
          font-songer font-bold 
          text-2xl sm:text-3xl lg:text-4xl
          my-10"
        >
          A THOUGHTFUL, PERSONALIZED APPROACH TO BUILDING LASTING FINANCIAL
          SUCCESS
        </h3>
        <p className="text-base sm:text-lg my-6">
          At Atlatl Advisers, we believe that great financial outcomes begin with
          a clear understanding of what matters most to you.
        </p>
        <p className="text-base sm:text-lg my-6">
          Our structured, collaborative process ensures that every decision is
          aligned with your goals; from discovery to review, so you can move
          forward with clarity, confidence, and purpose.
        </p>
      </div>
    </div>
  );
}