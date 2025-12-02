import { getFeaturedTeamMembers } from "@/lib/strapi";
import Link from "next/link";
export default async function HomeTeam() {
  const teamMembers = await getFeaturedTeamMembers(false);

  return (
    <div className="flex flex-col items-center w-full py-12 lg:py-20 bg-white">
      <h1 className="text-4xl lg:text-6xl font-bold font-songer text-darker-bold-blue mb-12 uppercase tracking-wide">
        Meet The Team
      </h1>
      <div className="w-full max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {teamMembers.map((teamMember, index) => {
          const imageUrl = teamMember.avatar.url;
          const fullImageUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${imageUrl}` : "localhost:1337" + imageUrl;
          const profileLink = `/team/${teamMember.slug}`
          return (
            <Link 
              href={profileLink} 
              key={teamMember.id}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-full mb-6 justify-center flex">
                <img
                  src={fullImageUrl}
                  className="aspect-[3/4] h-[220px] sm:h-[260px] lg:h-[300px] object-cover rounded-2xl shadow-lg
                             transition-transform duration-500 ease-in-out group-hover:scale-105"
                  alt={teamMember.name}
                />
              </div>
              {/* Name & Suffix */}
              <h2 className="font-songer text-dark-blue text-2xl font-bold uppercase tracking-wider mb-1 group-hover:text-bold-blue transition-colors duration-300">
                {teamMember.name}
                {teamMember.suffix && <span className="text-2xl">, {teamMember.suffix}</span>}
              </h2>
              {/* Position */}
              <p className="font-work-sans text-dark-blue font-medium text-sm md:text-xl tracking-wide group-hover:text-bold-blue transition-colors duration-300">
                {teamMember.position}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  );
}