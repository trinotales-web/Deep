"use client";

import { useState } from "react";
import {
  Lock,
  CheckCircle2,
  Circle,
  ChevronRight,
  Flame,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { growthPhases } from "@/lib/data";
import type { GrowthTask } from "@/lib/types";

export default function JourneyPage() {
  const [phases, setPhases] = useState(growthPhases);
  const [expandedPhase, setExpandedPhase] = useState<number>(1);

  const totalXP = phases
    .flatMap((p) => p.lessons)
    .filter((l) => l.completed)
    .reduce((sum, l) => sum + l.xp, 0);

  const completedCount = phases
    .flatMap((p) => p.lessons)
    .filter((l) => l.completed).length;

  const totalCount = phases.flatMap((p) => p.lessons).length;

  function toggleTask(phaseId: number, taskId: string) {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          lessons: phase.lessons.map((lesson) =>
            lesson.id === taskId
              ? { ...lesson, completed: !lesson.completed }
              : lesson
          ),
        };
      })
    );
  }

  return (
    <div className="min-h-screen px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Growth Journey</h1>
        <p className="text-xs text-muted">Your structured path from idea to revenue</p>
      </div>

      {/* Stats bar */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center rounded-xl border border-card-border bg-card-bg p-3">
          <Flame size={20} className="mb-1 text-warning" />
          <span className="text-lg font-bold">{completedCount}</span>
          <span className="text-[10px] text-muted">Tasks Done</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-card-border bg-card-bg p-3">
          <Star size={20} className="mb-1 text-accent" />
          <span className="text-lg font-bold">{totalXP}</span>
          <span className="text-[10px] text-muted">XP Earned</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-card-border bg-card-bg p-3">
          <Trophy size={20} className="mb-1 text-success" />
          <span className="text-lg font-bold">{Math.round((completedCount / totalCount) * 100)}%</span>
          <span className="text-[10px] text-muted">Complete</span>
        </div>
      </div>

      {/* Overall progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted">Overall Progress</span>
          <span className="font-medium">{completedCount}/{totalCount} tasks</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-card-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-success transition-all duration-500"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4 pb-24">
        {phases.map((phase) => (
          <div key={phase.id} className="rounded-xl border border-card-border bg-card-bg overflow-hidden">
            {/* Phase header */}
            <button
              onClick={() => setExpandedPhase(expandedPhase === phase.id ? 0 : phase.id)}
              className="flex w-full items-center gap-3 p-4"
              disabled={!phase.unlocked}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  phase.unlocked ? "bg-accent/20" : "bg-card-border"
                }`}
              >
                {phase.unlocked ? (
                  <span className="text-sm font-bold text-accent">{phase.id}</span>
                ) : (
                  <Lock size={16} className="text-muted" />
                )}
              </div>
              <div className="flex-1 text-left">
                <h3 className={`text-sm font-bold ${!phase.unlocked && "text-muted"}`}>
                  Phase {phase.id}: {phase.title}
                </h3>
                <p className="text-xs text-muted">{phase.subtitle}</p>
              </div>
              <ChevronRight
                size={16}
                className={`text-muted transition-transform ${
                  expandedPhase === phase.id && "rotate-90"
                }`}
              />
            </button>

            {/* Phase lessons */}
            {expandedPhase === phase.id && phase.unlocked && (
              <div className="border-t border-card-border px-4 pb-4">
                {phase.lessons.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(phase.id, task.id)}
                    className="flex w-full items-start gap-3 py-3 border-b border-card-border/50 last:border-0"
                  >
                    <div className="mt-0.5">
                      {task.completed ? (
                        <CheckCircle2 size={20} className="text-success" />
                      ) : (
                        <Circle size={20} className="text-muted" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className={`text-sm font-medium ${
                          task.completed && "text-muted line-through"
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                      <Zap size={10} /> +{task.xp} XP
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
