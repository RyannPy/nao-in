"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── cx helper ────────────────────────────────────────────────────────────────
function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  tag?: string;
}

interface MobileSidebarProps {
  items?: NavItem[];
  siteTitle?: string;
  activePath?: string;
}

// ─── Default nav items ────────────────────────────────────────────────────────
const DEFAULT_ITEMS: NavItem[] = [
  { label: "Index",          href: "/",         tag: "PGE-001" },
  { label: "Article",          href: "/articles", tag: "PGE-002" },
  { label: "Category",         href: "/categories", tag: "PGE-003" },
  { label: "About",       href: "/about",     tag: "PGE-004" },
];

const TEXTURE_STYLE: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg,transparent,transparent 28px,#000 28px,#000 29px)," +
    "repeating-linear-gradient(90deg,transparent,transparent 48px,#000 48px,#000 49px)",
};

// ─── Crosshair / Reticle trigger button ───────────────────────────────────────
function ReticleButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Tutup menu" : "Buka menu"}
      className="relative w-10 h-10 flex items-center justify-center group focus:outline-none"
    >
      {/* Outer ring — rotates 45deg when open */}
      <span
        className={cx(
          "absolute inset-0 border border-[#1a1a1a] rounded-full transition-all duration-300",
          open ? "rotate-45 scale-90 border-[#e8c830]" : "rotate-0 scale-100"
        )}
      />

      {/* Inner dot */}
      <span
        className={cx(
          "absolute w-[5px] h-[5px] rounded-full transition-all duration-200",
          open ? "bg-[#e8c830] scale-150" : "bg-[#1a1a1a] scale-100"
        )}
      />

      {/* Crosshair lines — 4 ticks N/S/E/W */}
      {/* Top */}
      <span
        className={cx(
          "absolute top-[4px] left-1/2 -translate-x-1/2 w-px bg-[#1a1a1a] transition-all duration-300",
          open ? "h-[6px] bg-[#e8c830] top-[3px]" : "h-[6px]"
        )}
      />
      {/* Bottom */}
      <span
        className={cx(
          "absolute bottom-[4px] left-1/2 -translate-x-1/2 w-px bg-[#1a1a1a] transition-all duration-300",
          open ? "h-[6px] bg-[#e8c830] bottom-[3px]" : "h-[6px]"
        )}
      />
      {/* Left */}
      <span
        className={cx(
          "absolute left-[4px] top-1/2 -translate-y-1/2 h-px bg-[#1a1a1a] transition-all duration-300",
          open ? "w-[6px] bg-[#e8c830] left-[3px]" : "w-[6px]"
        )}
      />
      {/* Right */}
      <span
        className={cx(
          "absolute right-[4px] top-1/2 -translate-y-1/2 h-px bg-[#1a1a1a] transition-all duration-300",
          open ? "w-[6px] bg-[#e8c830] right-[3px]" : "w-[6px]"
        )}
      />

      {/* Corner brackets — appear on hover */}
      <span className="absolute top-0 left-0 w-[7px] h-[7px] border-t border-l border-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      <span className="absolute top-0 right-0 w-[7px] h-[7px] border-t border-r border-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      <span className="absolute bottom-0 left-0 w-[7px] h-[7px] border-b border-l border-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      <span className="absolute bottom-0 right-0 w-[7px] h-[7px] border-b border-r border-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MobileSidebar({
  items = DEFAULT_ITEMS,
  siteTitle = "NAO-IN",
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Top bar ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#c9c9c9] border-b border-[#b0b0b0] flex items-center justify-between px-4 font-mono select-none">

        {/* Left: reticle + site title */}
        <div className="flex items-center gap-3">
          <ReticleButton open={open} onClick={() => setOpen((v) => !v)} />
          <div className="flex flex-col">
            <span className="text-[8px] tracking-[0.25em] text-[#888] uppercase leading-none mb-[2px]">
              UNIT-BETA
            </span>
            <span className="text-[13px] font-black tracking-tighter text-[#1a1a1a] uppercase leading-none" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
              {siteTitle}
            </span>
          </div>
        </div>

        {/* Right: status dot */}
        <div className="flex items-center gap-2">
          <span className="text-[8px] tracking-[0.2em] text-[#888]">ACTIVE</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8c830] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8c830]" />
          </span>
        </div>
      </header>

      {/* ── Backdrop ── */}
      <div
        onClick={() => setOpen(false)}
        className={cx(
          "lg:hidden fixed inset-0 z-40 bg-black transition-opacity duration-300",
          open ? "opacity-40 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden
      />

      {/* ── Drawer ── */}
      <div
        ref={drawerRef}
        className={cx(
          "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col",
          "bg-[#c9c9c9] border-r border-[#b0b0b0]",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={TEXTURE_STYLE}
        />

        {/* ── Drawer header ── */}
        <div className="relative flex items-center justify-between px-5 pt-5 pb-4">
          {/* Decorative scan line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#e8c830]" />

          <div>
            <span className="block text-[8px] tracking-[0.3em] text-[#888] uppercase mb-1">
              UNIT-BETA / NAV
            </span>
            <h2
              className="text-lg font-black tracking-tighter text-[#1a1a1a] uppercase"
              style={{ fontFamily: "'Courier New', Courier, monospace" }}
            >
              {siteTitle}
            </h2>
          </div>

          {/* Close — same reticle button */}
          <ReticleButton open={open} onClick={() => setOpen(false)} />
        </div>

        {/* Divider */}
        <div className="relative mx-5 mb-4">
          <div className="h-px bg-[#b0b0b0]" />
          <div className="mt-[2px] h-px bg-[#e0e0e0] w-3/4" />
        </div>

        {/* Section label */}
        <div className="px-5 mb-2">
          <span className="text-[8px] font-mono tracking-[0.3em] text-[#999] uppercase">
            {"// NAVIGATION"}
          </span>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex flex-col gap-[3px] px-3 overflow-y-auto flex-1">
          {items.map((item, i) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const isHovered = hoveredIndex === i;
            const isDark    = isActive || isHovered;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ transitionProperty: "background-color, box-shadow" }}
                className={cx(
                  "relative flex items-center gap-4 px-4 py-[14px] rounded-[2px]",
                  "transition-all duration-200 ease-out overflow-hidden",
                  isDark
                    ? "bg-[#1a1a1a] shadow-[inset_0_0_0_1px_#333]"
                    : "bg-[#c1c1c1]/70"
                )}
              >
                {/* Yellow accent bar */}
                <span
                  className={cx(
                    "absolute left-0 top-0 bottom-0 w-[3px] bg-[#e8c830]",
                    "transition-transform duration-200 ease-out origin-left",
                    isDark ? "scale-x-100" : "scale-x-0"
                  )}
                />

                {/* Step index */}
                <span
                  className={cx(
                    "text-[8px] tracking-[0.2em] font-mono shrink-0 transition-colors duration-150",
                    isDark ? "text-[#444]" : "text-[#bbb]"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Label + tag */}
                <span className="flex flex-col flex-1 min-w-0">
                  <span
                    className={cx(
                      "text-[13px] font-semibold font-mono tracking-tight leading-snug",
                      "transition-colors duration-150",
                      isDark ? "text-white" : "text-[#1a1a1a]"
                    )}
                  >
                    {item.label}
                  </span>
                  {item.tag && (
                    <span
                      className={cx(
                        "text-[8px] font-mono tracking-[0.2em] mt-[2px]",
                        "transition-colors duration-150",
                        isDark ? "text-[#444]" : "text-[#aaa]"
                      )}
                    >
                      {item.tag}
                    </span>
                  )}
                </span>

                {/* Arrow — only active/hovered */}
                <span
                  className={cx(
                    "text-[10px] tracking-[0.2em] font-mono shrink-0",
                    "transition-all duration-150",
                    isDark ? "text-[#e8c830] translate-x-0 opacity-100" : "opacity-0 -translate-x-1"
                  )}
                >
                  →
                </span>

                {/* Corner tick */}
                <span
                  className={cx(
                    "absolute top-[5px] right-[5px] w-[5px] h-[5px] border-t border-r",
                    "transition-colors duration-150",
                    isDark ? "border-[#333]" : "border-transparent"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* ── Drawer footer ── */}
        <div className="relative px-5 py-5">
          <div className="h-px bg-[#b0b0b0] mb-[2px]" />
          <div className="h-px bg-[#e0e0e0] w-2/3 mb-4" />
          <p className="text-[8px] font-mono text-[#aaa] tracking-[0.15em] leading-relaxed">
            {"V0.0.1 // BUILD 2026.05"}<br />
            NAO-IN NETWORK
          </p>
        </div>
      </div>

      {/* ── Spacer so page content doesn't hide behind top bar ── */}
      <div className="lg:hidden h-14" aria-hidden />
    </>
  );
}