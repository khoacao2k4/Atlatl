import RoadmapShortSection from "./RoadmapShortSection"

export default function RoadmapShort({steps}) {
    return (
        <div className="flex flex-wrap flex-row justify-evenly mt-12">
            {steps.map((step,idx) => (
                <RoadmapShortSection 
                    key={"roadmap-short-" + idx} 
                    title={step.title} 
                    media={step.symbol} 
                />
            ))}
        </div>
    )
}