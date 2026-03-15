"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BREATHING_PATTERNS } from "@/lib/constants";

type Phase = "inhale" | "hold" | "exhale" | "holdOut";

interface BreathingGuideProps {
  patternId: string;
  onBack: () => void;
}

export function BreathingGuide({ patternId, onBack }: BreathingGuideProps) {
  const pattern = BREATHING_PATTERNS.find((p) => p.id === patternId)!;
  const [phase, setPhase] = useState<Phase>("inhale");
  const [timeLeft, setTimeLeft] = useState(pattern.inhale);
  const [cycles, setCycles] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const phaseLabels: Record<Phase, string> = {
    inhale: "Breathe in",
    hold: "Hold",
    exhale: "Release",
    holdOut: "Hold empty",
  };

  const nextPhase = useCallback(() => {
    setPhase((current) => {
      if (current === "inhale") {
        if (pattern.hold > 0) {
          setTimeLeft(pattern.hold);
          return "hold";
        } else {
          setTimeLeft(pattern.exhale);
          return "exhale";
        }
      }
      if (current === "hold") {
        setTimeLeft(pattern.exhale);
        return "exhale";
      }
      if (current === "exhale") {
        if (pattern.holdOut > 0) {
          setTimeLeft(pattern.holdOut);
          return "holdOut";
        } else {
          setCycles((c) => c + 1);
          setTimeLeft(pattern.inhale);
          return "inhale";
        }
      }
      if (current === "holdOut") {
        setCycles((c) => c + 1);
        setTimeLeft(pattern.inhale);
        return "inhale";
      }
      return current;
    });
  }, [pattern]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          nextPhase();
          return t;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, nextPhase]);

  const orbScale = {
    inhale: 1.3,
    hold: 1.3,
    exhale: 0.75,
    holdOut: 0.75,
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 relative z-10">
      {/* Pattern name */}
      <div className="text-center">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-1">
          {pattern.name}
        </p>
        <p className="text-white/20 text-sm">{pattern.description}</p>
      </div>

      {/* Breathing orb */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow rings */}
        <motion.div
          className="absolute rounded-full border border-white/5"
          animate={{
            scale: isRunning ? [1, orbScale[phase]] : 1,
            opacity: isRunning ? 0.3 : 0,
          }}
          transition={{
            duration:
              phase === "inhale"
                ? pattern.inhale
                : phase === "exhale"
                  ? pattern.exhale
                  : phase === "hold"
                    ? pattern.hold
                    : pattern.holdOut,
            ease: "easeInOut",
          }}
          style={{ width: 200, height: 200 }}
        />
        <motion.div
          className="absolute rounded-full bg-white/3 backdrop-blur-sm border border-white/8"
          animate={{
            scale: isRunning ? orbScale[phase] : 1,
          }}
          transition={{
            duration:
              phase === "inhale"
                ? pattern.inhale
                : phase === "exhale"
                  ? pattern.exhale
                  : phase === "hold"
                    ? pattern.hold
                    : pattern.holdOut,
            ease: "easeInOut",
          }}
          style={{ width: 140, height: 140 }}
        />
        {/* Core */}
        <motion.div
          className="relative w-24 h-24 rounded-full flex flex-col items-center justify-center"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-center"
            >
              <p className="text-white/70 text-xs">{phaseLabels[phase]}</p>
              {isRunning && (
                <p className="text-white/40 text-2xl font-serif">{timeLeft}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cycle count */}
      {cycles > 0 && (
        <p className="text-white/20 text-xs">{cycles} cycles</p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 text-white/30 hover:text-white/50 text-sm transition-colors"
        >
          ← Back
        </button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            setIsRunning((r) => !r);
            if (!isRunning) {
              setPhase("inhale");
              setTimeLeft(pattern.inhale);
            }
          }}
          className="px-6 py-3 rounded-full border border-white/15 text-white/60 hover:text-white/80 hover:border-white/25 transition-all text-sm"
        >
          {isRunning ? "Pause" : "Begin"}
        </motion.button>
      </div>
    </div>
  );
}
