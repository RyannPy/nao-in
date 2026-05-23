// components/loading/index.ts
// Barrel export — import everything from "@/components/loading"

export { default as LoadingScreen } from "./LoadingScreen";
export { default as LoadingCard, LoadingCardGrid } from "./LoadingCard";
export { default as LoadingText } from "./LoadingText";
export { default as LoadingImage } from "./LoadingImage";
export { default as LoadingArticle } from "./LoadingArticle";

export {
  SKELETON_BASE,
  SKELETON_PULSE,
  SHIMMER_CHILD,
  SCANLINE_OVERLAY,
  SCANLINE_STYLE,
  BG_TEXTURE_STYLE,
  MONO_FONT,
  SYSTEM_LABELS,
} from "./loading-constants";

export type { SystemLabel } from "./loading-constants";