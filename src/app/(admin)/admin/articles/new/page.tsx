// app/(admin)/admin/articles/new/page.tsx
// UPDATED — menggunakan shared components dari ArticleFormShared

"use client";

import { useState, useEffect } from "react";
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
  ImageSection,
  ContentEditor,
  PublishSettingsSection,
  FormSubmitBar,
} from "@/components/admin/ArticleFormShared";

export default function AdminCreateArticlePage() {
  const [title, setTitle]                 = useState("");
  const [slug, setSlug]                   = useState("");
  const [slugLocked, setSlugLocked]       = useState(false);
  const [category, setCategory]           = useState<Category | "">("");
  const [excerpt, setExcerpt]             = useState("");
  const [content, setContent]             = useState("");
  const [imageSrc, setImageSrc]           = useState("");
  const [publishStatus, setPublishStatus] = useState<PublishStatus>("draft");
  const [featured, setFeatured]           = useState(false);
  const [submitting, setSubmitting]       = useState(false);

  useEffect(() => {
    if (!slugLocked) setSlug(toSlug(title));
  }, [title, slugLocked]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: connect to existing Supabase insert function
    setTimeout(() => setSubmitting(false), 1200);
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
                className="w-full bg-[#c4c4c4] border border-[#b5b5b5] focus:border-[#1a1a1a] px-4 py-3 text-[12px] tracking-[0.05em] text-[#1a1a1a] placeholder-[#aaa] outline-none font-mono transition-colors duration-150 resize-none"
                spellCheck={false}
              />
            </div>

          </div>
        </section>

        <ImageSection value={imageSrc} onChange={setImageSrc} />

        <ContentEditor value={content} onChange={setContent} />

        <PublishSettingsSection
          publishStatus={publishStatus}
          setPublishStatus={setPublishStatus}
          featured={featured}
          setFeatured={setFeatured}
        />

        <FormSubmitBar
          publishStatus={publishStatus}
          featured={featured}
          submitting={submitting}
          mode="create"
          onSaveDraft={() => setPublishStatus("draft")}
        />

      </form>
    </PageContainer>
  );
}