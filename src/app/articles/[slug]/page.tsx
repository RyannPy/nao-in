// app/articles/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryBadge from "@/components/CategoryBadge";
import PageContainer from "@/components/layout/PageContainer";
import StatusFooter from "@/components/layout/StatusFooter";
import AccentDivider from "@/components/ui/AccentDivider";
import MetaRow from "@/components/ui/MetaRow";
import SectionLabel from "@/components/ui/SectionLabel";
import { JSX } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RelatedArticle {
  id: string;
  slug: string;
  category: string;
  title: string;
  date: string;
}

// ─── Dummy data — replace with your real data source ─────────────────────────

import { getArticleBySlug } from "@/lib/articles";

const RELATED: RelatedArticle[] = [
  {
    id: "ART-006",
    slug: "retro-games-and-modern-game-design",
    category: "games",
    title: "Retro Games and Modern Game Design",
    date: "28 APR 2026",
  },
  {
    id: "ART-007",
    slug: "why-black-holes-distort-time",
    category: "science",
    title: "Why Black Holes Distort Time",
    date: "21 APR 2026",
  },
  {
    id: "ART-009",
    slug: "why-typescript-feels-safer",
    category: "coding",
    title: "Why TypeScript Feels Safer for Large Projects",
    date: "07 APR 2026",
  },
];

// ─── Data fetcher — replace with your DB/API call ─────────────────────────────

function getArticle(slug: string) {
  return getArticleBySlug(slug);
}

// ─── Prose renderer ───────────────────────────────────────────────────────────
// Parses the markdown-lite content string into styled JSX blocks.
// Replace with a proper MDX/markdown renderer (next-mdx-remote, remark) in production.

