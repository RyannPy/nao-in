// app/page.tsx  →  salin sebagai HomePage

import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import PageContainer from "@/components/layout/PageContainer";
import StatusFooter from "@/components/layout/StatusFooter";
import PageHeader from "@/components/ui/PageHeader";
import SectionLabel from "@/components/ui/SectionLabel";


import { getArticlesFeatured, getArticlesRecent, getCountArticles } from "@/lib/articles";


// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {

  
const FEATURED = await getArticlesFeatured();
const RECENT = await getArticlesRecent();

if (!FEATURED) {
  return <div>No featured article found.</div>;
}

const totalArticles = await getCountArticles();


const STATS = [
  { label: "ARTICLES", value: totalArticles },
  { label: "CATEGORIES", value: "5" },
  { label: "READERS / MONTH", value: "4.2K" },
  { label: "YEARS ACTIVE", value: "1" },
];



  return (
    <PageContainer className="font-mono">
      {/* ── Page header ── */}
      <PageHeader title="INDEX" code="PGE-001" />

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-4 gap-px bg-[#bbb] border border-[#bbb] mb-12">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-[#c9c9c9] px-4 py-4 flex flex-col gap-1"
          >
            <span className="text-2xl font-black tracking-tighter text-[#1a1a1a]">
              {s.value}
            </span>
            <span className="text-[8px] tracking-[0.25em] text-[#777] uppercase">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Featured article ── */}
      <section className="mb-12">
        <SectionLabel label={"// FEATURED"} />

        <Link
          href={`/articles/${FEATURED.slug}`}
          className="group block bg-[#1a1a1a] p-7 relative overflow-hidden border-l-[3px] border-[#e8c830] transition-all duration-200 hover:shadow-[4px_4px_0_#e8c830]"
        >
          {/* corner ticks */}
          <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#333]" />
          <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#333]" />

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] tracking-[0.3em] text-[#e8c830]">
              {FEATURED.tag}
            </span>
            <span className="text-[9px] tracking-[0.2em] text-[#555] uppercase">
              {FEATURED.category}
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight leading-snug text-white uppercase mb-3 group-hover:text-[#e8c830] transition-colors duration-150">
            {FEATURED.title}
          </h2>
          <p className="text-[12px] text-[#888] leading-relaxed mb-5">
            {FEATURED.excerpt}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[9px] tracking-[0.2em] text-[#555]">
              {FEATURED.date}
            </span>
            <span className="ml-auto text-[9px] tracking-[0.3em] text-[#e8c830] group-hover:translate-x-1 transition-transform duration-150">
              READ →
            </span>
          </div>
        </Link>
      </section>

      {/* ── Recent articles ── */}
      <section>
        <SectionLabel
          label={"// LATEST"}
          rightContent={
            <Link
              href="/articles"
              className="text-[9px] tracking-[0.2em] text-[#888] hover:text-[#1a1a1a] transition-colors"
            >
              ALL ARTICLES →
            </Link>
          }
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#bbb]">
          {RECENT.map((art) => (
            <ArticleCard
              key={art.tag}
              tag={art.tag}
              title={art.title}
              category={art.category}
              date={art.date}
              href={`/articles/${art.slug}`}
            />
          ))}
        </div>
      </section>

      {/* ── Footer status ── */}
      <StatusFooter />
    </PageContainer>
  );
}
