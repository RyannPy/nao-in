// ─── Prose renderer ───────────────────────────────────────────────────────────

import CodeBlock from "./CodeBlock";
import Link from "next/link";
import { JSX } from "react";

export default function renderContent(raw: string) {
  const lines = raw.trim().split("\n");
  const blocks: JSX.Element[] = [];

  let key = 0;
  let i = 0;

  function parseInline(text: string) {
    const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

    return text.split(regex).map((part, pi) => {
      // Bold
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pi} className="font-bold text-[#1a1a1a]">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Link
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);

      if (linkMatch) {
        const [, label, href] = linkMatch;

        const isExternal =
          href.startsWith("http://") || href.startsWith("https://");

        return (
          <Link
            key={pi}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-[#1a1a1a] underline decoration-[#e8c830] underline-offset-4 transition-colors duration-150 hover:text-[#e8c830]"
          >
            {label}
          </Link>
        );
      }

      return part;
    });
  }

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    // ─────────────────────────────────────────
    // CODE BLOCK
    // ```ts
    // code...
    // ```
    // ─────────────────────────────────────────
    if (line.startsWith("```")) {
      const language = line.replace("```", "").trim();

      const codeLines: string[] = [];
      i++;

      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }

      blocks.push(
        <CodeBlock
          key={key++}
          language={language}
          code={codeLines.join("\n")}
        />,
      );

      i++;
      continue;
    }

    // ─────────────────────────────────────────
    // H2
    // ## Heading
    // ─────────────────────────────────────────
    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={key++}
          className="text-[13px] font-black tracking-[0.2em] uppercase text-[#1a1a1a] mt-10 mb-4 flex items-center gap-3"
        >
          <span className="w-4 h-px bg-[#e8c830] inline-block shrink-0" />
          {line.slice(3)}
        </h2>,
      );

      i++;
      continue;
    }

    // ─────────────────────────────────────────
    // Bold-only line
    // **Sub heading**
    // ─────────────────────────────────────────
    if (line.startsWith("**") && line.endsWith("**")) {
      blocks.push(
        <p
          key={key++}
          className="text-[13px] font-bold tracking-tight text-[#1a1a1a] mt-6 mb-2"
        >
          {line.slice(2, -2)}
        </p>,
      );

      i++;
      continue;
    }

    // ─────────────────────────────────────────
    // Paragraph
    // ─────────────────────────────────────────
    blocks.push(
      <p key={key++} className="text-[14px] leading-[1.9] text-[#3a3a3a] mb-0">
        {parseInline(line)}
      </p>,
    );

    i++;
  }

  return blocks;
}