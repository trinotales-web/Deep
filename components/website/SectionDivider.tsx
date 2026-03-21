interface SectionDividerProps {
  className?: string;
}

export default function SectionDivider({ className = "" }: SectionDividerProps) {
  return (
    <div className={`site-divider ${className}`}>
      <span>&#9672;</span>
    </div>
  );
}
