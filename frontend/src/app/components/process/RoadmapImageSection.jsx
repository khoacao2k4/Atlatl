import { getMediaComponent } from '@/lib/helper';

export default function RoadmapImageSection({ imageUrl }) {
  return (
    <div className={`w-full lg:w-1/2 flex justify-center z-10 bg-white`}>
      {/* <img src={imageUrl} alt="Roadmap Step Image" /> */}
        <div className="flex items-center justify-center">
          {getMediaComponent(
            null,
            "SYMBOL",
            true,
            "rounded-[50px] w-[250px] lg:max-w-md shadow-2xl object-cover"
          )}
        </div>
    </div>
  );
}