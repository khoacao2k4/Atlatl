"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

const services = [
  "Financial Planning", 
  "Retirement Plan Service",
  "Wealth Management", 
  "Tax Planning",
  "Estate Planning",
  "Family Office Services",
  "Risk Management",
  "Investment Management",
  "Asset Management",
  "Strategic Advisory",
  "Alternative Investments",
  "Digital Assets"
];

export default function ServicesCarousel() {
  // --- EMBLA SETUP ---
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    // Default (Mobile): Scroll 1 item at a time
    slidesToScroll: 1, 
    breakpoints: {
      // Tablet (md): Scroll 2 items at a time
      "(min-width: 768px)": { slidesToScroll: 2 },
      // Desktop (lg): Scroll 3 items at a time
      "(min-width: 1024px)": { slidesToScroll: 3 }
    }
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    // Update snaps when the window resizes or carousel inits
    const updateSnaps = () => setScrollSnaps(emblaApi.scrollSnapList());
    
    updateSnaps();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      updateSnaps();
      onSelect();
    });
    
    // Cleanup
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  return (
    <div className="container mx-auto rounded-2xl flex flex-col items-center font-tenorite">
      {/* HEADER */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-songer text-darker-bold-blue font-bold text-center uppercase tracking-wide">
        Our Services
      </h1>
      <p className="text-lg md:text-xl px-[10%] py-8 text-center text-darker-bold-blue">
        Our team delivers a full suite of planning and advisory services built to
        support individuals, families, and businesses.
      </p>

      {/* CAROUSEL WRAPPER */}
      <div className="relative w-full max-w-7xl px-8 md:px-12 group">
        
        {/* VIEWPORT */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y -ml-4 py-4">
            {services.map((service, idx) => (
              <div
                key={"service-block-" + idx}
                // --- RESPONSIVE SIZING ---
                // Mobile: 100% width
                // Tablet: 50% width
                // Desktop: 33.333% width
                className="pl-4 min-w-0 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <div className="bg-dark-blue aspect-[4/3] rounded-lg flex items-center justify-center p-8 shadow-sm h-full hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-white text-2xl md:text-3xl font-bold text-center uppercase leading-snug">
                    {service}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ARROWS */}
        <button
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          className={`absolute top-1/2 -translate-y-1/2 left-0 md:-left-2 bg-[#3465B5] text-white p-3 rounded-full shadow-lg hover:bg-[#285090] transition-all z-10 
            ${!prevBtnEnabled ? "opacity-0 invisible" : "opacity-100 visible"}`}
        >
          <FiChevronLeft size={24} />
        </button>

        <button
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          className={`absolute top-1/2 -translate-y-1/2 right-0 md:-right-2 bg-[#3465B5] text-white p-3 rounded-full shadow-lg hover:bg-[#285090] transition-all z-10 
            ${!nextBtnEnabled ? "opacity-0 invisible" : "opacity-100 visible"}`}
        >
          <FiChevronRight size={24} />
        </button>

      </div>

      {/* DOTS */}
      {/* Logic: If there is only 1 snap point (all items fit), hide dots */}
      {scrollSnaps.length > 1 && (
        <div className="flex justify-center mt-6 gap-3">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all duration-300 rounded-full border border-gray-300 
                ${index === selectedIndex ? "w-8 h-3 bg-dark-blue border-white" : "w-3 h-3 bg-transparent hover:bg-gray-200"}`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12">
        <Link href="/contact-us" className="font-songer bg-bold-blue text-white py-3 px-8 mt-8 shadow-md rounded-full
          hover:bg-white hover:text-bold-blue hover:shadow-[0_0px_15px_-3px_rgba(0,0,0,0.3)] 
          transition-all duration-300 transform hover:-translate-y-0.5 hover:cursor-pointer">
          Meet with an adviser
        </Link>
      </div>
    </div>
  );
}