import { getMediaComponent } from "@/lib/helper";
import Image from "next/image";

function ContentBlock({ icon, title, description }) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-3">
        <Image
          src={icon}
          alt={title}
          width={50}
          height={50}
          className="w-10 md:w-12 lg:w-16 h-auto"
        />
        <h2 className="font-songer text-xl md:text-2xl lg:text-3xl font-bold">
          {title}
        </h2>
      </div>
      <p className="font-work-sans text-sm md:text-base lg:text-lg leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function PurposeSection({ media, title, subtitle, vision, mission }) {
  return (
    <section className="bg-dark-blue text-white px-4 md:px-16 lg:px-40 py-10 md:py-16 lg:py-20">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
        <div className="w-full lg:w-1/2">
        {getMediaComponent(
          media,
          "PurposeSection", false, "w-full h-full object-cover rounded-3xl max-h-[53.5rem]"
        )}
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6 lg:gap-8 lg:pl-8">
          <div>
            <h1 className="font-songer text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {title}
            </h1>
            <p className="font-work-sans text-sm md:text-base lg:text-lg leading-relaxed">
              {subtitle}
            </p>
          </div>

          <ContentBlock
            icon={vision.icon}
            title={vision.title}
            description={vision.description}
          />

          <ContentBlock
            icon={mission.icon}
            title={mission.title}
            description={mission.description}
          />
        </div>
      </div>
    </section>
  );
}