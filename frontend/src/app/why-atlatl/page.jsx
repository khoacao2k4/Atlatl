import HomeTeam from "../components/homepage/HomeTeam";
import CtaSection from "../components/homepage/CtaSection";
import HeroSection from "./HeroSection";
import VideoSection from "./VideoSection";
import CallToActionBanner from "./CallToActionBanner";
import InfoGrid from "./InfoGrid";
import CommitmentSection from "./CommitmentSection";
import PurposeSection from "./PurposeSection";

export default function WhyAtlatlPage() {
  // TODO: Replace with Strapi data
  const pageData = {
    hero: {
      title: "WHY ATLATL",
      pronunciation: "AT· LATL\n/ˈAT ˌ LAD( ə )L\nNOUN",
      description: "A tool that uses leverage to propel an arrow towards its intended target with greater accuracy, velocity, and power.",
      logoSrc: "/logo.svg"
    },
    video: {
      src: "/baby-swing.mp4",
      aspectRatio: "2.19 / 1"
    },
    ctaBanner: {
      title: "READY TO TAKE THE NEXT STEP TOWARD YOUR FINANCIAL FUTURE?",
      subtitle: "LET'S BUILD YOUR PLAN TOGETHER."
    },
    infoGrid: [
      {
        type: "image",
        src: "/AtlatlTool.png",
        alt: "Atlatl Tool"
      },
      {
        type: "text",
        title: "HEADER TEXT",
        content: "Our name is unique and chosen with intent because it offers a lot of parallels to how we view our team in relation to the clients we serve. In the digital age of information, it can be overwhelming and challenging to craft a path on one's own without guidance that is tailored to address specific needs. Atlatl Advisers is a team of professionals that can serve as a tool to help shape a path for individuals, families and businesses to achieve their goals, much like an atlatl was a tool that revolutionized hunting for people thousands of years ago."
      },
      {
        type: "text",
        title: "HEADER TEXT",
        content: "The name offers not only a nice metaphor for how we view ourselves as a resource, but it also has a personal family connection. A beloved relative of one of our employees was a skilled artisan by hobby and crafted wooden atlatls and other items, some of which can be found in our office. Upon his passing, and as the firm was expanding, it felt only appropriate to pay homage to this special person."
      },
      {
        type: "image",
        src: "/images/placeholder-vertical.png",
        alt: "Placeholder"
      },
      {
        type: "image",
        src: "/trio.png",
        alt: "Trio"
      },
      {
        type: "text",
        title: "HEADER TEXT",
        content: "Perhaps it is unsurprising that family and relationships are at the center of our business. We've built up a group that includes some of our own family members, and also those who have come to be seen as family. Our team is composed of individuals who bring different perspectives from their personal and professional histories to create an approach to wealth management that goes beyond the numbers. We strive for a balance that allows our employees to spend time with family and to pursue their passions, so that they come to work every day feeling fulfilled and ready to help clients achieve a level of success as they define it."
      }
    ],
    commitment: {
      title: "OUR COMMITMENT",
      items: [
        {
          icon: "/compass.svg",
          title: "Client Stewardship",
          description: "We are committed to providing an overall level of expertise that creates results for our clients that are specific to their aspirations. Exemplary service across the full range of our clients' needs is our paramount and unrelenting focus.​ We consistently strive for excellence in all that we do."
        },
        {
          icon: "/shield-half.svg",
          title: "Integrity as the standard",
          description: "We have an unwavering commitment to operate with integrity, trust, and sincerity, at all times. We are upheld and regulated to a Fiduciary Duty which means we always act in the best interest of our clients. We strive to ensure that our employees, clients, and communities are proud of the Firm, its history, its legacy, its reputation, and what it stands for."
        },
        {
          icon: "/book.svg",
          title: "Education",
          description: "We believe strong relationships begin with education and understanding. By learning each client's background and goals, we deliver more personalized and lasting guidance. This approach helps us engage with multiple generations and deepen the impact of our work. We're equally dedicated to ongoing development so we can remain informed and proactive in addressing the evolving needs of our clients."
        }
      ]
    },
    purpose: {
      videoSrc: "/our-purpose.mp4",
      title: "Your Goals, Our Purpose",
      subtitle: "We exist to empower individuals and families to navigate the complexities of wealth with trust, integrity, and personalized guidance.",
      vision: {
        icon: "/compass.svg",
        title: "Vision",
        description: "To be trusted advisers in navigating the complexities of multi-generational wealth for families and individuals. We tailor our services around our clients and their dynamic family needs."
      },
      mission: {
        icon: "/compass.svg",
        title: "Our Mission",
        description: "We aspire to redefine and elevate the financial services experience through exceptional client service and a commitment to excellence in all that we do. Our name was chosen with intent—the atlatl is leveraged to provide greater accuracy, precision, and velocity over long distances.​ The cornerstone to our service is the client experience. We empower individuals, families, business owners, and institutions to realize their aspirations and achieve some of life's most important goals."
      }
    }
  };

  return (
    <main className="bg-darker-light-blue overflow-x-hidden">
      <HeroSection 
        title={pageData.hero.title}
        pronunciation={pageData.hero.pronunciation}
        description={pageData.hero.description}
        logoSrc={pageData.hero.logoSrc}
      />
      
      <VideoSection 
        src={pageData.video.src}
        aspectRatio={pageData.video.aspectRatio}
      />
      
      <CallToActionBanner 
        title={pageData.ctaBanner.title}
        subtitle={pageData.ctaBanner.subtitle}
      />
      
      <InfoGrid items={pageData.infoGrid} />
      
      <CommitmentSection 
        title={pageData.commitment.title}
        items={pageData.commitment.items}
      />
      
      <PurposeSection 
        videoSrc={pageData.purpose.videoSrc}
        title={pageData.purpose.title}
        subtitle={pageData.purpose.subtitle}
        vision={pageData.purpose.vision}
        mission={pageData.purpose.mission}
      />
      
      <section className="py-16 md:py-24 bg-dark-blue text-white">
        <HomeTeam half_toggle={false} />
      </section>
      
      <section className="w-full bg-darker-light-blue">
        <CtaSection />
      </section>
    </main>
  );
}