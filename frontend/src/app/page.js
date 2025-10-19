export default function Home() {
  return (
    <div>
      <h1>Home</h1>
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
