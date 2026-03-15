import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { currentMonth } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") ?? currentMonth();

    const goals = await prisma.goal.findMany({
      where: { userId, month },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("[GET /api/goals]", error);
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
    const { text, month } = body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const goalMonth = month ?? currentMonth();

    const lastGoal = await prisma.goal.findFirst({
      where: { userId, month: goalMonth },
      orderBy: { order: "desc" },
    });
    const nextOrder = (lastGoal?.order ?? -1) + 1;

    const goal = await prisma.goal.create({
      data: {
        userId,
        month: goalMonth,
        text: text.trim(),
        order: nextOrder,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("[POST /api/goals]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id ?? null;
    }

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const goal = await prisma.goal.findFirst({ where: { id, userId } });
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    await prisma.goal.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/goals]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
