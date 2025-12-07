import { getMediaComponent } from '@/lib/helper';

export default function RoadmapImageSection({ media }) {
  return (
    <div className={`w-full lg:w-1/2 flex justify-center z-10 bg-white`}>
      {/* <img src={imageUrl} alt="Roadmap Step Image" /> */}
        <div className="flex items-center justify-center">
          {getMediaComponent(
            media,
            "SYMBOL",
            true,
            "rounded-[20px] w-[150px] md:w-[175px] md:w-[200px] lg:max-w-md object-cover"
          )}
        </div>
    </div>
  );
}