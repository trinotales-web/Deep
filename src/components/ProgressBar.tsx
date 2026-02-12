"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  color = "bg-accent",
  label,
  showValue = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-xs">
          {label && <span className="text-muted">{label}</span>}
          {showValue && <span className="text-foreground font-medium">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-card-border">
        <div
          className={`h-full rounded-full ${color} animate-progress`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
