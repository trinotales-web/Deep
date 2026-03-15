"use client";

import { motion } from "framer-motion";
import { cn, getMoodColor, getMoodEmoji } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface DayData {
  date: string;
  habitCompletion?: number; // 0-100
  mood?: number | null;
}

interface WeekCalendarProps {
  days: DayData[];
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}

export function WeekCalendar({
  days,
  selectedDate,
  onSelectDate,
}: WeekCalendarProps) {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="flex gap-2 justify-between">
      {days.map((day) => {
        const dayLabel = format(parseISO(day.date), "EEE");
        const dayNum = format(parseISO(day.date), "d");
        const isToday = day.date === today;
        const isSelected = day.date === selectedDate;
        const completionColor = day.habitCompletion
          ? day.habitCompletion >= 80
            ? "#7c9a6e"
            : day.habitCompletion >= 50
              ? "#d4a954"
              : "#e0dbd3"
          : "#e0dbd3";

        return (
          <motion.button
            key={day.date}
            type="button"
            onClick={() => onSelectDate?.(day.date)}
            whileTap={{ scale: 0.94 }}
            className={cn(
              "flex flex-col items-center gap-1.5 flex-1 py-2 px-1 rounded-xl transition-all duration-200",
              isSelected ? "bg-[#3d3a35]" : isToday ? "bg-[#f6f3ee]" : ""
            )}
          >
            {/* Day name */}
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-wide",
                isSelected ? "text-[#b5ad9e]" : "text-[#b5ad9e]"
              )}
            >
              {dayLabel}
            </span>

            {/* Day number */}
            <span
              className={cn(
                "text-sm font-medium",
                isSelected ? "text-white" : isToday ? "text-[#3d3a35]" : "text-[#5a5549]"
              )}
            >
              {dayNum}
            </span>

            {/* Habit completion dot */}
            {day.habitCompletion !== undefined ? (
              <div
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: completionColor }}
              />
            ) : (
              <div className="w-2 h-2 rounded-full bg-[#e0dbd3]" />
            )}

            {/* Mood dot */}
            {day.mood !== null && day.mood !== undefined ? (
              <span className="text-[11px] leading-none">
                {getMoodEmoji(day.mood)}
              </span>
            ) : (
              <div className="h-[14px]" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
