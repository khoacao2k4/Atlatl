import HomeTeam from "../components/homepage/HomeTeam";
import CtaSection from "../components/homepage/CtaSection";
import HeroSection from "./HeroSection";
import VideoSection from "./VideoSection";
import CallToActionBanner from "./CallToActionBanner";
import InfoGrid from "./InfoGrid";
import CommitmentSection from "./CommitmentSection";
import PurposeSection from "./PurposeSection";
import { getWhyAtlatlContent } from "@/lib/strapi";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Why Atlatl Advisers",
};


export default async function WhyAtlatlPage() {
  const whyAtlatlContent = await getWhyAtlatlContent();
  
  if (!whyAtlatlContent) {
    redirect("/maintenance");
  }

  const infogridData = whyAtlatlContent.infogrid.flatMap((item, index) => {
    // Create the standard objects your component expects
    const textItem = {
      type: 'text',
      title: item.title,
      content: item.description,
    };

    const mediaItem = {
      type: 'media',
      media: item.media,
      alt: item.title,
    };

    // If the index is even, return [textItem, mediaItem], otherwise return [mediaItem, textItem]
    if (index % 2 !== 0) {
      return [textItem, mediaItem];
    } else {
      return [mediaItem, textItem];
    }
  });

  const pageData = {
    hero: {
      title: "WHY ATLATL",
      pronunciation: "at· latl" + "\n/ˈat ˌ lad( ə )l\nnoun",
      description: "A tool that uses leverage to propel an arrow towards its intended target with greater accuracy, velocity, and power.",
      logoSrc: "/images/triangle_white.svg"
    },
    video: {
      media: whyAtlatlContent?.bannerMedia
    },
    ctaBanner: {
      title: "READY TO TAKE THE NEXT STEP TOWARD YOUR FINANCIAL FUTURE?",
      subtitle: "LET'S BUILD YOUR PLAN TOGETHER."
    },
    infoGrid: infogridData,
    commitment: {
      title: "OUR COMMITMENT",
      items: [
        {
          icon: "/images/compass.svg",
          title: "Client Stewardship",
          description: "We are committed to providing an overall level of expertise that creates results for our clients that are specific to their aspirations. Exemplary service across the full range of our clients' needs is our paramount and unrelenting focus.​ We consistently strive for excellence in all that we do."
        },
        {
          icon: "/images/shield-half.svg",
          title: "Integrity as the standard",
          description: "We have an unwavering commitment to operate with integrity, trust, and sincerity, at all times. We are upheld and regulated to a Fiduciary Duty which means we always act in the best interest of our clients. We strive to ensure that our employees, clients, and communities are proud of the Firm, its history, its legacy, its reputation, and what it stands for."
        },
        {
          icon: "/images/book.svg",
          title: "Education",
          description: "We believe strong relationships begin with education and understanding. By learning each client's background and goals, we deliver more personalized and lasting guidance. This approach helps us engage with multiple generations and deepen the impact of our work. We're equally dedicated to ongoing development so we can remain informed and proactive in addressing the evolving needs of our clients."
        }
      ]
    },
    purpose: {
      media: whyAtlatlContent.purposeMedia,
      title: "Your Goals, Our Purpose",
      subtitle: "We exist to empower individuals and families to navigate the complexities of wealth with trust, integrity, and personalized guidance.",
      vision: {
        icon: "/images/eye.svg",
        title: "Vision",
        description: "To be trusted advisers in navigating the complexities of multi-generational wealth for families and individuals. We tailor our services around our clients and their dynamic family needs."
      },
      mission: {
        icon: "/images/target.svg",
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
        media={pageData.video.media}
      />
      
      <CallToActionBanner 
        title={pageData.ctaBanner.title}
        subtitle={pageData.ctaBanner.subtitle}
        showMobile={false}
      />
      
      <InfoGrid items={pageData.infoGrid} />
      
      <CommitmentSection 
        title={pageData.commitment.title}
        items={pageData.commitment.items}
      />

      <CallToActionBanner 
        title={pageData.ctaBanner.title}
        subtitle={pageData.ctaBanner.subtitle}
        showMobile={true}
      />
      
      <PurposeSection 
        media={pageData.purpose.media}
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