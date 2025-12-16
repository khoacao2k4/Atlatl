import { FiPlusCircle } from "react-icons/fi";
import Markdown from "./Markdown";

export default function AccordionItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-200 font-tenorite">
      <button
        className="flex items-center justify-between w-full text-left py-6 group cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        aria-expanded={isOpen}
      >
        {/* Question Text */}
        <span className={`text-xl md:text-2xl font-bold transition-colors duration-300 pr-4
          ${isOpen ? "text-bold-blue" : "text-dark-blue group-hover:text-bold-blue"}`}>
          {question}
        </span>

        {/* Icon */}
        <div className="shrink-0 ml-4">
          <FiPlusCircle 
            className={`w-8 h-8 transition-transform duration-300 ease-out
              ${isOpen ? "transform rotate-45 text-bold-blue" : "text-dark-blue group-hover:text-bold-blue"}`} 
          />
        </div>
      </button>

      {/* THE CSS GRID TRICK 
         - grid-rows-[1fr] = Height Auto
         - grid-rows-[0fr] = Height 0
      */}
      <div
        role="region"
        className={`grid overflow-hidden transition-all duration-300 ease-in-out text-bold-blue
        ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden pb-6 text-lg leading-relaxed">
          <Markdown>{answer}</Markdown>
        </div>
      </div>
    </div>
  );
}