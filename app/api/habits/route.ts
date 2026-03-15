import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { today } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const todayStr = today();

    const habits = await prisma.habit.findMany({
      where: { userId, archived: false },
      orderBy: { order: "asc" },
      include: {
        logs: {
          where: { date: todayStr },
        },
      },
    });

    return NextResponse.json(habits);
  } catch (error) {
    console.error("[GET /api/habits]", error);
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
    const { name, icon, color } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const lastHabit = await prisma.habit.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
    });
    const nextOrder = (lastHabit?.order ?? -1) + 1;

    const habit = await prisma.habit.create({
      data: {
        userId,
        name: name.trim(),
        icon: icon ?? null,
        color: color ?? null,
        order: nextOrder,
      },
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error("[POST /api/habits]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
