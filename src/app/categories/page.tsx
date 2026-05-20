// app/categories/page.tsx  →  salin sebagai CategoriesPage

import Link from "next/link";

// ─── Dummy data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "CAT-01",
    slug: "sistem",
    name: "Sistem",
    desc: "Arsitektur, kernel, OS, dan segala sesuatu yang terjadi di lapisan paling bawah tumpukan teknologi.",
    count: 24,
    lastUpdated: "18 MEI 2026",
    icon: "◈",
    accent: "#e8c830",
  },
  {
    id: "CAT-02",
    slug: "infrastruktur",
    name: "Infrastruktur",
    desc: "Cloud, on-prem, hybrid. Kontainer, orkestrasi, dan segala sesuatu yang menjaga server tetap hidup.",
    count: 18,
    lastUpdated: "15 MEI 2026",
    icon: "⬡",
    accent: "#e8c830",
  },
  {
    id: "CAT-03",
    slug: "keamanan",
    name: "Keamanan",
    desc: "Threat modeling, CVE, incident response, dan filosofi di balik sistem yang benar-benar aman.",
    count: 31,
    lastUpdated: "12 MEI 2026",
    icon: "⬟",
    accent: "#e8c830",
  },
  {
    id: "CAT-04",
    slug: "pengembangan",
    name: "Pengembangan",
    desc: "Bahasa, toolchain, paradigma, dan praktik rekayasa perangkat lunak yang bertahan dalam skala.",
    count: 27,
    lastUpdated: "08 MEI 2026",
    icon: "⬡",
    accent: "#e8c830",
  },
  {
    id: "CAT-05",
    slug: "data",
    name: "Data",
    desc: "Pipeline, format penyimpanan, query engine, dan cara membuat data besar tetap bisa dikelola.",
    count: 15,
    lastUpdated: "03 MEI 2026",
    icon: "◈",
    accent: "#e8c830",
  },
  {
    id: "CAT-06",
    slug: "jaringan",
    name: "Jaringan",
    desc: "Protokol, routing, observabilitas jaringan, dan cara paket data menemukan jalannya.",
    count: 13,
    lastUpdated: "28 APR 2026",
    icon: "⬟",
    accent: "#e8c830",
  },
];

const TOTAL_ARTICLES = CATEGORIES.reduce((s, c) => s + c.count, 0);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CategoriesPage() {
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
            <span className="text-[9px] tracking-[0.2em] text-[#888]">SYS-003</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter leading-none uppercase text-[#1a1a1a]">
            KATEGORI
          </h1>
          <div className="mt-2 h-[3px] w-16 bg-[#e8c830]" />
          <p className="mt-4 text-[12px] text-[#666] leading-relaxed max-w-lg">
            {CATEGORIES.length} domain teknis. {TOTAL_ARTICLES} total artikel. Pilih jalur penelitian Anda.
          </p>
        </header>

        {/* ── Overview bar ── */}
        <div className="flex items-stretch gap-px bg-[#bbb] border border-[#bbb] mb-10">
          <div className="bg-[#1a1a1a] px-6 py-4 flex flex-col gap-1">
            <span className="text-2xl font-black text-white">{CATEGORIES.length}</span>
            <span className="text-[8px] tracking-[0.25em] text-[#555]">KATEGORI</span>
          </div>
          <div className="bg-[#c4c4c4] px-6 py-4 flex flex-col gap-1">
            <span className="text-2xl font-black text-[#1a1a1a]">{TOTAL_ARTICLES}</span>
            <span className="text-[8px] tracking-[0.25em] text-[#888]">TOTAL ARTIKEL</span>
          </div>
          <div className="bg-[#c4c4c4] px-6 py-4 flex flex-col gap-1 flex-1">
            <span className="text-2xl font-black text-[#e8c830]">AKTIF</span>
            <span className="text-[8px] tracking-[0.25em] text-[#888]">STATUS ARSIP</span>
          </div>
        </div>

        {/* ── Category grid ── */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[9px] tracking-[0.3em] text-[#888] uppercase">{"// DAFTAR DOMAIN"}</span>
          <span className="h-px flex-1 bg-[#bbb]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#bbb] border border-[#bbb]">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group bg-[#c9c9c9] p-6 hover:bg-[#1a1a1a] transition-colors duration-200 relative overflow-hidden"
            >
              {/* accent bar */}
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e8c830] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200" />

              {/* corner tick */}
              <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#bbb] group-hover:border-[#333] transition-colors duration-200" />

              {/* header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[9px] tracking-[0.2em] text-[#aaa] group-hover:text-[#555] block mb-1 transition-colors">
                    {cat.id}
                  </span>
                  <h2 className="text-base font-black tracking-tight uppercase text-[#1a1a1a] group-hover:text-white transition-colors duration-150">
                    {cat.name}
                  </h2>
                </div>
                <span className="text-2xl text-[#ccc] group-hover:text-[#333] transition-colors duration-150 select-none">
                  {cat.icon}
                </span>
              </div>

              {/* desc */}
              <p className="text-[11px] text-[#777] group-hover:text-[#888] leading-relaxed mb-4 transition-colors duration-150">
                {cat.desc}
              </p>

              {/* footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-[#e8c830] text-[10px] font-black">{cat.count}</span>
                  <span className="text-[8px] tracking-[0.2em] text-[#999] group-hover:text-[#666] transition-colors uppercase">
                    ARTIKEL
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[8px] tracking-[0.15em] text-[#aaa] group-hover:text-[#555] transition-colors">
                    {cat.lastUpdated}
                  </span>
                  <span className="text-[9px] tracking-[0.3em] text-[#aaa] group-hover:text-[#e8c830] group-hover:translate-x-1 transition-all duration-150">
                    →
                  </span>
                </div>
              </div>

              {/* progress bar */}
              <div className="mt-4 h-px bg-[#bbb] group-hover:bg-[#333] transition-colors duration-200">
                <div
                  className="h-px bg-[#e8c830] transition-all duration-500"
                  style={{ width: `${Math.round((cat.count / TOTAL_ARTICLES) * 100)}%` }}
                />
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-[7px] tracking-[0.2em] text-[#aaa] group-hover:text-[#555] transition-colors">
                  {Math.round((cat.count / TOTAL_ARTICLES) * 100)}{"% DARI TOTAL"}
                </span>
              </div>
            </Link>
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
              <span className="text-[9px] tracking-[0.2em] text-[#888]">SISTEM AKTIF</span>
            </div>
            <span className="text-[9px] tracking-[0.2em] text-[#aaa]">TERMA{"//"}LOG © 2026</span>
          </div>
        </footer>

      </div>
    </div>
  );
}