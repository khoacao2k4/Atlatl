import Hero from './Hero';
import TitleMediaText from './TitleMediaText';
import TeamPreview from './TeamPreview';
import Carousel from './Carousel';
import ProcessTable from './ProcessTable';
import CallToAction from './CallToAction';
import Team from './Team';
import Definition from './Definition';
import CenteredMedia from './CenteredMedia';
import MediaTextSplit from './MediaTextSplit';
import CardRow from './CardRow';
import MediaListSplit from './MediaListSplit';
import DynamicParagraph from './DynamicParagraph';
import FAQ from './FAQ';
import TitleTextMultipleMedia from './TitleTextMultipleMedia';
import Flow from './Flow';

const componentMap = {
  'blocks.hero': Hero,
  'blocks.title-media-text': TitleMediaText,
  'blocks.team-preview': TeamPreview,
  'blocks.carousel': Carousel,
  'blocks.process-table': ProcessTable,
  'blocks.call-to-action': CallToAction,
  'blocks.team': Team,
  'blocks.definition': Definition,
  'blocks.centered-media': CenteredMedia,
  'blocks.media-text-split': MediaTextSplit,
  'blocks.card-row': CardRow,
  'blocks.media-list-split': MediaListSplit,
  'blocks.dynamic-paragraph': DynamicParagraph,
  'blocks.faq': FAQ,
  'blocks.title-text-multiple-media': TitleTextMultipleMedia,
  'blocks.flow': Flow,
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

        return (
          <Component
            key={`${block.__component}-${block.id}`}
            {...block}
          />
        );
      })}
    </>
  );
}