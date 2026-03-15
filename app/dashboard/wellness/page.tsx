"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DotScale } from "@/components/ui/DotScale";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PageHeader } from "@/components/layout/PageHeader";
import { FocusTimer } from "@/components/features/FocusTimer";
import { SelfCareCard } from "@/components/features/SelfCareCard";
import { MoodChart } from "@/components/charts/MoodChart";
import { SleepChart } from "@/components/charts/SleepChart";
import { WaterChart } from "@/components/charts/WaterChart";
import { today, getLast7Days, formatShortDate } from "@/lib/utils";
import {
  MORNING_RITUALS,
  EVENING_RITUALS,
  SELF_CARE_SUGGESTIONS,
} from "@/lib/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "overview" | "sleep" | "body" | "focus" | "rituals";

interface SleepEntry {
  date: string;
  hours: number | null;
  quality?: number | null;
  restedness?: number | null;
  bedtime?: string | null;
  wakeTime?: string | null;
}

interface MoodEntry {
  date: string;
  mood: number | null;
}

interface WaterEntry {
  date: string;
  glasses: number;
}

interface EnergyEntry {
  energy?: number | null;
  stress?: number | null;
  calm?: number | null;
  physical?: number | null;
}

interface RoutineEntry {
  name: string;
  completed: boolean;
}

interface FocusStats {
  sessions: number;
  totalMinutes: number;
}

// ─── Body Kindness Quotes ────────────────────────────────────────────────────

const BODY_QUOTES = [
  { text: "Your body is doing its best, always.", author: "Unknown" },
  {
    text: "Rest is not laziness — it is medicine.",
    author: "Unknown",
  },
  {
    text: "Listen to your body. It speaks in whispers before it screams.",
    author: "Unknown",
  },
  {
    text: "You are allowed to take up space and move slowly.",
    author: "Unknown",
  },
  {
    text: "Gentleness is a form of strength.",
    author: "Unknown",
  },
];

function getDailyBodyQuote() {
  const day = Math.floor(Date.now() / 86400000);
  return BODY_QUOTES[day % BODY_QUOTES.length];
}

