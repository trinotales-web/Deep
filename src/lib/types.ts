export interface StartupIdea {
  id: string;
  title: string;
  hook: string;
  problem: string;
  solution: string;
  revenueModel: string;
  costRange: string;
  riskLevel: "Low" | "Medium" | "High";
  scalabilityScore: number;
  trendScore: number;
  whyNow: string;
  aiMatchPercent: number;
  category: string;
  industry: string;
  region: string;
}

export interface FounderProfile {
  country: string;
  budget: string;
  skills: string[];
  industries: string[];
  riskTolerance: "Conservative" | "Moderate" | "Aggressive";
  timeAvailability: string;
  goal: "Side Hustle" | "Full Startup" | "Scalable SaaS";
  founderScore: number;
}

export interface GrowthTask {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  phase: number;
  day: number;
}

export interface GrowthPhase {
  id: number;
  title: string;
  subtitle: string;
  lessons: GrowthTask[];
  unlocked: boolean;
}

export interface DashboardMetrics {
  validationStrength: number;
  revenueReadiness: number;
  marketFitIndex: number;
  executionConsistency: number;
  scalePotential: number;
  dailyStreak: number;
  xpPoints: number;
  badges: string[];
}

export interface GrowthStory {
  id: string;
  founderName: string;
  background: string;
  initialCapital: string;
  revenueTimeline: string;
  pivotMoment: string;
  keyLessons: string[];
  tacticalInsights: string[];
  category: "Bootstrapped" | "VC-backed" | "Solo Founder" | "Student Founder";
  industry: string;
  imageUrl: string;
  monthlyRevenue: string;
}

export interface DecisionScenario {
  title: string;
  description: string;
  revenueProjection: string;
  riskProbability: string;
  opportunityCost: string;
  impact12Month: string;
  recommendation: string;
}
