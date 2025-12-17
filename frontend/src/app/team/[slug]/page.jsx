import { notFound } from "next/navigation";
import { fetchAPI, getStrapiURL } from "@/lib/strapi";
import TeamMember from "@/components/blocks/TeamMember";

async function getTeamMemberData(slug) {
  try {
    const populateQuery = `filters[slug][$eq]=${slug}&populate=*`;

    const data = await fetchAPI(
      `/api/team-members?${populateQuery}`,
      { next: { revalidate: 1 } }
    );

    return data.data[0] || null;
  } catch (error) {
    console.error('Error fetching team member data:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const member = await getTeamMemberData(slug);

  if (!member) {
    return {
      title: 'Team Member Not Found',
    };
  }

  const fullName = member.suffix 
    ? `${member.name}, ${member.suffix}` 
    : member.name;
  
  return {
    title: `${fullName} - ${member.position}`,
    description: member.description?.substring(0, 160) || `Learn more about ${fullName}, ${member.position} at Atlatl Advisers`,
    openGraph: {
      title: `${fullName} - ${member.position}`,
      description: member.description?.substring(0, 160),
      images: member.avatar ? [getStrapiURL(member.avatar.url)] : [],
    },
  };
}

export default async function TeamMemberPage({ params }) {
  const { slug } = await params;
  const member = await getTeamMemberData(slug);

  if (!member) {
    return notFound();
  }

  return <TeamMember member={member} />;
}