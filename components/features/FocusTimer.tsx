"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const DURATION_OPTIONS = [15, 25, 30, 45];

interface FocusTimerProps {
  onSessionComplete?: (duration: number, type: "focus" | "break") => void;
}

export function FocusTimer({ onSessionComplete }: FocusTimerProps) {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const breakDuration = 5;

  const totalSeconds = phase === "focus" ? duration * 60 : breakDuration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 82;
  const strokeDash = circumference - (progress / 100) * circumference;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleComplete = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    onSessionComplete?.(
      phase === "focus" ? duration : breakDuration,
      phase
    );
    if (phase === "focus") {
      setSessions((s) => s + 1);
      setPhase("break");
      setTimeLeft(breakDuration * 60);
    } else {
      setPhase("focus");
      setTimeLeft(duration * 60);
    }
  }, [phase, duration, onSessionComplete]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            handleComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, handleComplete]);

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setPhase("focus");
  };

  const changeDuration = (d: number) => {
    if (!isRunning) {
      setDuration(d);
      setTimeLeft(d * 60);
      setPhase("focus");
    }
  };

  const ringColor =
    phase === "focus" ? "#7c9a6e" : "#8b7bb5";

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Phase indicator */}
      <div className="flex gap-2">
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-all",
            phase === "focus"
              ? "bg-[#7c9a6e]/15 text-[#7c9a6e]"
              : "bg-[#8b7bb5]/15 text-[#8b7bb5]"
          )}
        >
          {phase === "focus" ? "Focus" : "Break"}
        </span>
        {sessions > 0 && (
          <span className="px-3 py-1 rounded-full text-xs bg-[#d4a954]/15 text-[#d4a954]">
            {sessions} sessions
          </span>
        )}
      </div>

      {/* Circular timer */}
      <div className="relative w-[200px] h-[200px]">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 184 184"
        >
          <circle
            cx="92"
            cy="92"
            r="82"
            fill="none"
            stroke="#ede9e2"
            strokeWidth="6"
          />
          <motion.circle
            cx="92"
            cy="92"
            r="82"
            fill="none"
            stroke={ringColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p
            key={timeLeft}
            className="font-serif text-4xl text-[#3d3a35] tabular-nums"
          >
            {formatTime(timeLeft)}
          </motion.p>
          <p className="text-xs text-[#8a8578] mt-1">
            {phase === "focus" ? "stay present" : "breathe"}
          </p>
        </div>
      </div>

      {/* Duration selector */}
      <div className="flex gap-2">
        {DURATION_OPTIONS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => changeDuration(d)}
            disabled={isRunning}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              duration === d && phase === "focus"
                ? "bg-[#3d3a35] text-white"
                : "bg-[#faf8f5] text-[#8a8578] hover:bg-[#f0ede7] disabled:opacity-40"
            )}
          >
            {d}m
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="w-10 h-10 rounded-full bg-[#faf8f5] flex items-center justify-center text-[#8a8578] hover:bg-[#f0ede7] transition-colors"
        >
          <RotateCcw size={16} />
        </button>
        <motion.button
          type="button"
          onClick={() => setIsRunning((r) => !r)}
          whileTap={{ scale: 0.93 }}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center text-white transition-all",
            phase === "focus" ? "bg-[#7c9a6e] hover:bg-[#6b8a5e]" : "bg-[#8b7bb5] hover:bg-[#7b6ba5]"
          )}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </motion.button>
        <div className="w-10 h-10" />
      </div>
    </div>
  );
}
