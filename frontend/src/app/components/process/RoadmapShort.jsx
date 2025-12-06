import RoadmapShortSection from "./RoadmapShortSection"

export default function RoadmapShort() {
    return (
        <div className="flex flex-wrap flex-row justify-evenly mt-12">
            <RoadmapShortSection title="DISCOVER" />
            <RoadmapShortSection title="PLAN" />
            <RoadmapShortSection title="AGREE" />
            <RoadmapShortSection title="IMPLEMENT" />
            <RoadmapShortSection title="REVIEW" />
        </div>
    )
}