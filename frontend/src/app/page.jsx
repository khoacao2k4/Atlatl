import BlockRenderer from '@/components/blocks/BlockRenderer';
import { fetchAPI, getStrapiURL } from '@/lib/strapi';

async function getHomePageData() {
  try {
    const populateQuery = 
      `filters[slug][$eq]=home&populate[seo][populate]=*&populate[blocks][on][blocks.hero][populate]=*&populate[blocks][on][blocks.title-media-text][populate]=*&populate[blocks][on][blocks.team-preview][populate][team_members][populate]=*&populate[blocks][on][blocks.team-preview][populate][button][populate]=*&populate[blocks][on][blocks.team][populate][teamMembers][populate]=*&populate[blocks][on][blocks.carousel][populate]=*&populate[blocks][on][blocks.process-table][populate]=*&populate[blocks][on][blocks.call-to-action][populate]=*&populate[blocks][on][blocks.definition][populate]=*&populate[blocks][on][blocks.centered-media][populate]=*&populate[blocks][on][blocks.card-row][populate][card][populate][media][fields]=id,url,mime,width,height,alternativeText&populate[blocks][on][blocks.media-list-split][populate][media][fields]=id,url,mime,width,height,alternativeText&populate[blocks][on][blocks.media-list-split][populate][item][populate][media][fields]=id,url,mime,width,height,alternativeText&populate[blocks][on][blocks.media-text-split][populate][row][populate][media][fields]=id,url,mime,width,height,alternativeText&populate[blocks][on][blocks.dynamic-paragraph][populate][media][fields]=id,url,mime,width,height,alternativeText&populate[blocks][on][blocks.dynamic-paragraph][populate][button][populate]=*&populate[blocks][on][blocks.dynamic-paragraph][populate][Content][populate]=*&populate[blocks][on][blocks.faq][populate][topic][populate][questionblocks][populate]=*&populate[blocks][on][blocks.title-text-multiple-media][populate][media][fields]=id,url,mime,width,height,alternativeText,name,ext&populate[blocks][on][blocks.flow][populate][block][populate]=*&populate[blocks][on][blocks.login-table][populate][media][populate]=*&populate[blocks][on][blocks.login-table][populate][points][populate]=*&populate[blocks][on][blocks.login-table][populate][button][populate]=*&populate[blocks][on][blocks.login-table][populate][link][populate]=*`;

    const data = await fetchAPI(
      `/api/pages?${populateQuery}`,
      { next: { revalidate: 1 } }
    );

    return data.data[0] || null;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return null;
  }
}

export async function generateMetadata() {
  const page = await getHomePageData();

  if (!page?.seo?.[0]) {
    return {
      title: 'Home',
    };
  }

  const seo = page.seo[0];
  
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: seo.metaImage ? [getStrapiURL(seo.metaImage.url)] : [],
    },
  };
}

export default async function HomePage() {
  const page = await getHomePageData();

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Homepage Not Found</h1>
      </div>
    );
  }

  return (
    <main>
      <BlockRenderer blocks={page.blocks} />
    </main>
  );
}