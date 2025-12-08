import { notFound } from "next/navigation";
import { getTeamMemberDetails } from "@/lib/strapi";
import Markdown from "@/app/components/Markdown";
import { getFullMediaUrl } from "@/lib/helper";

export default async function TeamPage({ params }) {
  const { slug } = params;
  const memberInfo = await getTeamMemberDetails(slug);

  if (!memberInfo) return notFound();

  const imageUrl = memberInfo.avatar.url;
  const fullImageUrl = getFullMediaUrl(imageUrl);
  const fullName = memberInfo.suffix ? memberInfo.name + ", " + memberInfo.suffix : memberInfo.name;

  return (
    <div className="w-full bg-white font-tenorite text-dark-blue">
      {/* Main Container */}
      <div className="container mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-20">

        {/* Left Column: Image */}
        <div className="w-full lg:w-[420px] flex-shrink-0 flex justify-center lg:justify-start">
          <div className="w-full mb-6 justify-center flex">
            <img
              src={fullImageUrl}
              alt={memberInfo.name}
              className="aspect-[3/4] h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg"
            />
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
              {memberInfo.position}
            </h2>
          </div>

          {/* Horizontal Divider */}
          <hr className="border-t border-dark-blue opacity-30 my-8 w-full" />

          {/* Bio Description */}
          <div className="text-lg text-dark-blue font-tenorite leading-relaxed">
            <Markdown>
              {memberInfo.description}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}