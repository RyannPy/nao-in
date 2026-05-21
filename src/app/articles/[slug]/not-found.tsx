// app/articles/[slug]/not-found.tsx
// Shown when getArticle(slug) returns null and notFound() is called.

import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <div
      className="min-h-screen bg-[#d0d0d0] text-[#1a1a1a] relative overflow-x-hidden flex items-center justify-center"
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      {/* Background texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.04] z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 32px,#000 32px,#000 33px)," +
            "repeating-linear-gradient(90deg,transparent,transparent 56px,#000 56px,#000 57px)",
        }}
      />

      <div className="relative z-10 text-center px-8 max-w-md">
        {/* Error code block */}
        <div className="inline-flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 mb-8">
          <span className="w-1.5 h-1.5 bg-[#e8c830]" />
          <span className="text-[9px] tracking-[0.35em] text-[#555] uppercase">
            ERR-404
          </span>
        </div>

        <h1 className="text-6xl font-black tracking-tighter leading-none text-[#1a1a1a] mb-3">
          404
        </h1>
        <div className="h-[3px] w-12 bg-[#e8c830] mx-auto mb-6" />

        <p className="text-[12px] tracking-[0.15em] text-[#777] uppercase mb-2">
          DOKUMEN TIDAK DITEMUKAN
        </p>
        <p className="text-[11px] text-[#999] leading-relaxed mb-10">
          Artikel yang Anda cari tidak ada dalam arsip ini, atau slug tidak valid.
        </p>

        <Link
          href="/articles"
          className="inline-flex items-center gap-3 bg-[#1a1a1a] border-l-[3px] border-[#e8c830] px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-white hover:bg-[#111] transition-colors duration-150"
        >
          ← KEMBALI KE ARSIP
        </Link>
      </div>
    </div>
  );
}