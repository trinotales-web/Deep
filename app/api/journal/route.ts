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

    const entry = await prisma.journalEntry.findUnique({
      where: { userId_date: { userId, date } },
    });

    return NextResponse.json(entry ?? null);
  } catch (error) {
    console.error("[GET /api/journal]", error);
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
    const { content, prompt, date } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    const entryDate = date ?? today();

    const entry = await prisma.journalEntry.upsert({
      where: { userId_date: { userId, date: entryDate } },
      update: { content: content.trim(), prompt: prompt ?? null },
      create: {
        userId,
        date: entryDate,
        content: content.trim(),
        prompt: prompt ?? null,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("[POST /api/journal]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
