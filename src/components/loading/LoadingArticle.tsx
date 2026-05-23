// components/loading/LoadingArticle.tsx
// Full-page skeleton for ArticleSlugPage — mirrors exact layout.

import LoadingImage from "./LoadingImage";
import LoadingText from "./LoadingText";
import {
  SKELETON_BASE,
  SKELETON_PULSE,
  SHIMMER_CHILD,
  MONO_FONT,
} from "./loading-constants";

interface LoadingArticleProps {
  /** Show hero image skeleton (set false if article rarely has images) */
  showImage?: boolean;
  className?: string;
}

/** Thin horizontal rule skeleton — matches AccentDivider */
function SkeletonDivider() {
  return (
    <div className="relative mb-8 h-px bg-[#bbb]">
      <span className="absolute left-0 top-0 h-px w-12 bg-[#c8c8c8]" />
      <span className="absolute left-12 top-[-3px] w-1.5 h-1.5 rotate-45 bg-[#c8c8c8]" />
    </div>
  );
}

/** Badge-like small skeleton */
function SkeletonBadge({ width = "w-20" }: { width?: string }) {
  return (
    <div className={`h-[18px] ${width} ${SKELETON_BASE} ${SKELETON_PULSE}`}>
      <span className={SHIMMER_CHILD} />
    </div>
  );
}

export default function LoadingArticle({
  showImage = true,
  className = "",
}: LoadingArticleProps) {
  return (
    <div
      className={`px-6 md:px-10 py-10 max-w-3xl mx-auto ${className}`}
      style={MONO_FONT}
      aria-busy="true"
      aria-label="Loading article"
    >
      {/* ── Breadcrumb / top meta row ── */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`h-[9px] w-16 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
        <span className="h-3 w-px bg-[#ccc]" />
        <SkeletonBadge width="w-20" />
        <span className="h-px flex-1 bg-[#ccc]" />
        <div className={`h-[9px] w-14 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
      </div>

      {/* ── Title ── */}
      <div className="flex flex-col gap-3 mb-5">
        <div className={`h-9 w-full ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
        <div className={`h-9 w-4/5 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
      </div>

      {/* ── Meta row (date / site name) ── */}
      <div className="flex items-center gap-5 mb-6">
        <div className={`h-[9px] w-24 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
        <div className={`h-[9px] w-16 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
      </div>

      {/* ── Accent divider ── */}
      <SkeletonDivider />

      {/* ── Hero image (conditional) ── */}
      {showImage && (
        <LoadingImage aspectRatio="16/7" className="mb-10" />
      )}

      {/* ── Excerpt block — left border callout ── */}
      <div className="relative border-l-[3px] border-[#ccc] pl-5 mb-10">
        <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ccc]" />
        <span className="absolute bottom-0 left-[-3px] w-2 h-2 border-b border-l border-[#ccc]" />
        <LoadingText lines={2} shortLast />
      </div>

      {/* ── Section label — "// CONTENT" ── */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`h-[9px] w-20 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
        <span className="h-px flex-1 bg-[#ccc]" />
        <span className="w-1 h-1 bg-[#ccc]" />
      </div>

      {/* ── Article body — multiple paragraph groups ── */}
      <div className="flex flex-col gap-8">
        <LoadingText lines={4} shortLast />

        {/* Heading skeleton */}
        <div className="flex items-center gap-3">
          <span className="w-4 h-px bg-[#ccc] shrink-0" />
          <div className={`h-[13px] w-40 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
            <span className={SHIMMER_CHILD} />
          </div>
        </div>

        <LoadingText lines={5} shortLast />

        {/* Heading skeleton */}
        <div className="flex items-center gap-3">
          <span className="w-4 h-px bg-[#ccc] shrink-0" />
          <div className={`h-[13px] w-32 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
            <span className={SHIMMER_CHILD} />
          </div>
        </div>

        <LoadingText lines={4} shortLast />
      </div>

      {/* ── End of document marker ── */}
      <div className="flex items-center gap-3 mt-12 pt-5 border-t border-[#ccc]">
        <div className={`h-[8px] w-24 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
        <span className="h-px flex-1 bg-[#d8d8d8]" />
        <div className={`h-[8px] w-12 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
      </div>
    </div>
  );
}