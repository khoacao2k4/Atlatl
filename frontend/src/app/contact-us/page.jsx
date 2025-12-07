import ContactForm from "@/app/components/contact/ContactForm";
import CtaSection from "@/app/components/homepage/CtaSection";
import Link from "next/link";
import { PHONE_NUMBER, EMAIL_ADDRESS, OFFICE_ADDRESS } from "@/lib/constant";

// Google Maps
const mapContainerStyle = { width: "100%", height: "100%", borderRadius: "20px" };

export default function ContactUsPage() {
  return (
    <main className="bg-white">
      <section className="container mx-auto px-6 xl:px-20 py-16 md:py-24">
        {/* --- PAGE TITLE --- */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-songer text-darker-bold-blue font-bold text-center uppercase tracking-wide mb-16">
          LET'S CONNECT
        </h1>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-24 items-start">
          
          {/* --- LEFT COLUMN: INFO --- */}
          <div className="w-full lg:w-5/12 items-center flex flex-col gap-8">
            <div className="max-w-[350px]">
              <img src="/images/Atlatl_Logo_blue.svg" alt="Atlatl Advisers" className="w-full object-contain" />
            </div>

            <div className="font-tenorite text-darker-bold-blue text-xl space-y-6 pl-5 -mt-10">
              <p>
                {PHONE_NUMBER} <br />
                {EMAIL_ADDRESS}
              </p>
              <p>
                {OFFICE_ADDRESS}
              </p>
            </div>

            <Link href={`tel:${PHONE_NUMBER}`} className="bg-bold-blue text-white font-bold py-3 px-8 shadow-md rounded-full uppercase font-songer
                hover:bg-white hover:text-bold-blue hover:shadow-[0_0px_15px_-3px_rgba(0,0,0,0.3)] 
                transition-all duration-300 transform hover:-translate-y-0.5 hover:cursor-pointer">
              Schedule a Call
            </Link>
          </div>

          {/* --- RIGHT COLUMN: FORM --- */}
          <div className="w-full lg:w-3/4">
            <ContactForm />
          </div>
        </div>
      </section>
      <section className="container mx-auto px-6 xl:px-20 pb-16 md:pb-24">
        {/* --- MAP SECTION --- */}
        <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-lg border border-gray-200">
          <iframe className={`${mapContainerStyle}`} style={mapContainerStyle} src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Atlatl%20Advisers+(Atlatl%20Advisers)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
          </iframe>
        </div>
      </section>
      <section className="bg-darker-light-blue">
        <CtaSection />
      </section>
    </main>
  );
}