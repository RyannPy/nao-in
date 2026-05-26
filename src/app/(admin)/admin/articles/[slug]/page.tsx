// app/(admin)/admin/articles/[slug]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/ui/PageHeader";

// ─── Import shared components ─────────────────────────────────────────────────
// Dalam proyek nyata: import dari @/components/admin/ArticleFormShared
// Di sini inline untuk kemudahan paste — gunakan file ArticleFormShared.tsx
import {
  cx,
  toSlug,
  CATEGORIES,
  type Category,
  type PublishStatus,
  type ArticleFormData,
  SectionLabel,
  FieldLabel,
  TextInput,
  SlugField,
  CategorySelect,
  ImageSection,
  ContentEditor,
  PublishSettingsSection,
  FormSubmitBar,
} from "@/components/admin/ArticleFormShared";

// ─── Mock data — ganti dengan Supabase fetch by slug ─────────────────────────
const MOCK_ARTICLES: Record<string, ArticleFormData & { id: string }> = {
  "getting-started-with-rust-2026": {
    id: "ART-001",
    title: "Getting Started with Rust in 2026",
    slug: "getting-started-with-rust-2026",
    category: "coding",
    excerpt: "A practical guide to picking up Rust as your systems language in the current ecosystem.",
    content: "## Introduction\n\nRust has matured significantly...\n\n## Why Now?\n\nThe toolchain is finally stable enough for production use.",
    imageSrc: "",
    publishStatus: "published",
    featured: true,
  },
  "elden-ring-dlc-lore-breakdown": {
    id: "ART-002",
    title: "Elden Ring DLC — Full Lore Breakdown",
    slug: "elden-ring-dlc-lore-breakdown",
    category: "games",
    excerpt: "Every hidden detail and connection to the base game's lore explained.",
    content: "## The Shadow Realm\n\nWhen Miquella...",
    imageSrc: "",
    publishStatus: "published",
    featured: false,
  },
  "study-certifications-no-burnout": {
    id: "ART-003",
    title: "How I Study for Certifications Without Burning Out",
    slug: "study-certifications-no-burnout",
    category: "study",
    excerpt: "A system I built over two years to get through dense technical material.",
    content: "## The Problem\n\nMost certification guides treat study like a sprint...",
    imageSrc: "",
    publishStatus: "draft",
    featured: false,
  },
};

