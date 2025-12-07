import { getTeamMembers } from "@/lib/strapi";
import { getFullMediaUrl } from "@/lib/helper";
import Link from "next/link";

export default async function HomeTeam({ half_toggle = true }) {
  const teamMembers = await getTeamMembers();

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col justify-center items-center w-full font-tenorite bg-dark-blue text-white text-center">
        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-songer">
          PEOPLE WITH A PURPOSE
        </h1>
        <p className="text-lg md:text-xl px-[10%] py-8 text-center">
          We strive to hire, inspire, and invest in the best talent across our
          respective disciplines and empower our team to thrive in an
          environment of respect. Our ability to celebrate different
          perspectives and foster a culture of inclusion leads to an exceptional
          client experience.
        </p>
      </div>
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start lg:justify-between px-6 lg:px-[15%] gap-12 lg:gap-8">
        {teamMembers.map((teamMember, index) => {
          const imageUrl = teamMember.avatar.url;
          const fullImageUrl = getFullMediaUrl(imageUrl);
          return (
            <div
              key={teamMember.id}
              className={`flex flex-col items-center font-tenorite text-center lg:w-[30%] ${index < Math.floor(teamMembers.length / 2) && half_toggle ? "text-white lg:text-dark-blue" : ""}`}
            >
              <img
                src={fullImageUrl}
                className="h-[220px] sm:h-[260px] lg:h-[300px] object-cover mb-4"
                alt={teamMember.name}
              />
              <h2 className="font-songer text-lg font-bold">
                {teamMember.suffix ? teamMember.name + ", " + teamMember.suffix : teamMember.name}
              </h2>
              <div>{teamMember.position}</div>
            </div>
          )
        })}
      </div>
      
      <Link href="/team" className="font-songer bg-bold-blue text-white py-3 px-8 mt-8 shadow-md rounded-full
          hover:bg-white hover:text-bold-blue hover:shadow-[0_0px_15px_-3px_rgba(0,0,0,0.3)] 
          transition-all duration-300 transform hover:-translate-y-0.5 hover:cursor-pointer">
          VIEW MORE TEAM MEMBERS
      </Link>
    </div>
  );
}
