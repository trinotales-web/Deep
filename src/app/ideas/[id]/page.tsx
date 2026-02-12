"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  AlertTriangle,
  BarChart3,
  Zap,
} from "lucide-react";
import { sampleIdeas } from "@/lib/data";
import ProgressBar from "@/components/ProgressBar";

export default function IdeaDeepDivePage() {
  const params = useParams();
  const router = useRouter();
  const idea = sampleIdeas.find((i) => i.id === params.id) || sampleIdeas[0];

  const roadmapWeeks = [
    { week: "Week 1", title: "Validation Sprint", tasks: ["User interviews (10)", "Competitor analysis", "Landing page", "Email waitlist"] },
    { week: "Week 2", title: "MVP Build", tasks: ["Core feature development", "Payment integration", "Basic onboarding", "Beta user testing"] },
    { week: "Week 3", title: "Launch Prep", tasks: ["Fix critical bugs", "Content marketing prep", "Launch page polish", "Outreach to 50 prospects"] },
    { week: "Week 4", title: "Go Live", tasks: ["Product Hunt launch", "Social media blitz", "First 10 customers", "Collect testimonials"] },
  ];

  const isPremium = true; // Simulating premium access

  return (
    <div className="min-h-screen px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card-bg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold">{idea.title}</h1>
          <p className="text-xs text-muted">{idea.category} · {idea.industry}</p>
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-4 pb-24">
        {/* Match & hook */}
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
          <div className="flex items-center gap-2 text-accent mb-2">
            <Zap size={16} />
            <span className="text-sm font-bold">{idea.aiMatchPercent}% AI Match</span>
          </div>
          <p className="text-sm font-medium">{idea.hook}</p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: DollarSign, label: "Cost Range", value: idea.costRange, color: "text-success" },
            { icon: AlertTriangle, label: "Risk Level", value: idea.riskLevel, color: idea.riskLevel === "Low" ? "text-success" : idea.riskLevel === "Medium" ? "text-warning" : "text-danger" },
            { icon: TrendingUp, label: "Scalability", value: `${idea.scalabilityScore}/100`, color: "text-accent" },
            { icon: BarChart3, label: "Trend Score", value: `${idea.trendScore}/100`, color: "text-accent-light" },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-card-border bg-card-bg p-3">
              <metric.icon size={16} className={`mb-1 ${metric.color}`} />
              <p className="text-xs text-muted">{metric.label}</p>
              <p className={`text-sm font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Market size */}
        <div className="rounded-xl border border-card-border bg-card-bg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-accent" />
            <h3 className="text-sm font-bold">Market Overview</h3>
          </div>
          <div className="space-y-2">
            <ProgressBar value={75} label="TAM (Total Addressable Market)" color="bg-accent" />
            <ProgressBar value={45} label="SAM (Serviceable Market)" color="bg-accent-light" />
            <ProgressBar value={20} label="SOM (Obtainable Market)" color="bg-success" />
          </div>
        </div>

        {/* Revenue projection */}
        <div className="rounded-xl border border-card-border bg-card-bg p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={16} className="text-success" />
            <h3 className="text-sm font-bold">Revenue Projection</h3>
          </div>
          <div className="space-y-2">
            {[
              { month: "Month 3", revenue: "$500 - $1,500", width: 15 },
              { month: "Month 6", revenue: "$2,000 - $5,000", width: 35 },
              { month: "Month 12", revenue: "$5,000 - $15,000", width: 65 },
              { month: "Month 24", revenue: "$15,000 - $50,000", width: 90 },
            ].map((proj) => (
              <div key={proj.month} className="flex items-center gap-3">
                <span className="w-20 text-xs text-muted">{proj.month}</span>
                <div className="flex-1">
                  <div className="h-6 w-full overflow-hidden rounded-lg bg-background/50">
                    <div
                      className="flex h-full items-center rounded-lg bg-success/20 pl-2 text-xs font-medium text-success"
                      style={{ width: `${proj.width}%` }}
                    >
                      {proj.revenue}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 30-day roadmap */}
        <div className="rounded-xl border border-card-border bg-card-bg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-accent" />
            <h3 className="text-sm font-bold">30-Day Launch Roadmap</h3>
          </div>
          <div className="space-y-4">
            {roadmapWeeks.map((week, i) => (
              <div key={week.week} className="relative pl-6">
                <div className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {i + 1}
                </div>
                {i < roadmapWeeks.length - 1 && (
                  <div className="absolute left-2.5 top-5 h-full w-px bg-card-border" />
                )}
                <h4 className="text-sm font-semibold">
                  {week.week}: {week.title}
                </h4>
                <ul className="mt-1 space-y-1">
                  {week.tasks.map((task) => (
                    <li key={task} className="flex items-center gap-2 text-xs text-muted">
                      <div className="h-1 w-1 rounded-full bg-muted" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* First $1000 plan */}
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-accent" />
            <h3 className="text-sm font-bold">First $1,000 Action Plan</h3>
          </div>
          <ol className="space-y-2">
            {[
              "Build landing page with email capture (Day 1-2)",
              "Run 10 customer discovery calls (Day 3-7)",
              "Create MVP with core feature only (Day 8-14)",
              "Launch to waitlist with early-bird pricing (Day 15)",
              "Run targeted ads with $100 budget (Day 16-20)",
              "Convert first 10 paying customers (Day 21-25)",
              "Collect testimonials and iterate (Day 26-30)",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent">
                  {i + 1}
                </span>
                <span className="text-foreground/80">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Risk analysis */}
        <div className="rounded-xl border border-card-border bg-card-bg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-warning" />
            <h3 className="text-sm font-bold">Risk Analysis</h3>
          </div>
          <div className="space-y-2">
            {[
              { risk: "Market Competition", level: 65, desc: "Moderate existing competition" },
              { risk: "Technical Complexity", level: 40, desc: "Achievable with current tools" },
              { risk: "Customer Acquisition", level: 55, desc: "Requires focused marketing effort" },
              { risk: "Regulatory Risk", level: 20, desc: "Low regulatory barriers" },
            ].map((r) => (
              <div key={r.risk}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">{r.risk}</span>
                  <span className={r.level > 60 ? "text-danger" : r.level > 40 ? "text-warning" : "text-success"}>
                    {r.level}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-card-border">
                  <div
                    className={`h-full rounded-full ${r.level > 60 ? "bg-danger" : r.level > 40 ? "bg-warning" : "bg-success"}`}
                    style={{ width: `${r.level}%` }}
                  />
                </div>
                <p className="mt-0.5 text-[10px] text-muted">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        {!isPremium && (
          <div className="rounded-xl border border-accent bg-accent/10 p-6 text-center">
            <Lock size={24} className="mx-auto mb-2 text-accent" />
            <h3 className="font-bold">Unlock Full Deep Dive</h3>
            <p className="mt-1 text-xs text-muted">
              Get competitor analysis, growth channels, and exportable reports
            </p>
            <button
              onClick={() => router.push("/pricing")}
              className="mt-4 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white"
            >
              Upgrade to Pro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
