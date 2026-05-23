// app/articles/page.tsx  →  salin sebagai ArticlesPage

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import LoadingCard from "@/components/loading/LoadingCard";
import PageContainer from "@/components/layout/PageContainer";
import StatusFooter from "@/components/layout/StatusFooter";
import PageHeader from "@/components/ui/PageHeader";
import SectionLabel from "@/components/ui/SectionLabel";

// ─── Dummy data ───────────────────────────────────────────────────────────────
import { getArticlesPreview } from "@/lib/articles";

const ARTICLES = await getArticlesPreview();
// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filtered = ARTICLES.filter((a) => {
    const matchSearch =
      search.trim() === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <PageContainer className="font-mono">
      {/* ── Page header ── */}
      <PageHeader title="ARTICLES" code="PGE-002" className="mb-10" />

      {/* ── Search bar ── */}
      <div className="mb-6 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.2em] text-[#999]">
          {">>"}
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH ARTICLES..."
          className="w-full bg-[#c1c1c1] border border-[#b0b0b0] pl-10 pr-4 py-3 text-[12px] tracking-[0.15em] text-[#1a1a1a] placeholder-[#999] outline-none focus:border-[#1a1a1a] focus:bg-[#c8c8c8] transition-colors duration-150"
        />
      </div>

      {/* ── Count indicator ── */}
      <SectionLabel
        label={`// SHOWING ${filtered.length} / ${ARTICLES.length} RESULTS`}
      />

      {/* ── Article list ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#bbb] border border-[#bbb]">
        {!isMounted ? (
          Array.from({ length: 6 }).map((_, i) => <LoadingCard key={i} />)
        ) : (
          filtered.map((art) => (
            <ArticleCard
              key={art.id}
              tag={art.id}
              title={art.title}
              category={art.category}
              imageSrc={art.image_src}
              date={art.date}
              href={`/articles/${art.slug}`}
            />
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <StatusFooter />
    </PageContainer>
  );
}