// ─── Delete confirm modal — inline (sama pattern dgn list page) ───────────────
function DeleteModal({
  articleId,
  onConfirm,
  onCancel,
}: {
  articleId: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onCancel} aria-hidden />
      <div className="relative w-full max-w-sm mx-4 bg-[#c9c9c9] border border-[#b0b0b0] font-mono">
        <div className="h-[2px] bg-[#cc3333]" />
        <div className="px-6 pt-5 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[8px] tracking-[0.3em] text-[#aaa] uppercase">CONFIRM DELETE</span>
            <span className="h-px flex-1 bg-[#bbb]" />
            <span className="text-[8px] tracking-[0.3em] text-[#cc3333] uppercase">IRREVERSIBLE</span>
          </div>
          <p className="text-[12px] text-[#1a1a1a] leading-relaxed mb-1">
            Article akan dihapus permanen dari database.
          </p>
          <p className="text-[11px] text-[#777] leading-relaxed mb-5">
            <span className="text-[#1a1a1a] font-semibold">{articleId}</span>
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminEditArticlePage() {
  const params   = useParams();
  const router   = useRouter();
  const slug     = typeof params.slug === "string" ? params.slug : "";

  // ── Hydrate from mock (swap with Supabase fetch) ──
  const existing = MOCK_ARTICLES[slug];

  const [title, setTitle]                   = useState(existing?.title ?? "");
  const [articleSlug, setArticleSlug]       = useState(existing?.slug ?? "");
  const [slugLocked, setSlugLocked]         = useState(true); // edit mode: locked by default
  const [category, setCategory]             = useState<Category | "">(existing?.category as Category ?? "");
  const [excerpt, setExcerpt]               = useState(existing?.excerpt ?? "");
  const [content, setContent]               = useState(existing?.content ?? "");
  const [imageSrc, setImageSrc]             = useState(existing?.imageSrc ?? "");
  const [publishStatus, setPublishStatus]   = useState<PublishStatus>(existing?.publishStatus ?? "draft");
  const [featured, setFeatured]             = useState(existing?.featured ?? false);
  const [submitting, setSubmitting]         = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notFound, setNotFound]             = useState(!existing);

  // Auto-slug sync only when unlocked
  useEffect(() => {
    if (!slugLocked) setArticleSlug(toSlug(title));
  }, [title, slugLocked]);

  // ── Handlers ──
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: connect to existing Supabase update function
    setTimeout(() => setSubmitting(false), 1200);
  }

  function handleDelete() {
    // TODO: connect to existing Supabase delete function
    router.push("/admin/articles");
  }

  // ── Not found state ──
  if (notFound) {
    return (
      <PageContainer>
        <PageHeader title="Edit Article" code="ADM-005" />
        <div className="mt-8 bg-[#c4c4c4] border border-[#b8b8b8] px-6 py-10 flex flex-col items-center gap-3 font-mono">
          <span className="text-[32px] text-[#ccc] select-none">◈</span>
          <p className="text-[11px] tracking-[0.3em] text-[#aaa] uppercase">ARTICLE NOT FOUND</p>
          <p className="text-[9px] tracking-[0.15em] text-[#bbb]">slug: /{slug}</p>
          <button
            onClick={() => router.push("/admin/articles")}
            className="mt-4 px-5 py-2 bg-[#1a1a1a] border border-[#1a1a1a] text-[#e8c830] text-[9px] tracking-[0.3em] font-mono uppercase hover:bg-[#2a2a2a] transition-colors duration-150"
          >
            ← BACK TO LIST
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          articleId={existing?.id ?? slug}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <PageContainer>
        {/* Header with breadcrumb hint */}
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => router.push("/admin/articles")}
            className="text-[8px] tracking-[0.25em] text-[#aaa] font-mono uppercase hover:text-[#1a1a1a] transition-colors duration-150"
          >
            ← ARTICLES
          </button>
          <span className="text-[#ccc] text-[8px]">/</span>
          <span className="text-[8px] tracking-[0.25em] text-[#888] font-mono uppercase">
            {existing?.id}
          </span>
        </div>

        <PageHeader title="Edit Article" code="ADM-005" />

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">

          {/* ── SECTION: Core metadata ── */}
          <section>
            <SectionLabel>{"// CORE METADATA"}</SectionLabel>
            <div className="flex flex-col gap-5">

              {/* Title */}
              <div>
                <FieldLabel code="F-01" label="Title" />
                <TextInput value={title} onChange={setTitle} placeholder="Article title..." />
              </div>

              {/* Slug */}
              <SlugField
                slug={articleSlug}
                setSlug={setArticleSlug}
                locked={slugLocked}
                setLocked={setSlugLocked}
                title={title}
              />

              {/* Category */}
              <CategorySelect value={category} onChange={setCategory} />

              {/* Excerpt */}
              <div>
                <FieldLabel code="F-04" label="Excerpt" />
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short description shown in article cards..."
                  rows={3}
                  className="w-full bg-[#c4c4c4] border border-[#b5b5b5] focus:border-[#1a1a1a] px-4 py-3 text-[12px] tracking-[0.05em] text-[#1a1a1a] placeholder-[#aaa] outline-none font-mono transition-colors duration-150 resize-none"
                  spellCheck={false}
                />
              </div>

            </div>
          </section>

          {/* ── SECTION: Image ── */}
          <ImageSection value={imageSrc} onChange={setImageSrc} />

          {/* ── SECTION: Content ── */}
          <ContentEditor value={content} onChange={setContent} />

          {/* ── SECTION: Publish settings ── */}
          <PublishSettingsSection
            publishStatus={publishStatus}
            setPublishStatus={setPublishStatus}
            featured={featured}
            setFeatured={setFeatured}
          />

          {/* ── Submit bar with delete ── */}
          <FormSubmitBar
            publishStatus={publishStatus}
            featured={featured}
            submitting={submitting}
            mode="edit"
            onSaveDraft={() => setPublishStatus("draft")}
            onDelete={() => setShowDeleteModal(true)}
          />

        </form>
      </PageContainer>
    </>
  );
}