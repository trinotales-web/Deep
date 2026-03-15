"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";
import { getMoodEmoji, getMoodLabel } from "@/lib/utils";
import {
  BarChart2,
  TrendingUp,
  BedDouble,
  Droplets,
  Smartphone,
  Flame,
  Lightbulb,
} from "lucide-react";

// Dynamic imports to avoid SSR issues with Recharts
const MoodChart = dynamic(
  () => import("@/components/charts/MoodChart").then((m) => m.MoodChart),
  { ssr: false }
);
const HabitChart = dynamic(
  () => import("@/components/charts/HabitChart").then((m) => m.HabitChart),
  { ssr: false }
);
const SleepChart = dynamic(
  () => import("@/components/charts/SleepChart").then((m) => m.SleepChart),
  { ssr: false }
);
const WaterChart = dynamic(
  () => import("@/components/charts/WaterChart").then((m) => m.WaterChart),
  { ssr: false }
);
const ScreenTimeChart = dynamic(
  () =>
    import("@/components/charts/ScreenTimeChart").then(
      (m) => m.ScreenTimeChart
    ),
  { ssr: false }
);

type ChartTab = "mood" | "habits" | "sleep" | "water" | "screen";

const container = {
  animate: { transition: { staggerChildren: 0.07 } },
};
const item = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeChart, setActiveChart] = useState<ChartTab>("mood");

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setAnalytics(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tabs: { id: ChartTab; label: string; icon: any }[] = [
    { id: "mood", label: "Mood", icon: "🌸" },
    { id: "habits", label: "Habits", icon: "✅" },
    { id: "sleep", label: "Sleep", icon: "🌙" },
    { id: "water", label: "Water", icon: "💧" },
    { id: "screen", label: "Screen", icon: "📱" },
  ];

  return (
    <motion.div
      variants={container}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-5"
    >
      <PageHeader
        title="Analytics"
        subtitle="Understanding your patterns"
      />

      {/* Wellness Score */}
      {loading ? (
        <motion.div variants={item}>
          <CardSkeleton />
        </motion.div>
      ) : analytics ? (
        <motion.div variants={item}>
          <Card className="bg-[#3d3a35] border-transparent">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                  Wellness Score
                </p>
                <div className="flex items-end gap-2">
                  <p className="font-serif text-5xl text-white">
                    {analytics.wellnessScore ?? 0}
                  </p>
                  <p className="text-white/40 text-lg mb-1">/ 100</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/30 text-xs mb-1">This week</p>
                <p className="font-serif text-lg text-white/60">
                  {analytics.wellnessScore >= 80
                    ? "Flourishing"
                    : analytics.wellnessScore >= 60
                      ? "Thriving"
                      : analytics.wellnessScore >= 40
                        ? "Growing"
                        : "Nurturing"}
                </p>
              </div>
            </div>
            <ProgressBar
              value={analytics.wellnessScore ?? 0}
              color="#7c9a6e"
              height="h-2"
            />
          </Card>
        </motion.div>
      ) : null}

      {/* Weekly summary stats */}
      {!loading && analytics && (
        <motion.div variants={item}>
          <div className="grid grid-cols-2 gap-3">
            <Card compact>
              <div className="flex items-center gap-2 mb-1">
                <Flame size={14} className="text-[#d4a954]" />
                <span className="text-xs text-[#8a8578]">Habits</span>
              </div>
              <p className="font-serif text-2xl text-[#3d3a35]">
                {analytics.weeklyStats?.habitCompletion ?? 0}%
              </p>
              <p className="text-xs text-[#b5ad9e] mt-0.5">avg completion</p>
            </Card>

            <Card compact>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">
                  {analytics.weeklyStats?.avgMood !== null &&
                  analytics.weeklyStats?.avgMood !== undefined
                    ? getMoodEmoji(Math.round(analytics.weeklyStats.avgMood))
                    : "😐"}
                </span>
                <span className="text-xs text-[#8a8578]">Mood</span>
              </div>
              <p className="font-serif text-2xl text-[#3d3a35]">
                {analytics.weeklyStats?.avgMood !== null &&
                analytics.weeklyStats?.avgMood !== undefined
                  ? getMoodLabel(Math.round(analytics.weeklyStats.avgMood))
                  : "—"}
              </p>
              <p className="text-xs text-[#b5ad9e] mt-0.5">average</p>
            </Card>

            <Card compact>
              <div className="flex items-center gap-2 mb-1">
                <BedDouble size={14} className="text-[#8b7bb5]" />
                <span className="text-xs text-[#8a8578]">Sleep</span>
              </div>
              <p className="font-serif text-2xl text-[#3d3a35]">
                {analytics.weeklyStats?.avgSleep
                  ? analytics.weeklyStats.avgSleep.toFixed(1)
                  : "—"}
                <span className="text-base text-[#8a8578]">h</span>
              </p>
              <p className="text-xs text-[#b5ad9e] mt-0.5">per night</p>
            </Card>

            <Card compact>
              <div className="flex items-center gap-2 mb-1">
                <Droplets size={14} className="text-[#6b9bc3]" />
                <span className="text-xs text-[#8a8578]">Water</span>
              </div>
              <p className="font-serif text-2xl text-[#3d3a35]">
                {analytics.weeklyStats?.avgWater
                  ? analytics.weeklyStats.avgWater.toFixed(1)
                  : "—"}
                <span className="text-base text-[#8a8578]"> g</span>
              </p>
              <p className="text-xs text-[#b5ad9e] mt-0.5">glasses avg</p>
            </Card>

            <Card compact>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-[#7c9a6e]" />
                <span className="text-xs text-[#8a8578]">Focus</span>
              </div>
              <p className="font-serif text-2xl text-[#3d3a35]">
                {analytics.weeklyStats?.focusMinutes ?? 0}
                <span className="text-base text-[#8a8578]">m</span>
              </p>
              <p className="text-xs text-[#b5ad9e] mt-0.5">this week</p>
            </Card>

            <Card compact>
              <div className="flex items-center gap-2 mb-1">
                <Smartphone size={14} className="text-[#9e6b5e]" />
                <span className="text-xs text-[#8a8578]">Screen</span>
              </div>
              <p className="font-serif text-2xl text-[#3d3a35]">
                {analytics.weeklyStats?.screenMinutes
                  ? `${Math.floor(analytics.weeklyStats.screenMinutes / 60)}h`
                  : "—"}
              </p>
              <p className="text-xs text-[#b5ad9e] mt-0.5">this week</p>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Charts section */}
      <motion.div variants={item}>
        <Card>
          <h2 className="font-serif text-xl text-[#3d3a35] mb-4">
            30-day trends
          </h2>

          {/* Chart tabs */}
          <div className="flex gap-1.5 bg-[#faf8f5] p-1 rounded-xl mb-5 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeChart === tab.id
                    ? "bg-white text-[#3d3a35] shadow-sm"
                    : "text-[#8a8578] hover:text-[#5a5549]"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Chart content */}
          {loading ? (
            <Skeleton className="h-36 w-full" />
          ) : analytics ? (
            <div>
              {activeChart === "mood" && (
                <div>
                  <p className="text-xs text-[#8a8578] mb-3">
                    Mood over last 30 days
                  </p>
                  <MoodChart data={analytics.moodData || []} />
                </div>
              )}
              {activeChart === "habits" && (
                <div>
                  <p className="text-xs text-[#8a8578] mb-3">
                    Daily habit completion %
                  </p>
                  <HabitChart data={analytics.habitData || []} />
                </div>
              )}
              {activeChart === "sleep" && (
                <div>
                  <p className="text-xs text-[#8a8578] mb-3">
                    Sleep hours per night (dashed line = 8h goal)
                  </p>
                  <SleepChart data={analytics.sleepData || []} />
                </div>
              )}
              {activeChart === "water" && (
                <div>
                  <p className="text-xs text-[#8a8578] mb-3">
                    Daily glasses (dashed line = 8 glass goal)
                  </p>
                  <WaterChart data={analytics.waterData || []} />
                </div>
              )}
              {activeChart === "screen" && (
                <div>
                  <p className="text-xs text-[#8a8578] mb-3">
                    Daily screen time (minutes)
                  </p>
                  <ScreenTimeChart data={analytics.screenTimeData || []} />
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#8a8578] text-center py-8">
              No data yet — start logging to see your trends
            </p>
          )}
        </Card>
      </motion.div>

      {/* Insights */}
      {!loading && analytics?.insights && analytics.insights.length > 0 && (
        <motion.div variants={item}>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={16} className="text-[#d4a954]" />
              <h2 className="font-serif text-xl text-[#3d3a35]">Insights</h2>
            </div>
            <div className="flex flex-col gap-3">
              {analytics.insights.map((insight: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-3 bg-[#faf8f5] rounded-xl"
                >
                  <span className="text-[#d4a954] mt-0.5 shrink-0">✦</span>
                  <p className="text-sm text-[#5a5549] leading-relaxed">
                    {insight}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && !analytics && (
        <Card className="text-center py-12">
          <BarChart2 size={32} className="text-[#c5bfb4] mx-auto mb-3" />
          <p className="font-serif text-lg text-[#8a8578] mb-2">
            Your story is just beginning
          </p>
          <p className="text-sm text-[#b5ad9e]">
            Log your habits, mood, and wellness to unlock insights
          </p>
        </Card>
      )}
    </motion.div>
  );
}
