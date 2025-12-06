import { getMediaComponent } from '@/lib/helper';

export default function RoadmapShortSection({title, imageUrl}) {
  return (
    <div className={`flex items-center flex-col mx-4 gap-4`}>
      {/* <img src={imageUrl} alt="Roadmap Step Image" /> */}
        <div>
          {getMediaComponent(
            null,
            "SYMBOL",
            true,
            "rounded-[20px] lg:rounded-[50px] w-[80px] md:w-[100px] lg:w-[160px] lg:max-w-md shadow-2xl object-cover"
          )}
        </div>
        <h3 className="sm:text-md md:text-xl text-center font-songer text-dark-blue">
            {title}
        </h3>
    </div>
  );    
}