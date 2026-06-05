// app/(public)/categories/[slug]/loading.tsx
// Suspense boundary for the category articles page — shown during SSR/navigation.
// Renders a skeleton matching the category page layout to avoid layout shift.
// Requirements: 12.1, 12.2, 12.3, 12.4

import PageContainer from "@/components/layout/PageContainer";
import { LoadingCardGrid, SKELETON_BASE, SKELETON_PULSE, SHIMMER_CHILD } from "@/components/loading";

export default function Loading() {
  return (
    <PageContainer className="font-mono" innerClassName="px-4 py-6 md:px-10 md:py-10 max-w-5xl mx-auto">
      {/* ── Breadcrumb row skeleton ── */}
      <div className="flex items-center gap-4 mb-10">
        <div className={`h-[9px] w-20 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
        <span className="h-3 w-px bg-[#bbb]" />
        <div className={`h-[9px] w-16 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
        <span className="h-px flex-1 bg-[#bbb]" />
        <div className={`h-[9px] w-12 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
      </div>

      {/* ── Category header skeleton ── */}
      <header className="mb-8">
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
        <div className={`h-10 w-56 md:h-12 md:w-72 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>

        {/* Yellow accent underline */}
        <div className="mt-2 h-0.75 w-16 bg-[#e8c830] opacity-50" />
      </header>

      {/* ── Meta row skeleton ── */}
      <div className={`mb-4 h-[9px] w-48 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
        <span className={SHIMMER_CHILD} />
      </div>

      {/* ── Accent divider ── */}
      <div className="mb-10 h-px bg-[#bbb]" />

      {/* ── Section label + counter skeleton ── */}
      <div className="flex items-center justify-between mb-6">
        <div className={`h-[9px] w-24 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
        <div className={`h-6 w-20 ${SKELETON_BASE} ${SKELETON_PULSE}`}>
          <span className={SHIMMER_CHILD} />
        </div>
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
