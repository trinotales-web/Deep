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

    const sessions = await prisma.focusSession.findMany({
      where: { userId, date },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("[GET /api/focus]", error);
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
    const { duration, type, completed, date } = body;

    if (duration === undefined || typeof duration !== "number") {
      return NextResponse.json({ error: "duration is required and must be a number" }, { status: 400 });
    }
    if (!type || typeof type !== "string") {
      return NextResponse.json({ error: "type is required" }, { status: 400 });
    }

    const sessionDate = date ?? today();

    const focusSession = await prisma.focusSession.create({
      data: {
        userId,
        date: sessionDate,
        duration,
        type,
        completed: completed ?? false,
      },
    });

    return NextResponse.json(focusSession, { status: 201 });
  } catch (error) {
    console.error("[POST /api/focus]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
