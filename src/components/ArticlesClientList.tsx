"use client";

// components/ArticlesClientList.tsx
// Client component for the articles page — URL-based server-side pagination.
// Accepts server-paginated articles as props and handles page navigation via router.push().
// Requirements: 5.4, 5.5, 5.6, 5.7, 10.1, 10.7, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import LoadingCard from "@/components/loading/LoadingCard";
import SectionLabel from "@/components/ui/SectionLabel";
import Pagination from "@/components/ui/Pagination";
import type { ArticlePreview } from "@/types/article";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticleWithMeta extends ArticlePreview {
  tag: string;
  date: string;
}

/**
 * Props are all required — this component is a thin client shell around
 * server-fetched, server-paginated data (no local pagination state).
 * Requirements: 5.4
 */
interface Props {
  articles: ArticleWithMeta[];
  currentPage: number;
  totalPages: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ArticlesClientList({ articles, currentPage, totalPages }: Props) {
  const router = useRouter();

  // Client-side search input — filters the server-provided articles locally.
  const [search, setSearch] = useState("");

  // Tracks hydration to avoid SSR/client mismatch by showing skeletons until mounted.
  // Doubles as the mount guard to skip the search-reset effect on initial render.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  // ── Page navigation via URL (Req 5.6, 5.7, 10.7) ─────────────────────────

  /**
   * Navigate to a specific page by updating the URL search params.
   * Preserves all existing search params except `page` (Req 3.7, 8.9, 10.7).
   * Falls back to full page reload if router.push() throws (Req 5.7).
   */
  const handlePageChange = (page: number) => {
    try {
      const params = new URLSearchParams(window.location.search);
      params.set("page", String(page));
      router.push(`/articles?${params.toString()}`);
    } catch {
      // Req 5.7 / 8.2: fallback to full page reload if router.push fails
      window.location.href = `/articles?page=${page}`;
    }
  };

  // Reset to page 1 whenever the search input changes (Req 10.1).
  // Skips the initial render (isMounted guard) so the page doesn't redirect on load.
  useEffect(() => {
    if (!isMounted) return;
    // Preserve all existing URL params but reset page to 1 (Req 10.7)
    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");
    router.push(`/articles?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ── Client-side filter on server-provided articles ─────────────────────────

  // Client-side search filter on top of server-paginated articles (Req 10.3)
  const filtered = search.trim()
    ? articles.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase())
      )
    : articles;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Search bar (Req 10.1) ── */}
      <div className="mb-6 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.2em] text-[#999]">{">>"}</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH ARTICLES..."
          className="w-full bg-[#c1c1c1] border border-[#b0b0b0] pl-10 pr-4 py-3 text-[12px] tracking-[0.15em] text-[#1a1a1a] placeholder-[#999] outline-none focus:border-[#1a1a1a] focus:bg-[#c8c8c8] transition-colors duration-150"
        />
      </div>

      {/* ── Empty state (Req 10.6, 11.1, 11.2, 11.4, 11.6) ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#999] text-sm tracking-wider">
            {search ? "NO ARTICLES MATCH YOUR SEARCH" : "NO ARTICLES FOUND"}
          </p>
        </div>
      ) : (
        <>
          {/* ── Count indicator (Req 10.4) ── */}
          <SectionLabel label={`// SHOWING ${filtered.length} RESULTS`} />

          {/* ── Article grid (Req 5.5) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#bbb] border border-[#bbb]">
            {!isMounted
              ? Array.from({ length: 6 }).map((_, i) => <LoadingCard key={i} />)
              : filtered.map(art => (
                  <ArticleCard
                    key={art.id}
                    tag={`ART-${String(art.id).padStart(3, "0")}`}
                    title={art.title}
                    category={art.category}
                    imageSrc={art.image_src ?? undefined}
                    date={art.date}
                    href={`/articles/${art.slug}`}
                  />
                ))}
          </div>

          {/* ── Pagination (Req 5.5, 10.5, 11.2, 11.5) — hidden during search ── */}
          {!search && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
