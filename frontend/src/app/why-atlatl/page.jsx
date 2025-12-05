import Image from "next/image";
import HomeTeam from "../components/homepage/HomeTeam";
import CtaSection from "../components/homepage/CtaSection";

export default function WhyAtlatlPage() {
  return (
    <main className="bg-darker-light-blue overflow-x-hidden">
      {/* Intro Section */}
      <section className="bg-dark-blue text-darker-light-blue">
        <div className="container mx-auto px-10">
          <h1 className="font-songer text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center pt-20 md:pt-28 lg:pt-36 pb-8 md:pb-12">
            WHY ATLATL
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 md:pb-16 lg:pb-20">
            {/* Definition Text */}
            <div className="flex-1">
              <p className="font-songer text-xl md:text-2xl lg:text-4xl xl:text-5xl mb-4 md:mb-6 leading-tight">
                AT· LATL<br />/ˈAT ˌ LAD( ə )L<br />NOUN
              </p>
              <p className="font-work-sans text-base md:text-lg lg:text-2xl xl:text-3xl leading-relaxed md:pr-8">
                A tool that uses leverage to propel an arrow towards its intended target with greater accuracy, velocity, and power.
              </p>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center md:justify-end">
              <Image
                src="/logo.svg"
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

      {/* Video Section */}
      <section className="w-full bg-gradient-to-b from-dark-blue from-50% to-darker-light-blue to-50% px-4 md:px-16 lg:px-40 mb-4 md:mb-16">
        <video
          className="w-full h-auto rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl object-cover"
          style={{ aspectRatio: "2.19 / 1" }}
          autoPlay
          muted
          loop
          playsInline
          src="/baby-swing.mp4"
        />
      </section>

      {/* CTA Section */}
      <section className="py-6 md:py-12 lg:py-24 text-center px-4">
        <h2 className="font-songer font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-dark-blue leading-tight mb-4 md:mb-8 max-w-5xl mx-auto">
          READY TO TAKE THE NEXT STEP TOWARD YOUR FINANCIAL FUTURE?
        </h2>
        <p className="font-work-sans text-lg md:text-xl lg:text-2xl xl:text-3xl text-dark-blue">
          LET'S BUILD YOUR PLAN TOGETHER.
        </p>
      </section>

      {/* Info Grid Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-24 px-4 md:px-16 lg:px-40 pb-20 md:pb-32 lg:pb-40 place-items-center">
        {/* Info Image 1 */}
        <div className="relative w-full h-96 md:h-full rounded-3xl overflow-hidden">
          <Image
            src="/AtlatlTool.png"
            alt="Atlatl Tool"
            fill
            className="object-cover"
          />
        </div>

        {/* Info Box 1 */}
        <div className="bg-darker-bold-blue text-white w-full h-full rounded-3xl p-6 md:p-12 lg:p-16 xl:py-32 flex flex-col justify-center">
          <h2 className="font-songer font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-6">
            HEADER TEXT
          </h2>
          <p className="font-work-sans text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed">
            Our name is unique and chosen with intent because it offers a lot of parallels to how we view our team in relation to the clients we serve. In the digital age of information, it can be overwhelming and challenging to craft a path on one's own without guidance that is tailored to address specific needs. Atlatl Advisers is a team of professionals that can serve as a tool to help shape a path for individuals, families and businesses to achieve their goals, much like an atlatl was a tool that revolutionized hunting for people thousands of years ago.
          </p>
        </div>

        {/* Info Box 2 */}
        <div className="bg-darker-bold-blue text-white w-full h-full rounded-3xl p-6 md:p-12 lg:p-16 xl:py-32 flex flex-col justify-center">
          <h2 className="font-songer font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-6">
            HEADER TEXT
          </h2>
          <p className="font-work-sans text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed">
            The name offers not only a nice metaphor for how we view ourselves as a resource, but it also has a personal family connection. A beloved relative of one of our employees was a skilled artisan by hobby and crafted wooden atlatls and other items, some of which can be found in our office. Upon his passing, and as the firm was expanding, it felt only appropriate to pay homage to this special person.
          </p>
        </div>

        {/* Info Image 2 */}
        <div className="relative w-full h-96 md:h-full rounded-3xl overflow-hidden">
          <Image
            src="/images/placeholder-vertical.png"
            alt="Placeholder"
            fill
            className="object-cover"
          />
        </div>

        {/* Info Image 3 */}
        <div className="relative w-full h-96 md:h-full rounded-3xl overflow-hidden">
          <Image
            src="/trio.png"
            alt="Trio"
            fill
            className="object-cover"
          />
        </div>

        {/* Info Box 3 */}
        <div className="bg-darker-bold-blue text-white w-full h-full rounded-3xl p-6 md:p-12 lg:p-16 xl:py-32 flex flex-col justify-center">
          <h2 className="font-songer font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-6">
            HEADER TEXT
          </h2>
          <p className="font-work-sans text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed">
            Perhaps it is unsurprising that family and relationships are at the center of our business. We've built up a group that includes some of our own family members, and also those who have come to be seen as family. Our team is composed of individuals who bring different perspectives from their personal and professional histories to create an approach to wealth management that goes beyond the numbers. We strive for a balance that allows our employees to spend time with family and to pursue their passions, so that they come to work every day feeling fulfilled and ready to help clients achieve a level of success as they define it.
          </p>
        </div>
      </section>

      {/* Commitment Section */}
      <h1 className="font-songer text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-center text-dark-blue pb-8">
        OUR COMMITMENT
      </h1>

      <section className="w-full bg-gradient-to-b from-darker-light-blue from-50% to-dark-blue to-50% py-4 md:py-12">
        <div className="flex flex-wrap justify-center gap-8 px-4 md:px-8">
          {/* Commitment Box 1 */}
          <div className="w-full sm:w-80 md:w-96 bg-darker-bold-blue rounded-3xl p-6 flex flex-col items-center text-white">
            <Image
              src="/compass.svg"
              alt="Client Stewardship"
              width={50}
              height={50}
              className="w-12 h-12 mb-4"
            />
            <h3 className="font-songer font-bold text-xl md:text-2xl text-center mb-4 min-h-[5rem] flex items-center">
              Client Stewardship
            </h3>
            <p className="font-work-sans text-base leading-relaxed text-left">
              We are committed to providing an overall level of expertise that creates results for our clients that are specific to their aspirations. Exemplary service across the full range of our clients' needs is our paramount and unrelenting focus.​ We consistently strive for excellence in all that we do.
            </p>
          </div>

          {/* Commitment Box 2 */}
          <div className="w-full sm:w-80 md:w-96 bg-darker-bold-blue rounded-3xl p-6 flex flex-col items-center text-white">
            <Image
              src="/shield-half.svg"
              alt="Integrity"
              width={50}
              height={50}
              className="w-12 h-12 mb-4"
            />
            <h3 className="font-songer font-bold text-xl md:text-2xl text-center mb-4 min-h-[5rem] flex items-center">
              Integrity as the standard
            </h3>
            <p className="font-work-sans text-base leading-relaxed text-left">
              We have an unwavering commitment to operate with integrity, trust, and sincerity, at all times. We are upheld and regulated to a Fiduciary Duty which means we always act in the best interest of our clients. We strive to ensure that our employees, clients, and communities are proud of the Firm, its history, its legacy, its reputation, and what it stands for.
            </p>
          </div>

          {/* Commitment Box 3 */}
          <div className="w-full sm:w-80 md:w-96 bg-darker-bold-blue rounded-3xl p-6 flex flex-col items-center text-white">
            <Image
              src="/book.svg"
              alt="Education"
              width={50}
              height={50}
              className="w-12 h-12 mb-4"
            />
            <h3 className="font-songer font-bold text-xl md:text-2xl text-center mb-4 min-h-[5rem] flex items-center">
              Education
            </h3>
            <p className="font-work-sans text-base leading-relaxed text-left">
              We believe strong relationships begin with education and understanding. By learning each client's background and goals, we deliver more personalized and lasting guidance. This approach helps us engage with multiple generations and deepen the impact of our work. We're equally dedicated to ongoing development so we can remain informed and proactive in addressing the evolving needs of our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Your Goals, Our Purpose Section */}
      <section className="bg-dark-blue text-white px-4 md:px-16 lg:px-40 py-10 md:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Video */}
          <div className="w-full lg:w-1/2">
            <video
              src="/our-purpose.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-3xl"
              style={{ maxHeight: "53.5rem" }}
            />
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6 lg:gap-8 lg:pl-8">
            <div>
              <h1 className="font-songer text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Your Goals, Our Purpose
              </h1>
              <p className="font-work-sans text-sm md:text-base lg:text-lg leading-relaxed">
                We exist to empower individuals and families to navigate the complexities of wealth with trust, integrity, and personalized guidance.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-3">
                <Image
                  src="/compass.svg"
                  alt="Vision"
                  width={50}
                  height={50}
                  className="w-10 md:w-12 lg:w-16 h-auto"
                />
                <h2 className="font-songer text-xl md:text-2xl lg:text-3xl font-bold">
                  Vision
                </h2>
              </div>
              <p className="font-work-sans text-sm md:text-base lg:text-lg leading-relaxed">
                To be trusted advisers in navigating the complexities of multi-generational wealth for families and individuals. We tailor our services around our clients and their dynamic family needs.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-3">
                <Image
                  src="/compass.svg"
                  alt="Mission"
                  width={50}
                  height={50}
                  className="w-10 md:w-12 lg:w-16 h-auto"
                />
                <h2 className="font-songer text-xl md:text-2xl lg:text-3xl font-bold">
                  Our Mission
                </h2>
              </div>
              <p className="font-work-sans text-sm md:text-base lg:text-lg leading-relaxed">
                We aspire to redefine and elevate the financial services experience through exceptional client service and a commitment to excellence in all that we do. Our name was chosen with intent—the atlatl is leveraged to provide greater accuracy, precision, and velocity over long distances.​ The cornerstone to our service is the client experience. We empower individuals, families, business owners, and institutions to realize their aspirations and achieve some of life's most important goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-dark-blue text-white">
        <HomeTeam half_toggle={false} />
      </section>

      {/* Final CTA Section */}
      <section className="w-full bg-darker-light-blue">
        <CtaSection />
      </section>
    </main>
  );
}