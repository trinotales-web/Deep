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

    const log = await prisma.waterLog.findUnique({
      where: { userId_date: { userId, date } },
    });

    return NextResponse.json(log ?? null);
  } catch (error) {
    console.error("[GET /api/water]", error);
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
    const { glasses, date } = body;

    if (glasses === undefined || typeof glasses !== "number") {
      return NextResponse.json({ error: "glasses is required and must be a number" }, { status: 400 });
    }

    const logDate = date ?? today();

    const log = await prisma.waterLog.upsert({
      where: { userId_date: { userId, date: logDate } },
      update: { glasses },
      create: { userId, date: logDate, glasses },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("[POST /api/water]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
