// app/categories/page.tsx

import Link from "next/link";
import { JSX } from "react";
import PageContainer from "@/components/layout/PageContainer";
import StatusFooter from "@/components/layout/StatusFooter";
import PageHeader from "@/components/ui/PageHeader";
import SectionLabel from "@/components/ui/SectionLabel";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  slug: string;
  name: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  { id: "CAT-01", slug: "games",   name: "Games"   },
  { id: "CAT-02", slug: "science", name: "Science" },
  { id: "CAT-03", slug: "story",   name: "Story"   },
  { id: "CAT-04", slug: "coding",  name: "Coding"  },
  { id: "CAT-05", slug: "study",   name: "Study"   },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconGames() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="12" y="28" width="96" height="64" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <rect x="26" y="52" width="10" height="10" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="36" y="42" width="10" height="10" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="36" y="62" width="10" height="10" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="46" y="52" width="10" height="10" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="72" y="44" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="84" y="44" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="72" y="56" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="84" y="56" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="54" y="53" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="62" y="53" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
      <path d="M12 28L22 28L12 38Z" fill="currentColor" opacity="0.6"/>
      <line x1="12" y1="86" x2="108" y2="86" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
    </svg>
  );
}

function IconScience() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M45 20 L45 55 L22 90 Q20 94 24 95 L96 95 Q100 94 98 90 L75 55 L75 20 Z"
        stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <line x1="38" y1="20" x2="82" y2="20" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M34 74 Q60 70 86 74" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" opacity="0.7"/>
      <rect x="52" y="78" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="64" y="72" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="58" y="65" width="3" height="3" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
      <line x1="40" y1="58" x2="46" y2="58" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
      <line x1="38" y1="65" x2="44" y2="65" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
      <polygon points="22,20 30,20 22,28" fill="currentColor" opacity="0.6"/>
    </svg>
  );
}

function IconStory() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="20" y="16" width="80" height="90" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <line x1="32" y1="16" x2="32" y2="106" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="44" y1="34" x2="90" y2="34" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      <line x1="44" y1="44" x2="90" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      <line x1="44" y1="54" x2="90" y2="54" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      <line x1="44" y1="64" x2="90" y2="64" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      <line x1="44" y1="74" x2="76" y2="74" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      <path d="M84 16 L84 40 L78 34 L72 40 L72 16" stroke="currentColor" strokeWidth="1" fill="none"/>
      <polygon points="20,16 32,16 20,28" fill="currentColor" opacity="0.6"/>
      <path d="M100 96 L100 106 L90 106" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
    </svg>
  );
}

function IconCoding() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="10" y="16" width="100" height="72" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <rect x="18" y="24" width="84" height="56" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.4" fill="none"/>
      <line x1="60" y1="88" x2="60" y2="100" stroke="currentColor" strokeWidth="2"/>
      <line x1="42" y1="100" x2="78" y2="100" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M28 44 L22 52 L28 60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M38 44 L44 52 L38 60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="50" y="46" width="24" height="3" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="50" y="52" width="38" height="3" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="50" y="58" width="18" height="3" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="18" y="70" width="84" height="6" fill="currentColor" opacity="0.12"/>
      <rect x="20" y="71.5" width="12" height="3" rx="1" fill="currentColor" opacity="0.5"/>
      <polygon points="10,16 22,16 10,28" fill="currentColor" opacity="0.6"/>
    </svg>
  );
}

function IconStudy() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M60 18 L100 38 L60 58 L20 38 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <line x1="60" y1="58" x2="60" y2="90" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M100 38 L100 62" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
      <rect x="96" y="62" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
      <line x1="20" y1="38" x2="100" y2="38" stroke="currentColor" strokeWidth="0.6" opacity="0.4"/>
      <path d="M40 78 Q60 72 80 78 L80 90 Q60 84 40 90 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
      <line x1="60" y1="18" x2="66" y2="22" stroke="currentColor" strokeWidth="0.7" opacity="0.5"/>
      <line x1="60" y1="18" x2="54" y2="22" stroke="currentColor" strokeWidth="0.7" opacity="0.5"/>
      <polygon points="16,28 26,22 22,34" fill="currentColor" opacity="0.6"/>
    </svg>
  );
}

const ICONS: Record<string, () => JSX.Element> = {
  games:   IconGames,
  science: IconScience,
  story:   IconStory,
  coding:  IconCoding,
  study:   IconStudy,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CategoriesPage() {
  return (
    <PageContainer className="font-mono" innerClassName="px-8 py-10 max-w-5xl mx-auto">
      {/* ── Page header ── */}
      <PageHeader title="CATEGORY" code="PGE-003" className="mb-10" />

      {/* ── Section label ── */}
      <SectionLabel
        label={"// FILE INDEX"}
        className="mb-8"
        rightContent={
          <span className="text-[9px] tracking-[0.2em] text-[#888]">
            {CATEGORIES.length} DOMAIN
          </span>
        }
      />

      {/* ── Category grid — full viewport height minus header ── */}
      <div
        className="grid gap-px bg-[#b0b0b0]"
        style={{
          gridTemplateColumns: "repeat(5, 1fr)",
          /* Tinggi penuh: kurangi header ~260px, sisanya dibagi rata */
          height: "calc(100vh - 280px)",
          minHeight: "400px",
        }}
      >
        {CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.slug];
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="cat-card"
            >
              {/* Accent bar kiri */}
              <span className="cat-accent-bar" />

              {/* ID row */}
              <div className="flex items-center justify-between px-3 pt-3 pb-1 shrink-0">
                <span className="cat-id text-[7px] tracking-[0.28em] uppercase leading-none">
                  {cat.id}
                </span>
                <span className="cat-diamond" />
              </div>

              {/* Icon — mengisi sisa ruang secara vertikal */}
              <div className="flex flex-1 items-center justify-center px-6 py-4">
                <div className="cat-icon w-full h-full" style={{ maxWidth: "96px", maxHeight: "96px" }}>
                  <Icon />
                </div>
              </div>

              {/* Name label */}
              <div className="cat-divider px-3 pb-4 pt-2 shrink-0">
                <span className="cat-name block text-[11px] font-bold tracking-[0.22em] uppercase leading-none">
                  {cat.name}
                </span>
              </div>

              {/* Corner tick */}
              <span className="cat-corner-tick" />

              {/* Scanline overlay */}
              <span className="cat-scanline" />
            </Link>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <StatusFooter className="mt-8" />
    </PageContainer>
  );
}