// app/(admin)/admin/articles/new/page.tsx
// Admin create article page — wired to Supabase via Server Action.

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import {
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
import ImageUpload from "@/components/admin/ImageUpload";
import { createArticleAction } from "./actions";

export default function AdminCreateArticlePage() {
  const router = useRouter();

  const [title, setTitle]                 = useState("");
  const [slug, setSlug]                   = useState("");
  const [slugLocked, setSlugLocked]       = useState(false);
  const [category, setCategory]           = useState<Category | "">("");
  const [excerpt, setExcerpt]             = useState("");
  const [content, setContent]             = useState("");
  const [imageSrc, setImageSrc]           = useState("");
  const [publishStatus, setPublishStatus] = useState<PublishStatus>("draft");
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  useEffect(() => {
    if (!slugLocked) setSlug(toSlug(title));
  }, [title, slugLocked]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createArticleAction({
        slug,
        title,
        category,
        excerpt,
        content,
        image_src: imageSrc || null,
        published: publishStatus === "published",
      });
      router.push("/admin/articles");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      setSubmitting(false);
    }
  }

  function handleSaveDraft() {
    setPublishStatus("draft");
    // Trigger form submit programmatically after state update
    // We use a small timeout to let React flush the state change first
    setTimeout(() => {
      const form = document.querySelector<HTMLFormElement>("form");
      if (form) {
        // Dispatch a submit event so handleSubmit fires with the updated publishStatus
        form.requestSubmit();
      }
    }, 0);
  }

  return (
    <PageContainer>
      <PageHeader title="Create Article" code="ADM-003" />

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">

        <section>
          <SectionLabel>{"// CORE METADATA"}</SectionLabel>
          <div className="flex flex-col gap-5">

            <div>
              <FieldLabel code="F-01" label="Title" />
              <TextInput value={title} onChange={setTitle} placeholder="Article title..." />
            </div>

            <SlugField
              slug={slug}
              setSlug={setSlug}
              locked={slugLocked}
              setLocked={setSlugLocked}
              title={title}
            />

            <CategorySelect value={category} onChange={setCategory} />

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

        <section>
          <SectionLabel>{"// IMAGE SOURCE"}</SectionLabel>
          <ImageUpload
            slug={slug}
            onUpload={(url) => setImageSrc(url)}
          />
        </section>

        <ContentEditor value={content} onChange={setContent} />

        <PublishSettingsSection
          publishStatus={publishStatus}
          setPublishStatus={setPublishStatus}
        />

        {error && (
          <div className="border border-[#cc3333] bg-[#fff0f0] px-5 py-4">
            <p className="text-[10px] tracking-[0.15em] text-[#cc3333] font-mono uppercase font-semibold mb-1">
              ERROR
            </p>
            <p className="text-[11px] text-[#cc3333] font-mono">{error}</p>
          </div>
        )}

        <FormSubmitBar
          publishStatus={publishStatus}
          submitting={submitting}
          mode="create"
          onSaveDraft={handleSaveDraft}
        />

      </form>
    </PageContainer>
  );
}
