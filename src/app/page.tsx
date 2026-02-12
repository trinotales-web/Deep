"use client";

import { useRouter } from "next/navigation";
import { Rocket, ArrowRight, Sparkles, Target, TrendingUp, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      {/* Hero */}
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20 glow">
          <Rocket size={40} className="text-accent" />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          <span className="gradient-text">Startup Growth OS</span>
        </h1>
        <p className="mb-2 text-lg text-muted">
          The Daily Execution OS for Founders
        </p>
        <p className="mb-8 text-sm text-muted/70 leading-relaxed">
          Discover validated startup ideas, build execution plans, and track your journey from idea to first revenue.
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push("/onboarding")}
          className="group mb-12 flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-accent-light glow"
        >
          Get Started
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
        </button>

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {[
            { icon: Sparkles, title: "AI-Powered Ideas", desc: "Swipe through curated startup ideas" },
            { icon: Target, title: "Validate Fast", desc: "Structured frameworks & scoring" },
            { icon: TrendingUp, title: "Growth Plans", desc: "30-day actionable roadmaps" },
            { icon: Zap, title: "Decision Engine", desc: "Simulate business outcomes" },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-card-border bg-card-bg p-4 text-left card-hover"
            >
              <feature.icon size={24} className="mb-2 text-accent" />
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="text-xs text-muted mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted/50">
          Free to start. No credit card required.
        </p>
      </div>
    </div>
  );
}
