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
      const dateParam = searchParams.get("date") ?? today();
      const log = await prisma.sleepLog.findUnique({
        where: { userId_date: { userId, date: dateParam } },
      });
      return NextResponse.json(log ?? null);
    }

    const dates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      dates.push(formatDate(subDays(new Date(), i)));
    }

    const logs = await prisma.sleepLog.findMany({
      where: { userId, date: { in: dates } },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("[GET /api/sleep]", error);
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
    const { hours, quality, restedness, bedtime, wakeTime, date } = body;

    const logDate = date ?? today();

    const log = await prisma.sleepLog.upsert({
      where: { userId_date: { userId, date: logDate } },
      update: {
        hours: hours ?? undefined,
        quality: quality ?? undefined,
        restedness: restedness ?? undefined,
        bedtime: bedtime ?? undefined,
        wakeTime: wakeTime ?? undefined,
      },
      create: {
        userId,
        date: logDate,
        hours: hours ?? null,
        quality: quality ?? null,
        restedness: restedness ?? null,
        bedtime: bedtime ?? null,
        wakeTime: wakeTime ?? null,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("[POST /api/sleep]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
