import Image from 'next/image';
import HomeTeam from './components/HomeTeam';
import HomeFootnote from './components/HomeFootnote';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-light-blue py-16 md:py-24">
        <div className="container mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column: Text Content & Buttons */}
            <div className="flex flex-col justify-center text-center md:text-left font-songer">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-black leading-tight">
                YOUR <span className="text-bold-blue">WEALTH.</span>
                <br />
                OUR <span className="text-bold-blue">EXPERTISE.</span>
              </h1>
              <p className="mt-6 text-black text-lg font-work-sans">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <button className="w-auto bg-bold-blue text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-white hover:text-bold-blue">
                  Explore Services
                </button>
                <button className="w-auto bg-white text-bold-blue border-2 border-bold-blue font-bold py-3 px-8 rounded-lg shadow-sm hover:bg-bold-blue hover:text-white">
                  Button
                </button>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="flex items-center justify-center">
              <img
                src="https://placehold.co/600x600/378CE7/ffffff?text=Family"
                width={600}
                height={600}
                alt="Family"
                className="rounded-[100px] w-full h-auto max-w-md shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="font-sans bg-dark-blue py-16 md:py-24 text-white">
        <div className="container mx-auto px-10">
          <div className="rounded-2xl p-8">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-12 text-left font-songer">
              ABOUT <br />ATLATL ADVISERS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* Left Column: Image */}
              <div className="justify-center col-[1]">
                <img
                  src="https://placehold.co/800x600/EAEAEA/333?text=Adviser"
                  width={800}
                  height={600}
                  alt="A financial adviser meeting with a client."
                  className="rounded-3xl w-full h-auto max-w-md shadow-2xl object-cover"
                />
              </div>

              {/* Right Column: Text Content */}
              <div className="h-full flex flex-col justify-start gap-6 font-work-sans">
                <p className="text-xl font-bold">
                  Atlatl Advisers is a multi-family office wealth manager and a fully
                  independent, fee-only SEC Registered Investment Adviser.
                </p>
                <p className="text-xl">
                  We help qualified individuals and families comprehensively manage
                  their financial wellness with a focus on fiduciary responsibility,
                  personalized service, and holistic planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <HomeTeam />
      </section>

      <section>
        <HomeFootnote />
      </section>
    </div>
  );
}

// Run the code below instead for sample integration with backend, 
// Make sure that backend is up and running before frontend
/*
export default async function Home() {
  // Fetch articles from Strapi
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/articles?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  const json = await res.json();
  const articles = json.data || [];

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Home</h1>

      {articles.length === 0 ? (
        <p>No articles found. Try publishing one in Strapi.</p>
      ) : (
        <ul>
          {articles.map((article) => {
            const title = article.title || "Untitled";
            const description = article.description || "";
            const imageUrl = article.cover?.url
              ? process.env.NEXT_PUBLIC_API_URL + article.cover.url
              : null;
            const author = article.author?.name || "Unknown";
            const category = article.category?.name || "Uncategorized";

            return (
              <li
                key={article.id}
                style={{
                  marginBottom: "2rem",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "1rem",
                }}
              >
                <h2>{title}</h2>
                <p>
                  <strong>Category:</strong> {category}
                </p>
                <p>
                  <strong>By:</strong> {author}
                </p>
                <p>{description}</p>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={title}
                    width="400"
                    style={{ marginTop: "1rem", borderRadius: "8px" }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
//*/
