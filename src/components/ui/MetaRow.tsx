// components/ui/MetaRow.tsx
// Metadata row with yellow dot indicator and slash-separated labels.

interface MetaRowProps {
  /** Primary label shown next to the yellow dot */
  dotLabel: string;
  /** Additional labels separated by "/" dividers */
  labels?: string[];
  /** Wrapper className. Default: "mb-6" */
  className?: string;
}

export default function MetaRow({
  dotLabel,
  labels = [],
  className = "mb-6",
}: MetaRowProps) {
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      {/* Primary label with dot */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#e8c830]" />
        <span className="text-[9px] tracking-[0.25em] text-[#777] uppercase">
          {dotLabel}
        </span>
      </div>

      {/* Additional labels with slash separators */}
      {labels.map((label, i) => (
        <span key={i} className="contents">
          <span className="text-[#ccc]">/</span>
          <span className="text-[9px] tracking-[0.2em] text-[#999] uppercase">
            {label}
          </span>
        </span>
      ))}
    </div>
  );
}
