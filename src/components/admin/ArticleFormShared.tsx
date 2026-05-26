// components/admin/ArticleFormShared.tsx
// Komponen reusable yang dipakai oleh Create dan Edit page.
// Tidak ada page-level logic di sini — hanya building blocks.

"use client";

import { useEffect, useState } from "react";

// ─── cx ───────────────────────────────────────────────────────────────────────
export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const CATEGORIES = ["games", "coding", "science", "study", "story"] as const;
export type Category = (typeof CATEGORIES)[number];
export type PublishStatus = "draft" | "published";

export const MD_SNIPPETS = [
  { label: "## H2",    insert: "## Heading\n" },
  { label: "**bold**", insert: "**bold text**" },
  { label: "[link]",   insert: "[label](https://url)" },
  { label: "```code",  insert: "```language\ncode here\n```\n" },
];

// ─── Slug generator ───────────────────────────────────────────────────────────
export function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-");
}

// ─── Article form data type ───────────────────────────────────────────────────
export interface ArticleFormData {
  title: string;
  slug: string;
  category: Category | "";
  excerpt: string;
  content: string;
  imageSrc: string;
  publishStatus: PublishStatus;
  featured: boolean;
}

export const EMPTY_FORM: ArticleFormData = {
  title: "",
  slug: "",
  category: "",
  excerpt: "",
  content: "",
  imageSrc: "",
  publishStatus: "draft",
  featured: false,
};

// ─── SectionLabel ─────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="text-[9px] tracking-[0.3em] text-[#888] uppercase font-mono">{children}</span>
      <span className="h-px flex-1 bg-[#bbb]" />
    </div>
  );
}

// ─── FieldLabel ───────────────────────────────────────────────────────────────
export function FieldLabel({
  code,
  label,
  optional = false,
}: {
  code: string;
  label: string;
  optional?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-[6px]">
      <span className="text-[8px] tracking-[0.3em] text-[#aaa] font-mono uppercase">{code}</span>
      <span className="h-px flex-1 bg-[#bbb]" />
      <span className="text-[9px] tracking-[0.2em] text-[#777] font-mono uppercase">{label}</span>
      {optional && (
        <span className="text-[7px] tracking-[0.2em] text-[#aaa] font-mono uppercase border border-[#ccc] px-1 py-px">
          OPT
        </span>
      )}
    </div>
  );
}

// ─── TextInput ────────────────────────────────────────────────────────────────
export function TextInput({
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#bbb] font-mono select-none">
        {">"}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cx(
          "w-full bg-[#c4c4c4] border border-[#b5b5b5] focus:border-[#1a1a1a]",
          "pl-7 pr-4 py-[10px] text-[12px] tracking-[0.08em] text-[#1a1a1a]",
          "placeholder-[#aaa] outline-none transition-colors duration-150 font-mono",
          disabled ? "opacity-50 cursor-not-allowed" : ""
        )}
        spellCheck={false}
      />
    </div>
  );
}

// ─── ToggleSwitch ─────────────────────────────────────────────────────────────
export function ToggleSwitch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cx(
        "relative w-12 h-6 border transition-colors duration-200",
        value ? "bg-[#1a1a1a] border-[#1a1a1a]" : "bg-[#c8c8c8] border-[#c0c0c0]"
      )}
      aria-pressed={value}
    >
      <span
        className={cx(
          "absolute top-1 bottom-1 w-4 bg-[#e8c830] transition-all duration-200",
          value ? "left-[calc(100%-20px)]" : "left-1"
        )}
      />
    </button>
  );
}

