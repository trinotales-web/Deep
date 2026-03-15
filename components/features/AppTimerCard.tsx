"use client";

import { motion } from "framer-motion";
import { cn, formatMinutes } from "@/lib/utils";

interface AppTimerCardProps {
  appName: string;
  emoji: string;
  color: string;
  dailyLimitMin: number;
  minutesUsed: number;
  isActive: boolean;
  onToggle?: () => void;
  onLimitChange?: (minutes: number) => void;
}

export function AppTimerCard({
  appName,
  emoji,
  color,
  dailyLimitMin,
  minutesUsed,
  isActive,
  onToggle,
  onLimitChange,
}: AppTimerCardProps) {
  const progress = Math.min(100, (minutesUsed / dailyLimitMin) * 100);
  const remaining = Math.max(0, dailyLimitMin - minutesUsed);
  const isOver = minutesUsed >= dailyLimitMin;

  const ringColor =
    progress < 50 ? "#7c9a6e" : progress < 80 ? "#d4a954" : "#9e6b5e";

  const circumference = 2 * Math.PI * 26;
  const strokeDash = circumference - (progress / 100) * circumference;

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border transition-all",
        isActive
          ? "bg-white border-[#ede9e2]"
          : "bg-[#faf8f5] border-[#ede9e2] opacity-60"
      )}
    >
      {/* App icon + ring */}
      <div className="relative w-14 h-14 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="26" fill="none" stroke="#ede9e2" strokeWidth="4" />
          <motion.circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke={isOver ? "#9e6b5e" : ringColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDash }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">{emoji}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-[#3d3a35] truncate">{appName}</span>
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "w-10 h-5 rounded-full transition-all shrink-0 ml-2",
              isActive ? "bg-[#7c9a6e]" : "bg-[#e0dbd3]"
            )}
          >
            <motion.div
              className="w-4 h-4 bg-white rounded-full shadow-sm mx-0.5"
              animate={{ x: isActive ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
        {isOver ? (
          <p className="text-xs font-medium text-[#9e6b5e]">TIME&apos;S UP</p>
        ) : (
          <p className="text-xs text-[#8a8578]">
            {formatMinutes(remaining)} remaining
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1 bg-[#ede9e2] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: isOver ? "#9e6b5e" : ringColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] text-[#b5ad9e] shrink-0">
            {minutesUsed}/{dailyLimitMin}m
          </span>
        </div>
      </div>
    </div>
  );
}
