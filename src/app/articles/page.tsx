// app/articles/page.tsx  →  salin sebagai ArticlesPage

"use client";

import { useState } from "react";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";

// ─── Helper ───────────────────────────────────────────────────────────────────

function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const ALL_ARTICLES = [
  {
    tag: "ART-001",
    category: "Sistem",
    title: "Arsitektur Jaringan Terdistribusi pada Era Komputasi Tepi",
    date: "18 MEI 2026",
    readTime: "12 MIN",
    status: "PUBLISH",
  },
  {
    tag: "ART-002",
    category: "Infrastruktur",
    title: "Kontainer vs VM: Mana yang Tepat untuk Workload Anda?",
    date: "15 MEI 2026",
    readTime: "8 MIN",
    status: "PUBLISH",
  },
  {
    tag: "ART-003",
    category: "Keamanan",
    title: "Zero-Trust: Filosofi, Bukan Sekadar Produk",
    date: "12 MEI 2026",
    readTime: "10 MIN",
    status: "PUBLISH",
  },
  {
    tag: "ART-004",
    category: "Pengembangan",
    title: "Rust di Tahun 2026: Apakah Sudah Waktunya Beralih?",
    date: "08 MEI 2026",
    readTime: "15 MIN",
    status: "PUBLISH",
  },
  {
    tag: "ART-005",
    category: "Data",
    title: "Pipeline ETL Modern dengan Apache Arrow",
    date: "03 MEI 2026",
    readTime: "9 MIN",
    status: "PUBLISH",
  },
  {
    tag: "ART-006",
    category: "Sistem",
    title: "eBPF: Kernel Programming Tanpa Risiko",
    date: "28 APR 2026",
    readTime: "11 MIN",
    status: "PUBLISH",
  },
  {
    tag: "ART-007",
    category: "Keamanan",
    title: "Supply Chain Attack: Anatomi dan Mitigasi",
    date: "21 APR 2026",
    readTime: "13 MIN",
    status: "PUBLISH",
  },
  {
    tag: "ART-008",
    category: "Pengembangan",
    title: "WASM di Server: Bukan Lagi Eksperimen",
    date: "14 APR 2026",
    readTime: "7 MIN",
    status: "PUBLISH",
  },
  {
    tag: "ART-009",
    category: "Data",
    title: "Columnar Storage: Mengapa DuckDB Sangat Cepat?",
    date: "07 APR 2026",
    readTime: "10 MIN",
    status: "PUBLISH",
  },
  {
    tag: "ART-010",
    category: "Infrastruktur",
    title: "GitOps di Dunia Nyata: Pelajaran dari Produksi",
    date: "01 APR 2026",
    readTime: "14 MIN",
    status: "PUBLISH",
  },
];

const CATEGORIES = [
  "SEMUA",
  "Sistem",
  "Infrastruktur",
  "Keamanan",
  "Pengembangan",
  "Data",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState("SEMUA");
  const [search, setSearch] = useState("");

  const filtered = ALL_ARTICLES.filter((a) => {
    const matchCat =
      activeCategory === "SEMUA" || a.category === activeCategory;
    const matchSearch =
      search.trim() === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#d0d0d0] font-mono text-[#1a1a1a] relative overflow-x-hidden">
      {/* ── Background texture ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.04] z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 32px,#000 32px,#000 33px)," +
            "repeating-linear-gradient(90deg,transparent,transparent 56px,#000 56px,#000 57px)",
        }}
      />

      <div className="relative z-10 px-8 py-10 max-w-4xl mx-auto">
        {/* ── Page header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[9px] tracking-[0.35em] text-[#888] uppercase">
              NAO-IN
            </span>
            <span className="h-px flex-1 bg-[#bbb]" />
            <span className="text-[9px] tracking-[0.2em] text-[#888]">
              SYS-002
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter leading-none uppercase text-[#1a1a1a]">
            ARTIKEL
          </h1>
          <div className="mt-2 h-[3px] w-16 bg-[#e8c830]" />
          <p className="mt-4 text-[12px] text-[#666] leading-relaxed max-w-lg">
            Arsip penuh tulisan teknis. Gunakan filter di bawah untuk
            mempersempit pencarian.
          </p>
        </header>

        {/* ── Search bar ── */}
        <div className="mb-6 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.2em] text-[#999]">
            {">>"}
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="CARI ARTIKEL..."
            className="w-full bg-[#c1c1c1] border border-[#b0b0b0] pl-10 pr-4 py-3 text-[12px] tracking-[0.15em] text-[#1a1a1a] placeholder-[#999] outline-none focus:border-[#1a1a1a] focus:bg-[#c8c8c8] transition-colors duration-150"
          />
        </div>

        {/* ── Category filter ── */}
        <div className="flex flex-wrap gap-[3px] mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cx(
                "px-4 py-2 text-[9px] tracking-[0.25em] uppercase transition-all duration-150 border",
                activeCategory === cat
                  ? "bg-[#1a1a1a] text-[#e8c830] border-[#1a1a1a]"
                  : "bg-[#c1c1c1] text-[#666] border-[#b0b0b0] hover:bg-[#bbb] hover:text-[#1a1a1a]",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Count indicator ── */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.3em] text-[#888]">
            {"// MENAMPILKAN"} {filtered.length} {"/"} {ALL_ARTICLES.length}{" "}
            {"HASIL"}
          </span>
          <span className="h-px flex-1 bg-[#bbb]" />
        </div>

        {/* ── Article list ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#bbb] border border-[#bbb]">
          {filtered.map((art) => (
            <ArticleCard
              key={art.tag}
              tag={art.tag}
              title={art.title}
              category={art.category}
              date={art.date}
              href={`/articles/${art.tag.toLowerCase()}`}
            />
          ))}
        </div>

        {/* ── Footer ── */}
        <footer className="mt-16 pt-4 border-t border-[#bbb]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8c830] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8c830]" />
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#888]">
                SISTEM AKTIF
              </span>
            </div>
            <span className="text-[9px] tracking-[0.2em] text-[#aaa]">
              NAO-IN © 2026
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
