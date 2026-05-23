"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({
  code,
  language,
}: CodeBlockProps) {
  const [wrap, setWrap] = useState(false);

  return (
    <div className="relative my-6 border border-[#b0b0b0] bg-[#1a1a1a] overflow-hidden">
      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#333] bg-[#151515]">
        <div className="flex items-center gap-3">
          <span className="text-[9px] tracking-[0.25em] text-[#777] uppercase">
            {language || "CODE"}
          </span>

          <button
            onClick={() => setWrap((v) => !v)}
            className="text-[8px] tracking-[0.2em] text-[#888] hover:text-[#e8c830] transition-colors"
          >
            WRAP {wrap ? "ON" : "OFF"}
          </button>
        </div>

        <span className="text-[8px] tracking-[0.2em] text-[#555]">
          SYSTEM BLOCK
        </span>
      </div>

      {/* code */}
      <pre
        className={[
          "p-4 text-[13px] leading-[1.8] text-[#d0d0d0] font-mono",
          wrap
            ? "whitespace-pre-wrap break-words"
            : "overflow-x-auto",
        ].join(" ")}
      >
        <code>{code}</code>
      </pre>

      {/* accent */}
      <div className="absolute top-0 left-0 w-[3px] h-full bg-[#e8c830]" />
    </div>
  );
}