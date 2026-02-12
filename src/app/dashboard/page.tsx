"use client";

import {
  Flame,
  Star,
  Trophy,
  Award,
  TrendingUp,
  Target,
  Users,
  BarChart3,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { defaultMetrics } from "@/lib/data";
import ScoreRing from "@/components/ScoreRing";

export default function DashboardPage() {
  const metrics = defaultMetrics;

  const scoreItems = [
    { label: "Validation", value: metrics.validationStrength, color: "#6c5ce7" },
    { label: "Revenue Ready", value: metrics.revenueReadiness, color: "#00d2d3" },
    { label: "Market Fit", value: metrics.marketFitIndex, color: "#a29bfe" },
    { label: "Execution", value: metrics.executionConsistency, color: "#feca57" },
    { label: "Scale", value: metrics.scalePotential, color: "#ff6b6b" },
  ];

  const recentActivity = [
    { action: "Completed Skill Audit task", time: "2 hours ago", xp: 50 },
    { action: "Saved 'AI Resume Optimizer'", time: "4 hours ago", xp: 10 },
    { action: "Completed Problem Discovery", time: "Yesterday", xp: 75 },
    { action: "Earned Week One Streak badge", time: "Yesterday", xp: 100 },
    { action: "Saved 'Creator Analytics Dashboard'", time: "2 days ago", xp: 10 },
  ];

  return (
    <div className="min-h-screen px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-xs text-muted">Your founder metrics at a glance</p>
      </div>

      <div className="mx-auto max-w-lg space-y-4 pb-24">
        {/* Streak & XP Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-card-border bg-card-bg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={20} className="text-warning" />
              <span className="text-xs text-muted">Daily Streak</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{metrics.dailyStreak}</span>
              <span className="text-sm text-muted">days</span>
            </div>
          </div>
          <div className="rounded-xl border border-card-border bg-card-bg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star size={20} className="text-accent" />
              <span className="text-xs text-muted">Total XP</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{metrics.xpPoints.toLocaleString()}</span>
              <span className="text-sm text-muted">pts</span>
            </div>
          </div>
        </div>

        {/* Founder Score Rings */}
        <div className="rounded-xl border border-card-border bg-card-bg p-4">
          <h3 className="mb-4 text-sm font-bold flex items-center gap-2">
            <BarChart3 size={16} className="text-accent" />
            Founder Score
          </h3>
          <div className="flex items-center justify-around">
            {scoreItems.map((item) => (
              <ScoreRing
                key={item.label}
                score={item.value}
                size={64}
                strokeWidth={5}
                label={item.label}
                color={item.color}
              />
            ))}
          </div>
        </div>

        {/* Overall Score */}
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-center">
          <p className="text-xs text-muted mb-2">Overall Founder Readiness</p>
          <div className="flex items-center justify-center gap-3">
            <ScoreRing
              score={Math.round(
                (metrics.validationStrength +
                  metrics.revenueReadiness +
                  metrics.marketFitIndex +
                  metrics.executionConsistency +
                  metrics.scalePotential) /
                  5
              )}
              size={100}
              strokeWidth={8}
              color="#6c5ce7"
            />
            <div className="text-left">
              <p className="text-sm font-bold">Keep building!</p>
              <p className="text-xs text-muted">
                Complete more tasks to improve your scores
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-accent">
                <ArrowUpRight size={12} />
                <span>+12% this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="rounded-xl border border-card-border bg-card-bg p-4">
          <h3 className="mb-3 text-sm font-bold flex items-center gap-2">
            <Award size={16} className="text-warning" />
            Badges Earned
          </h3>
          <div className="flex flex-wrap gap-2">
            {metrics.badges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-1.5 rounded-full border border-warning/20 bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning"
              >
                <Trophy size={12} />
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-card-border bg-card-bg p-4">
          <h3 className="mb-3 text-sm font-bold flex items-center gap-2">
            <Zap size={16} className="text-accent" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-card-border/50 pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="text-xs font-medium">{item.action}</p>
                  <p className="text-[10px] text-muted">{item.time}</p>
                </div>
                <span className="text-xs font-bold text-accent">+{item.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly summary */}
        <div className="rounded-xl border border-card-border bg-card-bg p-4">
          <h3 className="mb-3 text-sm font-bold flex items-center gap-2">
            <TrendingUp size={16} className="text-success" />
            Weekly Performance
          </h3>
          <div className="grid grid-cols-7 gap-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
              const active = i < 5;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-8 w-full rounded-md ${
                      active
                        ? "bg-accent/30"
                        : "bg-card-border/50"
                    }`}
                    style={active ? { height: `${20 + Math.random() * 20}px` } : undefined}
                  />
                  <span className="text-[10px] text-muted">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