// ─── StatusToggle — draft / published pills ───────────────────────────────────
export function StatusToggle({
  value,
  onChange,
}: {
  value: PublishStatus;
  onChange: (v: PublishStatus) => void;
}) {
  return (
    <div className="flex gap-[3px]">
      {(["draft", "published"] as const).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={cx(
            "px-4 py-2 text-[9px] tracking-[0.25em] font-mono uppercase border transition-colors duration-150",
            value === s
              ? "bg-[#1a1a1a] text-[#e8c830] border-[#1a1a1a]"
              : "bg-[#c8c8c8] text-[#888] border-[#c0c0c0] hover:border-[#999]"
          )}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

// ─── SlugField ────────────────────────────────────────────────────────────────
export function SlugField({
  slug,
  setSlug,
  locked,
  setLocked,
  title,
}: {
  slug: string;
  setSlug: (v: string) => void;
  locked: boolean;
  setLocked: (v: boolean) => void;
  title: string;
}) {
  return (
    <div>
      <FieldLabel code="F-02" label="Slug" />
      <div className="flex gap-[3px]">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#bbb] font-mono select-none">
            {">"}
          </span>
          <input
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setLocked(true); }}
            placeholder="auto-generated-from-title"
            className="w-full bg-[#c4c4c4] border border-[#b5b5b5] focus:border-[#1a1a1a] pl-7 pr-4 py-[10px] text-[12px] tracking-[0.08em] text-[#1a1a1a] placeholder-[#aaa] outline-none font-mono transition-colors duration-150"
            spellCheck={false}
          />
        </div>
        <button
          type="button"
          onClick={() => { setLocked(false); setSlug(toSlug(title)); }}
          className="px-3 bg-[#c4c4c4] border border-[#b5b5b5] text-[9px] tracking-[0.2em] text-[#888] font-mono uppercase hover:bg-[#1a1a1a] hover:text-[#e8c830] hover:border-[#1a1a1a] transition-colors duration-150 whitespace-nowrap"
        >
          ↺ RESET
        </button>
      </div>
      <p className="mt-1 text-[8px] tracking-[0.15em] text-[#aaa] font-mono">
        {locked ? "MANUAL MODE — reset untuk sync dengan title" : "AUTO — sync dari title"}
      </p>
    </div>
  );
}

// ─── CategorySelect ───────────────────────────────────────────────────────────
export function CategorySelect({
  value,
  onChange,
}: {
  value: Category | "";
  onChange: (v: Category) => void;
}) {
  return (
    <div>
      <FieldLabel code="F-03" label="Category" />
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#bbb] font-mono select-none">
          {">"}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as Category)}
          className="w-full bg-[#c4c4c4] border border-[#b5b5b5] focus:border-[#1a1a1a] pl-7 pr-8 py-[10px] text-[12px] tracking-[0.08em] text-[#1a1a1a] outline-none font-mono transition-colors duration-150 appearance-none cursor-pointer"
        >
          <option value="" disabled>
            -- SELECT CATEGORY --
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#888] font-mono pointer-events-none">
          ▾
        </span>
      </div>
    </div>
  );
}

