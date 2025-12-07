export default function CallToActionBanner({ title, subtitle }) {
  return (
    <section className="py-6 md:py-12 lg:py-24 text-center px-4">
      <h2 className="font-songer font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-dark-blue leading-tight mb-4 md:mb-8 max-w-5xl mx-auto">
        {title}
      </h2>
      <p className="font-tenorite text-lg md:text-xl lg:text-2xl xl:text-3xl text-dark-blue">
        {subtitle}
      </p>
    </section>
  );
}