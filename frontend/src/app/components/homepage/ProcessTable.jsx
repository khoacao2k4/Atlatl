"use client";

import { FiPlusCircle } from "react-icons/fi";
import { useState } from "react";

// Data for the flashcards
const flashcardData = [
  {
    title: "DISCOVERY",
    content:
      "Our process begins with a personalized discovery meeting, where we take the time to understand you - your goals, priorities, and long-term vision. Through in-depth conversations, we explore what matters most to you while also introducing you to Atlatl Advisers and how we can help guide your financial journey.",
  },
  {
    title: "PLAN",
    content:
      "In our second meeting, we'll review your initial financial plan, providing personalized recommedations to optimize your overall strategy. This includes guidance on estate planning, tax efficiency, and insurance solutions to help protect and grow your wealth.",
  },
  {
    title: "AGREE",
    content:
      "Together, we develop a comprehensive strategy that balances both sides of your financial picture, providing solutions to help you achieve your goals at every state of your life.",
  },
  {
    title: "IMPLEMENT",
    content:
      "Once we establish the framework of our partnership, we'll guide you through a seamless onboarding process, integrating you into our client portals and putting your tailored financial plan into action.",
  },
  {
    title: "REVIEW",
    content:
      "Once your comprehensive financial plan is in place, we will meet regularly to review your investments and address key areas such as tax strategies, estate planning, and insurance to ensure your plan remains aligned with your goals.",
  },
];

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
        <div className="text-base sm:text-lg font-work-sans">{children}</div>
      </div>
    </div>
  );
}

export default function ProcessTable() {
  // State to track which card is open (by its title)
  const [openCard, setOpenCard] = useState(null);

  const handleToggle = (title) => {
    // If the clicked card is already open, close it (set to null).
    // Otherwise, open the clicked card.
    setOpenCard(openCard === title ? null : title);
  };

  return (
    <div
      className="container font-work-sans flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-stretch
                gap-5 xl:gap-12 mx-auto px-10"
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
          {flashcardData.map((card) => (
            <Flashcard
              key={card.title}
              title={card.title}
              isOpen={openCard === card.title} // Pass down if it's open
              onToggle={() => handleToggle(card.title)} // Pass down the handler
            >
              {card.content}
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
          text-3xl sm:text-5xl lg:text-6xl
          border-b-2 border-white py-5"
        >
          THE PROCESS
        </h1>
        <h3
          className="
          font-songer font-bold 
          text-3xl lg:text-4xl
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