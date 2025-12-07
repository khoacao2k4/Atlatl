"use client";
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

  // Handle Submit
  const onSubmit = async (data) => {
    console.log("Valid Form Data:", data);
    
    // Log to Google Sheets
    const result = await logToGoogleSheets('ContactFormSubmissions', {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      service: data.service,
      message: data.message || 'N/A'
    });

    if (result.success) {
      alert("Form submitted successfully!");
      reset();
    } else {
      alert("Failed to submit. Please try again.");
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
            disabled={isSubmitting || isLoading}
            className="bg-bold-blue text-white font-bold py-3 px-8 shadow-md rounded-full uppercase font-songer
                hover:bg-white hover:text-bold-blue hover:shadow-[0_0px_15px_-3px_rgba(0,0,0,0.3)] 
                transition-all duration-300 transform hover:-translate-y-0.5 hover:cursor-pointer"
          >
            {isSubmitting || isLoading ? "SENDING..." : "SUBMIT"}
          </button>
        </div>
      </form>
    </div>
  );
}