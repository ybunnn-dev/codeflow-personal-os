import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { userId, hours } = data;

    if (!userId || hours === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedRecord = await prisma.requiredHours.upsert({
      where: { userId: userId },
      update: { hours: parseFloat(hours) },
      create: { userId: userId, hours: parseFloat(hours) },
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("🔥 API CRASH IN REQUIRED HOURS PUT:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}