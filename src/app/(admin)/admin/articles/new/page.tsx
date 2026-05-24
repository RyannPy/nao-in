// app/(admin)/admin/articles/new/page.tsx

"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/ui/PageHeader";

// ─── cx helper ────────────────────────────────────────────────────────────────
function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["games", "coding", "science", "study", "story"] as const;
type Category = (typeof CATEGORIES)[number];

const MD_SNIPPETS = [
  { label: "## H2",     insert: "## Heading\n" },
  { label: "**bold**",  insert: "**bold text**" },
  { label: "[link]",    insert: "[label](https://url)" },
  { label: "```code",   insert: "```language\ncode here\n```\n" },
];

// ─── Slug generator ───────────────────────────────────────────────────────────
function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-");
}

// ─── Reusable field label ─────────────────────────────────────────────────────
function FieldLabel({ code, label, optional = false }: { code: string; label: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-[6px]">
      <span className="text-[8px] tracking-[0.3em] text-[#aaa] font-mono uppercase">{code}</span>
      <span className="h-px flex-1 bg-[#bbb]" />
      <span className="text-[9px] tracking-[0.2em] text-[#777] font-mono uppercase">{label}</span>
      {optional && (
        <span className="text-[7px] tracking-[0.2em] text-[#aaa] font-mono uppercase border border-[#ccc] px-1 py-px">OPT</span>
      )}
    </div>
  );
}

