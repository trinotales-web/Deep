"use client";

import { useState } from "react";
import {
  BookOpen,
  DollarSign,
  TrendingUp,
  Lightbulb,
  Target,
  User,
  Filter,
} from "lucide-react";
import { growthStories } from "@/lib/data";

const categories = ["All", "Bootstrapped", "VC-backed", "Solo Founder", "Student Founder"];

export default function StoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  const filtered =
    selectedCategory === "All"
      ? growthStories
      : growthStories.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen px-4 pt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Growth Stories</h1>
        <p className="text-xs text-muted">
          Real founder journeys — updated weekly
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${
              selectedCategory === cat
                ? "bg-accent text-white"
                : "bg-card-bg border border-card-border text-muted hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stories */}
      <div className="mx-auto max-w-lg space-y-4 pb-24">
        {filtered.map((story) => (
          <div
            key={story.id}
            className="rounded-xl border border-card-border bg-card-bg overflow-hidden card-hover"
          >
            {/* Story header */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                    <User size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{story.founderName}</h3>
                    <p className="text-xs text-muted">{story.category} · {story.industry}</p>
                  </div>
                </div>
                <div className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                  {story.monthlyRevenue}/mo
                </div>
              </div>

              <p className="text-xs text-foreground/70 mb-3">{story.background}</p>

              {/* Key stats */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg bg-background/50 p-2">
                  <div className="flex items-center gap-1 text-muted mb-0.5">
                    <DollarSign size={12} />
                    <span className="text-[10px]">Initial Capital</span>
                  </div>
                  <p className="text-xs font-bold">{story.initialCapital}</p>
                </div>
                <div className="rounded-lg bg-background/50 p-2">
                  <div className="flex items-center gap-1 text-muted mb-0.5">
                    <TrendingUp size={12} />
                    <span className="text-[10px]">Revenue Timeline</span>
                  </div>
                  <p className="text-xs font-bold">{story.revenueTimeline}</p>
                </div>
              </div>

              <button
                onClick={() =>
                  setExpandedStory(expandedStory === story.id ? null : story.id)
                }
                className="text-xs text-accent font-medium"
              >
                {expandedStory === story.id ? "Show less" : "Read full story"}
              </button>
            </div>

            {/* Expanded content */}
            {expandedStory === story.id && (
              <div className="border-t border-card-border p-4 space-y-4">
                {/* Pivot moment */}
                <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Lightbulb size={14} className="text-warning" />
                    <span className="text-xs font-bold text-warning">Pivot Moment</span>
                  </div>
                  <p className="text-xs text-foreground/70">{story.pivotMoment}</p>
                </div>

                {/* Key lessons */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <BookOpen size={14} className="text-accent" />
                    <span className="text-xs font-bold">Key Lessons</span>
                  </div>
                  <ul className="space-y-1.5">
                    {story.keyLessons.map((lesson, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent">
                          {i + 1}
                        </span>
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tactical insights */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Target size={14} className="text-success" />
                    <span className="text-xs font-bold">Tactical Insights</span>
                  </div>
                  <ul className="space-y-1.5">
                    {story.tacticalInsights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
