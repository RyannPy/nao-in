// components/layout/PageContainer.tsx
// Main page wrapper: background color + texture + content column.

import PageTexture from "./PageTexture";

interface PageContainerProps {
  children: React.ReactNode;
  /** Extra classes on the outer full-screen wrapper (e.g. "font-mono") */
  className?: string;
  /** Classes for the inner content column. Default: "px-8 py-10 max-w-4xl mx-auto" */
  innerClassName?: string;
  /** Inline style on outer wrapper (e.g. fontFamily for not-found pages) */
  style?: React.CSSProperties;
  /** If true, centers content (for error / not-found pages) */
  centered?: boolean;
}

export default function PageContainer({
  children,
  className = "",
  innerClassName = "px-8 py-10 max-w-4xl mx-auto",
  style,
  centered = false,
}: PageContainerProps) {
  return (
    <div
      className={`min-h-screen bg-[#d0d0d0] text-[#1a1a1a] relative overflow-x-hidden ${
        centered ? "flex items-center justify-center" : ""
      } ${className}`}
      style={style}
    >
      <PageTexture />
      <div
        className={`relative z-10 ${
          centered ? "text-center px-8 max-w-md" : innerClassName
        }`}
      >
        {children}
      </div>
    </div>
  );
}