// ─── Text input ───────────────────────────────────────────────────────────────
function TextInput({
  value,
  onChange,
  placeholder,
  disabled = false,
  monospace = true,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  monospace?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#bbb] font-mono select-none">{">"}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cx(
          "w-full bg-[#c4c4c4] border border-[#b5b5b5] focus:border-[#1a1a1a]",
          "pl-7 pr-4 py-[10px] text-[12px] tracking-[0.08em] text-[#1a1a1a]",
          "placeholder-[#aaa] outline-none transition-colors duration-150",
          monospace ? "font-mono" : "",
          disabled ? "opacity-50 cursor-not-allowed" : ""
        )}
        spellCheck={false}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminCreateArticlePage() {
  // ── Form state ──
  const [title, setTitle]           = useState("");
  const [slug, setSlug]             = useState("");
  const [slugLocked, setSlugLocked] = useState(false);
  const [category, setCategory]     = useState<Category | "">("");
  const [excerpt, setExcerpt]       = useState("");
  const [content, setContent]       = useState("");
  const [imageSrc, setImageSrc]     = useState("");
  const [publishStatus, setPublishStatus] = useState<"draft" | "published">("draft");
  const [featured, setFeatured]     = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Auto-slug from title ──
  useEffect(() => {
    if (!slugLocked) {
      setSlug(toSlug(title));
    }
  }, [title, slugLocked]);

  // ── Snippet insert ──
  function insertSnippet(text: string) {
    setContent((prev) => prev + (prev.endsWith("\n") || prev === "" ? "" : "\n") + text);
  }

  // ── Submit placeholder ──
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

        {/* ── SECTION: Core metadata ── */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[9px] tracking-[0.3em] text-[#888] uppercase font-mono">{"// CORE METADATA"}</span>
            <span className="h-px flex-1 bg-[#bbb]" />
          </div>

          <div className="flex flex-col gap-5">

            {/* Title */}
            <div>
              <FieldLabel code="F-01" label="Title" />
              <TextInput
                value={title}
                onChange={setTitle}
                placeholder="Article title..."
              />
            </div>

            {/* Slug */}
            <div>
              <FieldLabel code="F-02" label="Slug" />
              <div className="flex gap-[3px]">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#bbb] font-mono select-none">{">"}</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setSlugLocked(true); }}
                    placeholder="auto-generated-from-title"
                    className="w-full bg-[#c4c4c4] border border-[#b5b5b5] focus:border-[#1a1a1a] pl-7 pr-4 py-[10px] text-[12px] tracking-[0.08em] text-[#1a1a1a] placeholder-[#aaa] outline-none font-mono transition-colors duration-150"
                    spellCheck={false}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setSlugLocked(false); setSlug(toSlug(title)); }}
                  title="Reset slug dari title"
                  className="px-3 bg-[#c4c4c4] border border-[#b5b5b5] text-[9px] tracking-[0.2em] text-[#888] font-mono uppercase hover:bg-[#1a1a1a] hover:text-[#e8c830] hover:border-[#1a1a1a] transition-colors duration-150 whitespace-nowrap"
                >
                  ↺ RESET
                </button>
              </div>
              <p className="mt-1 text-[8px] tracking-[0.15em] text-[#aaa] font-mono">
                {slugLocked ? "MANUAL MODE — reset untuk sync dengan title" : "AUTO — sync dari title"}
              </p>
            </div>

            {/* Category */}
            <div>
              <FieldLabel code="F-03" label="Category" />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#bbb] font-mono select-none">{">"}</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-[#c4c4c4] border border-[#b5b5b5] focus:border-[#1a1a1a] pl-7 pr-8 py-[10px] text-[12px] tracking-[0.08em] text-[#1a1a1a] outline-none font-mono transition-colors duration-150 appearance-none cursor-pointer"
                >
                  <option value="" disabled>-- SELECT CATEGORY --</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#888] font-mono pointer-events-none">▾</span>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <FieldLabel code="F-04" label="Excerpt" />
              <div className="relative">
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short description shown in article cards and listings..."
                  rows={3}
                  className="w-full bg-[#c4c4c4] border border-[#b5b5b5] focus:border-[#1a1a1a] px-4 py-3 text-[12px] tracking-[0.05em] text-[#1a1a1a] placeholder-[#aaa] outline-none font-mono transition-colors duration-150 resize-none"
                  spellCheck={false}
                />
              </div>
            </div>

          </div>
        </section>

        {/* ── SECTION: Image ── */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[9px] tracking-[0.3em] text-[#888] uppercase font-mono">{"// IMAGE SOURCE"}</span>
            <span className="h-px flex-1 bg-[#bbb]" />
          </div>

          <div className="border border-[#b8b8b8] bg-[#c4c4c4] relative overflow-hidden">
            {/* upgrade hint bar */}
            <div className="bg-[#1a1a1a] px-5 py-2 flex items-center justify-between">
              <span className="text-[8px] tracking-[0.3em] text-[#555] font-mono uppercase">IMAGE MODULE — URL MODE</span>
              <span className="text-[7px] tracking-[0.2em] text-[#444] font-mono uppercase">UPLOAD READY FOR UPGRADE</span>
            </div>

            <div className="p-5">
              <FieldLabel code="F-05" label="Image URL" />
              <TextInput
                value={imageSrc}
                onChange={setImageSrc}
                placeholder="https://example.com/image.jpg"
              />

              {/* Preview */}
              {imageSrc && (
                <div className="mt-4 border border-[#b5b5b5] overflow-hidden">
                  <div className="bg-[#1a1a1a] px-3 py-1 flex items-center gap-2">
                    <span className="w-[5px] h-[5px] border-t border-r border-[#444]" />
                    <span className="text-[8px] tracking-[0.3em] text-[#555] font-mono uppercase">PREVIEW</span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt="preview"
                    className="w-full h-40 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SECTION: Content editor ── */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[9px] tracking-[0.3em] text-[#888] uppercase font-mono">{"// CONTENT EDITOR"}</span>
            <span className="h-px flex-1 bg-[#bbb]" />
          </div>

          <FieldLabel code="F-06" label="Content (Markdown)" />

          {/* Snippet toolbar */}
          <div className="flex flex-wrap gap-[3px] mb-[3px]">
            {MD_SNIPPETS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => insertSnippet(s.insert)}
                className="px-3 py-[5px] bg-[#1a1a1a] text-[#e8c830] text-[9px] tracking-[0.2em] font-mono uppercase hover:bg-[#2a2a2a] transition-colors duration-100"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"## Introduction\n\nStart writing your article here...\n\nSupports **bold**, [links](url), and ```code blocks```."}
            rows={20}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#e8c830] px-5 py-4 text-[12px] leading-relaxed tracking-[0.04em] text-[#c8c8c8] placeholder-[#3a3a3a] outline-none font-mono transition-colors duration-150 resize-y"
            spellCheck={false}
          />

          {/* Markdown cheatsheet */}
          <div className="mt-2 border border-[#c0c0c0] bg-[#c8c8c8]">
            <div className="px-4 py-2 border-b border-[#bbb]">
              <span className="text-[8px] tracking-[0.3em] text-[#888] font-mono uppercase">{"// MARKDOWN REFERENCE"}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#bbb]">
              {[
                { syntax: "## Heading",            result: "H2 section" },
                { syntax: "**text**",              result: "Bold text" },
                { syntax: "[label](url)",          result: "Hyperlink" },
                { syntax: "```lang … ```",         result: "Code block" },
              ].map((item) => (
                <div key={item.syntax} className="bg-[#c8c8c8] px-3 py-3 flex flex-col gap-1">
                  <code className="text-[9px] text-[#e8c830] bg-[#1a1a1a] px-2 py-1 font-mono">{item.syntax}</code>
                  <span className="text-[8px] tracking-[0.15em] text-[#888] uppercase font-mono">{item.result}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION: Publish settings ── */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[9px] tracking-[0.3em] text-[#888] uppercase font-mono">{"// PUBLISH SETTINGS"}</span>
            <span className="h-px flex-1 bg-[#bbb]" />
          </div>

          <div className="border border-[#b8b8b8] bg-[#c4c4c4]">
            {/* Status toggle */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#b8b8b8]">
              <div>
                <p className="text-[11px] font-mono font-semibold tracking-tight text-[#1a1a1a] uppercase">Publish Status</p>
                <p className="text-[9px] tracking-[0.1em] text-[#888] font-mono mt-[2px]">F-07 — draft hanya tersimpan, published langsung tampil</p>
              </div>
              <div className="flex gap-[3px]">
                {(["draft", "published"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPublishStatus(s)}
                    className={cx(
                      "px-4 py-2 text-[9px] tracking-[0.25em] font-mono uppercase border transition-colors duration-150",
                      publishStatus === s
                        ? "bg-[#1a1a1a] text-[#e8c830] border-[#1a1a1a]"
                        : "bg-[#c8c8c8] text-[#888] border-[#c0c0c0] hover:border-[#999]"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-[11px] font-mono font-semibold tracking-tight text-[#1a1a1a] uppercase">Featured</p>
                <p className="text-[9px] tracking-[0.1em] text-[#888] font-mono mt-[2px]">F-08 — artikel ditampilkan di homepage sebagai unggulan</p>
              </div>
              <button
                type="button"
                onClick={() => setFeatured((v) => !v)}
                className={cx(
                  "relative w-12 h-6 border transition-colors duration-200",
                  featured ? "bg-[#1a1a1a] border-[#1a1a1a]" : "bg-[#c8c8c8] border-[#c0c0c0]"
                )}
                aria-pressed={featured}
              >
                <span
                  className={cx(
                    "absolute top-1 bottom-1 w-4 bg-[#e8c830] transition-all duration-200",
                    featured ? "left-[calc(100%-20px)]" : "left-1"
                  )}
                />
              </button>
            </div>
          </div>
        </section>

        {/* ── Submit bar ── */}
        <div className="border-t border-[#bbb] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[9px] tracking-[0.2em] text-[#888] font-mono uppercase">
              STATUS:{" "}
              <span className={publishStatus === "published" ? "text-[#e8c830]" : "text-[#666]"}>
                {publishStatus.toUpperCase()}
              </span>
              {featured && (
                <span className="ml-3 text-[#e8c830]">+ FEATURED</span>
              )}
            </p>
            <p className="text-[8px] tracking-[0.15em] text-[#aaa] font-mono mt-1">
              Semua field wajib harus diisi sebelum submit.
            </p>
          </div>

          <div className="flex gap-[3px]">
            <button
              type="button"
              onClick={() => setPublishStatus("draft")}
              className="px-5 py-3 bg-[#c4c4c4] border border-[#b5b5b5] text-[10px] tracking-[0.3em] text-[#666] font-mono uppercase hover:bg-[#bbb] transition-colors duration-150"
            >
              SAVE DRAFT
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={cx(
                "px-6 py-3 text-[10px] tracking-[0.3em] font-mono uppercase font-black transition-all duration-200",
                submitting
                  ? "bg-[#2a2a2a] border border-[#333] text-[#555] cursor-wait"
                  : "bg-[#1a1a1a] border border-[#1a1a1a] text-[#e8c830] hover:bg-[#2a2a2a]"
              )}
            >
              {submitting ? "PUBLISHING..." : "PUBLISH →"}
            </button>
          </div>
        </div>

      </form>
    </PageContainer>
  );
}