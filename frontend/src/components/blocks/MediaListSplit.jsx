import { getMediaComponent } from "@/lib/strapi";
import { getTheme } from "@/lib/theme-config";

function ContentBlock({ icon, title, description }) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-3">
        {icon && (
          <div className="w-10 md:w-12 lg:w-16 h-auto">
            {getMediaComponent(
              icon,
              title,
              true,
              "w-10 md:w-12 lg:w-16 h-auto"
            )}
          </div>
        )}
        <h2 className="font-songer text-xl md:text-2xl lg:text-3xl font-bold">
          {title}
        </h2>
      </div>
      <div className="font-tenorite text-sm md:text-base lg:text-lg leading-relaxed">
        {description?.map((block, idx) => (
          <p key={idx} className={idx > 0 ? "mt-4" : ""}>
            {block.children?.map((child, childIdx) => child.text).join('')}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function MediaListSplit({ media, title, description, item, theme }) {
  const styles = getTheme(theme);
  
  return (
    <section className={`${styles.bg} ${styles.text} px-4 md:px-16 lg:px-40 py-10 md:py-16 lg:py-20`}>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
        <div className="w-full lg:w-1/2">
          {media && media.length > 0 && getMediaComponent(
            media[0],
            "MediaListSplit",
            false,
            "w-full h-full object-cover rounded-3xl max-h-[53.5rem]"
          )}
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6 lg:gap-8 lg:pl-8">
          <div>
            <h1 className="font-songer text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {title}
            </h1>
            {description && (
              <div className="font-tenorite text-sm md:text-base lg:text-lg leading-relaxed">
                {description.map((block, idx) => (
                  <p key={idx} className={idx > 0 ? "mt-4" : ""}>
                    {block.children?.map((child, childIdx) => child.text).join('')}
                  </p>
                ))}
              </div>
            )}
          </div>

          {item?.map((contentItem, index) => (
            <ContentBlock
              key={index}
              icon={contentItem.media}
              title={contentItem.title}
              description={contentItem.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}