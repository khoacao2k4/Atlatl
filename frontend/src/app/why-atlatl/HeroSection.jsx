import Image from "next/image";

export default function HeroSection({ title, pronunciation, description, logoSrc }) {
  return (
    <section className="bg-dark-blue text-white">
      <div className="container mx-auto px-10">
        <h1 className="font-songer text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center pt-20 md:pt-28 lg:pt-36 pb-8 md:pb-12">
          {title}
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 md:pb-16 lg:pb-20">
          <div className="flex-1">
            <p className="font-tenorite text-xl md:text-2xl lg:text-4xl xl:text-5xl mb-4 md:mb-6 leading-tight whitespace-pre-line">
              {pronunciation}
            </p>
            <p className="font-tenorite text-base md:text-lg lg:text-2xl xl:text-3xl leading-relaxed md:pr-8">
              {description}
            </p>
          </div>

          <div className="flex-1 flex justify-center md:justify-end">
            <Image
              src={logoSrc}
              alt="Atlatl Mark"
              width={300}
              height={300}
              className="w-32 md:w-48 lg:w-64 xl:w-80 h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}