import { RecentBlogCard } from "./Post";

export default function PostsSection({ name, }) {
    return (
        <div className="bg-light-blue rounded-[30px] p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-songer text-black mb-6 uppercase pl-6">
                {name}
            </h2>

            {/* Three-column responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2">
                <RecentBlogCard
                    title="An Important Look at Retirement Planning and Taxes in the Modern Era"
                    tag="blog"
                    excerpt="A deep dive into tax-advantaged retirement accounts, examining the pros and cons of traditional versus Roth contributions."
                />
                <RecentBlogCard
                    title="Best Practices for Reviewing Your Investment Portfolio Quarterly"
                    tag="template"
                    excerpt="Use this quick checklist to ensure your asset allocation is aligned with your long-term financial goals and risk tolerance."
                />
                <RecentBlogCard
                    title="The Ultimate Guide to Maxing Out Your HSA Contributions and How to Use It"
                    tag="calculator"
                    excerpt="Learn how to leverage a Health Savings Account (HSA) as a powerful, triple-tax-advantaged retirement vehicle."
                />
                <RecentBlogCard
                    title="The Ultimate Guide to Maxing Out Your HSA Contributions and How to Use It"
                    tag="calculator"
                    excerpt="Learn how to leverage a Health Savings Account (HSA) as a powerful, triple-tax-advantaged retirement vehicle."
                />
            </div>
        </div>
    );
}