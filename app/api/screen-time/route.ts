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
    const dateParam = searchParams.get("date");
    const daysParam = searchParams.get("days");

    if (daysParam) {
      const days = parseInt(daysParam, 10);
      const dates: string[] = [];
      for (let i = days - 1; i >= 0; i--) {
        dates.push(formatDate(subDays(new Date(), i)));
      }

      const logs = await prisma.screenTimeLog.findMany({
        where: { userId, date: { in: dates } },
        orderBy: [{ date: "asc" }, { appName: "asc" }],
      });

      return NextResponse.json(logs);
    }

    const date = dateParam ?? today();

    const logs = await prisma.screenTimeLog.findMany({
      where: { userId, date },
      orderBy: { appName: "asc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("[GET /api/screen-time]", error);
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
    const { appName, minutesUsed, date } = body;

    if (!appName || typeof appName !== "string") {
      return NextResponse.json({ error: "appName is required" }, { status: 400 });
    }
    if (minutesUsed === undefined || typeof minutesUsed !== "number") {
      return NextResponse.json({ error: "minutesUsed is required and must be a number" }, { status: 400 });
    }

    const logDate = date ?? today();

    const existing = await prisma.screenTimeLog.findUnique({
      where: { userId_date_appName: { userId, date: logDate, appName } },
    });

    const log = await prisma.screenTimeLog.upsert({
      where: { userId_date_appName: { userId, date: logDate, appName } },
      update: {
        minutesUsed: (existing?.minutesUsed ?? 0) + minutesUsed,
      },
      create: {
        userId,
        date: logDate,
        appName,
        minutesUsed,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("[POST /api/screen-time]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
