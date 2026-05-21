// lib/theme.ts — NAO-IN Design System Constants
// Shared color tokens, font stacks, texture patterns, and utilities.

// ─── Colors ───────────────────────────────────────────────────────────────────

export const COLORS = {
  /** Primary page background */
  bg: "#d0d0d0",
  /** Alternate panel background (stats, cards) */
  bgAlt: "#c9c9c9",
  /** Lighter panel background */
  bgPanel: "#c4c4c4",
  /** Dark surface / dark-mode accent */
  bgDark: "#1a1a1a",
  /** Dark surface hover */
  bgDarkHover: "#111",
  /** Brand accent — yellow */
  accent: "#e8c830",

  /** Primary text */
  text: "#1a1a1a",
  /** Secondary / muted text */
  textMuted: "#888",
  /** Dim / faint label text */
  textDim: "#aaa",
  /** Subtle info text */
  textSubtle: "#555",
  /** Faint placeholder text */
  textFaint: "#999",
  /** Light meta text */
  textLight: "#777",

  /** Standard border */
  border: "#bbb",
  /** Dark border (on dark surfaces) */
  borderDark: "#333",
  /** Light border */
  borderLight: "#b0b0b0",
  /** Alternative border */
  borderAlt: "#c8c8c8",

  white: "#ffffff",
} as const;

// ─── Fonts ────────────────────────────────────────────────────────────────────

export const FONTS = {
  mono: "'Courier New', Courier, monospace",
} as const;

// ─── Textures ─────────────────────────────────────────────────────────────────

export const TEXTURES = {
  /** Grid overlay used on all page backgrounds */
  grid:
    "repeating-linear-gradient(0deg,transparent,transparent 32px,#000 32px,#000 33px)," +
    "repeating-linear-gradient(90deg,transparent,transparent 56px,#000 56px,#000 57px)",
} as const;

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Tiny classname joiner — filters falsy values */
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
