"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { HabitItem } from "@/components/features/HabitItem";
import { HabitChart } from "@/components/charts/HabitChart";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";
import { today, getLast7Days } from "@/lib/utils";

const container = {
  animate: { transition: { staggerChildren: 0.05 } },
};

export default function HabitsPage() {
  const [habits, setHabits] = useState<any[]>([]);
  const [habitLogs, setHabitLogs] = useState<Record<string, boolean>>({});
  const [weekData, setWeekData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [saving, setSaving] = useState(false);

  const todayStr = today();

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const res = await fetch("/api/habits");
      const data = await res.json();
      const habits = data.habits || [];
      setHabits(habits);

      const logs: Record<string, boolean> = {};
      habits.forEach((h: any) => {
        const log = h.logs?.find((l: any) => l.date === todayStr);
        logs[h.id] = log?.completed ?? false;
      });
      setHabitLogs(logs);

      // Build weekly chart data
      const days = getLast7Days();
      setWeekData(
        days.map((date) => ({
          date,
          completion:
            habits.length > 0
              ? Math.round(
                  (habits.filter((h: any) =>
                    h.logs?.some((l: any) => l.date === date && l.completed)
                  ).length /
                    habits.length) *
                    100
                )
              : 0,
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    const current = habitLogs[id] ?? false;
    setHabitLogs((prev) => ({ ...prev, [id]: !current }));
    await fetch(`/api/habits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !current }),
    });
  };

  const handleDelete = async (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
  };

  const handleAddHabit = async () => {
    if (!newHabitName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newHabitName.trim() }),
      });
      const data = await res.json();
      setHabits((prev) => [...prev, data.habit]);
      setHabitLogs((prev) => ({ ...prev, [data.habit.id]: false }));
      setNewHabitName("");
      setAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const completed = Object.values(habitLogs).filter(Boolean).length;
  const total = habits.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Simple streak: count consecutive days where at least 1 habit was done
  const todayDone = completed > 0;

  return (
    <motion.div
      variants={container}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-5"
    >
      <PageHeader
        title="Habits"
        subtitle="Small steps, meaningful change"
        action={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setAdding(true)}
          >
            <Plus size={15} />
            Add
          </Button>
        }
      />

      {/* Progress summary */}
      {loading ? (
        <CardSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-2xl font-medium text-[#3d3a35]">
                  {completed}/{total}
                </p>
                <p className="text-sm text-[#8a8578]">habits today</p>
              </div>
              <div className="flex items-center gap-2">
                {todayDone && (
                  <div className="flex items-center gap-1 bg-[#d4a954]/15 rounded-full px-3 py-1.5">
                    <Flame size={14} className="text-[#d4a954]" />
                    <span className="text-xs font-medium text-[#d4a954]">
                      On a roll
                    </span>
                  </div>
                )}
              </div>
            </div>
            <ProgressBar value={percent} color="#7c9a6e" showLabel />
          </Card>
        </motion.div>
      )}

      {/* Weekly chart */}
      {!loading && weekData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-[#7c9a6e]" />
              <h3 className="font-serif text-lg text-[#3d3a35]">This week</h3>
            </div>
            <HabitChart data={weekData} />
          </Card>
        </motion.div>
      )}

      {/* Add habit form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <h3 className="font-serif text-base text-[#3d3a35] mb-3">
                New habit
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Morning walk, Read for 20 min..."
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
                  autoFocus
                  className="flex-1"
                />
                <Button
                  onClick={handleAddHabit}
                  loading={saving}
                  size="sm"
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAdding(false)}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habits list */}
      {loading ? (
        <CardSkeleton />
      ) : habits.length === 0 ? (
        <Card className="text-center py-10">
          <p className="font-serif text-lg text-[#8a8578] mb-2">
            No habits yet
          </p>
          <p className="text-sm text-[#b5ad9e] mb-4">
            Start with something small and gentle
          </p>
          <Button onClick={() => setAdding(true)} variant="outline" size="sm">
            Add your first habit
          </Button>
        </Card>
      ) : (
        <Card>
          <h3 className="font-serif text-lg text-[#3d3a35] mb-2">
            Today&apos;s habits
          </h3>
          <div className="divide-y divide-[#f6f3ee]">
            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                completed={habitLogs[habit.id] ?? false}
                onToggle={handleToggle}
                onDelete={handleDelete}
                showDelete
              />
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
}
