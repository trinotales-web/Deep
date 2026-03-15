import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { today } from "@/lib/utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { id } = params;

    const habit = await prisma.habit.findFirst({ where: { id, userId } });
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, completed, archived } = body;

    // Build update payload for Habit
    const habitUpdate: Record<string, unknown> = {};
    if (name !== undefined) habitUpdate.name = name;
    if (archived !== undefined) habitUpdate.archived = archived;

    let updatedHabit = habit;
    if (Object.keys(habitUpdate).length > 0) {
      updatedHabit = await prisma.habit.update({
        where: { id },
        data: habitUpdate,
      });
    }

    // Handle completed (creates/updates HabitLog for today)
    let habitLog = null;
    if (completed !== undefined) {
      const todayStr = today();
      habitLog = await prisma.habitLog.upsert({
        where: { habitId_date: { habitId: id, date: todayStr } },
        update: { completed },
        create: { userId, habitId: id, date: todayStr, completed },
      });
    }

    return NextResponse.json({ habit: updatedHabit, habitLog });
  } catch (error) {
    console.error("[PUT /api/habits/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { id } = params;

    const habit = await prisma.habit.findFirst({ where: { id, userId } });
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    await prisma.habit.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/habits/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
