"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

interface GoalItemProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalItem({ goal, onToggle, onDelete }: GoalItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="flex items-center gap-3 py-2.5 group"
    >
      <motion.button
        type="button"
        onClick={() => onToggle(goal.id)}
        whileTap={{ scale: 0.85 }}
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-300",
          goal.completed
            ? "bg-[#d4a954] border-[#d4a954]"
            : "border-[#e0dbd3] hover:border-[#d4a954]"
        )}
      >
        <AnimatePresence>
          {goal.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check size={11} className="text-white" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <span
        className={cn(
          "flex-1 text-sm transition-all duration-200",
          goal.completed ? "line-through text-[#b5ad9e]" : "text-[#3d3a35]"
        )}
      >
        {goal.text}
      </span>

      <button
        type="button"
        onClick={() => onDelete(goal.id)}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-[#c5bfb4] hover:text-[#9e6b5e] rounded transition-all shrink-0"
      >
        <Trash2 size={13} />
      </button>
    </motion.div>
  );
}
