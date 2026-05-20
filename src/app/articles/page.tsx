// app/articles/page.tsx  →  salin sebagai ArticlesPage

"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Helper ───────────────────────────────────────────────────────────────────

function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const ALL_ARTICLES = [
  { tag: "ART-001", category: "Sistem",        title: "Arsitektur Jaringan Terdistribusi pada Era Komputasi Tepi", date: "18 MEI 2026",  readTime: "12 MIN", status: "PUBLISH" },
  { tag: "ART-002", category: "Infrastruktur", title: "Kontainer vs VM: Mana yang Tepat untuk Workload Anda?",     date: "15 MEI 2026",  readTime: "8 MIN",  status: "PUBLISH" },
  { tag: "ART-003", category: "Keamanan",      title: "Zero-Trust: Filosofi, Bukan Sekadar Produk",               date: "12 MEI 2026",  readTime: "10 MIN", status: "PUBLISH" },
  { tag: "ART-004", category: "Pengembangan",  title: "Rust di Tahun 2026: Apakah Sudah Waktunya Beralih?",       date: "08 MEI 2026",  readTime: "15 MIN", status: "PUBLISH" },
  { tag: "ART-005", category: "Data",          title: "Pipeline ETL Modern dengan Apache Arrow",                  date: "03 MEI 2026",  readTime: "9 MIN",  status: "PUBLISH" },
  { tag: "ART-006", category: "Sistem",        title: "eBPF: Kernel Programming Tanpa Risiko",                    date: "28 APR 2026",  readTime: "11 MIN", status: "PUBLISH" },
  { tag: "ART-007", category: "Keamanan",      title: "Supply Chain Attack: Anatomi dan Mitigasi",                date: "21 APR 2026",  readTime: "13 MIN", status: "PUBLISH" },
  { tag: "ART-008", category: "Pengembangan",  title: "WASM di Server: Bukan Lagi Eksperimen",                    date: "14 APR 2026",  readTime: "7 MIN",  status: "PUBLISH" },
  { tag: "ART-009", category: "Data",          title: "Columnar Storage: Mengapa DuckDB Sangat Cepat?",           date: "07 APR 2026",  readTime: "10 MIN", status: "PUBLISH" },
  { tag: "ART-010", category: "Infrastruktur", title: "GitOps di Dunia Nyata: Pelajaran dari Produksi",           date: "01 APR 2026",  readTime: "14 MIN", status: "PUBLISH" },
];

const CATEGORIES = ["SEMUA", "Sistem", "Infrastruktur", "Keamanan", "Pengembangan", "Data"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState("SEMUA");
  const [search, setSearch] = useState("");

  const filtered = ALL_ARTICLES.filter((a) => {
    const matchCat = activeCategory === "SEMUA" || a.category === activeCategory;
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
            <span className="text-[9px] tracking-[0.35em] text-[#888] uppercase">TERMA{"//"}LOG</span>
            <span className="h-px flex-1 bg-[#bbb]" />
            <span className="text-[9px] tracking-[0.2em] text-[#888]">SYS-002</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter leading-none uppercase text-[#1a1a1a]">
            ARTIKEL
          </h1>
          <div className="mt-2 h-[3px] w-16 bg-[#e8c830]" />
          <p className="mt-4 text-[12px] text-[#666] leading-relaxed max-w-lg">
            Arsip penuh tulisan teknis. Gunakan filter di bawah untuk mempersempit pencarian.
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
                  : "bg-[#c1c1c1] text-[#666] border-[#b0b0b0] hover:bg-[#bbb] hover:text-[#1a1a1a]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Count indicator ── */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.3em] text-[#888]">
            {"// MENAMPILKAN"} {filtered.length} {"/"} {ALL_ARTICLES.length} {"HASIL"}
          </span>
          <span className="h-px flex-1 bg-[#bbb]" />
        </div>

        {/* ── Article list ── */}
        <div className="flex flex-col gap-px bg-[#bbb] border border-[#bbb]">
          {/* Header row */}
          <div className="flex items-center gap-5 bg-[#1a1a1a] px-5 py-3">
            <span className="text-[8px] tracking-[0.3em] text-[#555] w-16 shrink-0">ID</span>
            <span className="text-[8px] tracking-[0.3em] text-[#555] w-28 shrink-0">KATEGORI</span>
            <span className="text-[8px] tracking-[0.3em] text-[#555] flex-1">JUDUL</span>
            <span className="text-[8px] tracking-[0.3em] text-[#555] hidden md:block shrink-0 w-24 text-right">TANGGAL</span>
            <span className="text-[8px] tracking-[0.3em] text-[#555] shrink-0 w-16 text-right">DURASI</span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-[#c9c9c9] px-5 py-8 text-center">
              <span className="text-[11px] tracking-[0.2em] text-[#999]">TIDAK ADA HASIL — UBAH FILTER</span>
            </div>
          ) : (
            filtered.map((art) => (
              <Link
                key={art.tag}
                href={`/articles/${art.tag.toLowerCase()}`}
                className="group flex items-center gap-5 bg-[#c9c9c9] px-5 py-4 hover:bg-[#1a1a1a] transition-colors duration-150 relative"
              >
                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e8c830] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-150" />
                <span className="text-[9px] tracking-[0.2em] text-[#aaa] group-hover:text-[#555] w-16 shrink-0">{art.tag}</span>
                <span className="text-[9px] tracking-[0.2em] text-[#888] group-hover:text-[#555] w-28 shrink-0 uppercase">{art.category}</span>
                <span className="text-[13px] font-semibold tracking-tight text-[#1a1a1a] group-hover:text-white flex-1 transition-colors duration-150 leading-snug">
                  {art.title}
                </span>
                <span className="text-[9px] tracking-[0.15em] text-[#aaa] group-hover:text-[#555] hidden md:block shrink-0 w-24 text-right">{art.date}</span>
                <span className="text-[9px] tracking-[0.2em] text-[#aaa] group-hover:text-[#555] shrink-0 w-16 text-right">{art.readTime}</span>
              </Link>
            ))
          )}
        </div>

        {/* ── Footer ── */}
        <footer className="mt-16 pt-4 border-t border-[#bbb]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8c830] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8c830]" />
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#888]">SISTEM AKTIF</span>
            </div>
            <span className="text-[9px] tracking-[0.2em] text-[#aaa]">TERMA{"//"}LOG © 2026</span>
          </div>
        </footer>

      </div>
    </div>
  );
}