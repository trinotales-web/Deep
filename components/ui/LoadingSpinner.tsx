import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  color = "#7c9a6e",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
  };

  return (
    <div
      className={cn(
        "rounded-full border-t-transparent animate-spin",
        sizes[size],
        className
      )}
      style={{ borderColor: `${color}40`, borderTopColor: color }}
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="font-serif text-lg text-[#8a8578] italic">
          One moment...
        </p>
      </div>
    </div>
  );
}
