// components/ui/Pagination.tsx
// Reusable pagination component — NAO-IN brutalist/industrial theme.

"use client";

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generates an array of page numbers and ellipsis markers.
 * Always shows first, last, and pages around the current page.
 */
function getPageRange(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  // Always include page 1
  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  // Pages around current
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  // Always include last page
  pages.push(totalPages);

  return pages;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  // Req 8.8: don't render when totalPages <= 1
  if (totalPages <= 1) return null;

  // Req 8.7: don't render when currentPage is out of valid range
  if (currentPage < 1 || currentPage > totalPages) return null;

  const pages = getPageRange(currentPage, totalPages);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className={`flex flex-col items-center gap-3 font-mono ${className}`}>
      {/* ── Page info ── */}
      <div className="flex items-center gap-2">
        <span className="h-px w-6 bg-[#bbb]" />
        <span className="text-[8px] tracking-[0.3em] text-[#999] uppercase">
          PAGE {currentPage} / {totalPages}
        </span>
        <span className="h-px w-6 bg-[#bbb]" />
      </div>

      {/* ── Navigation buttons ── */}
      <div className="flex items-center gap-[3px] flex-wrap justify-center">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          aria-label="Previous page"
          className={`
            px-3 py-2 text-[9px] tracking-[0.2em] uppercase border transition-colors duration-150
            ${
              isFirst
                ? "bg-[#d0d0d0] text-[#bbb] border-[#c8c8c8] cursor-not-allowed"
                : "bg-[#c4c4c4] text-[#666] border-[#b8b8b8] hover:bg-[#1a1a1a] hover:text-[#e8c830] hover:border-[#1a1a1a]"
            }
          `}
        >
          ←
        </button>

        {/* Page numbers */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 py-2 text-[9px] tracking-[0.2em] text-[#aaa] select-none"
            >
              ···
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`
                min-w-[32px] px-2 py-2 text-[9px] tracking-[0.15em] border transition-colors duration-150
                ${
                  currentPage === page
                    ? "bg-[#1a1a1a] text-[#e8c830] border-[#1a1a1a] font-black"
                    : "bg-[#c4c4c4] text-[#666] border-[#b8b8b8] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]"
                }
              `}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          aria-label="Next page"
          className={`
            px-3 py-2 text-[9px] tracking-[0.2em] uppercase border transition-colors duration-150
            ${
              isLast
                ? "bg-[#d0d0d0] text-[#bbb] border-[#c8c8c8] cursor-not-allowed"
                : "bg-[#c4c4c4] text-[#666] border-[#b8b8b8] hover:bg-[#1a1a1a] hover:text-[#e8c830] hover:border-[#1a1a1a]"
            }
          `}
        >
          →
        </button>
      </div>
    </div>
  );
}

// ─── Pagination utilities ─────────────────────────────────────────────────────

/** Slice an array for the current page (12 items per page). */
export function paginateItems<T>(items: T[], page: number): T[] {
  const start = (page - 1) * ITEMS_PER_PAGE;
  return items.slice(start, start + ITEMS_PER_PAGE);
}

/** Calculate total pages for a given item count (12 per page). */
export function getTotalPages(totalItems: number): number {
  return Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
}
