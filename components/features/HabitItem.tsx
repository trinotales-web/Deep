"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface HabitItemProps {
  habit: {
    id: string;
    name: string;
    icon?: string | null;
    color?: string | null;
  };
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export function HabitItem({
  habit,
  completed,
  onToggle,
  onDelete,
  showDelete,
}: HabitItemProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const color = habit.color ?? "#7c9a6e";

  const handleToggle = () => {
    setIsAnimating(true);
    onToggle(habit.id);
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 py-3 px-1 group"
    >
      {/* Checkbox */}
      <motion.button
        type="button"
        onClick={handleToggle}
        whileTap={{ scale: 0.85 }}
        className={cn(
          "w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300",
          completed
            ? "border-transparent"
            : "border-[#e0dbd3] hover:border-[#a4be7b]"
        )}
        style={completed ? { backgroundColor: color, borderColor: color } : {}}
        animate={
          completed
            ? { scale: [1, 1.25, 1], backgroundColor: color }
            : { scale: 1, backgroundColor: "transparent" }
        }
        transition={{ duration: 0.35 }}
      >
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check size={13} className="text-white" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Habit name */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {habit.icon && <span className="text-lg leading-none">{habit.icon}</span>}
        <span
          className={cn(
            "text-sm font-medium transition-all duration-300 truncate",
            completed ? "text-[#b5ad9e] line-through" : "text-[#3d3a35]"
          )}
        >
          {habit.name}
        </span>
      </div>

      {/* Delete button */}
      {showDelete && onDelete && (
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center text-[#c5bfb4] hover:text-[#9e6b5e] rounded-lg hover:bg-[#faf8f5] transition-all shrink-0"
          onClick={() => onDelete(habit.id)}
          type="button"
        >
          <Trash2 size={14} />
        </motion.button>
      )}
    </motion.div>
  );
}
