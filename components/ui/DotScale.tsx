"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DotScaleProps {
  value: number | null; // 1-5
  onChange?: (value: number) => void;
  color?: string;
  size?: "sm" | "md";
  label?: string;
  max?: number;
}

export function DotScale({
  value,
  onChange,
  color = "#7c9a6e",
  size = "md",
  label,
  max = 5,
}: DotScaleProps) {
  const dotSize = size === "sm" ? "w-6 h-6" : "w-7 h-7";

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm text-[#5a5549]">{label}</span>}
      <div className="flex gap-2 items-center">
        {Array.from({ length: max }).map((_, i) => {
          const dotValue = i + 1;
          const isActive = value !== null && dotValue <= value;

          return (
            <motion.button
              key={i}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange?.(dotValue)}
              className={cn(
                dotSize,
                "rounded-full border-2 transition-all duration-200",
                onChange && "cursor-pointer",
                !onChange && "cursor-default"
              )}
              style={{
                borderColor: isActive ? color : "#e0dbd3",
                backgroundColor: isActive ? color : "transparent",
              }}
            />
          );
        })}
        {value !== null && value !== undefined && (
          <span className="text-xs text-[#8a8578] ml-1">{value}/5</span>
        )}
      </div>
    </div>
  );
}
