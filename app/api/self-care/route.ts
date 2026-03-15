import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { today } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") ?? today();

    const logs = await prisma.selfCareLog.findMany({
      where: { userId, date },
      orderBy: { activity: "asc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("[GET /api/self-care]", error);
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
    const { activity, completed, date } = body;

    if (!activity || typeof activity !== "string") {
      return NextResponse.json({ error: "activity is required" }, { status: 400 });
    }

    const logDate = date ?? today();

    const log = await prisma.selfCareLog.upsert({
      where: { userId_date_activity: { userId, date: logDate, activity } },
      update: { completed: completed ?? false },
      create: {
        userId,
        date: logDate,
        activity,
        completed: completed ?? false,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("[POST /api/self-care]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
