import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { today, formatDate } from "@/lib/utils";
import { subDays } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : 1;

    if (days === 1) {
      const log = await prisma.moodLog.findUnique({
        where: { userId_date: { userId, date: today() } },
      });
      return NextResponse.json(log ?? null);
    }

    const dates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      dates.push(formatDate(subDays(new Date(), i)));
    }

    const logs = await prisma.moodLog.findMany({
      where: { userId, date: { in: dates } },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("[GET /api/mood]", error);
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
    const { mood, note } = body;

    if (mood === undefined || typeof mood !== "number") {
      return NextResponse.json({ error: "mood is required and must be a number" }, { status: 400 });
    }

    const date = today();

    const log = await prisma.moodLog.upsert({
      where: { userId_date: { userId, date } },
      update: { mood, note: note ?? null },
      create: { userId, date, mood, note: note ?? null },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("[POST /api/mood]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
