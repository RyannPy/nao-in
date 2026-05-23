// components/ArticleCard.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { type CSSProperties, useState } from "react";
import CategoryBadge, { type BadgeVariant } from "./CategoryBadge";
import { LoadingImage } from "./loading";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ArticleCardProps {
  /** Unique ID / kode artikel, mis. "ART-001" */
  tag: string;
  /** Judul artikel */
  title: string;
  /** Nama kategori */
  category: string;
  /** Tanggal terbit, mis. "18 MEI 2026" */
  date: string;
  /** URL gambar thumbnail — opsional */
  imageSrc?: string;
  /** Alt text gambar */
  imageAlt?: string;
  /** URL tujuan card */
  href: string;
  /** Varian badge kategori */
  badgeVariant?: BadgeVariant;
}

// Scanline texture overlay di image placeholder
const SCANLINE: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.18) 3px,rgba(0,0,0,0.18) 4px)",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ArticleCard({
  tag,
  title,
  category,
  date,
  imageSrc,
  imageAlt = "",
  href,
  badgeVariant = "default",
}: ArticleCardProps) {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <Link
      href={href}
      className="group relative flex flex-col w-full aspect-[5/3] sm:aspect-4/3 bg-[#c4c4c4] border border-[#b0b0b0] overflow-hidden transition-all duration-200 ease-out hover:shadow-[4px_4px_0_#1a1a1a] hover:-translate-y-px hover:border-[#888] select-none"
    >
      {/* ── "Tab" di pojok kiri atas — efek folder ── */}
      <div className="absolute top-0 left-0 z-10 flex items-center gap-2 h-5 bg-[#1a1a1a] pl-2 pr-3">
        {/* dot merah kecil */}
        <span className="w-1.25 h-1.25 rounded-full bg-[#e8c830] shrink-0" />
        <span className="text-[7px] tracking-[0.3em] text-[#555] uppercase leading-none">
          {tag}
        </span>
      </div>

      {/* ── Corner ticks ── */}
      <span className="absolute top-6 right-2 w-2 h-2 border-t border-r border-[#aaa] z-10 transition-colors duration-150 group-hover:border-[#1a1a1a]" />
      <span className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#aaa] z-10 transition-colors duration-150 group-hover:border-[#1a1a1a]" />

      {/* ── Image area (atas, ~56% tinggi) ── */}
      <div className="relative w-full mt-5" style={{ flex: "0 0 56%" }}>
        {imageSrc ? (
          <>
            {!isImgLoaded && (
              <div className="absolute inset-0 z-0">
                <LoadingImage aspectRatio="auto" className="h-full w-full border-none" />
              </div>
            )}
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              onLoad={() => setIsImgLoaded(true)}
              className={`object-cover grayscale group-hover:grayscale-0 transition-all duration-300 ${
                isImgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            {/* overlay scanline */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
              style={SCANLINE}
            />
            {/* dark-to-transparent gradient bawah */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#c4c4c4]"
            />
          </>
        ) : (
          // Placeholder saat tidak ada gambar
          <div className="absolute inset-0 bg-[#b8b8b8] flex items-center justify-center">
            {/* Scanline texture */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={SCANLINE}
            />
            {/* Grid crosshair placeholder */}
            <div className="relative flex flex-col items-center gap-1 opacity-30">
              <span className="text-[8px] tracking-[0.4em] text-[#555] uppercase">
                NO_IMG
              </span>
              <span className="w-8 h-px bg-[#555]" />
            </div>
          </div>
        )}
      </div>

      {/* ── Info area (bawah, sisa tinggi) ── */}
      <div className="flex flex-col justify-between flex-1 px-3 pt-2 pb-3 bg-[#c4c4c4] group-hover:bg-[#1a1a1a] transition-colors duration-200">
        {/* Judul */}
        <p className="text-[12px] font-bold tracking-tight leading-snug text-[#1a1a1a] group-hover:text-white transition-colors duration-150 line-clamp-2">
          {title}
        </p>

        {/* Badge + tanggal */}
        <div className="flex items-end justify-between gap-2 mt-1">
          <CategoryBadge
            label={category}
            variant={badgeVariant}
            // Di hover (dark bg), paksa ghost agar tetap terbaca
            className="group-hover:bg-transparent group-hover:text-[#888] group-hover:border-[#444]"
          />
          <span className="text-[7px] tracking-[0.2em] text-[#888] group-hover:text-[#555] shrink-0 leading-none">
            {date}
          </span>
        </div>
      </div>

      {/* ── Accent bar kiri bawah (muncul saat hover) ── */}
      <span className="absolute left-0 bottom-0 w-0.75 bg-[#e8c830] transition-all duration-200 ease-out h-0 group-hover:h-full origin-bottom" />

      {/* ── Shimmer scanline overlay seluruh card ── */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/4ransparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
    </Link>
  );
}
