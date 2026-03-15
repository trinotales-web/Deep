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

    const log = await prisma.gratitudeLog.findUnique({
      where: { userId_date: { userId, date } },
    });

    return NextResponse.json(log ?? null);
  } catch (error) {
    console.error("[GET /api/gratitude]", error);
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
    const { entry1, entry2, entry3, date } = body;

    const logDate = date ?? today();

    const log = await prisma.gratitudeLog.upsert({
      where: { userId_date: { userId, date: logDate } },
      update: {
        entry1: entry1 ?? null,
        entry2: entry2 ?? null,
        entry3: entry3 ?? null,
      },
      create: {
        userId,
        date: logDate,
        entry1: entry1 ?? null,
        entry2: entry2 ?? null,
        entry3: entry3 ?? null,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("[POST /api/gratitude]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
