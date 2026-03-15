"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface FreeVoidProps {
  onBack: () => void;
}

export function FreeVoid({ onBack }: FreeVoidProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    if (m === 0) return `${sec}s`;
    return `${m}m ${sec.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 relative z-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="text-center"
      >
        <p className="font-serif italic text-2xl text-white/30 mb-2">
          Free Void
        </p>
        <p className="text-white/15 text-sm">Simply be</p>
      </motion.div>

      <motion.p
        key={Math.floor(seconds / 10)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-serif text-4xl text-white/20 tabular-nums"
      >
        {formatTime(seconds)}
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        onClick={onBack}
        className="text-white/10 hover:text-white/25 text-xs transition-colors mt-12"
      >
        return
      </motion.button>
    </div>
  );
}
