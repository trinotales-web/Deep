"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  height?: string;
  className?: string;
  animated?: boolean;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  color = "#7c9a6e",
  height = "h-1.5",
  className,
  animated = true,
  showLabel,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex-1 bg-[#ede9e2] rounded-full overflow-hidden",
          height
        )}
      >
        {animated ? (
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ) : (
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ backgroundColor: color, width: `${clampedValue}%` }}
          />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-[#8a8578] w-8 text-right shrink-0">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
}
