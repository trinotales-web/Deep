import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { today } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { appName, date } = body;

    if (!appName || typeof appName !== "string") {
      return NextResponse.json({ error: "appName is required" }, { status: 400 });
    }

    const logDate = date ?? today();
    const bonusMinutes = 5;

    const existing = await prisma.screenTimeLog.findUnique({
      where: { userId_date_appName: { userId, date: logDate, appName } },
    });

    const log = await prisma.screenTimeLog.upsert({
      where: { userId_date_appName: { userId, date: logDate, appName } },
      update: {
        timesUnlocked: { increment: 1 },
        mathSolved: { increment: 1 },
        minutesUsed: (existing?.minutesUsed ?? 0) + bonusMinutes,
      },
      create: {
        userId,
        date: logDate,
        appName,
        minutesUsed: bonusMinutes,
        timesUnlocked: 1,
        mathSolved: 1,
      },
    });

    return NextResponse.json({ success: true, newMinutes: bonusMinutes, log });
  } catch (error) {
    console.error("[POST /api/screen-time/unlock]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
