import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { DEFAULT_HABITS, MORNING_RITUALS, EVENING_RITUALS, SOCIAL_APPS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    // Seed default habits
    await prisma.habit.createMany({
      data: DEFAULT_HABITS.map((h, i) => ({
        userId: user.id,
        name: h.name,
        icon: h.icon,
        color: h.color,
        order: i,
      })),
    });

    // Seed default app timers (top 5)
    const defaultApps = SOCIAL_APPS.slice(0, 5);
    await prisma.appTimer.createMany({
      data: defaultApps.map((app) => ({
        userId: user.id,
        appName: app.name,
        dailyLimitMin: 30,
        isActive: true,
        color: app.color,
      })),
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
