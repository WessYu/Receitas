"use client";

import Image from "next/image";
import { useState } from "react";

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
      onError={() => setImageSrc("/logo.svg")}
    />
  );
}
