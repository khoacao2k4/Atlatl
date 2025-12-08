const PlaceholderImage = ({ className }) => (
    <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
        <img src={`https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/400/600`} alt="Placeholder" className="w-full h-full object-cover" />
    </div>
);

const tagColors = {
    "blog": '#5FADFF',
    "template": '#D90000',
    "calculator": '#E18906',
};

export function PostBlock({ title, tag, excerpt }) {
    const tagColor = tagColors[tag] || tagColors["blog"];
    return (
        <div className="flex items-start gap-4 sm:gap-6 w-full p-4 rounded-2xl transition-shadow duration-300 hover:shadow-lg cursor-pointer">
            <PlaceholderImage className="shrink-0 aspect-[8/7] max-w-[128px] rounded-2xl" />
            <div className="flex flex-col items-start gap-2 pt-1">
                <span className={`text-white text-sm font-bold px-3 py-1 rounded-full capitalize`}
                    style={{ backgroundColor: tagColor }}>
                    {tag}
                </span>
                <h3 className="text-lg sm:text-2xl font-songer text-foreground uppercase leading-tight line-clamp-2 text-ellipsis overflow-hidden">
                    {title}
                </h3>
            </div>
        </div>
    )
}

export function RecentBlogCard({ title, tag, excerpt }) {
    const tagColor = tagColors[tag] || tagColors["blog"];

    return (
        <div className="rounded-3xl p-6 flex flex-col h-full transition-shadow duration-300 hover:shadow-xl cursor-pointer">
            {/* Image (full width of the card) */}
            <PlaceholderImage className="w-full aspect-[4/3] rounded-2xl mb-3" />

            <div className="flex flex-col items-start gap-2 pt-1">
                {/* Tag - Use style prop for dynamic color */}
                <span className={`text-white text-sm font-bold px-3 py-1 rounded-full capitalize`}
                    style={{ backgroundColor: tagColor }}>
                    {tag}
                </span>

                {/* Title - Truncated to 2 lines */}
                <h3 className="text-xl font-songer text-black uppercase leading-tight line-clamp-2 mb-2">
                    {title}
                </h3>

                {/* Excerpt - Truncated to 3 lines */}
                <p className="text-black/80 text-sm leading-relaxed font-tenorite line-clamp-3">
                    {excerpt}
                </p>
            </div>
        </div>
    );
};

export function FeaturedBlog({ title, tag, excerpt }) {
    return (
        <div className="flex flex-col">
            <PlaceholderImage className="w-full aspect-video mb-6 rounded-2xl" />
            <div className="flex flex-col items-start gap-4">
                <span className="bg-blue-400 text-white text-sm font-bold px-3 py-1 rounded-full uppercase">
                    {tag}
                </span>
                <h3 className="text-3xl font-songer text-black font-bold">
                    {title}
                </h3>
                <p className="text-black font-tenorite max-w-lg">
                    {excerpt}
                </p>
            </div>
        </div>
    )
}