function renderContent(raw: string) {
  const lines = raw.trim().split("\n");
  const blocks: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={key++}
          className="text-[13px] font-black tracking-[0.2em] uppercase text-[#1a1a1a] mt-10 mb-4 flex items-center gap-3"
          
        >
          <span className="w-4 h-px bg-[#e8c830] inline-block shrink-0" />
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      // Bold standalone line — sub-heading
      blocks.push(
        <p
          key={key++}
          className="text-[13px] font-bold tracking-tight text-[#1a1a1a] mt-6 mb-2"
          
        >
          {line.slice(2, -2)}
        </p>,
      );
    } else {
      // Regular paragraph — render inline **bold** spans
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      blocks.push(
        <p
          key={key++}
          className="text-[14px] leading-[1.9] text-[#3a3a3a] mb-0"
          
        >
          {parts.map((part, pi) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={pi} className="font-bold text-[#1a1a1a]">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            ),
          )}
        </p>,
      );
    }
  }
  return blocks;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticleSlugPage({ params }: Props) {
  const { slug } = await params;

  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <PageContainer innerClassName="px-6 md:px-10 py-10 max-w-3xl mx-auto">
      {/* ════════════════════════════════════════════
          1. TOP METADATA ROW
      ════════════════════════════════════════════ */}
      <div className="flex items-center gap-4 mb-6">
        {/* Breadcrumb back */}
        <Link
          href="/articles"
          className="group flex items-center gap-1.5 text-[9px] tracking-[0.3em] text-[#888] uppercase hover:text-[#1a1a1a] transition-colors duration-150"
        >
          <span className="transition-transform duration-150 group-hover:-translate-x-0.5">
            ←
          </span>
          ARTICLES
        </Link>

        <span className="h-3 w-px bg-[#bbb]" />

        {/* Category badge */}
        <CategoryBadge label={article.category} variant="default" />

        {/* Spacer + Article ID flush right */}
        <span className="h-px flex-1 bg-[#bbb]" />
        <span className="text-[9px] tracking-[0.25em] text-[#aaa]">
          {article.id}
        </span>
      </div>

      {/* ════════════════════════════════════════════
          2. ARTICLE TITLE
      ════════════════════════════════════════════ */}
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-[1.1] uppercase text-[#1a1a1a] mb-5">
        {article.title}
      </h1>

      {/* ════════════════════════════════════════════
          3. PUBLICATION METADATA
      ════════════════════════════════════════════ */}
      <MetaRow dotLabel={article.date} labels={["NAO-IN"]} />

      {/* ════════════════════════════════════════════
          4. ACCENT DIVIDER
      ════════════════════════════════════════════ */}
      <AccentDivider />

      {/* ════════════════════════════════════════════
          5. EXCERPT / INTRODUCTION
      ════════════════════════════════════════════ */}
      <div className="relative border-l-[3px] border-[#e8c830] pl-5 mb-10">
        {/* Corner ticks */}
        <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#bbb]" />
        <span className="absolute bottom-0 -left-0.75 w-2 h-2 border-b border-l border-[#ccc]" />

        <p
          className="text-[13px] leading-[1.8] text-[#555] italic"
          
        >
          {article.excerpt}
        </p>
      </div>

      {/* ════════════════════════════════════════════
          6. MAIN ARTICLE CONTENT
      ════════════════════════════════════════════ */}
      <article className="mb-16">
        {/* Thin top border */}
        <SectionLabel
          label={"// CONTENT"}
          className="mb-8"
          rightContent={<span className="w-1 h-1 bg-[#bbb]" />}
        />

        {/* Prose content with paragraph spacing */}
        <div className="flex flex-col gap-5">
          {renderContent(article.content)}
        </div>

        {/* End-of-article marker */}
        <div className="flex items-center gap-3 mt-12 pt-5 border-t border-[#c8c8c8]">
          <span className="text-[8px] tracking-[0.3em] text-[#bbb] uppercase">
            END OF DOCUMENT
          </span>
          <span className="h-px flex-1 bg-[#d0d0d0]" />
          <span className="text-[8px] tracking-[0.2em] text-[#bbb]">
            {article.id}
          </span>
        </div>
      </article>

      {/* ════════════════════════════════════════════
          7A. RELATED ARTICLES
      ════════════════════════════════════════════ */}
      <section className="mb-12">
        <SectionLabel label={"// RELATED ARTICLES"} className="mb-5" />

        <div className="flex flex-col gap-px bg-[#bbb] border border-[#bbb]">
          {RELATED.map((rel) => (
            <Link
              key={rel.id}
              href={`/articles/${rel.slug}`}
              className="group flex items-center gap-4 bg-[#c9c9c9] px-5 py-3 hover:bg-[#1a1a1a] transition-colors duration-150 relative"
            >
              <span className="absolute left-0 top-0 bottom-0 w-0.75 bg-[#e8c830] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-150" />
              <span className="text-[8px] tracking-[0.2em] text-[#aaa] group-hover:text-[#555] shrink-0 w-14 transition-colors duration-150">
                {rel.id}
              </span>
              <span className="text-[8px] tracking-[0.2em] text-[#999] group-hover:text-[#555] w-24 shrink-0 uppercase hidden sm:block transition-colors duration-150">
                {rel.category}
              </span>
              <span className="text-[12px] font-semibold tracking-tight text-[#1a1a1a] group-hover:text-white flex-1 leading-snug transition-colors duration-150">
                {rel.title}
              </span>
              <span className="text-[8px] tracking-[0.15em] text-[#bbb] group-hover:text-[#555] shrink-0 hidden md:block transition-colors duration-150">
                {rel.date}
              </span>
              <span className="text-[9px] text-[#bbb] group-hover:text-[#e8c830] shrink-0 transition-colors duration-150">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          7B. BACK BUTTON + FOOTER METADATA
      ════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
        <Link
          href="/articles"
          className="group inline-flex items-center gap-3 bg-[#1a1a1a] px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-white hover:bg-[#111] transition-colors duration-150 relative border-l-[3px] border-[#e8c830]"
        >
          <span className="transition-transform duration-150 group-hover:-translate-x-0.5">
            ←
          </span>
          BACK TO ARCHIVE
        </Link>

        <Link
          href="/categories"
          className="group inline-flex items-center gap-3 bg-transparent border border-[#bbb] px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors duration-150"
        >
          VIEW CATEGORIES
          <span className="transition-transform duration-150 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>

      {/* ── Footer status ── */}
      <StatusFooter
        statusText="SYSTEM ACTIVE"
        className="mt-0"
        extraInfo={
          <span className="text-[8px] tracking-[0.15em] text-[#aaa]">
            {article.date}
          </span>
        }
      />
    </PageContainer>
  );
}
