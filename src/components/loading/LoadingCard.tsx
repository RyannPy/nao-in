// components/loading/LoadingCard.tsx
// Skeleton for ArticleCard — same 4:5 aspect ratio, same tab/icon/label structure.

import {
  SKELETON_BASE,
  SKELETON_PULSE,
  SHIMMER_CHILD,
  SCANLINE_OVERLAY,
  SCANLINE_STYLE,
  MONO_FONT,
} from "./loading-constants";

interface LoadingCardProps {
  className?: string;
}

function LoadingCardSingle({ className = "" }: LoadingCardProps) {
  return (
    <div
      className={`relative flex flex-col bg-[#c4c4c4] border border-[#b0b0b0] overflow-hidden ${className}`}
      style={{ aspectRatio: "4/5" }}
      aria-busy="true"
      aria-label="Loading article card"
    >
      {/* Tab row — mimics ArticleCard tab */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1 shrink-0">
        {/* ID placeholder */}
        <div className={`h-[7px] w-10 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
        {/* Diamond accent */}
        <span className="w-[6px] h-[6px] rotate-45 border border-[#bbb]" />
      </div>

      {/* Image area — top 56% */}
      <div
        className={`relative mx-3 ${SKELETON_BASE}`}
        style={{ flex: "0 0 52%" }}
      >
        <span className={SHIMMER_CHILD} />
        {/* Scanline texture */}
        <div
          aria-hidden
          className={SCANLINE_OVERLAY}
          style={SCANLINE_STYLE}
        />
        {/* NO_IMG placeholder text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span
            className="text-[7px] tracking-[0.3em] text-[#333] uppercase"
            style={MONO_FONT}
          >
            —
          </span>
        </div>
      </div>

      {/* Info area — bottom */}
      <div className="flex flex-col justify-between flex-1 px-3 pt-2 pb-3 bg-[#c4c4c4]">
        {/* Title skeleton — two lines */}
        <div className="flex flex-col gap-1.5">
          <div className={`h-[12px] w-full ${SKELETON_BASE} ${SKELETON_PULSE}`}>
            <span className={SHIMMER_CHILD} />
          </div>
          <div className={`h-[12px] w-4/5 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
            <span className={SHIMMER_CHILD} />
          </div>
        </div>

        {/* Badge + date row */}
        <div className="flex items-end justify-between gap-2 mt-1">
          <div className={`h-[14px] w-16 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
            <span className={SHIMMER_CHILD} />
          </div>
          <div className={`h-[7px] w-12 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
            <span className={SHIMMER_CHILD} />
          </div>
        </div>
      </div>

      {/* Left accent bar (static, no hover) */}
      <span className="absolute left-0 bottom-0 top-0 w-[3px] bg-[#bbb]" />

      {/* Corner tick bottom-right */}
      <span className="absolute bottom-2 right-2 w-[8px] h-[8px] border-b border-r border-[#bbb]" />
    </div>
  );
}

// ─── Grid variant: renders N skeleton cards ───────────────────────────────────

interface LoadingCardGridProps {
  count?: number;
  className?: string;
}

export function LoadingCardGrid({
  count = 4,
  className = "",
}: LoadingCardGridProps) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-[#b0b0b0] border border-[#b0b0b0] ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCardSingle key={i} />
      ))}
    </div>
  );
}

export default LoadingCardSingle;