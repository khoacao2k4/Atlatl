import { getMediaComponent } from "@/lib/strapi";
import { getTheme } from "@/lib/theme-config";

function MediaTextSplitMedia({ media }) {
  if (!media) return null;

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden relative min-h-[300px] md:min-h-0">
      {getMediaComponent(
        media,
        "MediaTextSplit Media",
        true,
        "max-w-full h-auto object-cover w-full h-full",
        {
          style: {
            width: "100%",
            height: "auto",
          },
        }
      )}
    </div>
  );
}

function MediaTextSplitTextBox({ title, description, rowTheme }) {
  const styles = getTheme(rowTheme || "LIGHT");

  return (
    <div
      className={`${styles.bg} ${styles.text} w-full h-full rounded-3xl p-6 md:p-12 lg:p-16 xl:py-32 flex flex-col justify-center`}
    >
      <h2 className="font-songer font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-6">
        {title}
      </h2>
      <div className="font-tenorite text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed">
        {description?.map((block, idx) => (
          <p key={idx} className={idx > 0 ? "mt-4" : ""}>
            {block.children?.map((child) => child.text).join("")}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function MediaTextSplit({ title, description, row, theme }) {
  const sectionStyles = getTheme(theme || "LIGHT");

  return (
    <section
      className={`${sectionStyles.bg} ${sectionStyles.text} flex flex-col gap-6 md:gap-12 px-4 md:px-16 lg:px-20 pb-10 md:pb-32 lg:pb-40`}
    >
      {/* Optional header */}
      {(title || description) && (
        <div className="text-center mb-6 md:mb-12">
          {title && (
            <h2 className="font-songer font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              {title}
            </h2>
          )}
          {description && (
            <div className="font-tenorite text-lg md:text-xl lg:text-2xl">
              {description.map((block, idx) => (
                <p key={idx} className={idx > 0 ? "mt-4" : ""}>
                  {block.children?.map((child) => child.text).join("")}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {row?.map((rowItem, rowIndex) => {
        const mediaFirst = rowItem.mediaFirst && rowItem.media;

        const containerClasses = `flex gap-6 md:gap-12 w-full ${
          mediaFirst ? "flex-col" : "flex-col-reverse"
        } md:grid md:grid-cols-2 items-stretch`;

        return (
          <div key={rowIndex} className={containerClasses}>
            {mediaFirst && rowItem.media && (
              <MediaTextSplitMedia media={rowItem.media} />
            )}
            <MediaTextSplitTextBox
              title={rowItem.title}
              description={rowItem.description}
              rowTheme={rowItem.theme}
            />
            {!mediaFirst && rowItem.media && (
              <MediaTextSplitMedia media={rowItem.media} />
            )}
          </div>
        );
      })}
    </section>
  );
}
