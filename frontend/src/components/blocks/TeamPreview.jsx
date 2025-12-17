import Link from "next/link";
import { getStrapiURL } from "@/lib/strapi";
import { getTheme, getButtonClasses, BackgroundImages } from "@/lib/theme-config";

export default function TeamPreview({ title, description, theme, button, team_members, half_toggle = true }) {
  const styles = getTheme(theme);

  return (
    <div className={`flex flex-col items-center w-full py-24 relative ${styles.bg}`}>
      <BackgroundImages images={styles.backgroundImages} />

      <div className="flex flex-col justify-center items-center w-full font-tenorite text-center relative z-10">
        <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-bold font-songer uppercase tracking-wide ${styles.title}`}>
          {title}
        </h1>
        <p className={`text-lg md:text-xl px-[10%] py-8 text-center ${styles.text}`}>
          {description}
        </p>
      </div>
      
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start lg:justify-between px-6 lg:px-[15%] gap-12 lg:gap-8 relative z-10">
        {team_members?.map((teamMember, index) => {
          const imageUrl = teamMember.avatar?.url;
          const fullImageUrl = imageUrl ? getStrapiURL(imageUrl) : null;
          
          return (
            <div
              key={teamMember.id}
              className={`flex flex-col items-center font-tenorite text-center lg:w-[30%]`}
            >
              {fullImageUrl && (
                <div className="w-full mb-4 flex justify-center">
                  <img
                    src={fullImageUrl}
                    className="h-[220px] sm:h-[260px] lg:h-[300px] object-cover transition-transform duration-500 ease-in-out"
                    alt={teamMember.name}
                  />
                </div>
              )}
              <h2 className={`font-songer text-lg font-bold group-hover:text-bold-blue transition-colors duration-300 ${styles.text}`}>
                {teamMember.suffix ? `${teamMember.name}, ${teamMember.suffix}` : teamMember.name}
              </h2>
              <div className={`group-hover:text-bold-blue transition-colors duration-300 ${styles.text}`}>
                {teamMember.position}
              </div>
            </div>
          );
        })}
      </div>
      
      {button && (
        <Link 
          href={button.link} 
          className={`${getButtonClasses(button)} mt-8 relative z-10`}
        >
          {button.title}
        </Link>
      )}
    </div>
  );
}