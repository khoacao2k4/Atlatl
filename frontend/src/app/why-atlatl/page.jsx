import "./page.css";
import Image from "next/image";
import HomeTeam from "../components/homepage/HomeTeam";
import CtaSection from "../components/homepage/CtaSection";

export default function WhyAtlatlPage() {
    return (
        <main className="why-atlatl">

            <section className="intro-section">
                <h1 className="title">WHY ATLATL</h1>

                <div className="definition-row">
                    <div className="definition">
                        <p className="phonetic">
                            AT· LATL<br />/ˈAT ˌ LAD( ə )L<br />NOUN
                        </p>
                        <p className="description">
                            A tool that uses leverage to propel an arrow towards its intended target with greater accuracy, velocity, and power.
                        </p>
                    </div>

                    <div className="logo-container">
                        <Image
                            src="/logo.svg"
                            alt="Atlatl Mark"
                            width={300}
                            height={300}
                            className="logo"
                            priority
                        />
                    </div>
                </div>
            </section>

            <section className="video-section">
                <video
                    className="baby-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    src="/baby-swing.mp4"
                />
            </section>

            <section className="cta-section">
                <div className="cta-text">
                    <h2>READY TO TAKE THE NEXT STEP TOWARD YOUR FINANCIAL FUTURE?</h2>
                    <p>LET’S BUILD YOUR PLAN TOGETHER.</p>
                </div>
            </section>

            <section className="info-section">
                <div className="info-image">
                    <Image
                        src="/AtlatlTool.png"
                        alt="Atlatl Tool"
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>

                <div className="info-box">
                    <h2>HEADER TEXT</h2>
                    <p>
                        Our name is unique and chosen with intent because it offers a lot of parallels to how we view our team in relation to the clients we serve. In the digital age of information, it can be overwhelming and challenging to craft a path on one’s own without guidance that is tailored to address specific needs. Atlatl Advisers is a team of professionals that can serve as a tool to help shape a path for individuals, families and businesses to achieve their goals, much like an atlatl was a tool that revolutionized hunting for people thousands of years ago.
                    </p>
                </div>

                <div className="info-box">
                    <h2>HEADER TEXT</h2>
                    <p>
                        The name offers not only a nice metaphor for how we view ourselves as a resource, but it also has a personal family connection. A beloved relative of one of our employees was a skilled artisan by hobby and crafted wooden atlatls and other items, some of which can be found in our office. Upon his passing, and as the firm was expanding, it felt only appropriate to pay homage to this special person.
                    </p>
                </div>

                <div className="info-image">
                    <Image
                        src="/images/placeholder-vertical.png"
                        alt="Placeholder"
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>

                <div className="info-image">
                    <Image
                        src="/trio.png"
                        alt="Trio"
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>

                <div className="info-box">
                    <h2>HEADER TEXT</h2>
                    <p>
                        Perhaps it is unsurprising that family and relationships are at the center of our business. We’ve built up a group that includes some of our own family members, and also those who have come to be seen as family.  Our team is composed of individuals who bring different perspectives from their personal and professional histories to create an approach to wealth management that goes beyond the numbers. We strive for a balance that allows our employees to spend time with family and to pursue their passions, so that they come to work every day feeling fulfilled and ready to help clients achieve a level of success as they define it.
                    </p>
                </div>
            </section>

            <h1 className="commitment-title">OUR COMMITMENT</h1>

            <section className="commitment-section">
                <div className="commitment-box-layout">

                    <div className="commitment-box">
                        <Image
                            src="/compass.svg"
                            alt="commitment logo"
                            width={50}
                            height={50}
                            className="commitment-logo"
                        />
                        <h3>Client Stewardship</h3>
                        <p>
                            We are committed to providing an overall level of expertise that creates results for our clients that are specific to their aspirations. Exemplary service across the full range of our clients’ needs is our paramount and unrelenting focus.​ We consistently strive for excellence in all that we do.
                        </p>
                    </div>

                    <div className="commitment-box">
                        <Image
                            src="/shield-half.svg"
                            alt="commitment logo"
                            width={50}
                            height={50}
                            className="commitment-logo"
                        />
                        <h3>Integrity as the standard</h3>
                        <p>
                            We have an unwavering commitment to operate with integrity, trust, and sincerity, at all times. We are upheld and regulated to a Fiduciary Duty which means we always act in the best interest of our clients. We strive to ensure that our employees, clients, and communities are proud of the Firm, its history, its legacy, its reputation, and what it stands for.
                        </p>
                    </div>

                    <div className="commitment-box">
                        <Image
                            src="/book.svg"
                            alt="commitment logo"
                            width={50}
                            height={50}
                            className="commitment-logo"
                        />
                        <h3>Education</h3>
                        <p>
                            We believe strong relationships begin with education and understanding. By learning each client’s background and goals, we deliver more personalized and lasting guidance. This approach helps us engage with multiple generations and deepen the impact of our work. We’re equally dedicated to ongoing development so we can remain informed and proactive in addressing the evolving needs of our clients.
                        </p>
                    </div>

                </div>
            </section>

            <section className="our-purpose-section">
                <div className="our-purpose-left">
                    <video
                        src="/our-purpose.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="our-purpose-video"
                    />
                </div>

                <div className="our-purpose-right">
                    <div className="our-purpose-right-header">
                        <h1>Your Goals, Our Purpose</h1>
                        <p>
                            We exist to empower individuals and families to navigate the complexities of wealth with trust, integrity, and personalized guidance.
                        </p>
                    </div>

                    <div className="our-purpose-right-body">
                        <div className="our-purpose-right-body-header">
                            <Image
                                src="/compass.svg"
                                alt="commitment-logo"
                                width={50}
                                height={50}
                                className="commitment-logo"
                            />
                            <h2>Vision</h2>
                        </div>
                        <p>
                            To be trusted advisers in navigating the complexities of multi-generational wealth for families and individuals. We tailor our services around our clients and their dynamic family needs.
                        </p>
                    </div>

                    <div className="our-purpose-right-body">
                        <div className="our-purpose-right-body-header">
                            <Image
                                src="/compass.svg"
                                alt="commitment-logo"
                                width={50}
                                height={50}
                                className="commitment-logo"
                            />
                            <h2>Our Mission</h2>
                        </div>
                        <p>
                            We aspire to redefine and elevate the financial services experience through exceptional client service and a commitment to excellence in all that we do. Our name was chosen with intent—the atlatl is leveraged to provide greater accuracy, precision, and velocity over long distances.​ The cornerstone to our service is the client experience. We empower individuals, families, business owners, and institutions to realize their aspirations and achieve some of life’s most important goals.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-dark-blue text-white">
                <HomeTeam half_toggle={false}/>
            </section>

            <section className="w-full bg-darker-light-blue">
                <CtaSection />
            </section>
        </main>
    );
}
