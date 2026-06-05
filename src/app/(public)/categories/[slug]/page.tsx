// app/categories/[slug]/page.tsx

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import CategoryArticlesList from "@/components/CategoryArticlesList";
import PageContainer from "@/components/layout/PageContainer";
import StatusFooter from "@/components/layout/StatusFooter";
import PageHeader from "@/components/ui/PageHeader";
import AccentDivider from "@/components/ui/AccentDivider";
import MetaRow from "@/components/ui/MetaRow";
import SectionLabel from "@/components/ui/SectionLabel";
import {
  getArticlesByCategoryPaginated,
  getCategoryMeta,
  CATEGORY_MAP,
} from "@/lib/articles";
import { calculateTotalPages, validatePageNumber } from "@/lib/pagination-utils";

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategorySlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  // Requirement 7.6 — validate category exists, return 404 if not
  const meta = getCategoryMeta(slug);
  if (!meta) notFound();

  // Fetch a preliminary count to determine total pages before full validation.
  // We use page 1 to get totalCount cheaply, then redirect if needed.
  const PAGE_SIZE = 12;

  // Requirement 4.3 — handle non-numeric page param
  const rawPage = parseInt(pageParam ?? "1", 10);
  const prelimPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  // Fetch paginated articles for this category
  // Requirements: 7.2, 7.3
  const { data: articles, totalCount } = await getArticlesByCategoryPaginated(
    slug,
    prelimPage,
    PAGE_SIZE,
  );

  // Requirement 2.2, 7.8 — calculate total pages
  const totalPages = calculateTotalPages(totalCount, PAGE_SIZE);

  // Requirements 4.1, 4.2, 4.3 — validate page number and redirect if invalid
  const validatedPage = validatePageNumber(pageParam, totalPages);
  if (validatedPage !== prelimPage) {
    redirect(`/categories/${slug}?page=${validatedPage}`);
  }

  return (
    <PageContainer className="font-mono" innerClassName="px-4 py-6 md:px-10 md:py-10 max-w-5xl mx-auto">
      {/* ════════════════════════════════════════════
          BREADCRUMB / TOP NAV ROW
      ════════════════════════════════════════════ */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/categories"
          className="group flex items-center gap-1.5 text-[9px] tracking-[0.3em] text-[#888] uppercase hover:text-[#1a1a1a] transition-colors duration-150"
        >
          <span className="transition-transform duration-150 group-hover:-translate-x-0.5">
            ←
          </span>
          CATEGORIES
        </Link>
        <span className="h-3 w-px bg-[#bbb]" />
        <span className="text-[9px] tracking-[0.25em] text-[#aaa] uppercase">
          {meta.label}
        </span>
        <span className="h-px flex-1 bg-[#bbb]" />
        <span className="text-[9px] tracking-[0.2em] text-[#aaa]">
          {meta.id}
        </span>
      </div>

      {/* ════════════════════════════════════════════
          1. HEADER — CATEGORY TITLE
      ════════════════════════════════════════════ */}
      <PageHeader
        title={meta.label}
        code={meta.id}
        titleClassName="text-4xl md:text-5xl"
        className="mb-8"
      />

      {/* ════════════════════════════════════════════
          2. METADATA / SUBTITLE ROW
      ════════════════════════════════════════════ */}
      <MetaRow dotLabel="ARCHIVE DOMAIN" labels={[meta.id, "NAO-IN"]} />

      {/* ════════════════════════════════════════════
          ACCENT DIVIDER
      ════════════════════════════════════════════ */}
      <AccentDivider className="mb-10" />

      {/* ════════════════════════════════════════════
          3. COUNTER + SECTION LABEL
      ════════════════════════════════════════════ */}
      <SectionLabel
        label={"// ARTICLES"}
        className="mb-6"
        rightContent={
          <div className="flex items-center gap-0 bg-[#1a1a1a]">
            <span className="px-3 py-1 text-[#e8c830] text-[11px] font-black tracking-tight">
              {totalCount}
            </span>
            <span className="px-3 py-1 text-[8px] tracking-[0.25em] text-[#555] uppercase border-l border-[#333]">
              TOTAL
            </span>
          </div>
        }
      />

      {/* ════════════════════════════════════════════
          4. ARTICLE GRID  /  5. EMPTY STATE
      ════════════════════════════════════════════ */}
      {totalCount === 0 ? (
        /* ── Empty state — Requirement 7.7 ── */
        <div className="relative border border-[#bbb] bg-[#c9c9c9] px-8 py-16 flex flex-col items-center gap-4">
          {/* Corner ticks */}
          <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#bbb]" />
          <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#bbb]" />
          <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#bbb]" />
          <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#bbb]" />

          {/* Status */}
          <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2">
            <span className="w-1.5 h-1.5 bg-[#555]" />
            <span className="text-[9px] tracking-[0.35em] text-[#555] uppercase">
              NULL RESULT
            </span>
          </div>

          <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase mt-2">
            NO ARTICLES IN THIS CATEGORY
          </p>
          <p className="text-[11px] text-[#aaa] leading-relaxed max-w-xs text-center">
            The archive for this domain is currently empty. Please check back later.
          </p>

          <Link
            href="/categories"
            className="mt-4 inline-flex items-center gap-3 bg-[#1a1a1a] border-l-[3px] border-[#e8c830] px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-white hover:bg-[#111] transition-colors duration-150"
          >
            ← BACK TO CATEGORIES
          </Link>
        </div>
      ) : (
        /* ── Paginated article list (client component) — Requirements 7.4, 7.5 ── */
        <CategoryArticlesList
          articles={articles}
          currentPage={validatedPage}
          totalPages={totalPages}
          categorySlug={slug}
        />
      )}

      {/* ════════════════════════════════════════════
          7. BOTTOM — BACK BUTTON + FOOTER
      ════════════════════════════════════════════ */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-12">
          <Link
            href="/categories"
            className="group inline-flex items-center gap-3 bg-[#1a1a1a] border-l-[3px] border-[#e8c830] px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-white hover:bg-[#111] transition-colors duration-150"
          >
            <span className="transition-transform duration-150 group-hover:-translate-x-0.5">
              ←
            </span>
            BACK TO CATEGORIES
          </Link>

          <Link
            href="/articles"
            className="group inline-flex items-center gap-3 bg-transparent border border-[#bbb] px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors duration-150"
          >
            ALL ARTICLES
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      )}

      {/* ── Footer status panel ── */}
      <StatusFooter
        statusText="SYSTEM ACTIVE"
        className="mt-12"
        extraInfo={
          <span className="text-[8px] tracking-[0.15em] text-[#aaa] uppercase">
            {totalCount} ARTICLES / {meta.label}
          </span>
        }
      />
    </PageContainer>
  );
}
