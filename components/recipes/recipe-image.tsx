"use client";

import Image from "next/image";
import { useState } from "react";

const blurDataUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 10'%3E%3Crect width='16' height='10' fill='%23141417'/%3E%3Cpath d='M0 8 4.5 4.5 7 6.5 10.5 2.5 16 8v2H0z' fill='%231d1d22'/%3E%3C/svg%3E";

export function RecipeImage({
  src,
  alt,
  priority,
  sizes,
  className = "object-cover"
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      src={imageSrc || "/logo.svg"}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      quality={priority ? 88 : 78}
      placeholder="blur"
      blurDataURL={blurDataUrl}
      onError={() => setImageSrc("/logo.svg")}
    />
  );
}
