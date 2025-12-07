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
export async function getTeamMembers(isFeatured = true) {
  const path = "/api/team-members";
  let params = "?fields[0]=name&fields[1]=position&fields[2]=slug&fields[3]=suffix&populate=*"
  if (isFeatured) {
    params += "&fields[4]=featured_order&filters[featured][$eq]=true&sort=featured_order:asc";
  }
  const options = { cache: "no-store" };
  const json = await fetchStrapiData(path, params, options);
  if (!json || !json.data) {
    console.warn("No featured team members found or API error.");
    return []; // Return an empty array
  }
  
  return json.data;
}

export async function getTeamMemberDetails(slug) {
  console.log(slug)
  const path = "/api/team-members";
  const params = `?filters[slug][$eq]=${slug}&populate=*`;
  const options = { cache: "no-store" };
  const json = await fetchStrapiData(path, params, options);
  if (!json || !json.data) {
    console.warn("No team member details found or API error.");
    return null;
  }
  console.log(json.data[0])
  return json.data[0];
}

export async function getHomepageContent() {
  const path = "/api/homepage";
  const params = "?populate=*";
  const options = { cache: "no-store" };

  const json = await fetchStrapiData(path, params, options);
  if (!json || !json.data) {
    console.warn("No homepage content found or API error.");
    return null;
  }
  
  return json.data;
}

export async function getServicepageContent() {
  const path = "/api/servicepage";
  const params = "?populate[0]=serviceblock&populate[1]=serviceblock.keywords&populate[2]=serviceblock.keywords.image";
  const options = { cache: "no-store" };

  const json = await fetchStrapiData(path, params, options);
  if (!json || !json.data) {
    console.warn("No service content found or API error.");
    return null;
  }
  
  return json.data;
}

export async function getFAQContent() {
  const path = "/api/faq";
  const params = "?populate[0]=topics.questionblocks";
  const options = { cache: "no-store" };

  const json = await fetchStrapiData(path, params, options);
  if (!json || !json.data) {
    console.warn("No FAQ content found or API error.");
    return null;
  }
  
  return json.data;
}

export async function getProcessContent() {
  const path = "/api/processpage";
  const params = "?populate[0]=step.symbol";
  const options = { cache: "no-store" };

  const json = await fetchStrapiData(path, params, options);
  if (!json || !json.data) {
    console.warn("No process content found or API error.");
    return null;
  }
  
  return json.data;
}

export async function getWhyAtlatlContent() {
  const path = "/api/whyatlatlpage";
  const params = "?populate[0]=infogrid.media&populate[1]=bannerMedia&populate[2]=purposeMedia";
  const options = { cache: "no-store" };

  const json = await fetchStrapiData(path, params, options);
  if (!json || !json.data) {
    console.warn("No Why Atlatl content found or API error.");
    return null;
  }
  
  return json.data;
}