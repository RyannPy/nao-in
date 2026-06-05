// components/CategoryArticlesList.tsx
// Client component for paginated category article grid.
// Uses URL-based server-side pagination (task 5.2).
// Requirements: 7.4, 7.5, 7.7

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import ArticleCard from "@/components/ArticleCard";
import { LoadingCardGrid } from "@/components/loading";
import Pagination from "@/components/ui/Pagination";
import type { ArticlePreview } from "@/types/article";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticleWithMeta extends ArticlePreview {
  tag: string;
  date: string;
}

// Requirements: 7.4, 7.5, 7.7 — all props required
interface Props {
  articles: ArticleWithMeta[];
  currentPage: number;
  totalPages: number;
  categorySlug: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryArticlesList({
  articles,
  currentPage,
  totalPages,
  categorySlug,
}: Props) {
  const router = useRouter();

  // Requirements 7.4, 7.5 — navigate with category slug preserved in URL
  const handlePageChange = (page: number) => {
    try {
      router.push(`/categories/${categorySlug}?page=${page}`);
    } catch (error) {
      console.error("Failed to navigate to page:", error);
      // Fallback: full page reload
      window.location.href = `/categories/${categorySlug}?page=${page}`;
    }
  };

  // Requirement 7.7 — empty state when no articles in this category
  if (articles.length === 0) {
    return (
      <div className="relative border border-[#bbb] bg-[#c9c9c9] px-8 py-16 flex flex-col items-center gap-4 font-mono">
        {/* Corner ticks */}
        <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#bbb]" />
        <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#bbb]" />
        <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#bbb]" />
        <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#bbb]" />

        {/* Status badge */}
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
    );
  }

  return (
    <>
      <Suspense
        fallback={
          <LoadingCardGrid
            count={6}
            className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          />
        }
      >
        {/* ── Article grid — Requirements 7.4 ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#bbb] border border-[#bbb]">
          {articles.map((art) => (
            <ArticleCard
              key={art.id}
              tag={art.tag}
              title={art.title}
              category={art.category}
              imageSrc={art.image_src ?? undefined}
              date={art.date}
              href={`/articles/${art.slug}`}
            />
          ))}
        </div>
      </Suspense>

      {/* ── Pagination — Requirements 7.4, 7.5 ── */}
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
