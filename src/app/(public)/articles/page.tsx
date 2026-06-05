// app/(public)/articles/page.tsx
// Server component — reads page from searchParams, validates it, fetches paginated
// articles from Supabase, and passes data to ArticlesClientList.
// Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4

import { redirect } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import StatusFooter from "@/components/layout/StatusFooter";
import PageHeader from "@/components/ui/PageHeader";
import { getArticlesPreviewPaginated } from "@/lib/articles";
import { validatePageNumber, calculateTotalPages } from "@/lib/pagination-utils";
import ArticlesClientList from "@/components/ArticlesClientList";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  // In Next.js 16, searchParams is a Promise and must be awaited
  searchParams: Promise<{ page?: string }>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ArticlesPage({ searchParams }: PageProps) {
  // In Next.js 16, searchParams is a Promise — must be awaited (Requirement 5.1)
  const { page: pageParam } = await searchParams;

  // Parse a preliminary page for the first fetch.
  // Invalid/missing values fall back to page 1 so the query is always valid.
  const rawPage = parseInt(pageParam ?? "1", 10);
  const initialPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  // Fetch paginated articles and total count (Requirements 5.2, 5.3)
  const { data: articles, totalCount } = await getArticlesPreviewPaginated(initialPage, 12);

  // Calculate total pages (Requirement 2.2)
  const totalPages = calculateTotalPages(totalCount, 12);

  // Validate the raw page param against the true total pages.
  // validatePageNumber handles: undefined → 1, NaN → 1, < 1 → 1, > totalPages → totalPages
  // (Requirements 4.1, 4.2, 4.3)
  const validPage = validatePageNumber(pageParam, totalPages);

  // If the page we fetched differs from the validated page, redirect to the
  // canonical URL so the browser URL always reflects a valid page number.
  // e.g. /articles?page=abc  → /articles?page=1
  //      /articles?page=999  → /articles?page=<totalPages>
  if (validPage !== initialPage) {
    redirect(`/articles?page=${validPage}`);
  }

  return (
    <PageContainer className="font-mono">
      {/* ── Page header ── */}
      <PageHeader title="ARTICLES" code="PGE-002" className="mb-10" />

      {/* ── Article list + pagination (client component) ── */}
      {/* ArticlesClientList renders the article grid and pagination controls */}
      <ArticlesClientList
        articles={articles}
        currentPage={validPage}
        totalPages={totalPages}
      />

      {/* ── Footer ── */}
      <StatusFooter />
    </PageContainer>
  );
}
