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

    const log = await prisma.energyLog.findUnique({
      where: { userId_date: { userId, date } },
    });

    return NextResponse.json(log ?? null);
  } catch (error) {
    console.error("[GET /api/energy]", error);
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
    const { energy, stress, calm, physical, date } = body;

    const logDate = date ?? today();

    const log = await prisma.energyLog.upsert({
      where: { userId_date: { userId, date: logDate } },
      update: {
        energy: energy ?? undefined,
        stress: stress ?? undefined,
        calm: calm ?? undefined,
        physical: physical ?? undefined,
      },
      create: {
        userId,
        date: logDate,
        energy: energy ?? null,
        stress: stress ?? null,
        calm: calm ?? null,
        physical: physical ?? null,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("[POST /api/energy]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
