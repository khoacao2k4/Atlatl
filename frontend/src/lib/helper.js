export const getFullMediaUrl = (url) => {
  const isLocal =
    process.env.NEXT_PUBLIC_STRAPI_API_URL === "http://localhost:1337";
  if (isLocal) {
    return `http://localhost:1337${url}`;
  }
  return url;
};

export const getMediaComponent = (media, placholderText) => {
  if (!media?.url) {
    return (
      <img
        src={`https://placehold.co/600x600/378CE7/ffffff?text=${placholderText}`}
        alt={placholderText}
        className="rounded-[100px] w-full h-auto max-w-[360px] lg:max-w-md shadow-2xl object-cover"
      />
    );
  }

  const mediaURL = getFullMediaUrl(media?.url);
  const isVideo = media?.ext === ".mp4";

  if (isVideo) {
    return (
      <div className="w-full max-w-[360px] lg:max-w-md aspect-square shadow-2xl rounded-[100px] overflow-hidden">
        <video className="w-full h-full object-cover" autoPlay loop muted>
          <source src={mediaURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  } else {
    return (
      <img
        src={mediaURL}
        alt={placholderText}
        className="rounded-[100px] w-full h-auto max-w-[360px] lg:max-w-md shadow-2xl object-cover"
      />
    );
  }
};
