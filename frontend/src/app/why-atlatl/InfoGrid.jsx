import { getMediaComponent } from "@/lib/helper";

function InfoGridMedia({ media}) {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden relative min-h-[300px] md:min-h-0">
      {/* min-h-[300px] added above ensures the image has height on mobile 
         even if intrinsic sizing tries to collapse it when flex-reversed.
      */}
      {getMediaComponent(
        media,
        "InfoGrid Image",
        true,
        "max-w-full h-auto object-cover w-full h-full",
        {
          style: {
            width: '100%',
            height: 'auto',
          },
        }
      )}
    </div>
  );
}

function InfoGridTextBox({ title, content }) {
  return (
    <div className="bg-darker-bold-blue text-white w-full h-full rounded-3xl p-6 md:p-12 lg:p-16 xl:py-32 flex flex-col justify-center">
      <h2 className="font-songer font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-6">
        {title}
      </h2>
      <p className="font-work-sans text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed">
        {content}
      </p>
    </div>
  );
}

export default function InfoGrid({ items }) {
  // 1. Create pairs of items (chunks of 2)
  const pairs = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }

  return (
    <section className="flex flex-col gap-6 md:gap-12 px-4 md:px-16 lg:px-20 pb-20 md:pb-32 lg:pb-40">
      {pairs.map((pair, pairIndex) => {
        // 2. Check the type of the first item in the pair
        const firstIsMedia = pair[0].type === "media";

        // 3. Define classes based on order
        // Mobile: 
        //  - If [Media, Text]: use 'flex-col-reverse' to swap them (Text on top).
        //  - If [Text, Media]: use 'flex-col' (Text already on top).
        // Desktop:
        //  - Always 'md:grid md:grid-cols-2' to put them side-by-side.
        const containerClasses = `flex gap-6 md:gap-12 w-full ${
          firstIsMedia ? "flex-col-reverse" : "flex-col"
        } md:grid md:grid-cols-2 items-stretch`;

        return (
          <div key={pairIndex} className={containerClasses}>
            {pair.map((item, itemIndex) => (
              <div key={itemIndex} className="w-full h-full">
                {item.type === "media" ? (
                  <InfoGridMedia media={item.media} alt={item.alt} />
                ) : (
                  <InfoGridTextBox title={item.title} content={item.content} />
                )}
              </div>
            ))}
          </div>
        );
      })}
    </section>
  );
}