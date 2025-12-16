import React from "react";
import { getMediaComponent } from "@/lib/strapi";
import {
  getTheme,
  getButtonClasses,
  BackgroundImages,
} from "@/lib/theme-config";
import Link from "next/link";

export default function LoginTable({
  title,
  description,
  media,
  points,
  button,
  link,
  theme,
}) {
  const styles = getTheme(theme);

  // Parse title with separators
  const titleParts = title ? title.split("|").map((p) => p.trim()) : [];

  return (
    <div className={`relative ${styles.bg}`}>
      <BackgroundImages images={styles.backgroundImages} />

      {/* ================= HEADER ================= */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 font-tenorite relative z-10">
        <div className="flex flex-col items-center text-center mb-16 space-y-8">
          {titleParts.length > 0 && (
            <div
              className={`flex max-xl:flex-wrap justify-center items-center gap-4 md:gap-0 font-songer text-2xl md:text-3xl lg:text-4xl font-bold ${styles.text}`}
            >
              {titleParts.map((part, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-6">{part}</span>
                  {idx < titleParts.length - 1 && (
                    <span className="hidden md:block h-8 w-[2px] bg-bold-blue" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {description && (
            <p
              className={`text-lg md:text-xl ${styles.text} max-w-4xl leading-relaxed`}
            >
              {description}
            </p>
          )}
        </div>
      </section>

      {/* ================= MAIN GRID ================= */}
      <section className="pb-16 md:pb-24 overflow-x-hidden font-tenorite relative z-10">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* -------- LEFT COLUMN -------- */}
          <div className="relative isolate p-8 md:p-12 flex flex-col justify-center">
            {/* Background breakout */}
            <span
              aria-hidden
              className="absolute inset-0 bg-light-blue rounded-3xl
                lg:left-auto lg:right-0 lg:w-[200vw]
                lg:rounded-l-none lg:rounded-r-3xl"
            />

            {points?.length > 0 && (
              <ul className="relative list-disc list-outside ml-6 space-y-4 text-darker-bold-blue text-lg md:text-xl font-medium">
                {points.map((point, idx) => (
                  <li key={idx}>{point.text}</li>
                ))}
              </ul>
            )}
          </div>

          {/* -------- RIGHT COLUMN -------- */}
          <div className="flex flex-col items-center justify-center space-y-12 px-4 md:px-0">
            {media && button?.link && (
              <Link
                href={button.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full max-w-lg"
              >
                <div className="border-2 border-bold-blue p-1 w-full shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                  {getMediaComponent(
                    media,
                    "LoginTable",
                    true,
                    "w-full h-auto object-contain"
                  )}
                </div>
              </Link>
            )}

            {/* Fallback: media without link */}
            {media && !button?.link && (
              <div className="border-2 border-bold-blue p-1 w-full max-w-lg shadow-xl">
                {getMediaComponent(
                  media,
                  "LoginTable",
                  true,
                  "w-full h-auto object-contain"
                )}
              </div>
            )}

            {button && button.link && (
              <Link
                href={button.link}
                target="_blank"
                rel="noopener noreferrer"
                className={getButtonClasses(button)}
              >
                {button.title}
              </Link>
            )}
          </div>
        </div>

        {/* ================= FOOTER LINKS ================= */}
        {link?.length > 0 && (
          <div className="mt-20 flex flex-col items-center space-y-10">
            <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl w-full">
              {link.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.media &&
                    getMediaComponent(
                      item.media,
                      `AppLink-${idx}`,
                      true,
                      "w-[150px] md:w-[200px] h-auto hover:opacity-80 transition-opacity"
                    )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
