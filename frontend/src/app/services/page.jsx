import { redirect } from 'next/navigation'
import TabContent from "../components/service/TabContent";
import { getServicepageContent } from "@/lib/strapi";
import FaqSection from '../components/service/FaqSection';

export default async function ServicesPage() {
  const services = await getServicepageContent();
  if (!services || !services.serviceblock || services.serviceblock.length === 0) {
    redirect('/maintenance');
  }
  const service_blocks = services.serviceblock;

  return (
    <>
      <section>
          {
              service_blocks.map((block) => (
              <TabContent
                  key={"service_block_" + block.id}
                  tabContent={block}
              />))
          }
      </section>

      <section className="bg-white py-16 md:py-24">
        <FaqSection />
      </section>
    </>
  )
}