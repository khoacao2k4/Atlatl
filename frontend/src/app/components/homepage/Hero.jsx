import { getMediaComponent } from "@/lib/helper";

export default function Hero({ media }) {
  return (
    <div className="container mx-auto px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Text Content & Buttons */}
        <div className="flex flex-col justify-center text-center md:text-left font-songer">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-black leading-tight">
            YOUR <span className="text-bold-blue">WEALTH.</span>
            <br />
            OUR <span className="text-bold-blue">EXPERTISE.</span>
          </h1>
          <p className="mt-6 text-black text-lg font-work-sans">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <button className="bg-bold-blue text-white font-bold py-3 px-8 shadow-md rounded-full
                hover:bg-white hover:text-bold-blue hover:shadow-xl 
                transition-all duration-300 transform hover:-translate-y-0.5 hover:cursor-pointer">
              Explore Services
            </button>
            <button className="bg-white text-bold-blue font-bold py-3 px-8 rshadow-md rounded-full border-2 border-bold-blue
                hover:bg-bold-blue hover:text-white hover:shadow-xl 
                transition-all duration-300 transform hover:-translate-y-0.5 hover:cursor-pointer
                ">
               Schedule a Call
            </button>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="flex items-center justify-center">
          {getMediaComponent(
            media,
            "Hero",
            true,
            "rounded-[100px] w-full h-auto max-w-[360px] lg:max-w-md shadow-2xl object-cover"
          )}
        </div>
      </div>
    </div>
  );
}