// ─── ImageSection ─────────────────────────────────────────────────────────────
export function ImageSection({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <section>
      <SectionLabel>{"// IMAGE SOURCE"}</SectionLabel>
      <div className="border border-[#b8b8b8] bg-[#c4c4c4] relative overflow-hidden">
        <div className="bg-[#1a1a1a] px-5 py-2 flex items-center justify-between">
          <span className="text-[8px] tracking-[0.3em] text-[#555] font-mono uppercase">
            IMAGE MODULE — URL MODE
          </span>
          <span className="text-[7px] tracking-[0.2em] text-[#444] font-mono uppercase">
            UPLOAD READY FOR UPGRADE
          </span>
        </div>
        <div className="p-5">
          <FieldLabel code="F-05" label="Image URL" optional />
          <TextInput value={value} onChange={onChange} placeholder="https://example.com/image.jpg" />
          {value && (
            <div className="mt-4 border border-[#b5b5b5] overflow-hidden">
              <div className="bg-[#1a1a1a] px-3 py-1 flex items-center gap-2">
                <span className="w-[5px] h-[5px] border-t border-r border-[#444]" />
                <span className="text-[8px] tracking-[0.3em] text-[#555] font-mono uppercase">PREVIEW</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="preview"
                className="w-full h-40 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── ContentEditor ────────────────────────────────────────────────────────────
export function ContentEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  function insertSnippet(text: string) {
    onChange(value + (value.endsWith("\n") || value === "" ? "" : "\n") + text);
  }

  return (
    <section>
      <SectionLabel>{"// CONTENT EDITOR"}</SectionLabel>
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

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"## Introduction\n\nStart writing here...\n\nSupports **bold**, [links](url), and ```code blocks```."}
        rows={20}
        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#e8c830] px-5 py-4 text-[12px] leading-relaxed tracking-[0.04em] text-[#c8c8c8] placeholder-[#3a3a3a] outline-none font-mono transition-colors duration-150 resize-y"
        spellCheck={false}
      />

      {/* Cheatsheet */}
      <div className="mt-2 border border-[#c0c0c0] bg-[#c8c8c8]">
        <div className="px-4 py-2 border-b border-[#bbb]">
          <span className="text-[8px] tracking-[0.3em] text-[#888] font-mono uppercase">
            {"// MARKDOWN REFERENCE"}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#bbb]">
          {[
            { syntax: "## Heading",   result: "H2 section" },
            { syntax: "**text**",     result: "Bold text"  },
            { syntax: "[label](url)", result: "Hyperlink"  },
            { syntax: "```lang…```",  result: "Code block" },
          ].map((item) => (
            <div key={item.syntax} className="bg-[#c8c8c8] px-3 py-3 flex flex-col gap-1">
              <code className="text-[9px] text-[#e8c830] bg-[#1a1a1a] px-2 py-1 font-mono">
                {item.syntax}
              </code>
              <span className="text-[8px] tracking-[0.15em] text-[#888] uppercase font-mono">
                {item.result}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PublishSettingsSection ───────────────────────────────────────────────────
export function PublishSettingsSection({
  publishStatus,
  setPublishStatus,
  featured,
  setFeatured,
}: {
  publishStatus: PublishStatus;
  setPublishStatus: (v: PublishStatus) => void;
  featured: boolean;
  setFeatured: (v: boolean) => void;
}) {
  return (
    <section>
      <SectionLabel>{"// PUBLISH SETTINGS"}</SectionLabel>
      <div className="border border-[#b8b8b8] bg-[#c4c4c4]">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#b8b8b8]">
          <div>
            <p className="text-[11px] font-mono font-semibold tracking-tight text-[#1a1a1a] uppercase">
              Publish Status
            </p>
            <p className="text-[9px] tracking-[0.1em] text-[#888] font-mono mt-[2px]">
              F-07 — draft hanya tersimpan, published langsung tampil
            </p>
          </div>
          <StatusToggle value={publishStatus} onChange={setPublishStatus} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-[11px] font-mono font-semibold tracking-tight text-[#1a1a1a] uppercase">
              Featured
            </p>
            <p className="text-[9px] tracking-[0.1em] text-[#888] font-mono mt-[2px]">
              F-08 — artikel ditampilkan di homepage sebagai unggulan
            </p>
          </div>
          <ToggleSwitch value={featured} onChange={setFeatured} />
        </div>
      </div>
    </section>
  );
}

// ─── FormSubmitBar ────────────────────────────────────────────────────────────
export function FormSubmitBar({
  publishStatus,
  featured,
  submitting,
  mode,
  onSaveDraft,
  onDelete,
}: {
  publishStatus: PublishStatus;
  featured: boolean;
  submitting: boolean;
  mode: "create" | "edit";
  onSaveDraft: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="border-t border-[#bbb] pt-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[9px] tracking-[0.2em] text-[#888] font-mono uppercase">
            {"STATUS: "}
            <span className={publishStatus === "published" ? "text-[#e8c830]" : "text-[#666]"}>
              {publishStatus.toUpperCase()}
            </span>
            {featured && <span className="ml-3 text-[#e8c830]">+ FEATURED</span>}
          </p>
          <p className="text-[8px] tracking-[0.15em] text-[#aaa] font-mono mt-1">
            Semua field wajib harus diisi sebelum submit.
          </p>
        </div>

        <div className="flex gap-[3px]">
          <button
            type="button"
            onClick={onSaveDraft}
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
            {submitting
              ? mode === "edit" ? "UPDATING..." : "PUBLISHING..."
              : mode === "edit" ? "UPDATE →" : "PUBLISH →"}
          </button>
        </div>
      </div>

      {/* Delete zone — edit mode only */}
      {mode === "edit" && onDelete && (
        <div className="flex items-center gap-4 pt-4 border-t border-[#e0e0e0]">
          <span className="text-[8px] tracking-[0.3em] text-[#bbb] font-mono uppercase">DANGER ZONE</span>
          <span className="h-px flex-1 bg-[#e0e0e0]" />
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 text-[9px] tracking-[0.25em] font-mono uppercase border border-[#ccc] text-[#aaa] hover:border-[#cc3333] hover:text-[#cc3333] hover:bg-[#fff0f0] transition-colors duration-150"
          >
            DELETE ARTICLE
          </button>
        </div>
      )}
    </div>
  );
}