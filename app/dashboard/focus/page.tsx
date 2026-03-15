"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { FocusTimer } from "@/components/features/FocusTimer";
import { today } from "@/lib/utils";
import { Clock, CheckCircle } from "lucide-react";

export default function FocusPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const todayStr = today();

  useEffect(() => {
    fetch(`/api/focus?date=${todayStr}`)
      .then((r) => r.json())
      .then((d) => {
        setSessions(d.sessions || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [todayStr]);

  const handleSessionComplete = async (duration: number, type: "focus" | "break") => {
    try {
      const res = await fetch("/api/focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration,
          type,
          completed: true,
          date: todayStr,
        }),
      });
      const data = await res.json();
      if (data.session) {
        setSessions((prev) => [...prev, data.session]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const focusSessions = sessions.filter(
    (s) => s.type === "focus" && s.completed
  );
  const totalMinutes = focusSessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-5"
    >
      <PageHeader
        title="Focus"
        subtitle="One task. Full presence."
      />

      {/* Timer */}
      <Card>
        <FocusTimer onSessionComplete={handleSessionComplete} />
      </Card>

      {/* Today's stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card compact className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle size={16} className="text-[#7c9a6e]" />
            <p className="text-xl font-medium text-[#3d3a35]">
              {focusSessions.length}
            </p>
          </div>
          <p className="text-xs text-[#8a8578]">Sessions today</p>
        </Card>
        <Card compact className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock size={16} className="text-[#d4a954]" />
            <p className="text-xl font-medium text-[#3d3a35]">
              {totalMinutes}m
            </p>
          </div>
          <p className="text-xs text-[#8a8578]">Minutes focused</p>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-[#faf8f5]">
        <h3 className="font-serif text-base text-[#3d3a35] mb-3">
          Practice notes
        </h3>
        <ul className="flex flex-col gap-2">
          {[
            "Close unnecessary tabs and silence your phone",
            "One task at a time — multitasking is a myth",
            "Each break is part of the practice, not a failure",
            "Notice when your mind wanders. Simply return.",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#5a5549]">
              <span className="text-[#a4be7b] mt-0.5">·</span>
              {tip}
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
}
