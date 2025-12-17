import { getMediaComponent } from "@/lib/strapi";
import { getTheme } from "@/lib/theme-config";

function Card({ card }) {
  const styles = getTheme(card.theme);

  return (
    <div
      className={`w-full sm:w-80 md:w-96 ${styles.bg} ${styles.text} rounded-3xl p-6 flex flex-col items-center`}
    >
      {card.media && (
        <div className="w-12 h-12 mb-4">
          {getMediaComponent(card.media, card.title, true, "w-12 h-12")}
        </div>
      )}
      <h3 className="font-songer font-bold text-xl md:text-2xl text-center mb-4 lg:min-h-[5rem] flex items-center">
        {card.title}
      </h3>
      <div className="font-tenorite text-base leading-relaxed text-left">
        {card.description?.map((block, idx) => (
          <p key={idx} className={idx > 0 ? "mt-4" : ""}>
            {block.children?.map((child) => child.text).join('')}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function CardRow({ title, themeTop, themeBottom, card }) {
  const topStyles = getTheme(themeTop);
  const bottomStyles = getTheme(themeBottom);

  const fromClass = topStyles.bg.replace("bg-", "");
  const toClass = bottomStyles.bg.replace("bg-", "");

  return (
    <>
      <div className={`${topStyles.bg} ${topStyles.text} pb-8`}>
        <h1 className="font-songer text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-center pt-12">
          {title}
        </h1>
      </div>

      <section className="w-full py-12 relative">
        <div className={`absolute top-0 left-0 w-full h-1/2 ${topStyles.bg}`}></div>
        <div className={`absolute bottom-0 left-0 w-full h-1/2 ${bottomStyles.bg}`}></div>
        <div className="relative flex flex-wrap justify-center gap-8 px-4 md:px-8">
          {card?.map((item, index) => (
            <Card key={index} card={item} />
          ))}
        </div>
      </section>
    </>
  );
}
