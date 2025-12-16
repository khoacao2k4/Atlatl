export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

export function getStrapiURL(path = '') {
  return `${STRAPI_URL}${path}`;
}

export function getStrapiMedia(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return getStrapiURL(url);
}

export async function fetchAPI(path, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  const requestUrl = getStrapiURL(path);

  try {
    const response = await fetch(requestUrl, mergedOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export function getMediaComponent(
  media,
  placeholderText,
  forceSquare = false,
  className = ''
) {
  if (!media?.url) {
    return (
      <img
        src={`https://placehold.co/600x600/378CE7/ffffff?text=${placeholderText}`}
        alt={placeholderText}
        className={className}
      />
    );
  }

  const mediaURL = getStrapiMedia(media.url);
  const isVideo = media.ext === '.mp4' || media.mime?.startsWith('video/');

  if (isVideo) {
    if (forceSquare) {
      return (
        <div className={`${className} aspect-square overflow-hidden`}>
          <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
            <source src={mediaURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return (
      <video className={className} autoPlay loop muted playsInline>
        <source src={mediaURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return <img src={mediaURL} alt={media.alternativeText || placeholderText} className={className} />;
}
