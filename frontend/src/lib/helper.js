export const getFullMediaUrl = (url) => {
  const isLocal =
    process.env.NEXT_PUBLIC_STRAPI_API_URL === "http://localhost:1337";
  if (isLocal) {
    return `http://localhost:1337${url}`;
  }
  return url;
};

export const getMediaComponent = (
  media,
  placholderText,
  forceSquare = false,
  className
) => {
  if (!media?.url) {
    return (
      <img
        src={`https://placehold.co/600x600/378CE7/ffffff?text=${placholderText}`}
        alt={placholderText}
        className={className} // Apply all classes directly
      />
    );
  }

  const mediaURL = getFullMediaUrl(media?.url);
  const isVideo = media?.ext === ".mp4";

  console.log(mediaURL);
  if (isVideo) {
    // If 'forceSquare' is true, the component adds 'aspect-square' and 'overflow-hidden'.
    if (forceSquare) {
      return (
        <div className={`${className} aspect-square overflow-hidden`}>
          {/* The inner video just needs to fill and cover */}
          <video className="w-full h-full object-cover" autoPlay loop muted>
            <source src={mediaURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // For a normal video, apply all classes directly
    return (
      <video className={className} autoPlay loop muted>
        <source src={mediaURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  // For a normal image, apply all classes directly
  return <img src={mediaURL} alt={placholderText} className={className} />;
};
