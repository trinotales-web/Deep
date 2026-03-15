"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MoodSelector } from "@/components/features/MoodSelector";
import { WaterTracker } from "@/components/features/WaterTracker";
import { HabitItem } from "@/components/features/HabitItem";
import { SelfCareCard } from "@/components/features/SelfCareCard";
import { WeekCalendar } from "@/components/features/WeekCalendar";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  today,
  getLast7Days,
  getGreeting,
  pickDailyItem,
  calculateStreak,
  getMoodLabel,
} from "@/lib/utils";
import { ZEN_QUOTES, DAILY_AFFIRMATIONS, SELF_CARE_SUGGESTIONS } from "@/lib/constants";
import { Moon, Flame, Droplets, BedDouble, ArrowRight } from "lucide-react";

const container = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const item = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardHome() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<any[]>([]);
  const [habitLogs, setHabitLogs] = useState<Record<string, boolean>>({});
  const [mood, setMood] = useState<number | null>(null);
  const [water, setWater] = useState(0);
  const [weekData, setWeekData] = useState<any[]>([]);
  const [todaySleep, setTodaySleep] = useState<number | null>(null);
  const [selfCareLogs, setSelfCareLogs] = useState<Record<string, boolean>>({});

  const todayStr = today();
  const dailyQuote = pickDailyItem(ZEN_QUOTES);
  const dailyAffirmation = pickDailyItem(DAILY_AFFIRMATIONS);
  const selfCare = SELF_CARE_SUGGESTIONS.slice(0, 3);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [habitsRes, moodRes, waterRes, sleepRes, weekRes, selfCareRes] =
        await Promise.all([
          fetch("/api/habits"),
          fetch(`/api/mood?date=${todayStr}`),
          fetch(`/api/water?date=${todayStr}`),
          fetch(`/api/sleep?date=${todayStr}`),
          fetch(`/api/mood?days=7`),
          fetch(`/api/self-care?date=${todayStr}`),
        ]);

      const habitsData = await habitsRes.json();
      const moodData = await moodRes.json();
      const waterData = await waterRes.json();
      const sleepData = await sleepRes.json();
      const weekMoods = await weekRes.json();
      const selfCareData = await selfCareRes.json();

      setHabits(habitsData.habits || []);
      const logs: Record<string, boolean> = {};
      (habitsData.habits || []).forEach((h: any) => {
        const log = h.logs?.find((l: any) => l.date === todayStr);
        logs[h.id] = log?.completed ?? false;
      });
      setHabitLogs(logs);
      setMood(moodData.mood?.mood ?? null);
      setWater(waterData.water?.glasses ?? 0);
      setTodaySleep(sleepData.sleep?.hours ?? null);

      // Build week calendar data
      const days7 = getLast7Days();
      const moodMap: Record<string, number | null> = {};
      (weekMoods.moods || []).forEach((m: any) => {
        moodMap[m.date] = m.mood;
      });
      setWeekData(
        days7.map((d) => ({
          date: d,
          mood: moodMap[d] ?? null,
          habitCompletion: 0, // simplified
        }))
      );

      // Self-care logs
      const scLogs: Record<string, boolean> = {};
      (selfCareData.logs || []).forEach((l: any) => {
        scLogs[l.activity] = l.completed;
      });
      setSelfCareLogs(scLogs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodChange = async (m: number) => {
    setMood(m);
    await fetch("/api/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: m, date: todayStr }),
    });
  };

  const handleHabitToggle = async (id: string) => {
    const current = habitLogs[id] ?? false;
    const newVal = !current;
    setHabitLogs((prev) => ({ ...prev, [id]: newVal }));
    await fetch(`/api/habits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: newVal }),
    });
  };

  const handleWaterToggle = async (glass: number) => {
    const newGlasses = water === glass ? glass - 1 : glass;
    setWater(newGlasses);
    await fetch("/api/water", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ glasses: newGlasses, date: todayStr }),
    });
  };

  const handleSelfCareToggle = async (activity: string) => {
    const current = selfCareLogs[activity] ?? false;
    setSelfCareLogs((prev) => ({ ...prev, [activity]: !current }));
    await fetch("/api/self-care", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activity, completed: !current, date: todayStr }),
    });
  };

  const completedHabits = Object.values(habitLogs).filter(Boolean).length;
  const totalHabits = habits.length;
  const habitPercent =
    totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const completedDates = Object.entries(habitLogs)
    .filter(([_, done]) => done)
    .map(() => todayStr);
  const streak = calculateStreak(completedDates);

  const firstName = session?.user?.name?.split(" ")[0] ?? "friend";
  const greeting = getGreeting();

  return (
    <motion.div
      variants={container}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-5"
    >
      {/* Header */}
      <motion.div variants={item}>
        <p className="text-sm text-[#8a8578] mb-0.5">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
        <h1 className="font-serif text-2xl text-[#3d3a35]">
          {greeting}, {firstName}
        </h1>
      </motion.div>

      {/* Daily Quote */}
      <motion.div variants={item}>
        <Card className="bg-[#3d3a35] border-transparent">
          <blockquote className="font-serif italic text-base text-white/80 leading-relaxed mb-3">
            &ldquo;{dailyQuote.text}&rdquo;
          </blockquote>
          <p className="text-xs text-white/40">— {dailyQuote.author}</p>
        </Card>
      </motion.div>

      {/* Affirmation */}
      <motion.div variants={item}>
        <p className="text-sm text-[#8a8578] italic text-center">
          {dailyAffirmation}
        </p>
      </motion.div>

      {/* Mood check-in */}
      <motion.div variants={item}>
        <Card>
          <h2 className="font-serif text-lg text-[#3d3a35] mb-4">
            How are you feeling?
          </h2>
          {loading ? (
            <Skeleton className="h-14 w-full" />
          ) : (
            <MoodSelector value={mood} onChange={handleMoodChange} />
          )}
          {mood !== null && (
            <p className="text-xs text-[#8a8578] mt-3">
              You feel{" "}
              <span className="text-[#3d3a35] font-medium">
                {getMoodLabel(mood)}
              </span>{" "}
              today
            </p>
          )}
        </Card>
      </motion.div>

      {/* Week calendar */}
      <motion.div variants={item}>
        <Card compact>
          <h3 className="text-sm font-medium text-[#5a5549] mb-3">
            This week
          </h3>
          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <WeekCalendar days={weekData} />
          )}
        </Card>
      </motion.div>

      {/* Quick stats */}
      <motion.div variants={item}>
        <div className="grid grid-cols-4 gap-2">
          <Card compact className="text-center">
            <p className="text-lg font-medium text-[#3d3a35]">
              {habitPercent}%
            </p>
            <p className="text-[10px] text-[#8a8578] mt-0.5">Habits</p>
          </Card>
          <Card compact className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame size={14} className="text-[#d4a954]" />
              <p className="text-lg font-medium text-[#3d3a35]">{streak}</p>
            </div>
            <p className="text-[10px] text-[#8a8578] mt-0.5">Streak</p>
          </Card>
          <Card compact className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Droplets size={14} className="text-[#6b9bc3]" />
              <p className="text-lg font-medium text-[#3d3a35]">
                {water}/8
              </p>
            </div>
            <p className="text-[10px] text-[#8a8578] mt-0.5">Water</p>
          </Card>
          <Card compact className="text-center">
            <div className="flex items-center justify-center gap-1">
              <BedDouble size={14} className="text-[#8b7bb5]" />
              <p className="text-lg font-medium text-[#3d3a35]">
                {todaySleep ?? "–"}
              </p>
            </div>
            <p className="text-[10px] text-[#8a8578] mt-0.5">Sleep</p>
          </Card>
        </div>
      </motion.div>

      {/* Quick habits */}
      {loading ? (
        <motion.div variants={item}>
          <Card>
            <Skeleton className="h-5 w-24 mb-3" />
            <Skeleton lines={4} />
          </Card>
        </motion.div>
      ) : habits.length > 0 ? (
        <motion.div variants={item}>
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg text-[#3d3a35]">Today&apos;s habits</h2>
              <Link
                href="/dashboard/habits"
                className="text-xs text-[#8a8578] hover:text-[#7c9a6e] flex items-center gap-1"
              >
                All <ArrowRight size={12} />
              </Link>
            </div>
            <ProgressBar value={habitPercent} color="#7c9a6e" className="mb-4" />
            <div className="divide-y divide-[#f6f3ee]">
              {habits.slice(0, 6).map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  completed={habitLogs[habit.id] ?? false}
                  onToggle={handleHabitToggle}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      ) : null}

      {/* Water tracker */}
      <motion.div variants={item}>
        <Card>
          <h2 className="font-serif text-lg text-[#3d3a35] mb-4">
            Hydration
          </h2>
          <WaterTracker
            glasses={water}
            onToggle={handleWaterToggle}
          />
        </Card>
      </motion.div>

      {/* Self-care suggestions */}
      <motion.div variants={item}>
        <Card>
          <h2 className="font-serif text-lg text-[#3d3a35] mb-4">
            Daily self-care
          </h2>
          <div className="flex flex-col gap-2">
            {selfCare.map((activity, i) => (
              <SelfCareCard
                key={activity}
                activity={activity}
                completed={selfCareLogs[activity] ?? false}
                onToggle={() => handleSelfCareToggle(activity)}
                index={i}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Enter The Void CTA */}
      <motion.div variants={item}>
        <Link href="/dashboard/void">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#0a0a0a] rounded-2xl p-6 text-center cursor-pointer border border-white/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent" />
            <Moon size={20} className="text-white/40 mx-auto mb-3" />
            <h3 className="font-serif text-xl text-white/80 mb-1">
              Enter The Void
            </h3>
            <p className="text-sm text-white/30">
              A space for breath, stillness, and presence
            </p>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
