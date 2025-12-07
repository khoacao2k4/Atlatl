import RoadmapSection from "./RoadmapSection"
import RoadmapConnector from "./RoadmapConnector"
import React from "react"

export default function Roadmap({steps}) {
    return (
        // Added 'w-full' and adjusted spacing/padding
        <div className="flex flex-col w-full mt-12 md:mt-20 px-4 md:px-10 gap-12 items-center justify-center">
            {steps.map((step, idx) => (
                <React.Fragment key={`roadmap-${idx}`}>
                    <RoadmapSection 
                        stepNum={`${(idx + 1).toString().padStart(2, '0')}`} 
                        title={step.title} 
                        media={step.symbol}
                        reverse={idx % 2 !== 0}
                    >
                        {step.description}
                    </RoadmapSection>
                    {
                        idx < steps.length - 1 && (
                            <RoadmapConnector 
                                key={`connector-${idx}`} 
                                direction={ (idx % 2 === 0) ? "rtl" : "ltr" } 
                            />
                        )
                    }
                </React.Fragment>
            ))}
        </div>
    )
}