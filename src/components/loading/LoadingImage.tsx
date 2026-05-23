// components/loading/LoadingImage.tsx
// Skeleton placeholder for images — respects aspect ratio, shows scanline grid.

import {
  SKELETON_BASE,
  SHIMMER_CHILD,
  SCANLINE_OVERLAY,
  SCANLINE_STYLE,
  MONO_FONT,
} from "./loading-constants";

interface LoadingImageProps {
  /** CSS aspect-ratio value, e.g. "4/3" or "16/7" */
  aspectRatio?: string;
  /** Article/block ID to show in the corner tab */
  id?: string;
  className?: string;
}

export default function LoadingImage({
  aspectRatio = "4/3",
  id,
  className = "",
}: LoadingImageProps) {
  return (
    <div
      className={`relative w-full border border-[#b8b8b8] ${className}`}
    >
      {/* Corner ticks — yellow like ArticleSlugPage hero */}
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#e8c830] z-10 pointer-events-none" />
      <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#e8c830] z-10 pointer-events-none" />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#e8c830] z-10 pointer-events-none" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#e8c830] z-10 pointer-events-none" />

      {/* Optional ID badge */}
      {id && (
        <div
          className="absolute top-0 left-4 z-10 flex items-center gap-2 bg-[#1a1a1a] px-2.5 py-1"
          style={MONO_FONT}
        >
          <span className="w-1 h-1 bg-[#555]" />
          <span className="text-[7px] tracking-[0.3em] text-[#555] uppercase leading-none">
            {id} // IMG
          </span>
        </div>
      )}

      {/* Main skeleton area */}
      <div
        className={`relative w-full ${SKELETON_BASE}`}
        style={{ aspectRatio }}
      >
        <span className={SHIMMER_CHILD} />

        {/* Scanline overlay */}
        <div
          aria-hidden
          className={SCANLINE_OVERLAY}
          style={SCANLINE_STYLE}
        />

        {/* Center placeholder text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-25">
          <span className="w-8 h-px bg-[#555]" />
          <span
            className="text-[8px] tracking-[0.35em] text-[#555] uppercase"
            style={MONO_FONT}
          >
            LOADING IMAGE
          </span>
          <span className="w-8 h-px bg-[#555]" />
        </div>
      </div>
    </div>
  );
}