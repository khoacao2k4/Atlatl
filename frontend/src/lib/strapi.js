/**
 * Fetches data from the Strapi API.
 * @param {string} path The API path (e.g., "/api/team-members")
 * @param {string} urlParams Strapi URL parameters (e.g., "?populate=*")
 * @param {object} options Next.js fetch options (e.g., { next: { revalidate: 60 } })
 */

async function fetchStrapiData(path, urlParams = "", options = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";
  const apiToken = process.env.STRAPI_API_TOKEN;

  if (!apiToken) {
    throw new Error("STRAPI_API_TOKEN is not defined in .env.local");
  }

  const url = `${apiUrl}${path}${urlParams}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      ...options,
    });

    if (!res.ok) {
      console.error(`Strapi API Error: ${res.status} ${res.statusText} at ${url}`);
      return null;
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Failed to fetch Strapi data:", error);
    return null; 
  }
}

/**
 * Gets all featured team members.
 */
export async function getFeaturedTeamMembers() {
  const path = "/api/team-members";
  const params = "?filters[featured][$eq]=true&populate=*";
  const options = { cache: "no-store" };

  const json = await fetchStrapiData(path, params, options);

  if (!json || !json.data) {
    console.warn("No featured team members found or API error.");
    return []; // Return an empty array
  }
  
  return json.data;
}