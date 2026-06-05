// app/(admin)/admin/articles/AdminArticlesClient.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import { deleteArticleAction } from "@/app/(admin)/admin/articles/actions";
import Pagination, { paginateItems, getTotalPages } from "@/components/ui/Pagination";
import type { ArticleAdmin } from "@/types/article";
import type { ArticleStats } from "@/lib/admin/articles";
import PageHeader from "@/components/ui/PageHeader";

// ─── cx ───────────────────────────────────────────────────────────────────────
function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Article = ArticleAdmin;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[9px] tracking-[0.3em] text-[#888] uppercase font-mono">{children}</span>
      <span className="h-px flex-1 bg-[#bbb]" />
    </div>
  );
}

function StatCell({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className="bg-[#c4c4c4] border border-[#b8b8b8] px-4 py-3 flex flex-col gap-1 relative overflow-hidden">
      <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#b0b0b0]" />
      <span
        className="text-xl font-black tracking-tighter font-mono leading-none"
        style={{ color: accent ? "#e8c830" : "#1a1a1a" }}
      >
        {value}
      </span>
      <span className="text-[8px] tracking-[0.2em] text-[#888] uppercase font-mono">{label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center px-2 py-[2px] text-[7px] tracking-[0.25em] font-mono uppercase border",
        status === "published"
          ? "bg-[#1a1a1a] text-[#e8c830] border-[#1a1a1a]"
          : "bg-[#d8d8d8] text-[#888] border-[#c8c8c8]"
      )}
    >
      {status}
    </span>
  );
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────
function DeleteModal({
  article,
  onConfirm,
  onCancel,
}: {
  article: Article;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onCancel}
        aria-hidden
      />
      {/* Panel */}
      <div className="relative w-full max-w-sm mx-4 bg-[#c9c9c9] border border-[#b0b0b0] font-mono">
        {/* top accent */}
        <div className="h-[2px] bg-[#cc3333]" />
        <div className="px-6 pt-5 pb-6">
          {/* header */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[8px] tracking-[0.3em] text-[#aaa] uppercase">CONFIRM DELETE</span>
            <span className="h-px flex-1 bg-[#bbb]" />
            <span className="text-[8px] tracking-[0.3em] text-[#cc3333] uppercase">IRREVERSIBLE</span>
          </div>

          <p className="text-[12px] text-[#1a1a1a] leading-relaxed mb-1">
            Article akan dihapus permanen dari database.
          </p>
          <p className="text-[11px] text-[#777] leading-relaxed mb-5">
            <span className="text-[#1a1a1a] font-semibold">#{article.id}</span>
            {" — "}
            {article.title}
          </p>

          <div className="flex gap-[3px]">
            <button
              onClick={onCancel}
              className="flex-1 py-3 text-[10px] tracking-[0.3em] uppercase border border-[#bbb] bg-[#c4c4c4] text-[#666] hover:bg-[#bbb] transition-colors duration-150"
            >
              CANCEL
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 text-[10px] tracking-[0.3em] uppercase font-black bg-[#cc3333] border border-[#cc3333] text-white hover:bg-[#aa2222] transition-colors duration-150"
            >
              DELETE →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────
type FilterTab = "ALL" | "PUBLISHED" | "DRAFT";
const FILTER_TABS: FilterTab[] = ["ALL", "PUBLISHED", "DRAFT"];

// ─── Loading state ────────────────────────────────────────────────────────────
function LoadingPanel() {
  return (
    <div className="mt-8 bg-[#c9c9c9] border border-[#b8b8b8] px-6 py-12 flex flex-col items-center gap-3">
      <span className="text-[28px] text-[#bbb] select-none animate-pulse">◈</span>
      <p className="text-[11px] tracking-[0.3em] text-[#aaa] font-mono uppercase">
        LOADING ARTICLES...
      </p>
      <p className="text-[9px] tracking-[0.15em] text-[#bbb] font-mono">
        Fetching from database
      </p>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────────
export default function AdminArticlesClient({
  initialArticles,
  initialStats,
  initialPage = 1,
}: {
  initialArticles: Article[];
  initialStats: ArticleStats;
  initialPage?: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Derive currentPage from URL, falling back to initialPage (Req 6.3)
  const currentPage = (() => {
    const p = parseInt(searchParams.get("page") ?? String(initialPage), 10);
    return isNaN(p) || p < 1 ? 1 : p;
  })();

  const [articles, setArticles]         = useState<Article[]>(initialArticles);
  const [stats]                         = useState<ArticleStats>(initialStats);
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  // Track whether the component has mounted so we skip the reset on initial render
  const isMounted = useRef(false);

  // Reset pagination to page 1 (via URL) when search or filter changes (Req 6.5, 10.2)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    try {
      router.push("/admin/articles?page=1");
    } catch (err) {
      console.error("Failed to reset page:", err);
      window.location.href = "/admin/articles?page=1";
    }
  }, [search, activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigate to a specific page by updating the URL (Req 6.6, 6.7)
  const handlePageChange = (page: number) => {
    try {
      router.push(`/admin/articles?page=${page}`);
    } catch (err) {
      console.error("Failed to navigate to page:", err);
      window.location.href = `/admin/articles?page=${page}`;
    }
  };

  // ── Derived stats (fallback to live counts if stats not loaded) ──
  const total     = stats?.total     ?? articles.length;
  const published = stats?.published ?? articles.filter((a) => a.published).length;
  const drafts    = stats?.drafts    ?? articles.filter((a) => !a.published).length;

  // ── Filtered list ──
  const filtered = articles.filter((a) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q);

    const matchFilter =
      activeFilter === "ALL" ||
      (activeFilter === "PUBLISHED" && a.published) ||
      (activeFilter === "DRAFT"     && !a.published);

    return matchSearch && matchFilter;
  });

  // ── Pagination ──
  const totalPages = getTotalPages(filtered.length);
  const paginatedArticles = paginateItems(filtered, currentPage);

  // ── Delete handler ──
  function handleDelete(article: Article) {
    setDeleteTarget(article);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteArticleAction(deleteTarget.slug);
      setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    } catch (err) {
      console.error("Failed to delete article:", err);
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <>
      {deleteTarget && (
        <DeleteModal
          article={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <PageContainer>
        <PageHeader title="Manage Articles" code="ADM-004" />

        <>
          {/* ── Stats ── */}
            <div className="mt-8">
              <SectionLabel>{"// ARCHIVE METRICS"}</SectionLabel>
              <div className="grid grid-cols-3 gap-px bg-[#b8b8b8] border border-[#b8b8b8]">
                <StatCell label="TOTAL"     value={total} />
                <StatCell label="PUBLISHED" value={published} accent />
                <StatCell label="DRAFT"     value={drafts} />
              </div>
            </div>

            {/* ── Search ── */}
            <div className="mt-8 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.2em] text-[#999] font-mono select-none">
                {">>"}
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH BY TITLE, CATEGORY, SLUG..."
                className="w-full bg-[#c1c1c1] border border-[#b0b0b0] pl-10 pr-4 py-3 text-[12px] tracking-[0.12em] text-[#1a1a1a] placeholder-[#999] outline-none focus:border-[#1a1a1a] transition-colors duration-150 font-mono"
              />
            </div>

            {/* ── Filter tabs ── */}
            <div className="mt-2 flex flex-wrap gap-[3px]">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={cx(
                    "px-4 py-2 text-[9px] tracking-[0.25em] font-mono uppercase border transition-colors duration-150",
                    activeFilter === tab
                      ? "bg-[#1a1a1a] text-[#e8c830] border-[#1a1a1a]"
                      : "bg-[#c4c4c4] text-[#777] border-[#c0c0c0] hover:border-[#999] hover:text-[#1a1a1a]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ── Table ── */}
            <div className="mt-6">
              <SectionLabel>
                {"// RESULTS — "}
                {filtered.length > 0
                  ? `SHOWING ${(currentPage - 1) * 12 + 1}-${Math.min(
                      currentPage * 12,
                      filtered.length,
                    )} / ${filtered.length}`
                  : `0 / ${total}`}
              </SectionLabel>

              <div className="flex flex-col border border-[#b8b8b8] bg-[#b8b8b8] gap-px overflow-hidden">

                {/* Table header */}
                <div className="hidden md:grid bg-[#1a1a1a] px-5 py-3 gap-4 items-center"
                  style={{ gridTemplateColumns: "80px 1fr 90px 90px 90px 120px" }}
                >
                  {["ID", "TITLE", "CATEGORY", "STATUS", "DATE", "ACTIONS"].map((h) => (
                    <span key={h} className="text-[8px] tracking-[0.3em] text-[#555] font-mono uppercase">
                      {h}
                    </span>
                  ))}
                </div>

                {/* Empty state */}
                {filtered.length === 0 && (
                  <div className="bg-[#c9c9c9] px-6 py-12 flex flex-col items-center gap-3">
                    <span className="text-[28px] text-[#ccc] select-none">◈</span>
                    <p className="text-[11px] tracking-[0.3em] text-[#aaa] font-mono uppercase">
                      NO ARTICLES FOUND
                    </p>
                    <p className="text-[9px] tracking-[0.15em] text-[#bbb] font-mono">
                      Try a different search or filter
                    </p>
                  </div>
                )}

                {/* Rows */}
                {paginatedArticles.map((article) => (
                  <ArticleRow
                    key={article.id}
                    article={article}
                    onDelete={() => handleDelete(article)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>

            {/* ── CTA ── */}
            <div className="mt-6 flex justify-end">
              <Link
                href="/admin/articles/new"
                className="group flex items-center gap-3 px-6 py-3 bg-[#1a1a1a] border border-[#1a1a1a] text-[#e8c830] text-[10px] tracking-[0.3em] font-mono uppercase font-black hover:bg-[#2a2a2a] transition-colors duration-150"
              >
                + CREATE NEW ARTICLE
              </Link>
            </div>
          </>
      </PageContainer>
    </>
  );
}

// ─── Article row ──────────────────────────────────────────────────────────────
function ArticleRow({
  article,
  onDelete,
}: {
  article: Article;
  onDelete: () => void;
}) {
  const status: "published" | "draft" = article.published ? "published" : "draft";
  // Format date from created_at ISO string
  const dateDisplay = article.created_at
    ? article.created_at.slice(0, 10)
    : "—";

  return (
    <div className="group relative bg-[#c9c9c9] hover:bg-[#1a1a1a] transition-colors duration-150">
      {/* yellow accent bar */}
      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e8c830] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-150" />

      {/* ── Desktop layout ── */}
      <div
        className="hidden md:grid items-center px-5 py-4 gap-4"
        style={{ gridTemplateColumns: "80px 1fr 90px 90px 90px 120px" }}
      >
        <span className="text-[9px] tracking-[0.2em] text-[#aaa] group-hover:text-[#555] font-mono transition-colors">
          #{article.id}
        </span>

        <div className="flex flex-col gap-[2px] min-w-0">
          <span className="text-[12px] font-semibold tracking-tight text-[#1a1a1a] group-hover:text-white font-mono truncate transition-colors duration-150">
            {article.title}
          </span>
          <span className="text-[8px] tracking-[0.15em] text-[#aaa] group-hover:text-[#555] font-mono truncate transition-colors">
            /{article.slug}
          </span>
        </div>

        <span className="text-[9px] tracking-[0.15em] text-[#888] group-hover:text-[#666] font-mono uppercase transition-colors">
          {article.category}
        </span>

        <div>
          <StatusBadge status={status} />
        </div>

        <span className="text-[9px] tracking-widest text-[#aaa] group-hover:text-[#555] font-mono transition-colors">
          {dateDisplay}
        </span>

        <div className="flex gap-[3px]">
          <Link
            href={`/admin/articles/${article.slug}`}
            className="px-2 py-1 text-[8px] tracking-[0.2em] font-mono uppercase border border-[#bbb] text-[#777] bg-[#c4c4c4] hover:bg-[#1a1a1a] hover:text-[#e8c830] hover:border-[#1a1a1a] transition-colors duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            EDIT
          </Link>
          <Link
            href={`/articles/${article.slug}`}
            target="_blank"
            className="px-2 py-1 text-[8px] tracking-[0.2em] font-mono uppercase border border-[#bbb] text-[#777] bg-[#c4c4c4] hover:bg-[#c4c4c4] hover:text-[#1a1a1a] hover:border-[#999] transition-colors duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            VIEW
          </Link>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="px-2 py-1 text-[8px] tracking-[0.2em] font-mono uppercase border border-[#bbb] text-[#aaa] bg-[#c4c4c4] hover:bg-[#fff0f0] hover:text-[#cc3333] hover:border-[#cc3333] transition-colors duration-100"
          >
            DEL
          </button>
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="md:hidden px-5 py-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[8px] tracking-[0.2em] text-[#aaa] group-hover:text-[#555] font-mono transition-colors">
                #{article.id}
              </span>
              <span className="text-[8px] tracking-[0.15em] text-[#888] group-hover:text-[#666] font-mono uppercase transition-colors">
                {article.category}
              </span>
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-[#1a1a1a] group-hover:text-white font-mono leading-snug transition-colors duration-150">
              {article.title}
            </span>
            <span className="text-[8px] tracking-widest text-[#aaa] group-hover:text-[#555] font-mono transition-colors">
              {dateDisplay}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <StatusBadge status={status} />
          </div>
        </div>
        <div className="flex gap-[3px]">
          <Link
            href={`/admin/articles/${article.slug}`}
            className="px-3 py-2 text-[8px] tracking-[0.2em] font-mono uppercase border border-[#bbb] text-[#777] bg-[#c4c4c4] hover:bg-[#1a1a1a] hover:text-[#e8c830] hover:border-[#1a1a1a] transition-colors duration-100"
          >
            EDIT
          </Link>
          <Link
            href={`/articles/${article.slug}`}
            target="_blank"
            className="px-3 py-2 text-[8px] tracking-[0.2em] font-mono uppercase border border-[#bbb] text-[#777] bg-[#c4c4c4] hover:border-[#999] hover:text-[#1a1a1a] transition-colors duration-100"
          >
            VIEW
          </Link>
          <button
            type="button"
            onClick={onDelete}
            className="px-3 py-2 text-[8px] tracking-[0.2em] font-mono uppercase border border-[#bbb] text-[#aaa] bg-[#c4c4c4] hover:bg-[#fff0f0] hover:text-[#cc3333] hover:border-[#cc3333] transition-colors duration-100"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}
