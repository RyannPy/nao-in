// components/ui/AccentDivider.tsx
// Decorative yellow-accent horizontal divider with diamond marker.

interface AccentDividerProps {
  className?: string;
}

export default function AccentDivider({ className = "mb-8" }: AccentDividerProps) {
  return (
    <div className={`relative h-px bg-[#bbb] ${className}`}>
      <span className="absolute left-0 top-0 h-px w-12 bg-[#e8c830]" />
      <span className="absolute left-12 -top-0.75 w-1.5 h-1.5 rotate-45 bg-[#e8c830]" />
    </div>
  );
}
