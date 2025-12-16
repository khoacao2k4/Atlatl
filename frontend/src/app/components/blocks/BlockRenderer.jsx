import Hero from './Hero';
import AboutUs from './AboutUs';
import TeamPreview from './TeamPreview';
import Carousel from './Carousel';
import ProcessTable from './ProcessTable';
import CallToAction from './CallToAction';
import Team from './Team';

const componentMap = {
  'blocks.hero': Hero,
  'blocks.about-us': AboutUs,
  'blocks.team-preview': TeamPreview,
  'blocks.carousel': Carousel,
  'blocks.process-table': ProcessTable,
  'blocks.call-to-action': CallToAction,
  'blocks.team': Team,
};

export default function BlockRenderer({ blocks }) {
  return (
    <>
      {blocks.map((block) => {
        const Component = componentMap[block.__component];
        
        if (!Component) {
          console.warn(`Component not found for: ${block.__component}`);
          return null;
        }

        return <Component key={block.id} {...block} />;
      })}
    </>
  );
}