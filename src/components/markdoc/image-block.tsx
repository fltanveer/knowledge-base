import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  position: "center" | "full-width" | "left" | "right";
};

const positionClasses: Record<Props["position"], string> = {
  center: "mx-auto max-w-2xl",
  "full-width": "w-full",
  left: "float-left mr-6 mb-4 max-w-xs sm:max-w-sm",
  right: "float-right ml-6 mb-4 max-w-xs sm:max-w-sm",
};

export function ImageBlock({ src, alt, caption, position }: Props) {
  if (!src) return null;

  return (
    <figure className={`my-8 ${positionClasses[position]}`}>
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <Image
          src={src}
          alt={alt || ""}
          width={1200}
          height={800}
          className="h-auto w-full object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
