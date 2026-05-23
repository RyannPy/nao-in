// app/categories/[slug]/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import { LoadingCardGrid } from "@/components/loading";
import PageContainer from "@/components/layout/PageContainer";
import StatusFooter from "@/components/layout/StatusFooter";
import PageHeader from "@/components/ui/PageHeader";
import AccentDivider from "@/components/ui/AccentDivider";
import MetaRow from "@/components/ui/MetaRow";
import SectionLabel from "@/components/ui/SectionLabel";
import {
  getArticlesByCategory,
  getCategoryMeta,
  CATEGORY_MAP,
} from "@/lib/articles";

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategorySlugPage({ params }: Props) {
  const { slug } = await params;

  const meta = getCategoryMeta(slug);
  if (!meta) notFound();

  const articles = await getArticlesByCategory(slug);

  return (
    <PageContainer className="font-mono" innerClassName="px-6 md:px-10 py-10 max-w-5xl mx-auto">
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
              {articles.length}
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
      {articles.length === 0 ? (
        /* ── Empty state ── */
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
        /* ── Article list ── */
        <Suspense fallback={<LoadingCardGrid count={6} />}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#bbb] border border-[#bbb]">
            {articles.map((art) => (
              <ArticleCard
                key={art.id}
                tag={art.id}
                title={art.title}
                category={art.category}
                imageSrc={art.image_src}
                date={art.date}
                href={`/articles/${art.slug}`}
              />
            ))}
          </div>
        </Suspense>
      )}

      {/* ════════════════════════════════════════════
          7. BOTTOM — BACK BUTTON + FOOTER
      ════════════════════════════════════════════ */}
      {articles.length > 0 && (
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
            {articles.length} ARTICLES / {meta.label}
          </span>
        }
      />
    </PageContainer>
  );
}
