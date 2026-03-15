import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_HABITS = [
  { name: "Morning Walk", icon: "🚶", color: "#7c9a6e" },
  { name: "Drink Water", icon: "💧", color: "#6b9bc3" },
  { name: "Meditate", icon: "🧘", color: "#8b7bb5" },
  { name: "Read", icon: "📖", color: "#d4a954" },
  { name: "Journal", icon: "✍️", color: "#a4be7b" },
  { name: "Green Tea", icon: "🍵", color: "#7c9a6e" },
];

const MORNING_RITUALS = [
  "Wake at a gentle hour",
  "Drink warm water",
  "Clean and tidy your space",
  "Brew green tea or warm lemon water",
  "Take a morning walk",
  "Stretch and move your body",
  "Write in your journal",
  "Set an intention for the day",
];

const EVENING_RITUALS = [
  "Put away screens an hour before bed",
  "Take a warm bath or shower",
  "Write your gratitude log",
  "Read something calming",
  "Gentle stretching or yoga",
  "Reflect on your day",
  "Prepare for tomorrow",
  "Sleep at a reasonable hour",
];

const SOCIAL_APPS = [
  { name: "Instagram", color: "#E4405F" },
  { name: "TikTok", color: "#000000" },
  { name: "YouTube", color: "#FF0000" },
  { name: "Twitter/X", color: "#1DA1F2" },
  { name: "Facebook", color: "#1877F2" },
];

async function main() {
  console.log("🌿 Seeding AXUNE database...");

  // Create a demo user
  const hashedPassword = await bcrypt.hash("axune2026", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@axune.app" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@axune.app",
      password: hashedPassword,
      bio: "Living intentionally, one day at a time.",
      timezone: "Asia/Tokyo",
    },
  });

  console.log(`✓ Created demo user: ${user.email}`);

  // Seed default habits
  for (let i = 0; i < DEFAULT_HABITS.length; i++) {
    const habit = DEFAULT_HABITS[i];
    await prisma.habit.upsert({
      where: {
        id: `seed-habit-${i}`,
      },
      update: {},
      create: {
        id: `seed-habit-${i}`,
        userId: user.id,
        name: habit.name,
        icon: habit.icon,
        color: habit.color,
        order: i,
      },
    });
  }
  console.log(`✓ Created ${DEFAULT_HABITS.length} default habits`);

  // Seed default app timers
  for (const app of SOCIAL_APPS) {
    await prisma.appTimer.upsert({
      where: {
        userId_appName: {
          userId: user.id,
          appName: app.name,
        },
      },
      update: {},
      create: {
        userId: user.id,
        appName: app.name,
        dailyLimitMin: 30,
        isActive: true,
        color: app.color,
      },
    });
  }
  console.log(`✓ Created ${SOCIAL_APPS.length} default app timers`);

  // Seed sample data for the past 7 days
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Mood log
    await prisma.moodLog.upsert({
      where: { userId_date: { userId: user.id, date: dateStr } },
      update: {},
      create: {
        userId: user.id,
        date: dateStr,
        mood: Math.floor(Math.random() * 4), // 0-3 (Peaceful to Neutral range)
      },
    });

    // Water log
    await prisma.waterLog.upsert({
      where: { userId_date: { userId: user.id, date: dateStr } },
      update: {},
      create: {
        userId: user.id,
        date: dateStr,
        glasses: Math.floor(Math.random() * 5) + 4, // 4-8 glasses
      },
    });

    // Sleep log
    await prisma.sleepLog.upsert({
      where: { userId_date: { userId: user.id, date: dateStr } },
      update: {},
      create: {
        userId: user.id,
        date: dateStr,
        hours: 6 + Math.random() * 3, // 6-9 hours
        quality: Math.floor(Math.random() * 3) + 3, // 3-5
        restedness: Math.floor(Math.random() * 3) + 3,
      },
    });
  }
  console.log("✓ Created 7 days of sample wellness data");

  // Sample journal entry
  await prisma.journalEntry.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date: today.toISOString().split("T")[0],
      },
    },
    update: {},
    create: {
      userId: user.id,
      date: today.toISOString().split("T")[0],
      content:
        "Today I started using AXUNE. There is something peaceful about having a quiet space to track how I'm really doing — not to optimize myself, but to simply pay attention. I noticed I felt more present just by writing this.",
      prompt: "What small moment brought you unexpected joy today?",
    },
  });
  console.log("✓ Created sample journal entry");

  // Sample monthly goals
  const monthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const goalTexts = [
    "Walk outside every day",
    "Read one book this month",
    "Practice meditation 5x per week",
    "Reduce screen time to under 2 hours/day",
  ];

  for (let i = 0; i < goalTexts.length; i++) {
    await prisma.goal.create({
      data: {
        userId: user.id,
        month: monthStr,
        text: goalTexts[i],
        order: i,
        completed: i === 0,
      },
    });
  }
  console.log("✓ Created sample monthly goals");

  console.log("\n🌸 Seed complete! Demo account:");
  console.log("   Email: demo@axune.app");
  console.log("   Password: axune2026");
  console.log('\n   Run: npm run dev then open http://localhost:3000\n');
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
