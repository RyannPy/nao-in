// app/categories/[slug]/not-found.tsx

import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import { FONTS } from "@/lib/theme";

export default function CategoryNotFound() {
  return (
    <PageContainer centered style={{ fontFamily: FONTS.mono }}>
      <div className="inline-flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 mb-8">
        <span className="w-1.5 h-1.5 bg-[#e8c830]" />
        <span className="text-[9px] tracking-[0.35em] text-[#555] uppercase">
          ERR-404 / CATEGORY
        </span>
      </div>

      <h1 className="text-6xl font-black tracking-tighter leading-none text-[#1a1a1a] mb-3">
        404
      </h1>
      <div className="h-[3px] w-12 bg-[#e8c830] mx-auto mb-6" />

      <p className="text-[12px] tracking-[0.15em] text-[#777] uppercase mb-2">
        DOMAIN TIDAK DITEMUKAN
      </p>
      <p className="text-[11px] text-[#999] leading-relaxed mb-10">
        Kategori yang Anda cari tidak ada dalam sistem ini.
      </p>

      <Link
        href="/categories"
        className="inline-flex items-center gap-3 bg-[#1a1a1a] border-l-[3px] border-[#e8c830] px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-white hover:bg-[#111] transition-colors duration-150"
      >
        ← KEMBALI KE KATEGORI
      </Link>
    </PageContainer>
  );
}