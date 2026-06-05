/**
 * Pagination utility functions and types for server-side pagination.
 * Requirements: 1.2, 1.6, 1.7, 2.2, 4.1, 4.2, 4.3
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Generic paginated response returned by data-layer query functions.
 */
export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
}

/**
 * URL-based pagination state passed between server and client components.
 */
export interface PaginationState {
  currentPage: number; // 1-indexed current page
  totalPages: number; // Total number of pages
  pageSize: number; // Items per page (always 12)
  totalCount: number; // Total items matching filter
}

// ─── Utility Functions ────────────────────────────────────────────────────────

/**
 * Parse and validate a page number from a URL search parameter.
 *
 * Rules:
 * - Undefined / empty → 1
 * - Non-numeric / NaN → 1
 * - Less than 1 → 1
 * - Greater than totalPages (when totalPages > 0) → totalPages
 * - Decimals are truncated via parseInt (e.g. "3.7" → 3)
 *
 * @param pageParam - Raw `page` value from searchParams
 * @param totalPages - Total number of pages available
 * @returns Valid page number in the range [1, totalPages]
 *
 * Requirements: 1.6, 1.7, 4.1, 4.2, 4.3
 */
export function validatePageNumber(
  pageParam: string | undefined,
  totalPages: number
): number {
  if (!pageParam) return 1;

  const parsed = parseInt(pageParam, 10);

  if (isNaN(parsed) || parsed < 1) return 1;
  if (parsed > totalPages && totalPages > 0) return totalPages;

  return parsed;
}

/**
 * Calculate the zero-indexed database offset for a given page.
 *
 * Formula: (page - 1) * pageSize
 *
 * @param page     - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Zero-indexed offset for use in Supabase `.range()`
 *
 * Requirements: 1.2
 */
export function calculateOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/**
 * Calculate the total number of pages from an item count.
 *
 * Always returns at least 1 so the UI never shows "0 pages".
 *
 * Formula: Math.max(1, Math.ceil(totalCount / pageSize))
 *
 * @param totalCount - Total number of items in the result set
 * @param pageSize   - Number of items per page
 * @returns Total page count (minimum 1)
 *
 * Requirements: 2.2
 */
export function calculateTotalPages(
  totalCount: number,
  pageSize: number
): number {
  return Math.max(1, Math.ceil(totalCount / pageSize));
}
