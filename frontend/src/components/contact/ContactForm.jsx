"use client";
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaChevronDown } from "react-icons/fa6";
import { useGoogleSheetsLogger } from '@/lib/google-sheets/useGoogleSheetsLogger';

// Zod schema for form validation
const contactSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  service: z.string().min(1, { message: "Please select a service" }),
  message: z.string().optional(),
});

export default function ContactForm() {
  // Hook form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      message: ""
    }
  });

  const { logToGoogleSheets, isLoading } = useGoogleSheetsLogger();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const modalRef = useRef(null);

  // Handle Submit
  const onSubmit = async (data) => {
    console.log("Valid Form Data:", data);
    
    // Log to Google Sheets
    const result = await logToGoogleSheets('Contact', {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      service: data.service,
      message: data.message || 'N/A'
    });

    if (result.success) {
      setShowSuccess(true);
      reset();
    } else {
      setShowError(true);
    }
  };

  // Helper styles
  const baseInputStyles = "w-full border rounded-lg px-4 py-3 text-darker-bold-blue focus:outline-none focus:ring-2 focus:ring-bold-blue focus:border-transparent transition-all";
  const labelStyles = "block text-darker-bold-blue font-semibold text-base mb-2";

  // Helper to dynamically add red border if error exists
  const getInputStyles = (error) => 
    `${baseInputStyles} ${error ? "border-red-500 bg-red-50" : "border-gray-400 bg-white"}`;

  return (
    <div className="bg-white shadow-[0_0_50px_-12px] shadow-darker-bold-blue/50 rounded-3xl p-8 md:p-12 border border-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-tenorite">
        
        {/* Row 1: Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>First Name:</label>
            <input 
              type="text" 
              {...register("firstName")}
              className={getInputStyles(errors.firstName)}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className={labelStyles}>Last Name:</label>
            <input 
              type="text" 
              {...register("lastName")}
              className={getInputStyles(errors.lastName)}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Row 2: Email */}
        <div>
          <label className={labelStyles}>Email:</label>
          <input 
            type="email" 
            {...register("email")}
            className={getInputStyles(errors.email)}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Row 3: Phone */}
        <div>
          <label className={labelStyles}>Phone:</label>
          <input 
            type="tel" 
            {...register("phone")}
            className={getInputStyles(errors.phone)}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Row 4: Dropdown */}
        <div>
          <label className={labelStyles}>What service are you inquiring about?</label>
          <div className="relative">
            <select 
              {...register("service")}
              className={`${getInputStyles(errors.service)} appearance-none cursor-pointer`}
              defaultValue=""
            >
              <option value="" disabled>Select</option>
              <option value="Wealth Management">Wealth Management</option>
              <option value="Family Office">Family Office</option>
              <option value="Asset Management">Asset Management</option>
              <option value="Retirement Plans">Retirement Plans</option>
            </select>
            {/* Chevron Icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <FaChevronDown className='text-[#929292]'/>
            </div>
          </div>
          {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
        </div>

        {/* Row 5: Message */}
        <div>
          <label className={labelStyles}>Message:</label>
          <textarea 
            rows="5" 
            placeholder="Type your message here..."
            {...register("message")}
            className={`${getInputStyles(errors.message)} resize-none`}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-bold-blue text-white font-bold py-3 px-8 shadow-md rounded-full uppercase font-songer
                hover:bg-white hover:text-bold-blue hover:shadow-[0_0px_15px_-3px_rgba(0,0,0,0.3)] 
                transition-all duration-300 transform hover:-translate-y-0.5 hover:cursor-pointer"
          >
            {isSubmitting || isLoading ? "SENDING..." : "SUBMIT"}
          </button>
        </div>
      </form>

      {/* Reusable Modal */}
      {(showSuccess || showError) && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowSuccess(false);
            setShowError(false);
          }}
        >
          <div 
            ref={modalRef}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 relative animate-[fadeIn_0.3s_ease-in-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close X Button */}
            <button 
              onClick={() => {
                setShowSuccess(false);
                setShowError(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${showSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                <svg className={`w-8 h-8 ${showSuccess ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showSuccess ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  )}
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-darker-bold-blue text-center mb-4 font-songer">
              {showSuccess ? 'Thank You!' : 'Submission Failed'}
            </h2>

            {/* Content */}
            {showSuccess ? (
              <>
                <div className="text-darker-bold-blue text-center space-y-4 font-tenorite text-lg">
                  <p>
                    Thank you for getting in touch with us through our website. We have received your message and appreciate you taking the time to reach out.
                  </p>
                  <p>
                    A member of our team will review your inquiry and follow up using the contact details you provided.
                  </p>
                  <p className="text-base">
                    In the meantime, you are welcome to explore more about us:
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <a 
                    href="/services" 
                    className="bg-bold-blue text-white font-bold py-3 px-6 rounded-full text-center uppercase font-songer
                      hover:bg-white hover:text-bold-blue hover:shadow-lg transition-all duration-300"
                  >
                    Our Services
                  </a>
                  <a 
                    href="/about-us" 
                    className="bg-white text-bold-blue border-2 border-bold-blue font-bold py-3 px-6 rounded-full text-center uppercase font-songer
                      hover:bg-bold-blue hover:text-white transition-all duration-300"
                  >
                    About Us
                  </a>
                </div>

                <p className="text-center text-darker-bold-blue font-tenorite mt-8 text-lg font-semibold">
                  Thank you again for your interest in Atlatl Advisers. <br />
                  We look forward to connecting with you.
                </p>
              </>
            ) : (
              <>
                <p className="text-darker-bold-blue text-center font-tenorite text-lg mb-6">
                  We couldn't process your submission. Please try again or contact us directly.
                </p>
                <button 
                  onClick={() => setShowError(false)}
                  className="w-full bg-bold-blue text-white font-bold py-3 px-6 rounded-full uppercase font-songer hover:bg-white hover:text-bold-blue hover:shadow-lg transition-all duration-300"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}