import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, differenceInDays, subDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "yyyy-MM-dd");
}

export function today(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function todayDate(): Date {
  return new Date();
}

export function currentMonth(): string {
  return format(new Date(), "yyyy-MM");
}

export function formatDisplayDate(date: string): string {
  return format(parseISO(date), "MMMM d, yyyy");
}

export function formatShortDate(date: string): string {
  return format(parseISO(date), "MMM d");
}

export function getDayOfWeek(date: string): string {
  return format(parseISO(date), "EEE");
}

export function getLast7Days(): string[] {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), "yyyy-MM-dd"));
  }
  return days;
}

export function getLast30Days(): string[] {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), "yyyy-MM-dd"));
  }
  return days;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function calculateStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const sortedDates = [...dates].sort().reverse();
  const todayStr = today();

  let streak = 0;
  let currentDate = todayStr;

  for (const date of sortedDates) {
    if (date === currentDate) {
      streak++;
      currentDate = format(subDays(parseISO(currentDate), 1), "yyyy-MM-dd");
    } else if (date < currentDate) {
      break;
    }
  }

  return streak;
}

export function getTimeBasedMessage(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "The quiet hours hold wisdom";
  if (hour < 12) return "A gentle morning to you";
  if (hour < 17) return "May your afternoon be peaceful";
  if (hour < 21) return "An evening of reflection awaits";
  return "Rest well, reflect deeply";
}

export function pickRandom<T>(array: T[], seed?: number): T {
  const index = seed
    ? seed % array.length
    : Math.floor(Math.random() * array.length);
  return array[index];
}

export function pickDailyItem<T>(array: T[]): T {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000
  );
  return array[dayOfYear % array.length];
}

export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function getMoodLabel(mood: number): string {
  const labels = ["Peaceful", "Happy", "Good", "Neutral", "Low", "Stressed"];
  return labels[mood] ?? "Unknown";
}

export function getMoodEmoji(mood: number): string {
  const emojis = ["🌸", "😊", "🙂", "😐", "😔", "😰"];
  return emojis[mood] ?? "😐";
}

export function getMoodColor(mood: number): string {
  const colors = [
    "#8b7bb5",
    "#d4a954",
    "#7c9a6e",
    "#8a8578",
    "#6b9bc3",
    "#9e6b5e",
  ];
  return colors[mood] ?? "#8a8578";
}

export function generateMathProblem(unlockCount: number): {
  question: string;
  answer: number;
} {
  const level = Math.min(unlockCount, 4);

  switch (level) {
    case 0: {
      const a = Math.floor(Math.random() * 50) + 10;
      const b = Math.floor(Math.random() * 50) + 10;
      return { question: `${a} + ${b}`, answer: a + b };
    }
    case 1: {
      const a = Math.floor(Math.random() * 9) + 3;
      const b = Math.floor(Math.random() * 9) + 3;
      return { question: `${a} × ${b}`, answer: a * b };
    }
    case 2: {
      const a = Math.floor(Math.random() * 30) + 10;
      const b = Math.floor(Math.random() * 8) + 2;
      const c = Math.floor(Math.random() * 8) + 2;
      return { question: `${a} + ${b} × ${c}`, answer: a + b * c };
    }
    case 3: {
      const multiplier = [2, 3, 4, 6, 7, 8, 9, 11, 12][
        Math.floor(Math.random() * 9)
      ];
      const divisor = [2, 3, 4][Math.floor(Math.random() * 3)];
      const dividend = divisor * (Math.floor(Math.random() * 10) + 2);
      return {
        question: `(${dividend} ÷ ${divisor}) × ${multiplier}`,
        answer: (dividend / divisor) * multiplier,
      };
    }
    default: {
      const a = Math.floor(Math.random() * 20) + 5;
      const b = Math.floor(Math.random() * 15) + 3;
      const c = Math.floor(Math.random() * 8) + 2;
      const d = Math.floor(Math.random() * 6) + 2;
      return {
        question: `${a} × ${b} - ${c} × ${d}`,
        answer: a * b - c * d,
      };
    }
  }
}
