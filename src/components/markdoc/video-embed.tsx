type Props = {
  url: string;
  type: "youtube" | "vimeo" | "video";
  caption?: string;
  aspectRatio: "16/9" | "4/3" | "1/1";
};

function getEmbedUrl(url: string, type: Props["type"]): string | null {
  if (type === "video") return url;

  if (type === "youtube") {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  if (type === "vimeo") {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  }

  return null;
}

export function VideoEmbed({ url, type, caption, aspectRatio }: Props) {
  if (!url) return null;
  const embedUrl = getEmbedUrl(url, type);
  if (!embedUrl) return null;

  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-lg" style={{ aspectRatio }}>
        {type === "video" ? (
          <video src={embedUrl} controls className="h-full w-full object-contain" />
        ) : (
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
