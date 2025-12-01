export default function CtaSection() {
  // Replace with your actual arrow image URL later
  const arrowImageUrl = "/Graphic_Arrow_Navy.png";

  return (
    <div className="py-16 md:py-24 relative bg-darker-light-blue">
      <div className="container mx-auto px-10 relative z-10 flex flex-col items-center font-songer">
        {/* z-10 ensures text is above the arrow */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-blue leading-tight mb-4 text-center">
          READY TO TAKE THE NEXT STEP <br /> TOWARD YOUR FINANCIAL FUTURE?
        </h2>
        <p className="text-lg md:text-xl text-dark-blue mb-10">
          LET'S BUILD YOUR PLAN TOGETHER.
        </p>
        <button className="bg-bold-blue text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-white hover:text-bold-blue
          hover:shadow-xl transition-all duration-300
          transform hover:-translate-y-0.5 hover:cursor-pointer">
          SCHEDULE A CALL NOW
        </button>
      </div>

      {/* Arrow Image - Positioned absolutely in the bottom left */}
      {/* Adjust bottom and left values to fine-tune its position based on your exact image dimensions */}
      <div
        className="absolute z-0
                    bottom-[-50px] left-[-30px]
                    md:bottom-[-75px] md:left-[-40px]
                    lg:bottom-[-100px] lg:left-[-50px]"
      >
        <img
          src={arrowImageUrl}
          alt="Decorative arrow"
          className="w-[200px] md:w-[300px] lg:w-[400px] h-auto rotate-270 rounded-full"
        />
      </div>
    </div>
  );
}
