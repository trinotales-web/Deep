"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronUp, Flame } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { GoalItem } from "@/components/features/GoalItem";
import {
  today,
  currentMonth,
  getLast7Days,
  pickDailyItem,
  formatDisplayDate,
  formatShortDate,
} from "@/lib/utils";
import {
  JOURNAL_PROMPTS,
  DAILY_AFFIRMATIONS,
} from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "write" | "gratitude" | "goals";

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

interface GratitudeEntry {
  date: string;
  items: [string, string, string];
}

interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

// ─── Past month selectors ─────────────────────────────────────────────────────

function getPastMonths(count = 5): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }
  return months;
}

function formatMonth(ym: string): string {
  const [year, month] = ym.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// ─── Collapsed past entry ─────────────────────────────────────────────────────

function PastEntryCard({ entry }: { entry: JournalEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-[#ede9e2] rounded-xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#faf8f5] hover:bg-[#f6f3ee] transition-colors text-left"
      >
        <span className="text-sm font-medium text-[#5a5549]">
          {formatDisplayDate(entry.date)}
        </span>
        {expanded ? (
          <ChevronUp size={15} className="text-[#b5ad9e] shrink-0" />
        ) : (
          <ChevronDown size={15} className="text-[#b5ad9e] shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-4 py-3 text-sm text-[#3d3a35] font-serif leading-relaxed whitespace-pre-wrap bg-white">
              {entry.content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("write");

  // Write tab
  const [journalText, setJournalText] = useState("");
  const [journalSaved, setJournalSaved] = useState(false);
  const [journalSaving, setJournalSaving] = useState(false);
  const [pastEntries, setPastEntries] = useState<JournalEntry[]>([]);
  const writeDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Gratitude tab
  const [gratitude, setGratitude] = useState<[string, string, string]>(
    ["", "", ""]
  );
  const [gratitudeStreak, setGratitudeStreak] = useState(0);
  const gratitudeDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Goals tab
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalText, setNewGoalText] = useState("");
  const [addingGoal, setAddingGoal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());
  const [goalsLoading, setGoalsLoading] = useState(false);
  const pastMonths = getPastMonths(5);

  const todayStr = today();
  const dailyPrompt = pickDailyItem(JOURNAL_PROMPTS);
  const dailyAffirmation = pickDailyItem(DAILY_AFFIRMATIONS);

  // ─── Initial load ─────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const last7 = getLast7Days();

        const [todayJournalRes, pastJournalRes, gratitudeRes, gratitudeStreakRes] =
          await Promise.allSettled([
            fetch(`/api/journal?date=${todayStr}`).then((r) => r.json()),
            fetch(`/api/journal?dates=${last7.slice(0, 7).join(",")}`).then((r) =>
              r.json()
            ),
            fetch(`/api/gratitude?date=${todayStr}`).then((r) => r.json()),
            fetch(`/api/gratitude/streak`).then((r) => r.json()),
          ]);

        // Today's journal entry
        if (todayJournalRes.status === "fulfilled") {
          setJournalText(todayJournalRes.value?.entry?.content ?? "");
        }

        // Past entries (exclude today)
        if (pastJournalRes.status === "fulfilled") {
          const entries: JournalEntry[] = pastJournalRes.value?.entries ?? [];
          setPastEntries(
            entries
              .filter((e) => e.date !== todayStr && e.content?.trim())
              .slice(0, 7)
          );
        }

        // Gratitude
        if (gratitudeRes.status === "fulfilled") {
          const items = gratitudeRes.value?.entry?.items;
          if (Array.isArray(items) && items.length >= 3) {
            setGratitude([items[0] ?? "", items[1] ?? "", items[2] ?? ""]);
          }
        }

        // Streak
        if (gratitudeStreakRes.status === "fulfilled") {
          setGratitudeStreak(gratitudeStreakRes.value?.streak ?? 0);
        }
      } catch (err) {
        console.error("Journal load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [todayStr]);

  // ─── Load goals when month changes ───────────────────────────────────

  useEffect(() => {
    const loadGoals = async () => {
      setGoalsLoading(true);
      try {
        const res = await fetch(`/api/goals?month=${selectedMonth}`);
        const data = await res.json();
        setGoals(data.goals ?? []);
      } catch (err) {
        console.error("Goals load error:", err);
      } finally {
        setGoalsLoading(false);
      }
    };

    loadGoals();
  }, [selectedMonth]);

  // ─── Journal auto-save (1.5s debounce) ──────────────────────────────

  const saveJournal = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setJournalSaving(true);
      try {
        await fetch("/api/journal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: todayStr, content: text }),
        });
        setJournalSaved(true);
        setTimeout(() => setJournalSaved(false), 2500);
      } catch (err) {
        console.error("Journal save error:", err);
      } finally {
        setJournalSaving(false);
      }
    },
    [todayStr]
  );

  const handleJournalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJournalText(text);
    setJournalSaved(false);
    if (writeDebounceRef.current) clearTimeout(writeDebounceRef.current);
    writeDebounceRef.current = setTimeout(() => saveJournal(text), 1500);
  };

  // ─── Gratitude auto-save (blur/change debounced) ────────────────────

  const saveGratitude = useCallback(
    async (items: [string, string, string]) => {
      if (items.every((i) => !i.trim())) return;
      try {
        await fetch("/api/gratitude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: todayStr, items }),
        });
      } catch (err) {
        console.error("Gratitude save error:", err);
      }
    },
    [todayStr]
  );

  const handleGratitudeChange = (index: number, value: string) => {
    const updated: [string, string, string] = [...gratitude] as [
      string,
      string,
      string
    ];
    updated[index] = value;
    setGratitude(updated);

    if (gratitudeDebounceRef.current)
      clearTimeout(gratitudeDebounceRef.current);
    gratitudeDebounceRef.current = setTimeout(
      () => saveGratitude(updated),
      1000
    );
  };

  const handleGratitudeBlur = () => {
    if (gratitudeDebounceRef.current)
      clearTimeout(gratitudeDebounceRef.current);
    saveGratitude(gratitude);
  };

  // ─── Goals ──────────────────────────────────────────────────────────

  const handleAddGoal = async () => {
    if (!newGoalText.trim()) return;
    setAddingGoal(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newGoalText.trim(), month: selectedMonth }),
      });
      const data = await res.json();
      if (data.goal) {
        setGoals((prev) => [...prev, data.goal]);
      }
      setNewGoalText("");
    } catch (err) {
      console.error("Add goal error:", err);
    } finally {
      setAddingGoal(false);
    }
  };

  const handleToggleGoal = async (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    const newCompleted = !goal.completed;
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: newCompleted } : g))
    );
    try {
      await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newCompleted }),
      });
    } catch (err) {
      console.error("Toggle goal error:", err);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    try {
      await fetch(`/api/goals/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete goal error:", err);
    }
  };

  const completedGoals = goals.filter((g) => g.completed).length;
  const goalPercent =
    goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  const TABS: { id: Tab; label: string }[] = [
    { id: "write", label: "Write" },
    { id: "gratitude", label: "Gratitude" },
    { id: "goals", label: "Goals" },
  ];

  const GRATITUDE_PLACEHOLDERS = [
    "something beautiful, a kind moment, a small joy...",
    "someone who showed up for you, a warm exchange...",
    "a moment of peace, something that surprised you...",
  ];

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5"
    >
      <PageHeader title="Journal" subtitle="Words as a place to rest" />

      {/* Tab Nav */}
      <div className="flex gap-1 p-1 bg-[#f6f3ee] rounded-xl border border-[#ede9e2]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              "flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200",
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
        {/* ── WRITE ───────────────────────────────────────────────────── */}
        {activeTab === "write" && (
          <motion.div
            key="write"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            {/* Today's entry */}
            <Card>
              {/* Prompt */}
              <div className="mb-4 px-4 py-3 bg-[#f6f3ee] rounded-xl border-l-2 border-[#8b7bb5]">
                <p className="text-xs text-[#8b7bb5] font-medium mb-0.5 uppercase tracking-wide">
                  Today&apos;s prompt
                </p>
                <p className="text-sm text-[#5a5549] italic leading-relaxed">
                  {dailyPrompt}
                </p>
              </div>

              {/* Textarea */}
              <textarea
                value={journalText}
                onChange={handleJournalChange}
                placeholder="Begin writing here... there is no right way."
                className="w-full min-h-[240px] px-4 py-3 bg-[#faf8f5] border border-[#ede9e2] rounded-xl font-serif text-[15px] text-[#3d3a35] placeholder:text-[#c5bfb4] leading-relaxed outline-none focus:border-[#7c9a6e] focus:bg-white transition-colors resize-none"
              />

              {/* Save indicator */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-[#c5bfb4]">
                  {formatDisplayDate(todayStr)}
                </p>
                <AnimatePresence>
                  {journalSaving && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-[#b5ad9e]"
                    >
                      Saving...
                    </motion.span>
                  )}
                  {journalSaved && !journalSaving && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-[#7c9a6e]"
                    >
                      Saved
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* Past entries */}
            {!loading && pastEntries.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-base text-[#3d3a35] px-1">
                  Recent entries
                </h3>
                {pastEntries.map((entry) => (
                  <PastEntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}

            {loading && (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-[#f6f3ee] rounded-xl animate-pulse"
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── GRATITUDE ────────────────────────────────────────────────── */}
        {activeTab === "gratitude" && (
          <motion.div
            key="gratitude"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            {/* Affirmation + streak */}
            <Card className="bg-gradient-to-br from-[#faf8f5] to-[#f6f3ee]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs text-[#8b7bb5] font-medium uppercase tracking-wide mb-1">
                    Today&apos;s affirmation
                  </p>
                  <p className="font-serif text-[15px] text-[#3d3a35] leading-relaxed">
                    {dailyAffirmation}
                  </p>
                </div>
                {gratitudeStreak > 0 && (
                  <div className="flex items-center gap-1.5 bg-[#d4a954]/15 rounded-full px-3 py-1.5 shrink-0">
                    <Flame size={13} className="text-[#d4a954]" />
                    <span className="text-xs font-medium text-[#d4a954]">
                      {gratitudeStreak}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Gratitude inputs */}
            <Card>
              <h3 className="font-serif text-lg text-[#3d3a35] mb-4">
                I am grateful for...
              </h3>
              <div className="flex flex-col gap-5">
                {([0, 1, 2] as const).map((i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#5a5549] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#d4a954]/15 text-[#d4a954] text-xs flex items-center justify-center font-semibold">
                        {i + 1}
                      </span>
                      Gratitude {i + 1}
                    </label>
                    <textarea
                      value={gratitude[i]}
                      onChange={(e) => handleGratitudeChange(i, e.target.value)}
                      onBlur={handleGratitudeBlur}
                      placeholder={GRATITUDE_PLACEHOLDERS[i]}
                      rows={2}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#ede9e2] rounded-xl font-serif text-[15px] text-[#3d3a35] placeholder:text-[#c5bfb4] leading-relaxed outline-none focus:border-[#d4a954] focus:bg-white transition-colors resize-none"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── GOALS ────────────────────────────────────────────────────── */}
        {activeTab === "goals" && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            {/* Monthly intention header */}
            <Card className="bg-gradient-to-br from-[#faf8f5] to-[#f6f3ee]">
              <p className="text-xs text-[#7c9a6e] font-medium uppercase tracking-wide mb-1">
                Monthly intention
              </p>
              <p className="font-serif text-base text-[#3d3a35]">
                What do I intend this month?
              </p>
            </Card>

            {/* Month selector */}
            <div className="flex flex-wrap gap-2">
              {pastMonths.map((month) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => setSelectedMonth(month)}
                  className={[
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                    selectedMonth === month
                      ? "bg-[#3d3a35] text-white"
                      : "bg-[#f6f3ee] text-[#5a5549] hover:bg-[#ede9e2]",
                  ].join(" ")}
                >
                  {formatMonth(month)}
                </button>
              ))}
            </div>

            {/* Progress */}
            {goals.length > 0 && (
              <Card compact>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[#5a5549]">
                    {completedGoals}/{goals.length} complete
                  </p>
                  <p className="text-sm font-medium text-[#7c9a6e]">
                    {goalPercent}%
                  </p>
                </div>
                <ProgressBar value={goalPercent} color="#7c9a6e" showLabel={false} />
              </Card>
            )}

            {/* Add goal */}
            <Card compact>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
                  placeholder="Add a new goal or intention..."
                  className="flex-1 px-4 py-3 bg-[#faf8f5] border border-[#ede9e2] rounded-xl text-[15px] text-[#3d3a35] placeholder:text-[#c5bfb4] outline-none focus:border-[#7c9a6e] focus:bg-white transition-colors"
                />
                <Button
                  onClick={handleAddGoal}
                  loading={addingGoal}
                  disabled={!newGoalText.trim()}
                  size="md"
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>
            </Card>

            {/* Goals list */}
            <Card>
              {goalsLoading ? (
                <div className="flex flex-col gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-[#f6f3ee] rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : goals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-serif text-base text-[#8a8578] mb-1">
                    No goals yet for this month
                  </p>
                  <p className="text-sm text-[#b5ad9e]">
                    Set an intention and watch it grow
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#f6f3ee]">
                  <AnimatePresence>
                    {goals.map((goal) => (
                      <GoalItem
                        key={goal.id}
                        goal={goal}
                        onToggle={handleToggleGoal}
                        onDelete={handleDeleteGoal}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
