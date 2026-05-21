// components/layout/PageTexture.tsx
// Background grid-texture overlay used on every page.

import { TEXTURES } from "@/lib/theme";

export default function PageTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 opacity-[0.04] z-0"
      style={{ backgroundImage: TEXTURES.grid }}
    />
  );
}
