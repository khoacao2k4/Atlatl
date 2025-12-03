"use client";
import React from 'react';
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";

export default function MaintenancePage() {
  // Using a placeholder image that matches the serene, building/balance vibe of your other images.
  // In production, replace this with a local image like '/images/maintenance-stones.jpg'
  const maintenanceImage = "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHw3fHxmYW1pbHl8ZW58MHx8fHwxNzY0NzIzMTc3fDA&ixlib=rb-4.1.0&fit=max&q=80";

  return (
    <main className="min-h-screen relative bg-white overflow-hidden flex items-center justify-center">
      {/* --- Background Patterns (Matches the vibe of image_0.png, image_3.png) --- */}
      {/* Replace src with your actual local vector files if you have them */}
      <img
        src="/images/vector_60.svg" // Assuming this is the gray diagonal pattern
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-50"
      />

      <div className="container mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* --- Left Column: Imagery --- */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-md w-full aspect-[3/4]">
              <img
                src={maintenanceImage}
                alt="Balancing stones indicating patience and building"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* --- Right Column: Content --- */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left space-y-8">
            
            <div>
              <h1 className="text-4xl lg:text-5xl font-songer text-darker-bold-blue font-bold uppercase tracking-wide leading-tight mb-6">
                We Are Currently <br /> Under Maintenance
              </h1>
              
              <p className="text-xl text-darker-bold-blue font-work-sans leading-relaxed max-w-xl mx-auto lg:mx-0">
                We're busy making improvements to your digital experience. We apologize for the inconvenience and appreciate your patience as we build for the future.
              </p>
              
              <p className="text-lg text-bold-blue font-semibold font-work-sans mt-4">
                We'll be back shortly.
              </p>
            </div>

            {/* --- Alternative Contact Section --- */}
            {/* Since the site is down, offer ways to get in touch immediately. 
                Styles match the footer vibe in image_5.png */}
            <div className="bg-light-blue/20 p-8 rounded-2xl border border-bold-blue/10 mt-8 max-w-xl mx-auto lg:mx-0">
              <h2 className="text-2xl font-songer text-darker-bold-blue font-bold mb-6 uppercase">
                Need to reach us now?
              </h2>
              <div className="flex flex-col gap-4 font-work-sans text-darker-bold-blue">
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <FaPhone className="w-6 h-6 text-bold-blue" />
                  <span className="text-lg hover:text-bold-blue transition-colors">
                    (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <CiMail className="w-6 h-6 text-bold-blue" />
                   <span className="text-lg hover:text-bold-blue transition-colors">
                    support@atlatladvisers.com
                  </span>
                </div>
                 <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <FaLocationDot className="w-6 h-6 text-bold-blue" />
                   <span className="text-lg">
                    123 Financial District, City, ST 12345
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}