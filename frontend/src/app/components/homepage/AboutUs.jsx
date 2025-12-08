import { getMediaComponent } from "@/lib/helper";

export default function AboutUs({ media }) {
  return (
    <div className="container mx-auto rounded-2xl px-5 xl:px-[5%] 2xl:px-[10%] text-center">
      <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-12 text-left font-songer">
        ABOUT ATLATL ADVISERS
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image */}
        <div className="flex justify-center col-[1]">
          {getMediaComponent(
            media,
            "About Us",
            false,
            "aspect-4/3 w-full max-w-[400px] lg:max-w-none rounded-[30px] shadow-2xl object-cover"
          )}
        </div>

        {/* Right Column: Text Content */}
        <div className="h-full flex flex-col justify-center gap-6 font-tenorite text-xl lg:text-2xl md:text-left">
          <p>
            Atlatl Advisers is a multi-family office wealth manager and a fully
            independent, fee-only SEC Registered Investment Adviser.
          </p>
          <p>
            We help qualified individuals and families comprehensively manage
            their financial wellness with a focus on fiduciary responsibility,
            personalized service, and holistic planning.
          </p>
        </div>
      </div>
    </div>
  );
}
