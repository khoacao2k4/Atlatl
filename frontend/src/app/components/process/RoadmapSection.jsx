import RoadmapTextSection from './RoadmapTextSection';
import RoadmapImageSection from './RoadmapImageSection';

export default function RoadmapSection({stepNum, title, children, imageUrl, reverse}) { 
    const className = `flex flex-col-reverse ${reverse ? "md:flex-row-reverse" : "md:flex-row"} mx-auto gap-8`;
    return (
        <div className={className}>
            <RoadmapTextSection stepNum={stepNum} title={title}>
                {children}
            </RoadmapTextSection>
            <RoadmapImageSection imageUrl={imageUrl} />
        </div>
    )
}