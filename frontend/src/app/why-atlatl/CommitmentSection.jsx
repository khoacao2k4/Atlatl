import Image from "next/image";

function CommitmentCard({ item }) {
  return (
    <div className="w-full sm:w-80 md:w-96 bg-darker-bold-blue rounded-3xl p-6 flex flex-col items-center text-white">
      <Image
        src={item.icon}
        alt={item.title}
        width={50}
        height={50}
        className="w-12 h-12 mb-4"
      />
      <h3 className="font-songer font-bold text-xl md:text-2xl text-center mb-4 min-h-[5rem] flex items-center">
        {item.title}
      </h3>
      <p className="font-work-sans text-base leading-relaxed text-left">
        {item.description}
      </p>
    </div>
  );
}

export default function CommitmentSection({ title, items }) {
  return (
    <>
      <h1 className="font-songer text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-center text-dark-blue pb-8">
        {title}
      </h1>

      <section className="w-full bg-gradient-to-b from-darker-light-blue from-50% to-dark-blue to-50% py-4 md:py-12">
        <div className="flex flex-wrap justify-center gap-8 px-4 md:px-8">
          {items.map((item, index) => (
            <CommitmentCard key={index} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}

