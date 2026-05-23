// components/loading/loading-constants.ts
// Shared animation utilities and constants for the TERMA//LOG loading system.
// Single source of truth — import from here, never duplicate inline.

// ─── Tailwind class bundles ───────────────────────────────────────────────────

/** Base skeleton block: muted gray background that accepts shimmer overlay */
export const SKELETON_BASE =
  "relative overflow-hidden bg-[#c0c0c0]" as const;

/** Slow, subtle opacity pulse — for text/label placeholders */
export const SKELETON_PULSE =
  "animate-pulse" as const;

/**
 * Shimmer sweep overlay.
 * Apply as a child <span> inside any SKELETON_BASE element.
 * Uses a keyframe defined in globals.css (see below).
 */
export const SHIMMER_CHILD =
  "absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" as const;

/** Scanline texture overlay — always aria-hidden */
export const SCANLINE_OVERLAY =
  "pointer-events-none absolute inset-0 opacity-[0.07]" as const;

export const SCANLINE_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.6) 3px,rgba(0,0,0,0.6) 4px)",
} as const;

/** Page-level background grid texture */
export const BG_TEXTURE_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(0deg,transparent,transparent 32px,#000 32px,#000 33px)," +
    "repeating-linear-gradient(90deg,transparent,transparent 56px,#000 56px,#000 57px)",
} as const;

/** Mono font stack — matches rest of project */
export const MONO_FONT = {
  fontFamily: "'Courier New', Courier, monospace",
} as const;

// ─── System status labels (rotating) ─────────────────────────────────────────

export const SYSTEM_LABELS = [
  "LOADING ARCHIVE",
  "FETCHING DATA",
  "INITIALIZING SYSTEM",
  "RETRIEVING ENTRY",
  "SYNCING INDEX",
  "PARSING DOCUMENT",
] as const;

export type SystemLabel = (typeof SYSTEM_LABELS)[number];

// ─── globals.css keyframe to add ─────────────────────────────────────────────
// Paste this into your globals.css @layer utilities or @keyframes block:
//
// @keyframes shimmer {
//   0%   { transform: translateX(-100%); }
//   100% { transform: translateX(200%); }
// }
//
// Then extend tailwind.config.ts:
// theme: { extend: { animation: { shimmer: "shimmer 1.8s ease-in-out infinite" } } }