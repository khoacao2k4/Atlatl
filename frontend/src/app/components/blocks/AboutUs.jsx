import { getMediaComponent } from '@/lib/strapi2';
import { getTheme, BackgroundImages } from '@/lib/theme-config';

export default function AboutUs({ title, text, theme, media }) {
  const styles = getTheme(theme);

  return (
    <div className={`py-24 relative ${styles.bg}`}>
      <BackgroundImages images={styles.backgroundImages} />

      <div className="container mx-auto rounded-2xl px-5 xl:px-[5%] 2xl:px-[10%] text-center relative z-10">
        <h2 className={`text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-12 text-left font-songer uppercase tracking-wide ${styles.text}`}>
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex justify-center col-[1]">
            {getMediaComponent(
              media,
              "About Us",
              false,
              "aspect-4/3 w-full max-w-[400px] lg:max-w-none rounded-[30px] shadow-2xl object-cover"
            )}
          </div>

          <div className={`h-full flex flex-col justify-center gap-6 font-tenorite text-xl lg:text-2xl md:text-left ${styles.text}`}>
            {text?.map((block, index) => {
              const content = block.children.map((child) => child.text).join('').trim();
              if (!content) return null;
              return (
                <p key={index}>
                  {content}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}