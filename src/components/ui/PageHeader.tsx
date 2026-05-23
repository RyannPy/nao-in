// components/ui/PageHeader.tsx
// Standard page header: NAO-IN label row → big title → yellow underline.

interface PageHeaderProps {
  /** Page title displayed as h1 */
  title: string;
  /** Page code shown on the right (e.g. "PGE-001") */
  code: string;
  /** Optional extra classes on h1 for sizing overrides */
  titleClassName?: string;
  /** Wrapper margin. Default: "mb-12" */
  className?: string;
}

export default function PageHeader({
  title,
  code,
  titleClassName = "text-3xl md:text-4xl",
  className = "mb-8 md:mb-12",
}: PageHeaderProps) {
  return (
    <header className={className}>
      {/* NAO-IN label row */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[9px] tracking-[0.35em] text-[#888] uppercase">
          NAO-IN
        </span>
        <span className="h-px flex-1 bg-[#bbb]" />
        <span className="text-[9px] tracking-[0.2em] text-[#888]">
          {code}
        </span>
      </div>

      {/* Big title */}
      <h1
        className={`${titleClassName} font-black tracking-tighter leading-none uppercase text-[#1a1a1a]`}
      >
        {title}
      </h1>

      {/* Yellow accent underline */}
      <div className="mt-2 h-0.75 w-16 bg-[#e8c830]" />
    </header>
  );
}
