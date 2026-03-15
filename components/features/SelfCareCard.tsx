"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelfCareCardProps {
  activity: string;
  completed: boolean;
  onToggle: () => void;
  index?: number;
}

export function SelfCareCard({
  activity,
  completed,
  onToggle,
  index = 0,
}: SelfCareCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onToggle}
      className={cn(
        "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200",
        completed
          ? "bg-[#f6f3ee] border-[#ede9e2]"
          : "bg-white border-[#ede9e2] hover:border-[#a4be7b] hover:bg-[#faf8f5]"
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
          completed
            ? "bg-[#7c9a6e] border-[#7c9a6e]"
            : "border-[#e0dbd3]"
        )}
      >
        {completed && <Check size={10} className="text-white" strokeWidth={3} />}
      </div>
      <span
        className={cn(
          "text-sm leading-snug transition-all duration-200",
          completed ? "text-[#b5ad9e] line-through" : "text-[#3d3a35]"
        )}
      >
        {activity}
      </span>
    </motion.div>
  );
}
