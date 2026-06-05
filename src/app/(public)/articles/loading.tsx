// app/(public)/articles/loading.tsx
// Suspense boundary for the articles page — shown by Next.js during SSR/navigation.
// Renders a skeleton that matches the actual page layout to avoid layout shift.
// Requirements: 12.1, 12.2, 12.3, 12.4

import PageContainer from "@/components/layout/PageContainer";
import { LoadingCardGrid, SKELETON_BASE, SKELETON_PULSE, SHIMMER_CHILD } from "@/components/loading";

export default function Loading() {
  return (
    <PageContainer className="font-mono">
      {/* ── Page header skeleton ── */}
      <header className="mb-10">
        {/* NAO-IN label row */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`h-[9px] w-12 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
            <span className={SHIMMER_CHILD} />
          </div>
          <span className="h-px flex-1 bg-[#bbb]" />
          <div className={`h-[9px] w-14 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
            <span className={SHIMMER_CHILD} />
          </div>
        </div>

        {/* Title skeleton */}
        <div className={`h-10 w-48 md:h-12 md:w-64 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>

        {/* Yellow accent underline */}
        <div className="mt-2 h-0.75 w-16 bg-[#e8c830] opacity-50" />
      </header>

      {/* ── Search bar skeleton ── */}
      <div className={`mb-6 h-11 w-full ${SKELETON_BASE} ${SKELETON_PULSE}`}>
        <span className={SHIMMER_CHILD} />
      </div>

      {/* ── Section label skeleton ── */}
      <div className={`mb-4 h-[9px] w-40 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
        <span className={SHIMMER_CHILD} />
      </div>

      {/* ── Article card grid skeleton ── */}
      <LoadingCardGrid
        count={12}
        className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      />

      {/* ── Pagination skeleton ── */}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-8 w-8 ${SKELETON_BASE} ${SKELETON_PULSE}`}
          >
            <span className={SHIMMER_CHILD} />
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
