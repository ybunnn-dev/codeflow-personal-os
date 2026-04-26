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
    const y = parseInt(year);
    const m = parseInt(monthStr) - 1;
    
    // Use UTC boundaries to avoid timezone cutoff issues
    const startDate = new Date(Date.UTC(y, m, 1));
    const endDate = new Date(Date.UTC(y, m + 1, 1));
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
  const normalizedWorkHours = workHours.map(record => {
    console.log("RAW record.date:", record.date);
    console.log("RAW record.date ISO:", record.date?.toISOString());
    console.log("NORMALIZED date:", toLocalDateString(record.date));
    console.log("---");
    
    return {
        id: record.id,
        userId: record.userId,
        date: toLocalDateString(record.date),
        time_in_am:  toTimeString(record.time_in_am),
        time_out_am: toTimeString(record.time_out_am),
        time_in_pm:  toTimeString(record.time_in_pm),
        time_out_pm: toTimeString(record.time_out_pm),
    };
    });

  return NextResponse.json({ workHours: normalizedWorkHours, requiredHours });
}