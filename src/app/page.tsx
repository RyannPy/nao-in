// app/page.tsx  →  salin sebagai HomePage

import Link from "next/link";

// ─── Dummy data ───────────────────────────────────────────────────────────────

const FEATURED = {
  tag: "ART-001",
  category: "Sistem",
  title: "Arsitektur Jaringan Terdistribusi pada Era Komputasi Tepi",
  excerpt:
    "Bagaimana node-node kecil di ujung jaringan mengubah cara kita merancang sistem skala besar — sebuah tinjauan teknis dari lapangan.",
  date: "18 MEI 2026",
  readTime: "12 MIN",
};

const RECENT = [
  {
    tag: "ART-002",
    category: "Infrastruktur",
    title: "Kontainer vs VM: Mana yang Tepat untuk Workload Anda?",
    date: "15 MEI 2026",
    readTime: "8 MIN",
  },
  {
    tag: "ART-003",
    category: "Keamanan",
    title: "Zero-Trust: Filosofi, Bukan Sekadar Produk",
    date: "12 MEI 2026",
    readTime: "10 MIN",
  },
  {
    tag: "ART-004",
    category: "Pengembangan",
    title: "Rust di Tahun 2026: Apakah Sudah Waktunya Beralih?",
    date: "08 MEI 2026",
    readTime: "15 MIN",
  },
  {
    tag: "ART-005",
    category: "Data",
    title: "Pipeline ETL Modern dengan Apache Arrow",
    date: "03 MEI 2026",
    readTime: "9 MIN",
  },
];

const STATS = [
  { label: "ARTIKEL", value: "128" },
  { label: "KATEGORI", value: "12" },
  { label: "PEMBACA / BULAN", value: "4.2K" },
  { label: "TAHUN AKTIF", value: "3" },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
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
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[9px] tracking-[0.35em] text-[#888] uppercase">TERMA{"//"}LOG</span>
            <span className="h-px flex-1 bg-[#bbb]" />
            <span className="text-[9px] tracking-[0.2em] text-[#888]">INDEX</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter leading-none uppercase text-[#1a1a1a]">
            BERANDA
          </h1>
          <div className="mt-2 h-[3px] w-16 bg-[#e8c830]" />
        </header>

        {/* ── Stats bar ── */}
        <div className="grid grid-cols-4 gap-px bg-[#bbb] border border-[#bbb] mb-12">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#c9c9c9] px-4 py-4 flex flex-col gap-1">
              <span className="text-2xl font-black tracking-tighter text-[#1a1a1a]">{s.value}</span>
              <span className="text-[8px] tracking-[0.25em] text-[#777] uppercase">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Featured article ── */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] tracking-[0.3em] text-[#888] uppercase">{"// UNGGULAN"}</span>
            <span className="h-px flex-1 bg-[#bbb]" />
          </div>

          <Link
            href="/articles/featured"
            className="group block bg-[#1a1a1a] p-7 relative overflow-hidden border-l-[3px] border-[#e8c830] transition-all duration-200 hover:shadow-[4px_4px_0_#e8c830]"
          >
            {/* corner ticks */}
            <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#333]" />
            <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#333]" />

            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] tracking-[0.3em] text-[#e8c830]">{FEATURED.tag}</span>
              <span className="text-[9px] tracking-[0.2em] text-[#555] uppercase">{FEATURED.category}</span>
            </div>
            <h2 className="text-xl font-black tracking-tight leading-snug text-white uppercase mb-3 group-hover:text-[#e8c830] transition-colors duration-150">
              {FEATURED.title}
            </h2>
            <p className="text-[12px] text-[#888] leading-relaxed mb-5">
              {FEATURED.excerpt}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[9px] tracking-[0.2em] text-[#555]">{FEATURED.date}</span>
              <span className="text-[9px] tracking-[0.2em] text-[#555]">{FEATURED.readTime} READ</span>
              <span className="ml-auto text-[9px] tracking-[0.3em] text-[#e8c830] group-hover:translate-x-1 transition-transform duration-150">
                BACA →
              </span>
            </div>
          </Link>
        </section>

        {/* ── Recent articles ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] tracking-[0.3em] text-[#888] uppercase">{"// TERBARU"}</span>
            <span className="h-px flex-1 bg-[#bbb]" />
            <Link href="/articles" className="text-[9px] tracking-[0.2em] text-[#888] hover:text-[#1a1a1a] transition-colors">
              SEMUA ARTIKEL →
            </Link>
          </div>

          <div className="flex flex-col gap-px bg-[#bbb]">
            {RECENT.map((art, i) => (
              <Link
                key={art.tag}
                href={`/articles/${art.tag.toLowerCase()}`}
                className="group flex items-center gap-5 bg-[#c9c9c9] px-5 py-4 hover:bg-[#1a1a1a] transition-colors duration-150 relative"
              >
                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e8c830] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-150" />
                <span className="text-[9px] tracking-[0.2em] text-[#aaa] group-hover:text-[#555] w-16 shrink-0">
                  {art.tag}
                </span>
                <span className="text-[9px] tracking-[0.2em] text-[#888] group-hover:text-[#555] w-28 shrink-0 uppercase">
                  {art.category}
                </span>
                <span className="text-[13px] font-semibold tracking-tight text-[#1a1a1a] group-hover:text-white flex-1 transition-colors duration-150">
                  {art.title}
                </span>
                <span className="text-[9px] tracking-[0.2em] text-[#aaa] group-hover:text-[#555] shrink-0 hidden md:block">
                  {art.date}
                </span>
                <span className="text-[9px] tracking-[0.2em] text-[#aaa] group-hover:text-[#555] shrink-0">
                  {art.readTime}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Footer status ── */}
        <footer className="mt-16 pt-4 border-t border-[#bbb]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8c830] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8c830]" />
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#888]">SISTEM AKTIF</span>
            </div>
            <span className="text-[9px] tracking-[0.2em] text-[#aaa]">
              TERMA{"//"}LOG © 2026
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}