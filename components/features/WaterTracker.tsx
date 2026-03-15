"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WaterTrackerProps {
  glasses: number;
  goal?: number;
  onToggle?: (glass: number) => void;
  readonly?: boolean;
}

export function WaterTracker({
  glasses,
  goal = 8,
  onToggle,
  readonly,
}: WaterTrackerProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        {Array.from({ length: goal }).map((_, i) => {
          const isFilled = i < glasses;

          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => !readonly && onToggle?.(i + 1)}
              whileTap={!readonly ? { scale: 0.9 } : {}}
              className={cn(
                "relative w-9 h-11 rounded-b-lg border-2 overflow-hidden transition-all duration-200",
                readonly ? "cursor-default" : "cursor-pointer",
                isFilled
                  ? "border-[#6b9bc3]"
                  : "border-[#b5ad9e] hover:border-[#6b9bc3]"
              )}
            >
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-[#6b9bc3]"
                initial={{ height: 0 }}
                animate={{ height: isFilled ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.04 }}
              />
              {/* Glass rim */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#6b9bc3]/20 border-b border-[#6b9bc3]/30" />
            </motion.button>
          );
        })}
      </div>
      <p className="text-sm text-[#8a8578]">
        <span className="font-medium text-[#3d3a35]">{glasses}</span> / {goal}{" "}
        glasses
        {glasses >= goal && (
          <span className="text-[#7c9a6e] ml-2">✓ Goal reached!</span>
        )}
      </p>
    </div>
  );
}
