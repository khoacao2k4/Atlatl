export default function RoadmapTextSection({ stepNum, title, children }) {
  return (
    <div className="w-full lg:w-1/2 px-0 md:px-4 justify-center flex flex-col gap-4 md:gap-6 items-center md:items-start z-10 bg-white">
      <div className="flex flex-col space-y-4">
        {/* Header: Number and Title */}
        <div className="flex flex-row text-dark-blue font-bold font-songer items-baseline justify-center md:justify-start gap-3">
          {/* Responsive text sizes: smaller on mobile, larger on md+ */}
          <h1 className="text-5xl md:text-7xl leading-none">{stepNum}</h1>
          <h6 className="text-2xl md:text-3xl leading-none">{title}</h6>
        </div>
        
        {/* Description Text */}
        <div className="font-work-sans w-full text-center md:text-left text-base md:text-lg text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}