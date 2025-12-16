import { getMediaComponent } from "@/lib/strapi";
import { getTheme, BackgroundImages } from "@/lib/theme-config";

export default function Definition({
  title,
  headword,
  pronunciation,
  partOfSpeech,
  description,
  theme,
  illustration,
}) {
  const styles = getTheme(theme);

  return (
    <div className={`relative ${styles.bg}`}>
      <BackgroundImages images={styles.backgroundImages} />

      <div className="container mx-auto px-[10%] relative z-10">
        <h1 className={`font-songer text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center pt-20 md:pt-28 lg:pt-36 pb-8 md:pb-12 ${styles.text}`}>
          {title}
        </h1>

        <div className="relative md:flex md:flex-row md:justify-between md:items-start md:gap-8 pb-8 md:pb-16 lg:pb-20">
          
          <div className="float-right ml-4 pt-2 md:order-2 md:float-none md:ml-0 md:pt-0">
            {getMediaComponent(
              illustration,
              "Definition",
              true,
              "w-16 h-16 md:w-48 lg:w-64 xl:w-80 md:h-auto"
            )}
          </div>
          
          <div className="md:flex-1 md:max-w-xl md:order-1">
            {headword && (
              <p className={`font-tenorite text-xl md:text-2xl lg:text-4xl xl:text-5xl mb-2 md:mb-3 leading-tight ${styles.text}`}>
                {headword}
              </p>
            )}
            
            {pronunciation && (
              <p className={`font-tenorite text-xl md:text-2xl lg:text-4xl xl:text-5xl mb-2 md:mb-3 leading-tight ${styles.text}`}>
                {pronunciation}
              </p>
            )}
            
            {partOfSpeech && (
              <p className={`font-tenorite text-base md:text-lg lg:text-xl xl:text-2xl mb-4 md:mb-6 italic ${styles.text}`}>
                {partOfSpeech}
              </p>
            )}
            
            <p className={`font-tenorite text-base md:text-lg lg:text-2xl xl:text-3xl leading-relaxed md:pr-8 clear-right md:clear-none ${styles.text}`}>
              {description}
            </p>
          </div>          
        </div>
      </div>
    </div>
  );
}