"use client";

import Image from "next/image";
import { useState } from "react";
import { LoadingImage } from "@/components/loading";

interface HeroImageProps {
  src: string;
  alt: string;
}

export default function HeroImage({ src, alt }: HeroImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 z-0">
          <LoadingImage
            aspectRatio="auto"
            className="h-full w-full border-none"
          />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        onLoad={() => setIsLoaded(true)}
        className={`object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
