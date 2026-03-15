import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

export function Skeleton({ className, lines, height = "h-4" }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg animate-pulse bg-gradient-to-r from-[#ede9e2] via-[#faf8f5] to-[#ede9e2]",
              height,
              i === lines - 1 && "w-3/4",
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg animate-pulse bg-gradient-to-r from-[#ede9e2] via-[#faf8f5] to-[#ede9e2]",
        height,
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#ede9e2] p-[22px] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <Skeleton className="w-2/3 mb-4" height="h-5" />
      <Skeleton lines={3} />
    </div>
  );
}
