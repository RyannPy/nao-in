// components/ui/SectionLabel.tsx
// "// LABEL" section divider row with optional right-side content.

interface SectionLabelProps {
  /** Label text displayed (e.g. "// UNGGULAN") */
  label: string;
  /** Optional content on the right side of the divider line */
  rightContent?: React.ReactNode;
  /** Wrapper className. Default: "mb-4" */
  className?: string;
}

export default function SectionLabel({
  label,
  rightContent,
  className = "mb-4",
}: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-[9px] tracking-[0.3em] text-[#888] uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-[#bbb]" />
      {rightContent}
    </div>
  );
}
