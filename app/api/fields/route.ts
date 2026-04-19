import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const fields = await prisma.field.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(fields);
  } catch (err) {
    console.error("Fields fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch fields" }, { status: 500 });
  }
}