// components/ArticleContent.tsx
// Reusable prose renderer for article body text.
// In production, replace renderContent() with next-mdx-remote or remark/rehype.

interface ArticleContentProps {
  content: string;
}

function renderContent(raw: string) {
  const lines = raw.trim().split("\n");
  const blocks: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // ## Heading
    if (trimmed.startsWith("## ")) {
      blocks.push(
        <h2
          key={key++}
          className="flex items-center gap-3 text-[13px] font-black tracking-[0.2em] uppercase text-[#1a1a1a] mt-10 mb-4"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          <span className="w-4 h-px bg-[#e8c830] shrink-0" />
          {trimmed.slice(3)}
        </h2>
      );
      continue;
    }

    // **Standalone bold line** → sub-heading
    if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length > 4) {
      blocks.push(
        <p
          key={key++}
          className="text-[13px] font-bold tracking-tight text-[#1a1a1a] mt-6 mb-1"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          {trimmed.slice(2, -2)}
        </p>
      );
      continue;
    }

    // Regular paragraph — handle inline **bold**
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
    blocks.push(
      <p
        key={key++}
        className="text-[14px] leading-[1.9] text-[#3a3a3a]"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        {parts.map((part, pi) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={pi} className="font-bold text-[#1a1a1a]">
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  }

  return blocks;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="flex flex-col gap-5">
      {renderContent(content)}
    </div>
  );
}