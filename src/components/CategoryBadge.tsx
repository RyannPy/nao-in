// components/CategoryBadge.tsx

import { type CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant = "default" | "accent" | "ghost";

interface CategoryBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

// ─── Variant styles ───────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  // Dark fill — used on light card backgrounds
  default:
    "bg-[#1a1a1a] text-[#e8c830] border border-[#333]",
  // Yellow fill — high-emphasis (e.g. featured article)
  accent:
    "bg-[#e8c830] text-[#1a1a1a] border border-[#c9a800]",
  // Transparent — subtle, e.g. on dark card surfaces
  ghost:
    "bg-transparent text-[#999] border border-[#555]",
};

const MONO: CSSProperties = {
  fontFamily: "'Courier New', Courier, monospace",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryBadge({
  label,
  variant = "default",
  className = "",
}: CategoryBadgeProps) {
  return (
    <span
      style={MONO}
      className={[
        // Base
        "inline-flex items-center px-2 py-[3px]",
        "text-[8px] font-semibold tracking-[0.28em] uppercase leading-none",
        "select-none shrink-0",
        // Left tick — decorative
        "relative pl-[18px]",
        // Variant
        VARIANT_STYLES[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Left accent tick */}
      <span
        aria-hidden
        className="absolute left-[7px] top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-none"
        style={{
          background:
            variant === "ghost"
              ? "#555"
              : variant === "accent"
              ? "#1a1a1a"
              : "#e8c830",
        }}
      />
      {label}
    </span>
  );
}