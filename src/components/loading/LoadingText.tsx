// components/loading/LoadingText.tsx
// Skeleton placeholder for text lines — matches paragraph/label proportions.

import {
  SKELETON_BASE,
  SKELETON_PULSE,
  SHIMMER_CHILD,
  MONO_FONT,
} from "./loading-constants";

interface LoadingTextProps {
  /** Number of skeleton lines to render */
  lines?: number;
  /** Make last line shorter (natural paragraph end) */
  shortLast?: boolean;
  /** Optional label above lines, e.g. "// CONTENT" */
  label?: string;
  className?: string;
}

export default function LoadingText({
  lines = 3,
  shortLast = true,
  label,
  className = "",
}: LoadingTextProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`} style={MONO_FONT}>
      {/* Optional section label skeleton */}
      {label && (
        <p className="text-[9px] tracking-[0.3em] text-[#aaa] uppercase mb-1">
          {label}
        </p>
      )}

      {Array.from({ length: lines }).map((_, i) => {
        const isLast = i === lines - 1;
        const width =
          isLast && shortLast
            ? "w-3/5"
            : i % 3 === 0
            ? "w-full"
            : i % 3 === 1
            ? "w-11/12"
            : "w-10/12";

        return (
          <div
            key={i}
            className={`h-[14px] ${width} ${SKELETON_BASE} ${SKELETON_PULSE}`}
          >
            <span className={SHIMMER_CHILD} />
          </div>
        );
      })}
    </div>
  );
}