"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { VoidParticles } from "@/components/void/VoidParticles";
import { BreathingGuide } from "@/components/void/BreathingGuide";
import { TimedSilence } from "@/components/void/TimedSilence";
import { FreeVoid } from "@/components/void/FreeVoid";
import { BREATHING_PATTERNS } from "@/lib/constants";
import Link from "next/link";

type Mode = "select" | "breathing-select" | "breathing" | "silence" | "free";

export default function VoidPage() {
  const [mode, setMode] = useState<Mode>("select");
  const [breathingPattern, setBreathingPattern] = useState<string>("balance");

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col">
      <VoidParticles count={25} />

      {/* Close button */}
      <div className="absolute top-safe top-5 right-5 z-20">
        <Link href="/dashboard">
          <button className="w-10 h-10 flex items-center justify-center text-white/30 hover:text-white/50 transition-colors rounded-full hover:bg-white/5">
            <X size={20} />
          </button>
        </Link>
      </div>

      {/* Logo */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
        <p className="font-serif text-white/20 text-sm tracking-widest">
          AXUNE
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-6">
        <AnimatePresence mode="wait">
          {mode === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm text-center"
            >
              <h1 className="font-serif italic text-3xl text-white/50 mb-2">
                The Void
              </h1>
              <p className="text-white/20 text-sm mb-12">
                A space of pure stillness
              </p>

              <div className="flex flex-col gap-4">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setMode("breathing-select")}
                  className="w-full py-4 rounded-2xl border border-white/8 text-white/50 hover:text-white/70 hover:border-white/15 transition-all"
                >
                  <p className="font-serif text-lg mb-1">Guided Breathing</p>
                  <p className="text-xs text-white/25">
                    Choose a breathing pattern
                  </p>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setMode("silence")}
                  className="w-full py-4 rounded-2xl border border-white/8 text-white/50 hover:text-white/70 hover:border-white/15 transition-all"
                >
                  <p className="font-serif text-lg mb-1">Timed Silence</p>
                  <p className="text-xs text-white/25">
                    Set a duration and simply be
                  </p>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setMode("free")}
                  className="w-full py-4 rounded-2xl border border-white/8 text-white/50 hover:text-white/70 hover:border-white/15 transition-all"
                >
                  <p className="font-serif text-lg mb-1">Free Void</p>
                  <p className="text-xs text-white/25">
                    Open-ended stillness
                  </p>
                </motion.button>
              </div>
            </motion.div>
          )}

          {mode === "breathing-select" && (
            <motion.div
              key="breathing-select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm"
            >
              <p className="font-serif text-xl text-white/40 text-center mb-8">
                Choose a practice
              </p>
              <div className="flex flex-col gap-3">
                {BREATHING_PATTERNS.map((pattern) => (
                  <motion.button
                    key={pattern.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBreathingPattern(pattern.id);
                      setMode("breathing");
                    }}
                    className="w-full p-4 rounded-2xl border border-white/8 text-left hover:border-white/15 transition-all"
                  >
                    <p className="text-white/60 font-medium mb-0.5">
                      {pattern.name}
                    </p>
                    <p className="text-white/25 text-sm">
                      {pattern.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full">
                        {pattern.inhale}s in
                      </span>
                      {pattern.hold > 0 && (
                        <span className="text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full">
                          {pattern.hold}s hold
                        </span>
                      )}
                      <span className="text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full">
                        {pattern.exhale}s out
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setMode("select")}
                className="w-full mt-4 text-white/20 hover:text-white/40 text-sm transition-colors py-2"
              >
                ← Back
              </button>
            </motion.div>
          )}

          {mode === "breathing" && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm h-full"
            >
              <BreathingGuide
                patternId={breathingPattern}
                onBack={() => setMode("breathing-select")}
              />
            </motion.div>
          )}

          {mode === "silence" && (
            <motion.div
              key="silence"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm h-full"
            >
              <TimedSilence onBack={() => setMode("select")} />
            </motion.div>
          )}

          {mode === "free" && (
            <motion.div
              key="free"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <FreeVoid onBack={() => setMode("select")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
