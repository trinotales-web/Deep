import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const timers = await prisma.appTimer.findMany({
      where: { userId },
      orderBy: { appName: "asc" },
    });

    return NextResponse.json(timers);
  } catch (error) {
    console.error("[GET /api/app-timers]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { appName, dailyLimitMin, isActive, color } = body;

    if (!appName || typeof appName !== "string") {
      return NextResponse.json({ error: "appName is required" }, { status: 400 });
    }

    const timer = await prisma.appTimer.upsert({
      where: { userId_appName: { userId, appName } },
      update: {
        dailyLimitMin: dailyLimitMin ?? undefined,
        isActive: isActive ?? undefined,
        color: color ?? undefined,
      },
      create: {
        userId,
        appName,
        dailyLimitMin: dailyLimitMin ?? 30,
        isActive: isActive ?? true,
        color: color ?? null,
      },
    });

    return NextResponse.json(timer);
  } catch (error) {
    console.error("[POST /api/app-timers]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
