export default function RoadmapConnector({ direction }) {
    // direction = "rtl" (Right to Left) or "ltr" (Left to Right)
    // We use an SVG to draw the line. 
    // "vectorEffect='non-scaling-stroke'" keeps the line thickness constant even if the SVG stretches.

    return (
        <div className="hidden md:flex w-full h-16 md:h-24 justify-center items-center -my-4 z-0 relative">
            {/* The container is 50% width because the images are centered in 50% columns. 
                This spans the gap between the center of the Left col and center of Right col. */}
            <div className="w-1/2 h-full relative">
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="overflow-visible"
                >
                    {direction === 'rtl' ? (
                        // Path: Start Top-Right -> Down -> Left -> Down (to Bottom-Left)
                        <path
                            d="M 100 0 V 50 H 0 V 100"
                            fill="none"
                            stroke="#1B365D" // Replace with your exact dark-blue hex
                            strokeWidth="3"
                            vectorEffect="non-scaling-stroke"
                        />
                    ) : (
                        // Path: Start Top-Left -> Down -> Right -> Down (to Bottom-Right)
                        <path
                            d="M 0 0 V 50 H 100 V 100"
                            fill="none"
                            stroke="#1B365D" // Replace with your exact dark-blue hex
                            strokeWidth="3"
                            vectorEffect="non-scaling-stroke"
                        />
                    )}
                </svg>
            </div>
        </div>
    );
}