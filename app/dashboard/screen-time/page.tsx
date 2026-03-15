"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTimerCard } from "@/components/features/AppTimerCard";
import { MathGate } from "@/components/features/MathGate";
import { ScreenTimeChart } from "@/components/charts/ScreenTimeChart";
import { Skeleton } from "@/components/ui/Skeleton";
import { SOCIAL_APPS } from "@/lib/constants";
import { today, formatMinutes } from "@/lib/utils";
import { Plus, Settings, X } from "lucide-react";

interface AppTimer {
  id: string;
  appName: string;
  dailyLimitMin: number;
  isActive: boolean;
  color: string | null;
}

interface ScreenTimeLog {
  id: string;
  appName: string;
  minutesUsed: number;
  date: string;
  timesUnlocked?: number;
}

interface ActiveTimer {
  appName: string;
  startTime: number;
  limitMin: number;
}

const container = {
  animate: { transition: { staggerChildren: 0.07 } },
};
const item = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ScreenTimePage() {
  const router = useRouter();
  const [tab, setTab] = useState<"timers" | "analytics">("timers");
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState<AppTimer[]>([]);
  const [todayLogs, setTodayLogs] = useState<ScreenTimeLog[]>([]);
  const [weekLogs, setWeekLogs] = useState<ScreenTimeLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingApp, setAddingApp] = useState<string | null>(null);
  const [newAppLimit, setNewAppLimit] = useState(30);

  // Active timer state
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [showMathGate, setShowMathGate] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [unlockCount, setUnlockCount] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Timer tick
  useEffect(() => {
    if (activeTimer) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          const limitSeconds = activeTimer.limitMin * 60;
          if (next >= limitSeconds && !showMathGate) {
            setShowMathGate(true);
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsed(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTimer]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [timersRes, logsRes, weekRes] = await Promise.all([
        fetch("/api/app-timers"),
        fetch(`/api/screen-time?date=${today()}`),
        fetch("/api/screen-time?days=7"),
      ]);
      const timersData = await timersRes.json();
      const logsData = await logsRes.json();
      const weekData = await weekRes.json();
      setTimers(Array.isArray(timersData) ? timersData : []);
      setTodayLogs(Array.isArray(logsData) ? logsData : []);
      setWeekLogs(Array.isArray(weekData) ? weekData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMinutesUsed = (appName: string): number => {
    const log = todayLogs.find((l) => l.appName === appName);
    return log?.minutesUsed ?? 0;
  };

  const getUnlockCount = (appName: string): number => {
    const log = todayLogs.find((l) => l.appName === appName);
    return log?.timesUnlocked ?? 0;
  };

  const handleToggleTimer = (timer: AppTimer) => {
    if (activeTimer?.appName === timer.appName) {
      // Stop timer
      setActiveTimer(null);
    } else {
      // Start new timer
      const minutesUsed = getMinutesUsed(timer.appName);
      const remaining = Math.max(0, timer.dailyLimitMin - minutesUsed);
      if (remaining === 0) {
        setShowMathGate(true);
        setActiveTimer({ appName: timer.appName, startTime: Date.now(), limitMin: 0 });
      } else {
        setActiveTimer({
          appName: timer.appName,
          startTime: Date.now(),
          limitMin: remaining,
        });
        setUnlockCount(getUnlockCount(timer.appName));
      }
    }
  };

  const handleAddTime = async (appName: string) => {
    try {
      await fetch("/api/screen-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appName, minutesUsed: 5, date: today() }),
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (timer: AppTimer) => {
    try {
      await fetch("/api/app-timers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName: timer.appName,
          isActive: !timer.isActive,
          dailyLimitMin: timer.dailyLimitMin,
        }),
      });
      setTimers((prev) =>
        prev.map((t) =>
          t.id === timer.id ? { ...t, isActive: !t.isActive } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMathGateAccept = () => {
    setShowMathGate(false);
    setActiveTimer(null);
    router.push("/dashboard");
  };

  const handleMathGateExtend = async (appName: string) => {
    await fetch("/api/screen-time/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appName, date: today() }),
    });
    setUnlockCount((prev) => prev + 1);
    // Extend timer limit by 5 minutes
    if (activeTimer) {
      setActiveTimer((prev) =>
        prev ? { ...prev, limitMin: prev.limitMin + 5 } : null
      );
    }
    await loadData();
  };

  const handleMathGateClose = () => {
    setShowMathGate(false);
    setActiveTimer(null);
  };

  const handleAddApp = async (appName: string) => {
    try {
      setAddingApp(appName);
      const appInfo = SOCIAL_APPS.find((a) => a.name === appName);
      await fetch("/api/app-timers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName,
          dailyLimitMin: newAppLimit,
          isActive: true,
          color: appInfo?.color ?? null,
        }),
      });
      await loadData();
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingApp(null);
    }
  };

  // Analytics data processing
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const chartData = weekDates.map((date) => {
    const dayLogs = weekLogs.filter((l) => l.date === date);
    const totalMinutes = dayLogs.reduce((sum, l) => sum + l.minutesUsed, 0);
    return { date, totalMinutes };
  });

  const todayTotal = todayLogs.reduce((sum, l) => sum + l.minutesUsed, 0);

  const mostMindfulDay = chartData.reduce(
    (best, day) =>
      day.totalMinutes < best.totalMinutes && day.totalMinutes > 0 ? day : best,
    chartData[0] ?? { date: "", totalMinutes: 9999 }
  );

  const allApps = Array.from(
    new Set(weekLogs.map((l) => l.appName))
  );
  const appTotals = allApps.map((appName) => ({
    appName,
    total: weekLogs
      .filter((l) => l.appName === appName)
      .reduce((sum, l) => sum + l.minutesUsed, 0),
  })).sort((a, b) => b.total - a.total);

  const maxAppTotal = appTotals[0]?.total ?? 1;

  const existingAppNames = timers.map((t) => t.appName);

  return (
    <div className="min-h-screen bg-[#f6f3ee] px-4 pt-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg mx-auto"
      >
        <PageHeader
          title="Screen Time"
          subtitle="Track and limit your digital habits"
          action={
            tab === "timers" ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={14} />
                Add app
              </Button>
            ) : undefined
          }
        />

        {/* Tabs */}
        <div className="flex gap-1 bg-[#ede9e2] p-1 rounded-xl mb-6">
          {(["timers", "analytics"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize ${
                tab === t
                  ? "bg-white text-[#3d3a35] shadow-sm"
                  : "text-[#8a8578] hover:text-[#3d3a35]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "timers" && (
            <motion.div
              key="timers"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Active timer display */}
              <AnimatePresence>
                {activeTimer && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-4"
                  >
                    <Card className="bg-[#3d3a35] border-transparent text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">
                            Tracking
                          </p>
                          <p className="font-serif text-lg text-white/90">
                            {activeTimer.appName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-2xl text-white font-medium tabular-nums">
                            {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
                            {String(elapsed % 60).padStart(2, "0")}
                          </p>
                          <p className="text-xs text-white/40">
                            / {formatMinutes(activeTimer.limitMin)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-white/50 rounded-full"
                          animate={{
                            width: `${Math.min(100, (elapsed / (activeTimer.limitMin * 60)) * 100)}%`,
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {loading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height="h-20" className="rounded-xl" />
                  ))}
                </div>
              ) : timers.length === 0 ? (
                <Card className="text-center py-10">
                  <p className="text-3xl mb-3">📱</p>
                  <p className="font-serif text-lg text-[#3d3a35] mb-1">
                    No apps tracked yet
                  </p>
                  <p className="text-sm text-[#8a8578] mb-5">
                    Add your first app to start managing screen time
                  </p>
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus size={14} />
                    Add app
                  </Button>
                </Card>
              ) : (
                <motion.div
                  variants={container}
                  initial="initial"
                  animate="animate"
                  className="flex flex-col gap-3"
                >
                  {timers.map((timer) => {
                    const appInfo = SOCIAL_APPS.find(
                      (a) => a.name === timer.appName
                    );
                    const minutesUsed = getMinutesUsed(timer.appName);
                    const isTracking = activeTimer?.appName === timer.appName;

                    return (
                      <motion.div key={timer.id} variants={item}>
                        <Card compact className="flex flex-col gap-3">
                          <AppTimerCard
                            appName={timer.appName}
                            emoji={appInfo?.emoji ?? "📱"}
                            color={timer.color ?? appInfo?.color ?? "#8a8578"}
                            dailyLimitMin={timer.dailyLimitMin}
                            minutesUsed={minutesUsed}
                            isActive={timer.isActive}
                            onToggle={() => handleToggleActive(timer)}
                          />
                          <div className="flex gap-2 pt-1 border-t border-[#f0ede7]">
                            <Button
                              variant={isTracking ? "danger" : "secondary"}
                              size="sm"
                              className="flex-1"
                              onClick={() => handleToggleTimer(timer)}
                            >
                              {isTracking ? "Stop" : "Track"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddTime(timer.appName)}
                            >
                              +5 min
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}

          {tab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              {/* Today summary */}
              <Card>
                <p className="text-xs text-[#8a8578] uppercase tracking-widest mb-2">
                  Today
                </p>
                <p className="font-serif text-3xl text-[#3d3a35] mb-0.5">
                  {formatMinutes(todayTotal)}
                </p>
                <p className="text-sm text-[#8a8578]">total screen time</p>
              </Card>

              {/* 7-day chart */}
              <Card>
                <p className="text-sm font-medium text-[#3d3a35] mb-4">
                  Last 7 days
                </p>
                {loading ? (
                  <Skeleton height="h-36" />
                ) : (
                  <ScreenTimeChart data={chartData} />
                )}
                {mostMindfulDay.totalMinutes < 9999 &&
                  mostMindfulDay.totalMinutes > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#f0ede7]">
                      <p className="text-xs text-[#8a8578]">
                        Most mindful day:{" "}
                        <span className="text-[#7c9a6e] font-medium">
                          {new Date(mostMindfulDay.date).toLocaleDateString(
                            "en-US",
                            { weekday: "long", month: "short", day: "numeric" }
                          )}{" "}
                          — {formatMinutes(mostMindfulDay.totalMinutes)}
                        </span>
                      </p>
                    </div>
                  )}
              </Card>

              {/* Per-app breakdown */}
              {appTotals.length > 0 && (
                <Card>
                  <p className="text-sm font-medium text-[#3d3a35] mb-4">
                    App breakdown (7 days)
                  </p>
                  <div className="flex flex-col gap-3">
                    {appTotals.map(({ appName, total }) => {
                      const appInfo = SOCIAL_APPS.find(
                        (a) => a.name === appName
                      );
                      const pct = Math.round((total / maxAppTotal) * 100);
                      return (
                        <div key={appName}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base">
                                {appInfo?.emoji ?? "📱"}
                              </span>
                              <span className="text-sm text-[#3d3a35]">
                                {appName}
                              </span>
                            </div>
                            <span className="text-xs text-[#8a8578]">
                              {formatMinutes(total)}
                            </span>
                          </div>
                          <div className="h-1.5 bg-[#ede9e2] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                backgroundColor:
                                  appInfo?.color ?? "#9e6b5e",
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Math Gate */}
      <AnimatePresence>
        {showMathGate && activeTimer && (
          <MathGate
            appName={activeTimer.appName}
            unlockCount={unlockCount}
            onAccept={handleMathGateAccept}
            onExtend={handleMathGateExtend}
            onClose={handleMathGateClose}
          />
        )}
      </AnimatePresence>

      {/* Add App Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 px-4 pb-0"
            onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="w-full max-w-lg bg-white rounded-t-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#ede9e2]">
                <div>
                  <h2 className="font-serif text-lg text-[#3d3a35]">
                    Add app timer
                  </h2>
                  <p className="text-xs text-[#8a8578] mt-0.5">
                    Set a daily limit for social apps
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-[#8a8578] hover:text-[#3d3a35] hover:bg-[#f6f3ee] rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Daily limit picker */}
              <div className="px-5 py-4 border-b border-[#f0ede7]">
                <p className="text-xs text-[#8a8578] uppercase tracking-widest mb-3">
                  Daily limit
                </p>
                <div className="flex gap-2 flex-wrap">
                  {[15, 30, 45, 60, 90, 120].map((min) => (
                    <button
                      key={min}
                      onClick={() => setNewAppLimit(min)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        newAppLimit === min
                          ? "bg-[#3d3a35] text-white"
                          : "bg-[#f6f3ee] text-[#5a5549] hover:bg-[#ede9e2]"
                      }`}
                    >
                      {formatMinutes(min)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-5 py-4 max-h-80 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  {SOCIAL_APPS.map((app) => {
                    const alreadyAdded = existingAppNames.includes(app.name);
                    return (
                      <button
                        key={app.name}
                        onClick={() => !alreadyAdded && handleAddApp(app.name)}
                        disabled={alreadyAdded || addingApp === app.name}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                          alreadyAdded
                            ? "opacity-40 cursor-not-allowed bg-[#faf8f5]"
                            : "hover:bg-[#f6f3ee] active:bg-[#ede9e2]"
                        }`}
                      >
                        <span className="text-xl">{app.emoji}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#3d3a35]">
                            {app.name}
                          </p>
                          {alreadyAdded && (
                            <p className="text-xs text-[#b5ad9e]">
                              Already tracking
                            </p>
                          )}
                        </div>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: app.color }}
                        />
                        {addingApp === app.name && (
                          <span className="w-4 h-4 border-2 border-[#3d3a35] border-t-transparent rounded-full animate-spin" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="h-safe-bottom pb-6" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
