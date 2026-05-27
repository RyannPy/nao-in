// app/(admin)/admin/articles/[slug]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  cx,
  toSlug,
  type Category,
  type PublishStatus,
  SectionLabel,
  FieldLabel,
  TextInput,
  SlugField,
  CategorySelect,
  ContentEditor,
  PublishSettingsSection,
  FormSubmitBar,
} from "@/components/admin/ArticleFormShared";
import {
  updateArticleAction,
  deleteArticleAction,
} from "@/app/(admin)/admin/articles/actions";
import type { ArticleAdmin } from "@/types/article";

// ─── Delete confirm modal ─────────────────────────────────────────────────────
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

// ─── Component ──────────────────────────────────────────────────────────────────
export default function AdminEditArticleClient({
  initialArticle,
}: {
  initialArticle: ArticleAdmin;
}) {
  const router = useRouter();
  const slug   = initialArticle.slug;

  // ── Form state ──
  const [title, setTitle]                     = useState(initialArticle.title);
  const [articleSlug, setArticleSlug]         = useState(initialArticle.slug);
  const [slugLocked, setSlugLocked]           = useState(true);
  const [category, setCategory]               = useState<Category | "">(initialArticle.category as Category);
  const [excerpt, setExcerpt]                 = useState(initialArticle.excerpt ?? "");
  const [content, setContent]                 = useState(initialArticle.content ?? "");
  const [imageSrc, setImageSrc]               = useState(initialArticle.image_src ?? "");
  const [publishStatus, setPublishStatus]     = useState<PublishStatus>(initialArticle.published ? "published" : "draft");

  // ── UI state ──
  const [submitting, setSubmitting]           = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError]                     = useState<string | null>(null);

  // ── Auto-slug sync when unlocked ──
  useEffect(() => {
    if (!slugLocked) setArticleSlug(toSlug(title));
  }, [title, slugLocked]);

  // ── Fetch article on mount removed ──

  // ── Handlers ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await updateArticleAction(slug, {
        title,
        slug: articleSlug,
        category,
        excerpt,
        content,
        image_src: imageSrc || null,
        published: publishStatus === "published",
      });
      router.push("/admin/articles");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update article.";
      setError(msg);
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteArticleAction(slug);
      router.push("/admin/articles");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete article.";
      setError(msg);
      setShowDeleteModal(false);
    }
  }

  // ── Loading & Not Found handled by Server Component ──

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          articleId={slug}
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
            {slug}
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
                  className="w-full bg-[#c4c4c4] border border-[#b5b5b5] focus:border-[#1a1a1a] px-4 py-3 text-[12px] tracking-wider text-[#1a1a1a] placeholder-[#aaa] outline-none font-mono transition-colors duration-150 resize-none"
                  spellCheck={false}
                />
              </div>

            </div>
          </section>

          {/* ── SECTION: Image ── */}
          <section>
            <SectionLabel>{"// IMAGE SOURCE"}</SectionLabel>
            <ImageUpload
              slug={articleSlug}
              currentImageUrl={imageSrc || undefined}
              onUpload={(url) => setImageSrc(url)}
            />
          </section>

          {/* ── SECTION: Content ── */}
          <ContentEditor value={content} onChange={setContent} />

          {/* ── SECTION: Publish settings ── */}
          <PublishSettingsSection
            publishStatus={publishStatus}
            setPublishStatus={setPublishStatus}
          />

          {/* ── Error message ── */}
          {error && (
            <div className="border border-[#cc3333] bg-[#fff0f0] px-5 py-3 font-mono">
              <p className="text-[9px] tracking-[0.25em] text-[#cc3333] uppercase font-semibold mb-1">
                ERROR
              </p>
              <p className="text-[10px] text-[#cc3333] leading-relaxed">{error}</p>
            </div>
          )}

          {/* ── Submit bar with delete ── */}
          <FormSubmitBar
            publishStatus={publishStatus}
            submitting={submitting}
            mode="edit"
            onSaveDraft={() => {
              setPublishStatus("draft");
            }}
            onDelete={() => setShowDeleteModal(true)}
          />

        </form>
      </PageContainer>
    </>
  );
}
