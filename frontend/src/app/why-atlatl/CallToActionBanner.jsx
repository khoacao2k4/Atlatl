export default function CallToActionBanner({ title, subtitle, showMobile }) {
  return (
    <section className={`py-6 md:py-12 lg:py-24 text-center px-4 ${!showMobile ? 'max-md:hidden' : 'md:hidden bg-dark-blue'}`}>
      <h2 className={`font-songer font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl ${!showMobile ? 'text-dark-blue' : 'text-white'} leading-tight mb-4 md:mb-8 max-w-5xl mx-auto`}>
        {title}
      </h2>
      <p className={`font-tenorite text-lg md:text-xl lg:text-2xl xl:text-3xl ${!showMobile ? 'text-dark-blue' : 'text-white'}`}>
        {subtitle}
      </p>
    </section>
  );
}