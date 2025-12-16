import { getMediaComponent } from "@/lib/strapi2";
import Link from "next/link";
import { getTheme, BackgroundImages } from "@/lib/theme-config";

export default function Team({ title, teamMembers, theme }) {
  const styles = getTheme(theme);

  return (
    <div className={`py-12 lg:py-20 relative ${styles.bg}`}>
      <BackgroundImages images={styles.backgroundImages} />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className={`text-4xl lg:text-6xl font-bold font-songer ${styles.text} mb-12 uppercase tracking-wide text-center`}>
          {title}
        </h2>
        
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {teamMembers && teamMembers.map((teamMember) => {
            const profileLink = `/team/${teamMember.slug}`;
            
            return (
              <Link 
                href={profileLink} 
                key={teamMember.id}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-full mb-6 justify-center flex">
                  {getMediaComponent(
                    teamMember.avatar,
                    teamMember.name,
                    false,
                    "aspect-[3/4] h-[220px] sm:h-[260px] lg:h-[300px] object-cover rounded-2xl shadow-lg transition-transform duration-500 ease-in-out group-hover:scale-105"
                  )}
                </div>
                
                <h3 className={`font-songer ${styles.text} text-2xl font-bold uppercase tracking-wider mb-1 group-hover:text-bold-blue transition-colors duration-300`}>
                  {teamMember.name}
                  {teamMember.suffix && <span className="text-2xl">, {teamMember.suffix}</span>}
                </h3>
                
                <p className={`font-tenorite ${styles.text} font-medium text-sm md:text-xl tracking-wide group-hover:text-bold-blue transition-colors duration-300`}>
                  {teamMember.position}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}