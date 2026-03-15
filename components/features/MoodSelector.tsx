"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MOODS = [
  { id: 0, label: "Peaceful", emoji: "🌸", color: "#8b7bb5" },
  { id: 1, label: "Happy", emoji: "😊", color: "#d4a954" },
  { id: 2, label: "Good", emoji: "🙂", color: "#7c9a6e" },
  { id: 3, label: "Neutral", emoji: "😐", color: "#8a8578" },
  { id: 4, label: "Low", emoji: "😔", color: "#6b9bc3" },
  { id: 5, label: "Stressed", emoji: "😰", color: "#9e6b5e" },
];

interface MoodSelectorProps {
  value: number | null;
  onChange?: (mood: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}

export function MoodSelector({
  value,
  onChange,
  readonly,
  size = "md",
}: MoodSelectorProps) {
  return (
    <div className="flex gap-1 flex-wrap justify-start">
      {MOODS.map((mood) => {
        const isSelected = value === mood.id;

        return (
          <motion.button
            key={mood.id}
            type="button"
            onClick={() => !readonly && onChange?.(mood.id)}
            whileTap={!readonly ? { scale: 0.92 } : {}}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl transition-all duration-200",
              size === "sm" ? "px-2 py-1.5" : "px-3 py-2.5",
              readonly ? "cursor-default" : "cursor-pointer",
              isSelected
                ? "border-2"
                : "border-2 border-transparent bg-transparent hover:bg-[#faf8f5]"
            )}
            style={
              isSelected
                ? {
                    borderColor: mood.color,
                    backgroundColor: `${mood.color}12`,
                  }
                : {}
            }
          >
            <span className={size === "sm" ? "text-lg" : "text-2xl"}>
              {mood.emoji}
            </span>
            <span
              className={cn(
                "font-medium leading-none",
                size === "sm" ? "text-[10px]" : "text-xs",
                isSelected ? "text-[#3d3a35]" : "text-[#b5ad9e]"
              )}
            >
              {mood.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export { MOODS };
