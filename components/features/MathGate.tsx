"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateMathProblem } from "@/lib/utils";
import { MINDFULNESS_QUOTES_FOR_GATE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface MathGateProps {
  appName: string;
  unlockCount: number;
  onAccept: () => void;
  onExtend: (appName: string) => Promise<void>;
  onClose: () => void;
}

export function MathGate({
  appName,
  unlockCount,
  onAccept,
  onExtend,
  onClose,
}: MathGateProps) {
  const [mode, setMode] = useState<"gate" | "math">("gate");
  const [problem, setProblem] = useState(generateMathProblem(unlockCount));
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [solving, setSolving] = useState(false);
  const [success, setSuccess] = useState(false);

  const quote =
    MINDFULNESS_QUOTES_FOR_GATE[
      unlockCount % MINDFULNESS_QUOTES_FOR_GATE.length
    ];

  const handleSolve = async () => {
    const userAnswer = parseFloat(answer.trim());
    if (isNaN(userAnswer)) {
      setError("Please enter a number");
      return;
    }
    if (Math.abs(userAnswer - problem.answer) < 0.01) {
      setSolving(true);
      try {
        await onExtend(appName);
        setSuccess(true);
        setTimeout(() => onClose(), 1500);
      } catch {
        setError("Something went wrong. Try again.");
      } finally {
        setSolving(false);
      }
    } else {
      setError("Not quite. Try again.");
      setProblem(generateMathProblem(unlockCount));
      setAnswer("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/95 px-6"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-sm bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="w-8 h-8" />
          <div className="text-center">
            <p className="text-xs text-white/30 uppercase tracking-widest">
              Time&apos;s Up
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "gate" && !success && (
            <motion.div
              key="gate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 pb-8 text-center"
            >
              <p className="font-serif text-2xl text-white/90 mb-2">
                Your time with {appName} is up
              </p>
              <p className="text-sm text-white/40 mb-6">
                Taking a break helps your mind reset
              </p>

              {unlockCount >= 5 && (
                <p className="text-xs text-[#d4a954]/70 mb-4 italic">
                  You&apos;ve extended {unlockCount} times today. Perhaps a
                  real break?
                </p>
              )}

              <blockquote className="text-sm text-white/30 italic mb-8 leading-relaxed px-4">
                &ldquo;{quote}&rdquo;
              </blockquote>

              <div className="flex flex-col gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={onAccept}
                  className="bg-white/10 text-white/80 border-white/10 hover:bg-white/15"
                >
                  Accept & Return to AXUNE
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => setMode("math")}
                  className="text-white/40 hover:text-white/60 hover:bg-white/5 text-sm"
                >
                  Solve math to add 5 more minutes →
                </Button>
              </div>
            </motion.div>
          )}

          {mode === "math" && !success && (
            <motion.div
              key="math"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-6 pb-8 text-center"
            >
              <p className="text-sm text-white/40 mb-6">
                Solve to earn 5 more minutes
              </p>
              <div className="bg-white/5 rounded-xl p-5 mb-6">
                <p className="font-serif text-3xl text-white/90 mb-1">
                  {problem.question}
                </p>
                <p className="text-xs text-white/25">= ?</p>
              </div>

              <input
                type="number"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSolve()}
                placeholder="Your answer"
                className="w-full px-4 py-3 bg-white/8 border border-white/10 rounded-xl text-white text-center text-lg outline-none focus:border-white/25 placeholder:text-white/20 mb-2 bg-[#ffffff10]"
                autoFocus
              />

              {error && (
                <p className="text-xs text-[#9e6b5e] mb-3">{error}</p>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMode("gate");
                    setError("");
                  }}
                  className="text-white/40 hover:text-white/60 hover:bg-white/5"
                >
                  Back
                </Button>
                <Button
                  fullWidth
                  onClick={handleSolve}
                  loading={solving}
                  className="bg-[#7c9a6e] hover:bg-[#6b8a5e] text-white border-none"
                >
                  Submit Answer
                </Button>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6 pb-8 text-center"
            >
              <p className="text-4xl mb-3">✓</p>
              <p className="font-serif text-xl text-white/80 mb-2">
                +5 minutes unlocked
              </p>
              <p className="text-sm text-white/30">Use them mindfully</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
