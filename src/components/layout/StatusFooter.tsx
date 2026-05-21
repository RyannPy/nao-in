// components/layout/StatusFooter.tsx
// Footer status panel with pinging indicator, shared across all pages.

interface StatusFooterProps {
  /** Status label next to the ping dot. Default: "SYSTEM ACTIVE" */
  statusText?: string;
  /** Optional extra info rendered before "NAO-IN © 2026" */
  extraInfo?: React.ReactNode;
  /** Wrapper className (controls spacing above footer). Default: "mt-16" */
  className?: string;
}

export default function StatusFooter({
  statusText = "SYSTEM ACTIVE",
  extraInfo,
  className = "mt-16",
}: StatusFooterProps) {
  return (
    <footer className={`${className} pt-4 border-t border-[#bbb]`}>
      <div className="flex items-center justify-between">
        {/* Left: ping indicator + status */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8c830] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8c830]" />
          </span>
          <span className="text-[9px] tracking-[0.2em] text-[#888]">
            {statusText}
          </span>
        </div>

        {/* Right: optional extra info + copyright */}
        <div className="flex items-center gap-4">
          {extraInfo}
          <span className="text-[9px] tracking-[0.2em] text-[#aaa]">
            NAO-IN © 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
