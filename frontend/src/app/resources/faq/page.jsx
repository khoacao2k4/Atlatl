import { redirect } from 'next/navigation';
import FaqSection from '@/app/components/service/FaqSection';
import { getFAQContent } from '@/lib/strapi';

export default async function FAQPage() {
    const faqs = await getFAQContent();

    if (!faqs || !faqs.topics || faqs.topics.length === 0) {
        redirect('/maintenance');
    }

    return (
        <section className="bg-white py-16 md:py-24">
            <FaqSection faqBlocks={faqs.topics} />
        </section>
    )
}