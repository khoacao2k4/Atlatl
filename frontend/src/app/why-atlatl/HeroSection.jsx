import Image from "next/image";

export default function HeroSection({ title, pronunciation, description, logoSrc }) {
  return (
    <section className="bg-dark-blue text-white">
      <div className="container mx-auto px-[10%]">
        <h1 className="font-songer text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center pt-20 md:pt-28 lg:pt-36 pb-8 md:pb-12">
          {title}
        </h1>

        {/* --- Main Content Area: Re-enable flex row for MD view --- */}
        <div className="relative md:flex md:flex-row md:justify-between md:items-start md:gap-8 pb-8 md:pb-16 lg:pb-20">
          
          {/* Logo Container: Floats right on mobile, is ordered second on MD+ */}
          <div className="float-right ml-4 pt-2 md:order-2 md:float-none md:ml-0 md:pt-0">
            <Image
              src={logoSrc}
              alt="Atlatl Mark"
              width={300}
              height={300}
              className="w-16 h-16 md:w-48 lg:w-64 xl:w-80 md:h-auto"
              priority
            />
          </div>
          
          {/* Text Container: order-1 ensures it is on the left side on MD+, 
             and md:flex-1 ensures it shares space correctly. */}
          <div className="md:flex-1 md:max-w-xl md:order-1">
            {/* Pronunciation */}
            <p className="font-tenorite text-xl md:text-2xl lg:text-4xl xl:text-5xl mb-4 md:mb-6 leading-tight whitespace-pre-line">
              {pronunciation}
            </p>
            
            {/* Description: Clear float on mobile, no float/clear needed on MD+ */}
            <p className="font-tenorite text-base md:text-lg lg:text-2xl xl:text-3xl leading-relaxed md:pr-8 clear-right md:clear-none">
              {description}
            </p>
          </div>          
        </div>
      </div>
    </section>
  );
}