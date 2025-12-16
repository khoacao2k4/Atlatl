import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import { fetchAPI, getStrapiURL } from '@/lib/strapi2';

async function getPageData(slug) {
  try {
    const populateQuery = `filters[slug][$eq]=team-page&populate[seo][populate]=*&populate[blocks][on][blocks.hero][populate]=*&populate[blocks][on][blocks.about-us][populate]=*&populate[blocks][on][blocks.team-preview][populate][team_members][populate]=*&populate[blocks][on][blocks.team-preview][populate][button]=*&populate[blocks][on][blocks.team][populate][teamMembers][populate]=*&populate[blocks][on][blocks.carousel][populate]=*&populate[blocks][on][blocks.process-table][populate]=*&populate[blocks][on][blocks.call-to-action][populate]=*`;
    
    const data = await fetchAPI(
      `/api/pages?${populateQuery}`,
      { next: { revalidate: 1 } }
    );
    return data.data[0] || null;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page?.seo?.[0]) {
    return {
      title: 'Page Not Found',
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

export default async function Page({ params }) {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
      </div>
    );
  }

  return (
    <main>
      <BlockRenderer blocks={page.blocks} />
    </main>
  );
}