// components/loading/LoadingScreen.tsx
// Full-viewport loading overlay — used in app/loading.tsx and Suspense boundaries.
// Terminal-style: animated status line, scanlines, corner ticks, pinging dot.

"use client";

import { useEffect, useState } from "react";
import {
  BG_TEXTURE_STYLE,
  SCANLINE_OVERLAY,
  SCANLINE_STYLE,
  MONO_FONT,
  SYSTEM_LABELS,
  type SystemLabel,
} from "./loading-constants";

interface LoadingScreenProps {
  /** Override the rotating label with a fixed one */
  label?: SystemLabel | string;
  /** Show the full-page background (false when used inside a section) */
  fullPage?: boolean;
  className?: string;
}

/** Animated progress bar — scanline-style horizontal sweep */
function ProgressBar() {
  return (
    <div className="relative w-full h-px bg-[#bbb] overflow-hidden">
      {/* Animated sweep */}
      <span
        className="absolute top-0 left-0 h-full w-1/3 bg-[#e8c830] opacity-80"
        style={{
          animation: "loadingBar 1.6s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes loadingBar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}

/** Blinking cursor — terminal text cursor */
function BlinkCursor() {
  return (
    <span
      className="inline-block w-[6px] h-[12px] bg-[#e8c830] ml-1 align-middle"
      style={{ animation: "blink 1s step-end infinite" }}
    >
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </span>
  );
}

export default function LoadingScreen({
  label,
  fullPage = true,
  className = "",
}: LoadingScreenProps) {
  const [currentLabel, setCurrentLabel] = useState<string>(
    label ?? SYSTEM_LABELS[0]
  );
  const [labelIndex, setLabelIndex] = useState(0);

  // Cycle through system labels if no fixed label provided
  useEffect(() => {
    if (label) return;
    const id = setInterval(() => {
      setLabelIndex((i) => {
        const next = (i + 1) % SYSTEM_LABELS.length;
        setCurrentLabel(SYSTEM_LABELS[next]);
        return next;
      });
    }, 1800);
    return () => clearInterval(id);
  }, [label]);

  const wrapper = fullPage
    ? "fixed inset-0 z-50 bg-[#d0d0d0]"
    : "relative w-full min-h-[320px] bg-[#d0d0d0]";

  return (
    <div
      className={`${wrapper} flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={MONO_FONT}
      aria-live="polite"
      aria-label={currentLabel}
    >
      {/* ── Background grid texture ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={BG_TEXTURE_STYLE}
      />

      {/* ── Scanlines ── */}
      <div
        aria-hidden
        className={SCANLINE_OVERLAY}
        style={SCANLINE_STYLE}
      />

      {/* ── Corner ticks ── */}
      <span className="absolute top-5 left-5 w-5 h-5 border-t-2 border-l-2 border-[#e8c830]" />
      <span className="absolute top-5 right-5 w-5 h-5 border-t-2 border-r-2 border-[#e8c830]" />
      <span className="absolute bottom-5 left-5 w-5 h-5 border-b-2 border-l-2 border-[#e8c830]" />
      <span className="absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2 border-[#e8c830]" />

      {/* ── Center panel ── */}
      <div className="relative flex flex-col items-center gap-6 px-8 w-full max-w-sm">

        {/* Site identifier */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] tracking-[0.35em] text-[#888] uppercase">
            NAO
          </span>
          <span className="h-px w-4 bg-[#bbb]" />
          <span className="text-[9px] tracking-[0.35em] text-[#888] uppercase">
            IN
          </span>
        </div>

        {/* Main status label */}
        <div className="text-center">
          <p className="text-[11px] tracking-[0.3em] text-[#555] uppercase mb-1">
            {currentLabel}
            <BlinkCursor />
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full flex flex-col gap-2">
          <ProgressBar />
        </div>

        {/* System info row */}
        <div className="flex items-center gap-4 w-full justify-between">
          {/* Pinging dot */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8c830] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#e8c830]" />
            </span>
            <span className="text-[8px] tracking-[0.2em] text-[#888] uppercase">
              SYSTEM ACTIVE
            </span>
          </div>
          <span className="text-[8px] tracking-[0.15em] text-[#aaa]">
            V0.0.1
          </span>
        </div>
      </div>

      {/* ── Bottom status bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#bbb]" />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <span className="text-[7px] tracking-[0.3em] text-[#ccc] uppercase">
          PLEASE WAIT
        </span>
      </div>
    </div>
  );
}