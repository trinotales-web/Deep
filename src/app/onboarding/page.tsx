"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Globe,
  DollarSign,
  Wrench,
  Building2,
  Shield,
  Clock,
  Target,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    key: "country",
    title: "Where are you based?",
    subtitle: "We'll personalize ideas for your market",
    icon: Globe,
  },
  {
    key: "budget",
    title: "What's your startup budget?",
    subtitle: "This helps us match realistic ideas",
    icon: DollarSign,
  },
  {
    key: "skills",
    title: "What are your top skills?",
    subtitle: "Select all that apply",
    icon: Wrench,
  },
  {
    key: "industries",
    title: "Which industries interest you?",
    subtitle: "Pick up to 3",
    icon: Building2,
  },
  {
    key: "risk",
    title: "Your risk tolerance?",
    subtitle: "How comfortable are you with uncertainty?",
    icon: Shield,
  },
  {
    key: "time",
    title: "Time you can commit weekly?",
    subtitle: "Be honest — we'll plan accordingly",
    icon: Clock,
  },
  {
    key: "goal",
    title: "What's your goal?",
    subtitle: "This shapes your entire experience",
    icon: Target,
  },
];

const countries = ["United States", "India", "United Kingdom", "Canada", "Germany", "Australia", "Nigeria", "Brazil", "Indonesia", "Other"];
const budgets = ["$0 - $500", "$500 - $2,000", "$2,000 - $5,000", "$5,000 - $15,000", "$15,000+"];
const skillOptions = ["Marketing", "Sales", "Development", "Design", "Finance", "Writing", "Data Analysis", "Operations", "Leadership", "AI/ML"];
const industryOptions = ["SaaS", "E-commerce", "FinTech", "EdTech", "Health", "AI/ML", "Creator Economy", "Real Estate", "Food & Bev", "Agency"];
const riskOptions = ["Conservative", "Moderate", "Aggressive"];
const timeOptions = ["< 5 hours", "5-10 hours", "10-20 hours", "20-40 hours", "Full-time (40+)"];
const goalOptions = ["Side Hustle", "Full Startup", "Scalable SaaS"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  function getOptions(): string[] {
    switch (currentStep.key) {
      case "country": return countries;
      case "budget": return budgets;
      case "skills": return skillOptions;
      case "industries": return industryOptions;
      case "risk": return riskOptions;
      case "time": return timeOptions;
      case "goal": return goalOptions;
      default: return [];
    }
  }

  const isMultiSelect = currentStep.key === "skills" || currentStep.key === "industries";

  function handleSelect(option: string) {
    if (isMultiSelect) {
      const current = (answers[currentStep.key] as string[]) || [];
      if (current.includes(option)) {
        setAnswers({ ...answers, [currentStep.key]: current.filter((o) => o !== option) });
      } else {
        setAnswers({ ...answers, [currentStep.key]: [...current, option] });
      }
    } else {
      setAnswers({ ...answers, [currentStep.key]: option });
    }
  }

  function isSelected(option: string): boolean {
    const val = answers[currentStep.key];
    if (Array.isArray(val)) return val.includes(option);
    return val === option;
  }

  function canProceed(): boolean {
    const val = answers[currentStep.key];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  }

  function handleNext() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      router.push("/discover");
    }
  }

  return (
    <div className="flex min-h-screen flex-col px-6 py-8">
      {/* Progress bar */}
      <div className="mx-auto w-full max-w-md">
        <div className="mb-2 flex items-center justify-between text-xs text-muted">
          <span>Step {step + 1} of {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-card-border">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20">
          <currentStep.icon size={28} className="text-accent" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-center">{currentStep.title}</h2>
        <p className="mb-8 text-sm text-muted text-center">{currentStep.subtitle}</p>

        {/* Options */}
        <div className={`w-full ${isMultiSelect ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"}`}>
          {getOptions().map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                isSelected(option)
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-card-border bg-card-bg text-foreground hover:border-accent/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isSelected(option) && <CheckCircle2 size={16} className="text-accent" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mx-auto flex w-full max-w-md items-center justify-between pt-8">
        <button
          onClick={() => step > 0 && setStep(step - 1)}
          className={`flex items-center gap-1 text-sm ${step === 0 ? "invisible" : "text-muted hover:text-foreground"}`}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
            canProceed()
              ? "bg-accent text-white hover:bg-accent-light glow"
              : "bg-card-border text-muted cursor-not-allowed"
          }`}
        >
          {step === steps.length - 1 ? "See My Ideas" : "Continue"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
