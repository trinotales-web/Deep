"use client";

import { useState } from "react";
import {
  Check,
  Star,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Zap,
    color: "text-muted",
    borderColor: "border-card-border",
    features: [
      "10-20 swipes per day",
      "Basic growth plan",
      "Limited founder scoring",
      "Growth stories access",
      "Community access",
    ],
    cta: "Current Plan",
    ctaStyle: "bg-card-border text-muted cursor-default",
    popular: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "/month",
    icon: Star,
    color: "text-accent",
    borderColor: "border-accent",
    features: [
      "Unlimited swipes",
      "Idea deep dive access",
      "Advanced founder scoring",
      "AI personalization engine",
      "30-day launch roadmaps",
      "Revenue projections",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    ctaStyle: "bg-accent text-white hover:bg-accent-light glow",
    popular: true,
  },
  {
    name: "Founder",
    price: "$39",
    period: "/month",
    icon: Crown,
    color: "text-warning",
    borderColor: "border-warning/50",
    features: [
      "Everything in Pro",
      "Decision simulator",
      "Revenue projections",
      "Full analytics dashboard",
      "Exportable business reports",
      "AI business plan generator",
      "1-on-1 founder coaching",
      "Private founder community",
    ],
    cta: "Start Founder Trial",
    ctaStyle: "bg-warning text-black font-bold hover:bg-warning/80",
    popular: false,
  },
];

const addOns = [
  { name: "Idea Packs", price: "$49", desc: "50 curated ideas in your niche", type: "one-time" },
  { name: "AI Business Plan", price: "$59", desc: "Full AI-generated business plan report", type: "per report" },
  { name: "Founder Community", price: "$79", desc: "Private community of active founders", type: "/month" },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen px-4 pt-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-1">Choose Your Plan</h1>
        <p className="text-xs text-muted">Start free. Upgrade when you're ready to scale.</p>
      </div>

      {/* Toggle */}
      <div className="mx-auto mb-6 flex items-center justify-center gap-3">
        <span className={`text-sm ${!annual ? "text-foreground" : "text-muted"}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative h-7 w-12 rounded-full transition-colors ${
            annual ? "bg-accent" : "bg-card-border"
          }`}
        >
          <div
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
              annual ? "translate-x-5.5" : "translate-x-0.5"
            }`}
          />
        </button>
        <span className={`text-sm ${annual ? "text-foreground" : "text-muted"}`}>
          Annual <span className="text-xs text-success font-medium">Save 20%</span>
        </span>
      </div>

      <div className="mx-auto max-w-lg space-y-4 pb-8">
        {/* Plans */}
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-xl border ${plan.borderColor} bg-card-bg p-5 ${
              plan.popular ? "glow" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-white">
                Most Popular
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <plan.icon size={20} className={plan.color} />
                <h3 className="text-lg font-bold">{plan.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">
                  {annual && plan.price !== "$0"
                    ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}`
                    : plan.price}
                </span>
                <span className="text-xs text-muted">{plan.period}</span>
              </div>
            </div>

            <ul className="mb-4 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-xs">
                  <Check size={14} className={plan.color} />
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full rounded-full py-3 text-sm font-semibold transition-all ${plan.ctaStyle}`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <div className="mx-auto max-w-lg pb-24">
        <h3 className="mb-3 text-sm font-bold flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          Optional Add-ons
        </h3>
        <div className="space-y-2">
          {addOns.map((addon) => (
            <div
              key={addon.name}
              className="flex items-center justify-between rounded-xl border border-card-border bg-card-bg p-4"
            >
              <div>
                <h4 className="text-sm font-semibold">{addon.name}</h4>
                <p className="text-xs text-muted">{addon.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-bold">{addon.price}</span>
                  <p className="text-[10px] text-muted">{addon.type}</p>
                </div>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
