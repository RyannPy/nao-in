// app/(admin)/admin/dashboard/page.tsx

import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/ui/PageHeader";

// ─── Placeholder data (ganti dengan Supabase query existing) ─────────────────
const STATS = {
  totalArticles: "--",
  lastArchived: "—",
  categories: 5,
  status: "ONLINE",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[9px] tracking-[0.3em] text-[#888] uppercase font-mono">{children}</span>
      <span className="h-px flex-1 bg-[#bbb]" />
    </div>
  );
}

function StatCell({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-[#c4c4c4] border border-[#b8b8b8] px-5 py-4 flex flex-col gap-1 relative overflow-hidden">
      <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#b0b0b0]" />
      <span
        className="text-2xl font-black tracking-tighter font-mono leading-none"
        style={{ color: accent ? "#e8c830" : "#1a1a1a" }}
      >
        {value}
      </span>
      <span className="text-[8px] tracking-[0.25em] text-[#888] uppercase font-mono">{label}</span>
    </div>
  );
}

function QuickAction({
  href,
  code,
  label,
  desc,
  primary = false,
}: {
  href: string;
  code: string;
  label: string;
  desc: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "group relative flex flex-col gap-2 px-5 py-5 overflow-hidden",
        "transition-colors duration-200 border",
        primary
          ? "bg-[#1a1a1a] border-[#333] hover:border-[#e8c830]"
          : "bg-[#c4c4c4] border-[#b8b8b8] hover:bg-[#1a1a1a] hover:border-[#333]",
      ].join(" ")}
    >
      {/* accent bar */}
      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e8c830] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200" />
      {/* corner tick */}
      <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#333] group-hover:border-[#555] transition-colors duration-200" />

      <span
        className={[
          "text-[8px] tracking-[0.3em] font-mono uppercase transition-colors duration-150",
          primary ? "text-[#555]" : "text-[#aaa] group-hover:text-[#555]",
        ].join(" ")}
      >
        {code}
      </span>
      <span
        className={[
          "text-[14px] font-black tracking-tight font-mono uppercase leading-none transition-colors duration-150",
          primary ? "text-[#e8c830]" : "text-[#1a1a1a] group-hover:text-white",
        ].join(" ")}
      >
        {label}
      </span>
      <span
        className={[
          "text-[11px] font-mono leading-relaxed transition-colors duration-150",
          primary ? "text-[#666]" : "text-[#777] group-hover:text-[#888]",
        ].join(" ")}
      >
        {desc}
      </span>
      <span
        className={[
          "mt-1 text-[9px] tracking-[0.3em] font-mono group-hover:translate-x-1 transition-all duration-150",
          primary ? "text-[#e8c830]" : "text-[#aaa] group-hover:text-[#e8c830]",
        ].join(" ")}
      >
        EXECUTE →
      </span>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  return (
    <PageContainer>
      <PageHeader title="Admin Dashboard" code="ADM-001" />

      {/* ── Welcome panel ── */}
      <div className="mt-8 bg-[#1a1a1a] border-l-[3px] border-[#e8c830] px-6 py-5 relative overflow-hidden">
        <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#333]" />
        <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#333]" />
        <p className="text-[9px] tracking-[0.35em] text-[#555] uppercase font-mono mb-2">WELCOME BACK</p>
        <p className="text-white font-black text-lg tracking-tight font-mono uppercase leading-none">
          NAO-IN ARCHIVE SYSTEM
        </p>
        <p className="mt-2 text-[11px] text-[#666] font-mono leading-relaxed">
          Internal management panel. Select an action below or navigate via sidebar.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="mt-8">
        <SectionLabel>{"// SYSTEM METRICS"}</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#b8b8b8] border border-[#b8b8b8]">
          <StatCell label="TOTAL ARTICLES" value={STATS.totalArticles} />
          <StatCell label="CATEGORIES"     value={String(STATS.categories)} />
          <StatCell label="LAST ARCHIVED"  value={STATS.lastArchived} />
          <StatCell label="SYSTEM STATUS"  value={STATS.status} accent />
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="mt-8">
        <SectionLabel>{"// QUICK ACTIONS"}</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#b8b8b8] border border-[#b8b8b8]">
          <QuickAction
            href="/admin/articles/new"
            code="ACT-001"
            label="Create New Article"
            desc="Open the article editor and publish a new entry to the archive."
            primary
          />
          <QuickAction
            href="/admin/articles"
            code="ACT-002"
            label="Manage Articles"
            desc="Browse, edit, or remove existing articles from the archive index."
          />
        </div>
      </div>

      {/* ── System status panel ── */}
      <div className="mt-8">
        <SectionLabel>{"// ARCHIVE STATUS"}</SectionLabel>
        <div className="border border-[#b8b8b8] bg-[#c4c4c4]">
          {[
            { key: "Database",        val: "CONNECTED",  ok: true },
            { key: "Storage Bucket",  val: "STANDBY",    ok: true },
            { key: "Auth Provider",   val: "ACTIVE",     ok: true },
            { key: "Last Deploy",     val: "2026.05.18", ok: true },
          ].map((row, i) => (
            <div
              key={row.key}
              className={[
                "flex items-center justify-between px-5 py-3 font-mono",
                i !== 0 ? "border-t border-[#b8b8b8]" : "",
              ].join(" ")}
            >
              <span className="text-[11px] tracking-[0.1em] text-[#555] uppercase">{row.key}</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-[6px] w-[6px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8c830] opacity-50" />
                  <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[#e8c830]" />
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#e8c830] uppercase font-black">{row.val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </PageContainer>
  );
}