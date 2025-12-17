import { getMediaComponent } from "@/lib/strapi";
import { getTheme, BackgroundImages } from "@/lib/theme-config";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

export default function TitleTextMultipleMedia({
  title,
  description,
  paragraph,
  media,
  theme,
}) {
  const styles = getTheme(theme);

  return (
    <div className={`py-10  md:py-22 relative ${styles.bg}`}>
      <BackgroundImages images={styles.backgroundImages} />

      <section className="container mx-auto px-6 xl:px-20 relative z-10">
        {title && (
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-songer font-bold text-center uppercase tracking-wide mb-16 ${styles.text}`}
          >
            {title}
          </h1>
        )}

        {(description || paragraph) && (
          <div className={`text-center font-tenorite space-y-8 ${styles.title}`}>
            {description && (
              <p className="text-xl md:text-2xl lg:text-3xl font-bold">
                {description}
              </p>
            )}

            {paragraph && (
              <div className="text-xl max-w-8xl space-y-1 mx-auto text-gray-700">
                <BlocksRenderer content={paragraph} />
              </div>
            )}
          </div>
        )}

        {media && media.length > 0 && (
          <div className="flex flex-wrap justify-center gap-19 mt-10 md:mt-12">
            {media.map((item, idx) => (
              <div
                key={`media-${idx}`}
                className="flex flex-col items-center text-center w-[140px]"
              >
                {getMediaComponent(
                  item,
                  `TitleTextMultipleMedia-${idx}`,
                  true,
                  "w-[98px] md:w-[114px] lg:w-[130px] object-contain"
                )}

                {item?.alternativeText && (
                  <p className="mt-4 text-base md:text-lg lg:text-xl font-songer uppercase tracking-[0.08em] text-dark-blue">
                    {item.alternativeText}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}