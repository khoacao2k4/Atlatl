import Link from "next/link";
import { getTheme, getButtonClasses, BackgroundImages } from "@/lib/theme-config";

export default function CallToAction({ title, description, theme, button }) {
  const styles = getTheme(theme);

  return (
    <div className={`py-16 md:py-24 relative ${styles.bg}`}>
      <BackgroundImages images={styles.backgroundImages} />

      <div className="container mx-auto px-10 relative z-10 flex flex-col items-center font-songer">
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${styles.title} leading-tight mb-4 text-center text-balance uppercase tracking-wide`}>
          {title}
        </h2>
        <p className={`text-lg md:text-xl ${styles.text} mb-10 text-center text-balance max-w-2xl uppercase`}>
          {description}
        </p>
        
        {button && (
          <Link href={button.link} className={getButtonClasses(button)}>
            {button.title}
          </Link>
        )}
      </div>
    </div>
  );
}