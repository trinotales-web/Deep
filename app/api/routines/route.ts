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
    const type = searchParams.get("type");

    const where: Record<string, unknown> = { userId, date };
    if (type) where.type = type;

    const logs = await prisma.routineLog.findMany({
      where,
      orderBy: { item: "asc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("[GET /api/routines]", error);
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
    const { date, type, item, completed } = body;

    if (!type || typeof type !== "string") {
      return NextResponse.json({ error: "type is required" }, { status: 400 });
    }
    if (!item || typeof item !== "string") {
      return NextResponse.json({ error: "item is required" }, { status: 400 });
    }

    const logDate = date ?? today();

    const log = await prisma.routineLog.upsert({
      where: {
        userId_date_type_item: { userId, date: logDate, type, item },
      },
      update: { completed: completed ?? false },
      create: {
        userId,
        date: logDate,
        type,
        item,
        completed: completed ?? false,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("[POST /api/routines]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
