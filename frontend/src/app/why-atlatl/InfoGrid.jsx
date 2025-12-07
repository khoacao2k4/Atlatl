import Image from "next/image";

function InfoGridImage({ src, alt }) {
  return (
    <div className="relative w-full h-96 md:h-full rounded-3xl overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
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
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-24 px-4 md:px-16 lg:px-40 pb-20 md:pb-32 lg:pb-40 place-items-center">
      {items.map((item, index) => (
        <div key={index} className="w-full h-full">
          {item.type === "image" ? (
            <InfoGridImage src={item.src} alt={item.alt} />
          ) : (
            <InfoGridTextBox title={item.title} content={item.content} />
          )}
        </div>
      ))}
    </section>
  );
}

