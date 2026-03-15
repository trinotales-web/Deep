import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        timezone: true,
        image: true,
        joinedAt: true,
        preferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compute stats
    const [habitCount, journalCount, focusSessions] = await Promise.all([
      prisma.habit.count({ where: { userId, archived: false } }),
      prisma.journalEntry.count({ where: { userId } }),
      prisma.focusSession.findMany({
        where: { userId, type: "focus", completed: true },
        select: { duration: true },
      }),
    ]);

    const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.duration, 0);

    const profile = {
      ...user,
      stats: {
        totalHabits: habitCount,
        totalJournalEntries: journalCount,
        totalFocusSessions: focusSessions.length,
        totalMeditationMinutes: totalFocusMinutes,
      },
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[GET /api/profile]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { name, bio, timezone, preferences } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (preferences !== undefined) {
      updateData.preferences =
        typeof preferences === "string"
          ? preferences
          : JSON.stringify(preferences);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        timezone: true,
        image: true,
        joinedAt: true,
        preferences: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[PUT /api/profile]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/profile]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
