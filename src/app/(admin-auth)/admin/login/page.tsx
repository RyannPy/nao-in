// app/(admin-auth)/admin/login/page.tsx

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// ─── cx helper ────────────────────────────────────────────────────────────────
function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

const TEXTURE_STYLE: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg,transparent,transparent 32px,#000 32px,#000 33px)," +
    "repeating-linear-gradient(90deg,transparent,transparent 56px,#000 56px,#000 57px)",
};

// Scanline overlay — horizontal lines tipis ala CRT/terminal
const SCANLINE_STYLE: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px)",
};

// ─── Field component ─────────────────────────────────────────────────────────
function Field({
  label,
  code,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  code: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex items-center gap-3">
        <span className="text-[8px] tracking-[0.3em] text-[#aaa] uppercase font-mono">
          {code}
        </span>
        <span className="h-px flex-1 bg-[#333]" />
        <span className="text-[9px] tracking-[0.25em] text-[#888] uppercase font-mono">
          {label}
        </span>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#555] font-mono tracking-widest select-none">
          {">"}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#e8c830] pl-7 pr-4 py-3 text-[12px] tracking-[0.1em] text-[#e0e0e0] placeholder-[#444] outline-none font-mono transition-colors duration-150"
          spellCheck={false}
        />
        {/* focus accent line */}
        <span className="absolute bottom-0 left-0 right-0 h-px bg-[#e8c830] scale-x-0 focus-within:scale-x-100 origin-left transition-transform duration-200" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Placeholder — auth logic goes here
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center relative overflow-hidden font-mono">
      {/* ── Background texture ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={TEXTURE_STYLE}
      />

      {/* ── Scanlines ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={SCANLINE_STYLE}
      />

      {/* ── Corner decorations ── */}
      <span className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#2a2a2a]" />
      <span className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#2a2a2a]" />
      <span className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[#2a2a2a]" />
      <span className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#2a2a2a]" />

      {/* ── Main panel ── */}
      <div className="relative w-full max-w-sm mx-4">
        {/* Top accent bar */}
        <div className="h-[2px] bg-[#e8c830] mb-px" />
        <div className="h-px bg-[#3a3000] mb-6" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[8px] tracking-[0.4em] text-[#555] uppercase">
              SYS-ACCESS
            </span>
            <span className="h-px flex-1 bg-[#222]" />
            <span className="text-[8px] tracking-[0.3em] text-[#444] uppercase">
              RESTRICTED
            </span>
          </div>

          <p className="text-[9px] tracking-[0.4em] text-[#888] uppercase mb-2">
            AUTHORIZED ACCESS ONLY
          </p>
          <h1
            className="text-3xl font-black tracking-tighter text-white uppercase leading-none"
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
            NAO-IN ADMIN
          </h1>

          {/* Yellow divider */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-[3px] w-8 bg-[#e8c830]" />
            <div className="h-px flex-1 bg-[#222]" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field
            label="Email"
            code="F-01"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="admin@nao-in.dev"
            autoComplete="email"
          />
          <Field
            label="Password"
            code="F-02"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••••••"
            autoComplete="current-password"
          />

          {/* Submit */}
          <div className="mt-2">
            <button
              type="submit"
              disabled={loading}
              className={cx(
                "w-full relative flex items-center justify-center gap-3",
                "py-3 font-mono text-[11px] tracking-[0.4em] uppercase font-black",
                "border transition-all duration-200 overflow-hidden",
                loading
                  ? "bg-[#1a1a1a] border-[#333] text-[#555] cursor-wait"
                  : "bg-[#e8c830] border-[#e8c830] text-[#1a1a1a] hover:bg-[#f0d040] active:scale-[0.99]",
              )}
            >
              {/* shimmer line when loading */}
              {loading && (
                <span className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[#333] to-transparent animate-[shimmer_1s_ease-in-out_infinite]" />
              )}
              <span>{loading ? "AUTHENTICATING..." : "LOGIN"}</span>
              {!loading && <span className="text-[10px]">→</span>}
            </button>
          </div>
        </form>

        {/* Bottom divider */}
        <div className="mt-6 flex items-center gap-2">
          <div className="h-px flex-1 bg-[#222]" />
          <div className="h-[3px] w-8 bg-[#222]" />
        </div>

        {/* Status footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-[6px] w-[6px]">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8c830] opacity-50" />
              <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[#e8c830]" />
            </span>
            <span className="text-[8px] tracking-[0.2em] text-[#555] uppercase">
              SYSTEM ONLINE
            </span>
          </div>
          <span className="text-[8px] tracking-[0.15em] text-[#444]">
            NAO-IN // V0.0.1
          </span>
        </div>
      </div>
    </div>
  );
}
