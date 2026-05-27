"use client";

// components/ArticlesClientList.tsx
// Client component for the articles page search + filter UI.

import { useState, useEffect } from "react";
import ArticleCard from "@/components/ArticleCard";
import LoadingCard from "@/components/loading/LoadingCard";
import SectionLabel from "@/components/ui/SectionLabel";
import type { ArticlePreview } from "@/types/article";

interface ArticleWithMeta extends ArticlePreview {
  tag: string;
  date: string;
}

interface Props {
  articles: ArticleWithMeta[];
}

export default function ArticlesClientList({ articles }: Props) {
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filtered = articles.filter((a) => {
    const matchSearch =
      search.trim() === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <>
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
        label={`// SHOWING ${filtered.length} / ${articles.length} RESULTS`}
      />

      {/* ── Article list ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#bbb] border border-[#bbb]">
        {!isMounted ? (
          Array.from({ length: 6 }).map((_, i) => <LoadingCard key={i} />)
        ) : (
          filtered.map((art) => (
            <ArticleCard
              key={art.id}
              tag={`ART-${String(art.id).padStart(3, "0")}`}
              title={art.title}
              category={art.category}
              imageSrc={art.image_src ?? undefined}
              date={art.date}
              href={`/articles/${art.slug}`}
            />
          ))
        )}
      </div>
    </>
  );
}
