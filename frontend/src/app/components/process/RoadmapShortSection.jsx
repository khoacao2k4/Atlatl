import { getMediaComponent } from '@/lib/helper';

export default function RoadmapShortSection({title, media}) {
  return (
    <div className={`flex items-center flex-col mx-4 gap-4`}>
      {/* <img src={imageUrl} alt="Roadmap Step Image" /> */}
        <div>
          {getMediaComponent(
            media,
            "SYMBOL",
            true,
            "rounded-[20px] w-[80px] md:w-[100px] lg:w-[130px] lg:max-w-md object-cover"
          )}
        </div>
        <h3 className="sm:text-md md:text-xl text-center font-songer text-dark-blue">
            {title}
        </h3>
    </div>
  );    
}