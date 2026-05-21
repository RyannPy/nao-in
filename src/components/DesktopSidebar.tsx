"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Tiny cx helper — no multiline template literals ─────────────────────────
function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  tag?: string;
}

interface DesktopSidebarProps {
  items?: NavItem[];
  siteTitle?: string;
  activePath?: string;
}

// ─── Default nav items ────────────────────────────────────────────────────────

const DEFAULT_ITEMS: NavItem[] = [
  { label: "Home", href: "/", tag: "PGE-001" },
  { label: "Article", href: "/articles", tag: "PGE-002" },
  { label: "Category", href: "/categories", tag: "PGE-003" },
  { label: "About", href: "/about", tag: "PGE-004" },
];

// ─── Background texture style (extracted as a constant) ───────────────────────

const TEXTURE_STYLE: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg,transparent,transparent 28px,#000 28px,#000 29px)," +
    "repeating-linear-gradient(90deg,transparent,transparent 48px,#000 48px,#000 49px)",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DesktopSidebar({
  items = DEFAULT_ITEMS,
  siteTitle = "NAO-IN",
  activePath = "/",
}: DesktopSidebarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 flex-col justify-center w-64 h-screen bg-[#c9c9c9] border-r border-[#b0b0b0] select-none overflow-hidden">
      {/* ── Decorative texture ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={TEXTURE_STYLE}
      />

      {/* ── Site title / logo ── */}
      <div className="relative px-5 pt-7 pb-5">
        <span className="block text-[11px] tracking-[0.25em] font-mono font-semibold text-[#555] uppercase mb-1">
          UNIT//BETA
        </span>
        <h1
          className="text-[#1a1a1a] font-black text-xl tracking-tighter leading-none font-mono uppercase"
        >
          {siteTitle}
        </h1>
      </div>

      {/* ── Section label ── */}
      <div className="px-5 mb-2">
        <span className="text-[9px] font-mono tracking-[0.3em] text-[#888] uppercase">
          {"// NAVIGASI"}
        </span>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex flex-col gap-0.75 px-3">
        {items.map((item, i) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const isHovered = hoveredIndex === i;
          const isDark = isActive || isHovered;

          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ transitionProperty: "background-color, box-shadow" }}
              className={cx(
                "group relative flex flex-col justify-center px-4 py-3 rounded-xsansition-all duration-200 ease-out overflow-hidden",
                isDark
                  ? "bg-[#1a1a1a] shadow-[inset_0_0_0_1px_#333]"
                  : "bg-[#c1c1c1]/70 hover:bg-[#1a1a1a]",
              )}
            >
              {/* yellow accent bar */}
              <span
                className={cx(
                  "absolute left-0 top-0 bottom-0 w-0.75 bg-[#e8c830] transition-transform duration-200 ease-out origin-left",
                  isDark ? "scale-x-100" : "scale-x-0",
                )}
              />

              {/* corner tick */}
              <span
                className={cx(
                  "absolute top-1.25 right-1.25 w-1.25 h-1.25 border-t border-r transition-colors duration-200",
                  isDark ? "border-[#444]" : "border-[#bbb]",
                )}
              />

              {/* label */}
              <span
                className={cx(
                  "relative text-[13px] font-semibold leading-snug font-mono tracking-tight transition-colors duration-150",
                  isDark ? "text-white" : "text-[#2a2a2a]",
                )}
              >
                {item.label}
              </span>

              {/* tag / kode kecil */}
              {item.tag && (
                <span
                  className={cx(
                    "relative text-[9px] font-mono tracking-[0.2em] mt-0.5 transition-colors duration-150",
                    isDark ? "text-[#555]" : "text-[#999]",
                  )}
                >
                  {item.tag}
                </span>
              )}

              {/* scan-line shimmer */}
              <span
                className={cx(
                  "pointer-events-none absolute inset-0 bg-linear-to-b from-white/4 to-transparent transition-opacity duration-200",
                  isHovered ? "opacity-100" : "opacity-0",
                )}
              />
            </Link>
          );
        })}
      </nav>
      {/* ── Bottom status panel ── */}
      <div className="relative px-5 py-5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8c830] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8c830]" />
          </span>
          <span className="text-[9px] font-mono tracking-[0.2em] text-[#888] uppercase">
            SYSTEM ACTIVE
          </span>
        </div>

        <p className="mt-2 text-[8px] font-mono text-[#aaa] leading-relaxed tracking-wide">
          {"V0.0.1 // BUILD 2026.05"}
          <br />
          CREATED BY NAO
        </p>
      </div>
    </aside>
  );
}
