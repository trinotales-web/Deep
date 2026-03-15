"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DURATIONS = [2, 5, 10, 15, 20];

interface TimedSilenceProps {
  onBack: () => void;
}

export function TimedSilence({ onBack }: TimedSilenceProps) {
  const [duration, setDuration] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          setComplete(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, timeLeft]);

  const start = (mins: number) => {
    setDuration(mins);
    setTimeLeft(mins * 60);
    setRunning(true);
    setComplete(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-10 relative z-10">
      <AnimatePresence mode="wait">
        {!duration && !complete && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div>
              <p className="font-serif text-2xl text-white/60 mb-2">
                Timed Silence
              </p>
              <p className="text-white/25 text-sm">
                How long do you wish to be still?
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {DURATIONS.map((d) => (
                <motion.button
                  key={d}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => start(d)}
                  className="px-5 py-3 rounded-full border border-white/10 text-white/50 hover:text-white/70 hover:border-white/20 transition-all text-sm"
                >
                  {d} min
                </motion.button>
              ))}
            </div>
            <button
              onClick={onBack}
              className="text-white/20 hover:text-white/40 text-sm transition-colors mt-4"
            >
              ← Back
            </button>
          </motion.div>
        )}

        {running && !complete && (
          <motion.div
            key="timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <p className="text-white/15 text-xs uppercase tracking-widest">
              {duration} minutes of silence
            </p>
            <motion.p
              key={timeLeft}
              className="font-serif text-6xl text-white/50 tabular-nums"
            >
              {formatTime(timeLeft)}
            </motion.p>
            <p className="text-white/15 text-sm italic">
              You are here
            </p>
            <button
              onClick={() => {
                setRunning(false);
                setDuration(null);
              }}
              className="text-white/15 hover:text-white/30 text-xs mt-8 transition-colors"
            >
              end session
            </button>
          </motion.div>
        )}

        {complete && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <p className="font-serif text-3xl text-white/60">
              Silence complete
            </p>
            <p className="text-white/25 text-sm italic">
              {duration} minutes of pure presence
            </p>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setDuration(null);
                  setComplete(false);
                }}
                className="px-5 py-2.5 rounded-full border border-white/10 text-white/40 hover:text-white/60 transition-all text-sm"
              >
                Again
              </button>
              <button
                onClick={onBack}
                className="text-white/25 hover:text-white/45 transition-colors text-sm px-5 py-2.5"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
