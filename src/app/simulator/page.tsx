"use client";

import { useState } from "react";
import {
  Brain,
  Send,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import type { DecisionScenario } from "@/lib/types";

const presetQuestions = [
  "Should I quit my job to start a business?",
  "Should I raise funding or bootstrap?",
  "Should I take a business loan?",
  "Should I hire my first employee?",
  "Should I pivot my product?",
  "Should I expand to a new market?",
];

const mockScenarios: Record<string, DecisionScenario[]> = {
  default: [
    {
      title: "Optimistic Scenario",
      description:
        "You execute well, market conditions are favorable, and early traction validates your approach.",
      revenueProjection: "$5,000 - $15,000/mo by month 12",
      riskProbability: "25%",
      opportunityCost: "Lost salary for 6-12 months",
      impact12Month: "Potential for significant upside with product-market fit",
      recommendation: "Strong GO if you have 6+ months runway",
    },
    {
      title: "Moderate Scenario",
      description:
        "Slower than expected growth, requiring iteration and pivots to find the right market fit.",
      revenueProjection: "$1,000 - $3,000/mo by month 12",
      riskProbability: "50%",
      opportunityCost: "Moderate financial pressure, limited personal income",
      impact12Month: "Sustainable but requires patience and additional investment",
      recommendation: "Consider part-time start to validate first",
    },
    {
      title: "Pessimistic Scenario",
      description:
        "Market timing is wrong, customer acquisition proves difficult, or product fails to gain traction.",
      revenueProjection: "$0 - $500/mo by month 12",
      riskProbability: "25%",
      opportunityCost: "Significant career gap, depleted savings",
      impact12Month: "May need to return to employment with lessons learned",
      recommendation: "Maintain safety net and set clear go/no-go criteria",
    },
  ],
};

export default function SimulatorPage() {
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [displayedQuestion, setDisplayedQuestion] = useState("");

  function handleSubmit(q?: string) {
    const finalQ = q || question;
    if (!finalQ.trim()) return;
    setDisplayedQuestion(finalQ);
    setSubmitted(true);
  }

  const scenarios = mockScenarios.default;

  const scenarioColors = [
    { bg: "bg-success/10", border: "border-success/20", icon: "text-success" },
    { bg: "bg-warning/10", border: "border-warning/20", icon: "text-warning" },
    { bg: "bg-danger/10", border: "border-danger/20", icon: "text-danger" },
  ];

  return (
    <div className="min-h-screen px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Decision Simulator</h1>
        <p className="text-xs text-muted">
          AI-powered scenario analysis for your toughest decisions
        </p>
      </div>

      <div className="mx-auto max-w-lg pb-24">
        {!submitted ? (
          <>
            {/* Input area */}
            <div className="mb-6 rounded-xl border border-card-border bg-card-bg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={20} className="text-accent" />
                <span className="text-sm font-bold">Ask a Decision</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Should I..."
                  className="flex-1 rounded-lg border border-card-border bg-background px-4 py-3 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
                />
                <button
                  onClick={() => handleSubmit()}
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-white"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            {/* Preset questions */}
            <div>
              <p className="mb-3 text-xs text-muted font-medium uppercase tracking-wider">
                Popular Questions
              </p>
              <div className="space-y-2">
                {presetQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSubmit(q)}
                    className="flex w-full items-center justify-between rounded-xl border border-card-border bg-card-bg p-4 text-left text-sm transition-all hover:border-accent/50 card-hover"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles size={16} className="text-accent" />
                      <span>{q}</span>
                    </div>
                    <ChevronRight size={16} className="text-muted" />
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Question display */}
            <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <p className="text-xs text-muted mb-1">Your Question</p>
              <p className="text-sm font-bold">{displayedQuestion}</p>
            </div>

            {/* Scenarios */}
            <div className="space-y-4 mb-6">
              {scenarios.map((scenario, i) => (
                <div
                  key={scenario.title}
                  className={`rounded-xl border ${scenarioColors[i].border} ${scenarioColors[i].bg} p-4`}
                >
                  <h3 className={`text-sm font-bold ${scenarioColors[i].icon} mb-2`}>
                    {scenario.title}
                  </h3>
                  <p className="text-xs text-foreground/70 mb-3">{scenario.description}</p>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-background/30 p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp size={12} className={scenarioColors[i].icon} />
                        <span className="text-[10px] text-muted">Revenue</span>
                      </div>
                      <p className="text-xs font-medium">{scenario.revenueProjection}</p>
                    </div>
                    <div className="rounded-lg bg-background/30 p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle size={12} className={scenarioColors[i].icon} />
                        <span className="text-[10px] text-muted">Probability</span>
                      </div>
                      <p className="text-xs font-medium">{scenario.riskProbability}</p>
                    </div>
                    <div className="rounded-lg bg-background/30 p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign size={12} className={scenarioColors[i].icon} />
                        <span className="text-[10px] text-muted">Opp. Cost</span>
                      </div>
                      <p className="text-xs font-medium">{scenario.opportunityCost}</p>
                    </div>
                    <div className="rounded-lg bg-background/30 p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock size={12} className={scenarioColors[i].icon} />
                        <span className="text-[10px] text-muted">12-Mo Impact</span>
                      </div>
                      <p className="text-xs font-medium">{scenario.impact12Month}</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg bg-background/30 p-2">
                    <p className="text-[10px] text-muted">Recommendation</p>
                    <p className="text-xs font-semibold">{scenario.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action */}
            <button
              onClick={() => {
                setSubmitted(false);
                setQuestion("");
              }}
              className="w-full rounded-xl border border-card-border bg-card-bg p-3 text-sm font-medium text-center hover:border-accent/50"
            >
              Ask Another Question
            </button>
          </>
        )}
      </div>
    </div>
  );
}
