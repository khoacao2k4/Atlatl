import { getMediaComponent } from "@/lib/strapi";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Markdown from "../Markdown";

export default function TeamMember({ member }) {
  if (!member) return null;

  const fullName = member.suffix 
    ? `${member.name}, ${member.suffix}` 
    : member.name;

  return (
    <div className="w-full bg-white font-tenorite text-dark-blue">
      {/* Main Container */}
      <div className="container mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-20">

        {/* Left Column: Image */}
        <div className="w-full lg:w-[420px] flex-shrink-0 flex justify-center lg:justify-start">
          <div className="w-full mb-6 justify-center flex">
            {getMediaComponent(
              member.avatar,
              `team-member-${member.slug}`,
              true,
              "aspect-[3/4] h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg"
            )}
          </div>
        </div>

        {/* Right Column: Text Content */}
        <div className="flex-1 w-full pt-4">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="font-songer font-bold text-3xl md:text-4xl lg:text-5xl uppercase tracking-wide mb-2">
              {fullName}
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-normal text-dark-blue">
              {member.position}
            </h2>
          </div>

          {/* Horizontal Divider */}
          <hr className="border-t border-dark-blue opacity-30 my-8 w-full" />

          {/* Bio Description */}
          <div className="text-lg text-dark-blue font-tenorite leading-relaxed">
            <Markdown>
              {member.description}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}