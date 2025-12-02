import TabContent from "../components/service/TabContent";

export default function ServicesPage() {
  const content = {
        holistic: {
            title: "Holistic",
            text: "Embrace a holistic approach to financial planning that encompasses all aspects of your financial life, including tax, insurance, estate, philanthropy, and succession planning. This ensures that every part of your strategy is harmonized with your overall goals and values, providing a comprehensive and integrated financial landscape."
        },
        unified: {
            title: "Unified",
            text: "We bring together disjointed financial pieces into a single, cohesive picture. By unifying your investment management with your broader life goals, we eliminate redundancies and ensure that every dollar is working towards the same objective. Experience the clarity that comes from a fully aligned financial ecosystem."
        },
        practical: {
            title: "Practical",
            text: "While we dream big, we plan with feet on the ground. Our strategies are built on real-world data, actionable insights, and proven methodologies. We strip away the complex jargon to provide you with clear, executable steps that make sense for your specific situation and timeline."
        }
    };
  return <TabContent tabContent={content}/>
}