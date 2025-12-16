import { PostBlock, RecentBlogCard, FeaturedBlog } from '../../components/resource/Post';
import PostsSection from '../../components/resource/PostsSection';

export default function ResourcesPage() {
  return (
    <>
      <section className="container mx-auto px-6 xl:px-20 py-16 md:py-24 font-tenorite">
        {/* Main Section Header */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-songer text-darker-bold-blue font-bold text-center uppercase tracking-wide mb-16">
          Resources
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN: Featured Blogs */}
          <div className="bg-light-blue rounded-[30px] p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-songer text-black mb-6 uppercase">
              FEATURED BLOGS
            </h2>
            <FeaturedBlog
              title="First Featured Blog Post"
              tag="tag"
              excerpt="This is a short excerpt from the blog post to give readers an idea of the content."
            />
          </div>

          {/* RIGHT COLUMN: Spotlight */}
          <div className="bg-light-blue rounded-[30px] p-8 md:p-10 flex flex-col h-full">
            <div className="flex flex-col flex-grow">
              <h2 className="text-2xl md:text-3xl font-songer text-black mb-6 uppercase">
                SPOTLIGHT
              </h2>
              <div className="flex flex-col justify-evenly flex-grow">
                {/* Item 2: Blog List Item */}
                <PostBlock
                  title="This is a sample blog title that is fairly long"
                  tag="calculator"
                  excerpt="This is a short excerpt from the blog post to give readers an idea of the content."
                />
                {/* Item 3: Blog List Item */}
                <PostBlock
                  title="Short title"
                  tag="tag"
                  excerpt="This is a short excerpt from the blog post to give readers an idea of the content."
                />
                <PostBlock
                  title="Short title"
                  tag="tag"
                  excerpt="This is a short excerpt from the blog post to give readers an idea of the content."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT BLOG POSTS */}
      <section className="container mx-auto px-6 xl:px-20 pb-16 md:pb-24 font-tenorite">
        <PostsSection name={"recent blog posts"}/>
      </section>

      <section className="container mx-auto px-6 xl:px-20 pb-16 md:pb-24 font-tenorite">
        <PostsSection name={"Tools"}/>
      </section>
    </>
  );
}