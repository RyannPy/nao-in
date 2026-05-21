// app/about/page.tsx  →  salin sebagai AboutPage

import Link from "next/link";

// ─── Dummy data ───────────────────────────────────────────────────────────────

const SKILLS = [
  { name: "PYTHON", level: 92 },
  { name: "HTML/CSS", level: 95 },
  { name: "REACT", level: 88 },
  { name: "NEXTJS", level: 61 },
  { name: "DATA SCIENCE", level: 64 },
  { name: "AI ENGINEER", level: 65 },
];

const TIMELINE = [
  {
    year: "May 2024",
    event: "Penasaran dengan pemrograman.",
  },
  {
    year: "2024",
    event:
      "Bergabung dengan tim infrastruktur di perusahaan SaaS skala menengah.",
  },
  {
    year: "2024",
    event: "Artikel pertama viral — lebih dari 40 ribu pembaca dalam 3 hari.",
  },
  {
    year: "2025",
    event: "Meraih sertifikasi CKA (Certified Kubernetes Administrator).",
  },
  {
    year: "2026",
    event: "Merilis ulang blog dengan desain baru dan arsip terstruktur.",
  },
];

const CONTACT = [
  {
    label: "EMAIL",
    value: "ryanbayu155@gmail.com",
    href: "mailto:ryanbayu155@gmail.com",
  },
  {
    label: "GITHUB",
    value: "https://github.com/RyannPy",
    href: "https://github.com/RyannPy",
  },
  { label: "RSS", value: "nao-in.dev/rss.xml", href: "/rss.xml" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
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
              PGE-004
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter leading-none uppercase text-[#1a1a1a]">
            ABOUT
          </h1>
          <div className="mt-2 h-0.75 w-16 bg-[#e8c830]" />
        </header>

        {/* ── Identity card ── */}
        <div className="flex flex-col md:flex-row gap-px bg-[#bbb] border border-[#bbb] mb-10">
          {/* Avatar placeholder */}
          <div className="bg-[#1a1a1a] md:w-48 shrink-0 flex flex-col items-center justify-center p-8 relative">
            <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#333]" />
            <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#333]" />
            <div className="w-20 h-20 border-2 border-[#333] flex items-center justify-center text-3xl select-none">
              ◈
            </div>
            <span className="mt-3 text-[9px] tracking-[0.2em] text-[#555]">
              UNIT-AUTHOR
            </span>
          </div>

          {/* Bio */}
          <div className="bg-[#c4c4c4] p-7 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[9px] tracking-[0.25em] text-[#888]">
                AUTHOR IDENTITY
              </span>
              <span className="h-px flex-1 bg-[#bbb]" />
              <span className="text-[9px] tracking-[0.2em] text-[#e8c830]">
                ACTIVE
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight uppercase mb-1">
              RYAN
            </h2>
            <p className="text-[11px] tracking-[0.2em] text-[#777] mb-5 uppercase">
              Data Scientist · AI Engineer · Web Developer
            </p>
            <p className="text-[12px] text-[#555] leading-relaxed max-w-xl">
              "Never play or never win."
            </p>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Skills */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] tracking-[0.3em] text-[#888]">
                {"// SKILL DATABASE"}
              </span>
              <span className="h-px flex-1 bg-[#bbb]" />
            </div>
            <div className="flex flex-col gap-3">
              {SKILLS.map((sk) => (
                <div key={sk.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] tracking-[0.15em] text-[#444] uppercase">
                      {sk.name}
                    </span>
                    <span className="text-[10px] font-black text-[#e8c830]">
                      {sk.level}
                    </span>
                  </div>
                  <div className="h-0.75 bg-[#bbb]">
                    <div
                      className="h-0.75 bg-[#1a1a1a] transition-all duration-700"
                      style={{ width: `${sk.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] tracking-[0.3em] text-[#888]">
                {"// TIMELINE"}
              </span>
              <span className="h-px flex-1 bg-[#bbb]" />
            </div>
            <div className="flex flex-col relative">
              {/* vertical line */}
              <div className="absolute left-6.5 top-0 bottom-0 w-px bg-[#bbb]" />

              {TIMELINE.map((item, i) => (
                <div key={i} className="flex gap-4 mb-5 relative">
                  {/* dot */}
                  <div className="shrink-0 w-3.25 h-3.25 border-2 border-[#1a1a1a] bg-[#d0d0d0] mt-0.5 z-10 ml-5" />
                  <div>
                    <span className="text-[9px] tracking-[0.3em] text-[#e8c830] block mb-1">
                      {item.year}
                    </span>
                    <p className="text-[11px] text-[#555] leading-relaxed">
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Contact ── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] tracking-[0.3em] text-[#888]">
              {"// KONTAK"}
            </span>
            <span className="h-px flex-1 bg-[#bbb]" />
          </div>
          <div className="flex flex-col gap-px bg-[#bbb] border border-[#bbb]">
            {CONTACT.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-6 bg-[#c9c9c9] px-5 py-4 hover:bg-[#1a1a1a] transition-colors duration-150 relative"
              >
                <span className="absolute left-0 top-0 bottom-0 w-0.75 bg-[#e8c830] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-150" />
                <span className="text-[9px] tracking-[0.25em] text-[#999] group-hover:text-[#555] w-16 shrink-0 transition-colors">
                  {c.label}
                </span>
                <span className="text-[12px] font-semibold text-[#1a1a1a] group-hover:text-white flex-1 transition-colors duration-150">
                  {c.value}
                </span>
                <span className="text-[9px] tracking-[0.3em] text-[#aaa] group-hover:text-[#e8c830] group-hover:translate-x-1 transition-all duration-150">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div className="border border-[#bbb] bg-[#c4c4c4] px-6 py-5 relative">
          <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#bbb]" />
          <span className="text-[9px] tracking-[0.25em] text-[#888] block mb-2">
            {"// CATATAN"}
          </span>
          <p className="text-[11px] text-[#666] leading-relaxed">
            Semua opini, analisis, dan kesalahan di blog ini adalah milik saya
            sendiri dan tidak mencerminkan pandangan pemberi kerja manapun. Kode
            dan konten tersedia bebas kecuali disebutkan sebaliknya. Jika Anda
            menemukan kesalahan teknis, beri tahu saya.
          </p>
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
                SYSTEM ACTIVE
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
