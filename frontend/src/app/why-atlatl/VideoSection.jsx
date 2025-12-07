import { getMediaComponent } from "@/lib/helper";

export default function VideoSection({ media }) {
  return (
    <section className="w-full bg-gradient-to-b from-dark-blue from-50% to-darker-light-blue to-50% px-4 md:px-16 lg:px-40 mb-4 md:mb-16">
      {getMediaComponent(
        media,
        "WhyAtlatlVideo",
        false,
        "w-full h-auto rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl object-cover aspect-video",)}
    </section>
  );
}