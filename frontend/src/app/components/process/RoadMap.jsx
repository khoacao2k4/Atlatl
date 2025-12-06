import RoadmapSection from "./RoadmapSection"
import RoadmapConnector from "./RoadmapConnector"

export default function Roadmap() {
    return (
        // Added 'w-full' and adjusted spacing/padding
        <div className="flex flex-col w-full mt-12 md:mt-20 px-4 md:px-10 gap-12 items-center justify-center">
            
            {/* STEP 1 */}
            <RoadmapSection stepNum="01" title="DISCOVER">
                Our process begins with a personalized discovery meeting, where we take the time to understand you—your goals, priorities, and long-term vision. Through in-depth conversations, we explore what matters most to you while also introducing you to Atlatl Advisers and how we can help guide your financial journey.
            </RoadmapSection>

            {/* CONNECTOR: Step 1 (Right Image) -> Step 2 (Left Image) = RTL */}
            <RoadmapConnector direction="rtl" />

            {/* STEP 2 */}
            <RoadmapSection stepNum="02" title="PLAN" reverse={true}>
                In our second meeting, we’ll review your initial financial plan, providing personalized recommendations to optimize your overall strategy. This includes guidance on estate planning, tax efficiency, and insurance solutions to help protect and grow your wealth.
            </RoadmapSection>

            {/* CONNECTOR: Step 2 (Left Image) -> Step 3 (Right Image) = LTR */}
            <RoadmapConnector direction="ltr" />

            {/* STEP 3 */}
            <RoadmapSection stepNum="03" title="AGREE">
                Together, we develop a comprehensive strategy that balances both sides of your financial picture, providing solutions to help you achieve your goals at every stage of life.
            </RoadmapSection>

            {/* CONNECTOR: Step 3 (Right Image) -> Step 4 (Left Image) = RTL */}
            <RoadmapConnector direction="rtl" />

            {/* STEP 4 */}
            <RoadmapSection stepNum="04" title="IMPLEMENT" reverse={true}>
                Once we establish the framework of our partnership, we’ll guide you through a seamless onboarding process, integrating you into our client portals and putting your tailored financial plan into action.
            </RoadmapSection>

            {/* CONNECTOR: Step 4 (Left Image) -> Step 5 (Right Image) = LTR */}
            <RoadmapConnector direction="ltr" />

            {/* STEP 5 */}
            <RoadmapSection stepNum="05" title="REVIEW">
                Once your comprehensive financial plan is in place, we will meet regularly to review your investments and address key areas such as tax strategies, estate planning, and insurance to ensure your plan remains aligned with your goals.
            </RoadmapSection>        
        </div>
    )
}