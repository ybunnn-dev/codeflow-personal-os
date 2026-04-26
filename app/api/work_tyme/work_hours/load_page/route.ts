import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// Converts a UTC DateTime from DB to "YYYY-MM-DD" using local time (PHT)
function toLocalDateString(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

// Slices "HH:mm" directly from ISO string — no timezone shift
function toTimeString(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(11, 16);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const month = searchParams.get("month");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  let dateFilter = {};
  if (month) {
    const [year, monthStr] = month.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthStr) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthStr), 1);
    dateFilter = { date: { gte: startDate, lt: endDate } };
  }

  const [workHours, requiredHours] = await Promise.all([
    prisma.workHours.findMany({
      where: { userId, ...dateFilter },
    }),
    prisma.requiredHours.findUnique({
      where: { userId },
    }),
  ]);

  // Normalize all records to plain strings before sending to frontend
  const normalizedWorkHours = workHours.map(record => ({
    id: record.id,
    userId: record.userId,
    date: toLocalDateString(record.date),           // "2026-02-20"
    time_in_am:  toTimeString(record.time_in_am),   // "07:20"
    time_out_am: toTimeString(record.time_out_am),  // "12:00"
    time_in_pm:  toTimeString(record.time_in_pm),   // "13:00"
    time_out_pm: toTimeString(record.time_out_pm),  // "17:00"
  }));

  return NextResponse.json({ workHours: normalizedWorkHours, requiredHours });
}