// ─── Tab Nav ─────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "sleep", label: "Sleep" },
  { id: "body", label: "Body" },
  { id: "focus", label: "Focus" },
  { id: "rituals", label: "Rituals" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WellnessPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Overview data
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [sleepWeekData, setSleepWeekData] = useState<SleepEntry[]>([]);
  const [waterWeekData, setWaterWeekData] = useState<WaterEntry[]>([]);
  const [selfCareStates, setSelfCareStates] = useState<boolean[]>(
    Array(3).fill(false)
  );

  // Sleep tab
  const [sleepHours, setSleepHours] = useState<number | null>(null);
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [restedness, setRestedness] = useState<number | null>(null);
  const [bedtime, setBedtime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepSaving, setSleepSaving] = useState(false);
  const [sleepSaved, setSleepSaved] = useState(false);

  // Body tab
  const [energy, setEnergy] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [calm, setCalm] = useState<number | null>(null);
  const [physical, setPhysical] = useState<number | null>(null);
  const bodyDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [bodySaved, setBodySaved] = useState(false);

  // Focus tab
  const [focusStats, setFocusStats] = useState<FocusStats>({
    sessions: 0,
    totalMinutes: 0,
  });

  // Rituals tab
  const [morningDone, setMorningDone] = useState<boolean[]>(
    Array(8).fill(false)
  );
  const [eveningDone, setEveningDone] = useState<boolean[]>(
    Array(8).fill(false)
  );

  const todayStr = today();

  // ─── Load all data on mount ─────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const days = getLast7Days();

        const [
          sleepRes,
          moodRes,
          waterRes,
          energyRes,
          morningRes,
          eveningRes,
          focusRes,
        ] = await Promise.allSettled([
          fetch(`/api/sleep?days=7`).then((r) => r.json()),
          fetch(`/api/mood?days=7`).then((r) => r.json()),
          fetch(`/api/water?days=7`).then((r) => r.json()),
          fetch(`/api/energy?date=${todayStr}`).then((r) => r.json()),
          fetch(`/api/routines?date=${todayStr}&type=morning`).then((r) =>
            r.json()
          ),
          fetch(`/api/routines?date=${todayStr}&type=evening`).then((r) =>
            r.json()
          ),
          fetch(`/api/focus?date=${todayStr}`).then((r) => r.json()),
        ]);

        // Sleep week
        if (sleepRes.status === "fulfilled") {
          const raw = sleepRes.value?.entries ?? [];
          setSleepWeekData(
            days.map((date) => {
              const found = raw.find((e: SleepEntry) => e.date === date);
              return { date, hours: found?.hours ?? null };
            })
          );
          // Pre-fill today's sleep form
          const todayEntry = raw.find((e: SleepEntry) => e.date === todayStr);
          if (todayEntry) {
            setSleepHours(todayEntry.hours ?? null);
            setSleepQuality(todayEntry.quality ?? null);
            setRestedness(todayEntry.restedness ?? null);
            setBedtime(todayEntry.bedtime ?? "");
            setWakeTime(todayEntry.wakeTime ?? "");
          }
        } else {
          setSleepWeekData(days.map((date) => ({ date, hours: null })));
        }

        // Mood week
        if (moodRes.status === "fulfilled") {
          const raw = moodRes.value?.entries ?? [];
          setMoodData(
            days.map((date) => {
              const found = raw.find((e: MoodEntry) => e.date === date);
              return { date, mood: found?.mood ?? null };
            })
          );
        } else {
          setMoodData(days.map((date) => ({ date, mood: null })));
        }

        // Water week
        if (waterRes.status === "fulfilled") {
          const raw = waterRes.value?.entries ?? [];
          setWaterWeekData(
            days.map((date) => {
              const found = raw.find((e: WaterEntry) => e.date === date);
              return { date, glasses: found?.glasses ?? 0 };
            })
          );
        } else {
          setWaterWeekData(days.map((date) => ({ date, glasses: 0 })));
        }

        // Energy / body check-in
        if (energyRes.status === "fulfilled") {
          const e = energyRes.value?.entry ?? null;
          if (e) {
            setEnergy(e.energy ?? null);
            setStress(e.stress ?? null);
            setCalm(e.calm ?? null);
            setPhysical(e.physical ?? null);
          }
        }

        // Morning rituals
        if (morningRes.status === "fulfilled") {
          const items: RoutineEntry[] = morningRes.value?.items ?? [];
          setMorningDone(
            MORNING_RITUALS.map((name) => {
              const found = items.find((i) => i.name === name);
              return found?.completed ?? false;
            })
          );
        }

        // Evening rituals
        if (eveningRes.status === "fulfilled") {
          const items: RoutineEntry[] = eveningRes.value?.items ?? [];
          setEveningDone(
            EVENING_RITUALS.map((name) => {
              const found = items.find((i) => i.name === name);
              return found?.completed ?? false;
            })
          );
        }

        // Focus stats
        if (focusRes.status === "fulfilled") {
          setFocusStats({
            sessions: focusRes.value?.sessions ?? 0,
            totalMinutes: focusRes.value?.totalMinutes ?? 0,
          });
        }
      } catch (err) {
        console.error("Wellness load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [todayStr]);

  // ─── Weekly averages ────────────────────────────────────────────────────

  const avgMood = (() => {
    const vals = moodData
      .map((d) => d.mood)
      .filter((v): v is number => v !== null);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—";
  })();

  const avgSleep = (() => {
    const vals = sleepWeekData
      .map((d) => d.hours)
      .filter((v): v is number => v !== null);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—";
  })();

  const avgWater = (() => {
    const vals = waterWeekData.map((d) => d.glasses).filter((v) => v > 0);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—";
  })();

  // ─── Sleep save ─────────────────────────────────────────────────────────

  const handleSaveSleep = async () => {
    if (sleepHours === null) return;
    setSleepSaving(true);
    try {
      await fetch("/api/sleep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayStr,
          hours: sleepHours,
          quality: sleepQuality,
          restedness,
          bedtime: bedtime || null,
          wakeTime: wakeTime || null,
        }),
      });
      setSleepSaved(true);
      setTimeout(() => setSleepSaved(false), 2500);
      // Update chart
      setSleepWeekData((prev) =>
        prev.map((d) =>
          d.date === todayStr ? { ...d, hours: sleepHours } : d
        )
      );
    } catch (err) {
      console.error("Sleep save error:", err);
    } finally {
      setSleepSaving(false);
    }
  };

  // ─── Body auto-save (debounced) ─────────────────────────────────────────

  const saveBody = useCallback(
    async (
      e: number | null,
      s: number | null,
      c: number | null,
      p: number | null
    ) => {
      try {
        await fetch("/api/energy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: todayStr,
            energy: e,
            stress: s,
            calm: c,
            physical: p,
          }),
        });
        setBodySaved(true);
        setTimeout(() => setBodySaved(false), 2000);
      } catch (err) {
        console.error("Body save error:", err);
      }
    },
    [todayStr]
  );

  const triggerBodySave = useCallback(
    (e: number | null, s: number | null, c: number | null, p: number | null) => {
      if (bodyDebounceRef.current) clearTimeout(bodyDebounceRef.current);
      bodyDebounceRef.current = setTimeout(() => saveBody(e, s, c, p), 800);
    },
    [saveBody]
  );

  const handleEnergyChange = (v: number) => {
    setEnergy(v);
    triggerBodySave(v, stress, calm, physical);
  };
  const handleStressChange = (v: number) => {
    setStress(v);
    triggerBodySave(energy, v, calm, physical);
  };
  const handleCalmChange = (v: number) => {
    setCalm(v);
    triggerBodySave(energy, stress, v, physical);
  };
  const handlePhysicalChange = (v: number) => {
    setPhysical(v);
    triggerBodySave(energy, stress, calm, v);
  };

  // ─── Focus session complete ─────────────────────────────────────────────

  const handleFocusComplete = useCallback(
    async (duration: number, type: "focus" | "break") => {
      if (type !== "focus") return;
      const newSessions = focusStats.sessions + 1;
      const newMinutes = focusStats.totalMinutes + duration;
      setFocusStats({ sessions: newSessions, totalMinutes: newMinutes });
      try {
        await fetch("/api/focus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: todayStr, duration }),
        });
      } catch (err) {
        console.error("Focus save error:", err);
      }
    },
    [focusStats, todayStr]
  );

  // ─── Ritual toggle ──────────────────────────────────────────────────────

  const handleRitualToggle = async (
    type: "morning" | "evening",
    index: number
  ) => {
    const name =
      type === "morning" ? MORNING_RITUALS[index] : EVENING_RITUALS[index];
    const currentArr = type === "morning" ? morningDone : eveningDone;
    const newVal = !currentArr[index];

    if (type === "morning") {
      setMorningDone((prev) => prev.map((v, i) => (i === index ? newVal : v)));
    } else {
      setEveningDone((prev) => prev.map((v, i) => (i === index ? newVal : v)));
    }

    try {
      await fetch("/api/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayStr,
          type,
          name,
          completed: newVal,
        }),
      });
    } catch (err) {
      console.error("Ritual save error:", err);
    }
  };

  const morningCount = morningDone.filter(Boolean).length;
  const eveningCount = eveningDone.filter(Boolean).length;

  const bodyQuote = getDailyBodyQuote();

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5"
    >
      <PageHeader
        title="Wellness"
        subtitle="Tend to yourself, gently"
      />

      {/* Tab Nav */}
      <div className="flex gap-1 p-1 bg-[#f6f3ee] rounded-xl border border-[#ede9e2] w-full overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              "flex-1 min-w-fit px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
              activeTab === tab.id
                ? "bg-white text-[#3d3a35] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                : "text-[#8a8578] hover:text-[#3d3a35]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── OVERVIEW ────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            {/* Weekly stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Avg Mood", value: avgMood, color: "#8b7bb5" },
                { label: "Avg Sleep", value: avgSleep ? `${avgSleep}h` : "—", color: "#6b9bc3" },
                { label: "Avg Water", value: avgWater ? `${avgWater}g` : "—", color: "#7c9a6e" },
              ].map((stat) => (
                <Card key={stat.label} compact>
                  <p
                    className="text-xl font-medium"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#8a8578] mt-0.5">{stat.label}</p>
                </Card>
              ))}
            </div>

            {/* Mood chart */}
            <Card>
              <h3 className="font-serif text-base text-[#3d3a35] mb-3">
                Mood this week
              </h3>
              {loading ? (
                <div className="h-40 bg-[#f6f3ee] rounded-lg animate-pulse" />
              ) : (
                <MoodChart data={moodData} />
              )}
            </Card>

            {/* Sleep chart */}
            <Card>
              <h3 className="font-serif text-base text-[#3d3a35] mb-3">
                Sleep hours
              </h3>
              {loading ? (
                <div className="h-36 bg-[#f6f3ee] rounded-lg animate-pulse" />
              ) : (
                <SleepChart data={sleepWeekData} />
              )}
            </Card>

            {/* Water chart */}
            <Card>
              <h3 className="font-serif text-base text-[#3d3a35] mb-3">
                Water intake
              </h3>
              {loading ? (
                <div className="h-36 bg-[#f6f3ee] rounded-lg animate-pulse" />
              ) : (
                <WaterChart data={waterWeekData} />
              )}
            </Card>

            {/* Self-care suggestions */}
            <Card>
              <h3 className="font-serif text-base text-[#3d3a35] mb-3">
                Self-care today
              </h3>
              <div className="flex flex-col gap-2">
                {SELF_CARE_SUGGESTIONS.slice(0, 3).map((item, i) => (
                  <SelfCareCard
                    key={item}
                    activity={item}
                    completed={selfCareStates[i]}
                    onToggle={() =>
                      setSelfCareStates((prev) =>
                        prev.map((v, idx) => (idx === i ? !v : v))
                      )
                    }
                    index={i}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── SLEEP ────────────────────────────────────────────────────── */}
        {activeTab === "sleep" && (
          <motion.div
            key="sleep"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            <Card>
              <h3 className="font-serif text-lg text-[#3d3a35] mb-4">
                How did you sleep?
              </h3>

              {/* Hours quick-select */}
              <div className="mb-5">
                <p className="text-sm text-[#5a5549] mb-2">Hours of sleep</p>
                <div className="flex flex-wrap gap-2">
                  {[4, 5, 6, 7, 8, 9, 10].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setSleepHours(h)}
                      className={[
                        "w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200",
                        sleepHours === h
                          ? "bg-[#6b9bc3] text-white shadow-sm"
                          : "bg-[#f6f3ee] text-[#5a5549] hover:bg-[#ede9e2]",
                      ].join(" ")}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality DotScale */}
              <div className="flex flex-col gap-4 mb-5">
                <DotScale
                  value={sleepQuality}
                  onChange={setSleepQuality}
                  color="#8b7bb5"
                  label="Sleep quality"
                />
                <DotScale
                  value={restedness}
                  onChange={setRestedness}
                  color="#d4a954"
                  label="How rested do you feel?"
                />
              </div>

              {/* Optional time inputs */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-[#5a5549]">
                    Bedtime (optional)
                  </label>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#ede9e2] rounded-xl text-[15px] text-[#3d3a35] outline-none focus:border-[#7c9a6e] focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-[#5a5549]">
                    Wake time (optional)
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#ede9e2] rounded-xl text-[15px] text-[#3d3a35] outline-none focus:border-[#7c9a6e] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveSleep}
                  loading={sleepSaving}
                  disabled={sleepHours === null}
                >
                  Save sleep log
                </Button>
                <AnimatePresence>
                  {sleepSaved && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-[#7c9a6e]"
                    >
                      Saved
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* Weekly sleep chart */}
            <Card>
              <h3 className="font-serif text-base text-[#3d3a35] mb-3">
                This week
              </h3>
              <SleepChart data={sleepWeekData} />
            </Card>
          </motion.div>
        )}

        {/* ── BODY CHECK-IN ─────────────────────────────────────────────── */}
        {activeTab === "body" && (
          <motion.div
            key="body"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-[#3d3a35]">
                  Body check-in
                </h3>
                <AnimatePresence>
                  {bodySaved && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-[#7c9a6e]"
                    >
                      Auto-saved
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-5">
                <DotScale
                  value={energy}
                  onChange={handleEnergyChange}
                  color="#d4a954"
                  label="Energy"
                />
                <DotScale
                  value={stress}
                  onChange={handleStressChange}
                  color="#9e6b5e"
                  label="Stress"
                />
                <DotScale
                  value={calm}
                  onChange={handleCalmChange}
                  color="#7c9a6e"
                  label="Calm"
                />
                <DotScale
                  value={physical}
                  onChange={handlePhysicalChange}
                  color="#6b9bc3"
                  label="Physical"
                />
              </div>
            </Card>

            {/* Body kindness quote */}
            <Card className="bg-[#faf8f5]">
              <p className="font-serif text-base text-[#3d3a35] leading-relaxed mb-2">
                &ldquo;{bodyQuote.text}&rdquo;
              </p>
              <p className="text-xs text-[#b5ad9e]">— {bodyQuote.author}</p>
            </Card>
          </motion.div>
        )}

        {/* ── FOCUS TIMER ──────────────────────────────────────────────── */}
        {activeTab === "focus" && (
          <motion.div
            key="focus"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            <Card className="flex justify-center py-6">
              <FocusTimer onSessionComplete={handleFocusComplete} />
            </Card>

            {/* Today's focus stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card compact className="text-center">
                <p className="text-2xl font-medium text-[#7c9a6e]">
                  {focusStats.sessions}
                </p>
                <p className="text-xs text-[#8a8578] mt-0.5">
                  Sessions today
                </p>
              </Card>
              <Card compact className="text-center">
                <p className="text-2xl font-medium text-[#8b7bb5]">
                  {focusStats.totalMinutes}
                  <span className="text-base font-normal">m</span>
                </p>
                <p className="text-xs text-[#8a8578] mt-0.5">
                  Total minutes
                </p>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ── RITUALS ──────────────────────────────────────────────────── */}
        {activeTab === "rituals" && (
          <motion.div
            key="rituals"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            {/* Morning */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-lg text-[#3d3a35]">
                  Morning rituals
                </h3>
                <span className="text-sm font-medium text-[#d4a954]">
                  {morningCount}/8
                </span>
              </div>
              <ProgressBar
                value={(morningCount / 8) * 100}
                color="#d4a954"
                height="h-1.5"
                className="mb-4"
              />
              <div className="flex flex-col gap-2">
                {MORNING_RITUALS.map((item, i) => (
                  <motion.label
                    key={item}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#ede9e2] cursor-pointer hover:bg-[#faf8f5] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={morningDone[i]}
                      onChange={() => handleRitualToggle("morning", i)}
                      className="w-4 h-4 accent-[#d4a954] rounded cursor-pointer"
                    />
                    <span
                      className={[
                        "text-sm transition-colors",
                        morningDone[i]
                          ? "text-[#b5ad9e] line-through"
                          : "text-[#3d3a35]",
                      ].join(" ")}
                    >
                      {item}
                    </span>
                  </motion.label>
                ))}
              </div>
            </Card>

            {/* Evening */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-lg text-[#3d3a35]">
                  Evening rituals
                </h3>
                <span className="text-sm font-medium text-[#8b7bb5]">
                  {eveningCount}/8
                </span>
              </div>
              <ProgressBar
                value={(eveningCount / 8) * 100}
                color="#8b7bb5"
                height="h-1.5"
                className="mb-4"
              />
              <div className="flex flex-col gap-2">
                {EVENING_RITUALS.map((item, i) => (
                  <motion.label
                    key={item}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#ede9e2] cursor-pointer hover:bg-[#faf8f5] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={eveningDone[i]}
                      onChange={() => handleRitualToggle("evening", i)}
                      className="w-4 h-4 accent-[#8b7bb5] rounded cursor-pointer"
                    />
                    <span
                      className={[
                        "text-sm transition-colors",
                        eveningDone[i]
                          ? "text-[#b5ad9e] line-through"
                          : "text-[#3d3a35]",
                      ].join(" ")}
                    >
                      {item}
                    </span>
                  </motion.label>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
