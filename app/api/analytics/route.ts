import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { today, formatDate } from "@/lib/utils";
import { subDays } from "date-fns";

function getLast30DayDates(): string[] {
  const dates: string[] = [];
  for (let i = 29; i >= 0; i--) {
    dates.push(formatDate(subDays(new Date(), i)));
  }
  return dates;
}

function getLast7DayDates(): string[] {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    dates.push(formatDate(subDays(new Date(), i)));
  }
  return dates;
}

function getThisWeekDates(): string[] {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    dates.push(formatDate(subDays(new Date(), i)));
  }
  return dates;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const last30Days = getLast30DayDates();
    const last7Days = getLast7DayDates();
    const thisWeek = getThisWeekDates();
    const todayStr = today();

    // Fetch all data in parallel
    const [
      moodLogs,
      habits,
      habitLogs,
      sleepLogs,
      waterLogs,
      screenTimeLogs,
      focusSessions,
    ] = await Promise.all([
      prisma.moodLog.findMany({
        where: { userId, date: { in: last30Days } },
        orderBy: { date: "asc" },
      }),
      prisma.habit.findMany({
        where: { userId, archived: false },
        select: { id: true, name: true },
      }),
      prisma.habitLog.findMany({
        where: { userId, date: { in: last30Days } },
      }),
      prisma.sleepLog.findMany({
        where: { userId, date: { in: last30Days } },
        orderBy: { date: "asc" },
      }),
      prisma.waterLog.findMany({
        where: { userId, date: { in: last30Days } },
        orderBy: { date: "asc" },
      }),
      prisma.screenTimeLog.findMany({
        where: { userId, date: { in: last7Days } },
        orderBy: [{ date: "asc" }, { appName: "asc" }],
      }),
      prisma.focusSession.findMany({
        where: { userId, date: { in: thisWeek }, type: "focus", completed: true },
        select: { duration: true, date: true },
      }),
    ]);

    // --- Mood data (last 30 days) ---
    const moodData = last30Days.map((date) => {
      const log = moodLogs.find((m) => m.date === date);
      return { date, mood: log?.mood ?? null, note: log?.note ?? null };
    });

    // --- Habit completion data (last 30 days) ---
    const habitCompletionData = last30Days.map((date) => {
      const total = habits.length;
      const completed = habitLogs.filter(
        (l) => l.date === date && l.completed
      ).length;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { date, completed, total, pct };
    });

    // --- Sleep data (last 30 days) ---
    const sleepData = last30Days.map((date) => {
      const log = sleepLogs.find((s) => s.date === date);
      return {
        date,
        hours: log?.hours ?? null,
        quality: log?.quality ?? null,
        restedness: log?.restedness ?? null,
      };
    });

    // --- Water data (last 30 days) ---
    const waterData = last30Days.map((date) => {
      const log = waterLogs.find((w) => w.date === date);
      return { date, glasses: log?.glasses ?? 0 };
    });

    // --- Screen time totals (last 7 days) ---
    const screenTimeByDate = last7Days.map((date) => {
      const dayLogs = screenTimeLogs.filter((s) => s.date === date);
      const totalMinutes = dayLogs.reduce((sum, l) => sum + l.minutesUsed, 0);
      return { date, totalMinutes, apps: dayLogs };
    });

    // --- Total focus minutes this week ---
    const totalFocusMinutesThisWeek = focusSessions.reduce(
      (sum, s) => sum + s.duration,
      0
    );

    // --- Weekly wellness score (0-100) ---
    // Components: habit completion %, avg mood score, sleep avg, water consistency
    const weekHabitLogs = habitLogs.filter((l) => last7Days.includes(l.date));
    const weekHabitTotal = habits.length * last7Days.length;
    const weekHabitCompleted = weekHabitLogs.filter((l) => l.completed).length;
    const habitScore =
      weekHabitTotal > 0
        ? Math.round((weekHabitCompleted / weekHabitTotal) * 100)
        : 0;

    const weekMoods = moodLogs.filter((m) => last7Days.includes(m.date));
    // Mood 0 (Peaceful) = best, 5 (Stressed) = worst — invert for score
    const avgMoodRaw =
      weekMoods.length > 0
        ? weekMoods.reduce((sum, m) => sum + m.mood, 0) / weekMoods.length
        : 3;
    const moodScore = Math.round(((5 - avgMoodRaw) / 5) * 100);

    const weekSleeps = sleepLogs.filter((s) => last7Days.includes(s.date));
    const sleepHours = weekSleeps
      .map((s) => s.hours)
      .filter((h): h is number => h !== null);
    const avgSleep =
      sleepHours.length > 0
        ? sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length
        : 0;
    // Target 8 hours; score out of 100
    const sleepScore = Math.min(100, Math.round((avgSleep / 8) * 100));

    const weekWater = waterLogs.filter((w) => last7Days.includes(w.date));
    // Target 8 glasses/day
    const waterDaysHit = weekWater.filter((w) => w.glasses >= 8).length;
    const waterScore = Math.round((waterDaysHit / last7Days.length) * 100);

    const wellnessScore = Math.round(
      habitScore * 0.35 + moodScore * 0.25 + sleepScore * 0.25 + waterScore * 0.15
    );

    // --- Auto-generated insights ---
    const insights: string[] = [];

    if (habitScore >= 80) {
      insights.push(
        "Great habit consistency this week! You completed over 80% of your daily habits."
      );
    } else if (habitScore < 40) {
      insights.push(
        "Your habit completion is lower than usual this week. Starting with just one habit each morning can help build momentum."
      );
    }

    if (avgSleep > 0 && avgSleep < 7) {
      insights.push(
        `Your average sleep this week is ${avgSleep.toFixed(1)} hours. Aiming for 7-9 hours can significantly improve energy and mood.`
      );
    } else if (avgSleep >= 7) {
      insights.push(
        `You're averaging ${avgSleep.toFixed(1)} hours of sleep this week — keep up the great rest habits!`
      );
    }

    if (moodScore < 40) {
      insights.push(
        "Your mood has been on the lower side recently. Journaling or a short walk can sometimes shift perspective."
      );
    } else if (moodScore >= 70) {
      insights.push(
        "Your mood has been positive this week. Consistent habits and good sleep seem to be paying off."
      );
    }

    if (waterDaysHit < 3) {
      insights.push(
        "You hit your water goal fewer than 3 days this week. Keeping a water bottle visible can help you stay hydrated."
      );
    }

    if (totalFocusMinutesThisWeek > 0) {
      insights.push(
        `You've logged ${totalFocusMinutesThisWeek} minutes of focused work this week. Consistent deep work sessions compound over time.`
      );
    }

    // Trim to at most 5 insights
    const finalInsights = insights.slice(0, 5);

    return NextResponse.json({
      moodData,
      habitCompletionData,
      sleepData,
      waterData,
      screenTimeData: screenTimeByDate,
      wellnessScore,
      totalFocusMinutesThisWeek,
      insights: finalInsights,
      meta: {
        generatedAt: todayStr,
        habitsTracked: habits.length,
      },
    });
  } catch (error) {
    console.error("[GET /api/analytics]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
