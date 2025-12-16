import { getMediaComponent } from "@/lib/strapi2";
import Link from "next/link";
import { getTheme, getButtonClasses, BackgroundImages } from "@/lib/theme-config";

export default function Hero({
  titleTop,
  titleBottom,
  description,
  theme,
  media,
  primaryButton,
  secondaryButton,
}) {
  const styles = getTheme(theme);

  return (
    <div className={`py-24 relative ${styles.bg}`}>
      <BackgroundImages images={styles.backgroundImages} />

      <div className="container mx-auto px-5 xl:px-[5%] 2xl:px-[10%] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center text-center md:text-left font-songer">
            <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight ${styles.text}`}>
              {titleTop.split(' ')[0]} <span className="text-bold-blue">{titleTop.split(' ')[1]}</span>
              <br />
              {titleBottom.split(' ')[0]} <span className="text-bold-blue">{titleBottom.split(' ')[1]}</span>
            </h1>
            <p className={`mt-6 text-lg font-tenorite ${styles.text}`}>
              {description}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              {primaryButton && (
                <Link href={primaryButton.link} className={getButtonClasses(primaryButton)}>
                  {primaryButton.title}
                </Link>
              )}
              {secondaryButton && (
                <Link href={secondaryButton.link} className={getButtonClasses(secondaryButton)}>
                  {secondaryButton.title}
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center">
            {getMediaComponent(
              media,
              "Hero",
              true,
              "rounded-[100px] w-full h-auto max-w-[360px] lg:max-w-md shadow-2xl object-cover"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}