import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// Reusing your time slicer
function toTimeString(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(11, 16);
}

function calculateDailyHours(timeInAm: string, timeOutAm: string, timeInPm: string, timeOutPm: string): number {
  const timeToMins = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  let totalMins = 0;
  const amInMins = timeToMins(timeInAm);
  const amOutMins = timeToMins(timeOutAm);
  const pmInMins = timeToMins(timeInPm);
  const pmOutMins = timeToMins(timeOutPm);

  if (timeInAm && timeOutAm) totalMins += (amOutMins - amInMins);
  if (timeInPm && timeOutPm) totalMins += (pmOutMins - pmInMins);

  if (timeInAm && !timeOutAm && !timeInPm && timeOutPm) {
    let diff = pmOutMins - amInMins;
    if (amInMins <= 12 * 60 && pmOutMins >= 13 * 60) {
      diff -= 60; // 1 hr lunch deduction
    }
    totalMins += diff;
  }

  return Math.max(0, totalMins / 60);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch user's work hours and required hours in parallel
    const [workHours, requiredHoursRecord] = await Promise.all([
      prisma.workHours.findMany({
        where: { userId },
        orderBy: { date: 'asc' } // Ensure chronological order for the chart
      }),
      prisma.requiredHours.findUnique({
        where: { userId },
      }),
    ]);

    let totalHours = 0;
    let totalDays = 0;
    
    // Object to hold data for the Line Graph: { "YYYY-MM": { total: number, days: number } }
    const monthlyData: Record<string, { totalHours: number; days: number }> = {};

    workHours.forEach((record) => {
      const hours = calculateDailyHours(
        toTimeString(record.time_in_am),
        toTimeString(record.time_out_am),
        toTimeString(record.time_in_pm),
        toTimeString(record.time_out_pm)
      );

      if (hours > 0) {
        totalHours += hours;
        totalDays += 1;

        // Extract YYYY-MM for grouping
        const monthKey = [
          record.date.getFullYear(),
          String(record.date.getMonth() + 1).padStart(2, '0')
        ].join('-');

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { totalHours: 0, days: 0 };
        }
        
        monthlyData[monthKey].totalHours += hours;
        monthlyData[monthKey].days += 1;
      }
    });

    // Format chart data for ApexCharts
    const chartData = Object.keys(monthlyData).map(key => {
      const [year, month] = key.split('-');
      const dateObj = new Date(parseInt(year), parseInt(month) - 1);
      const monthName = dateObj.toLocaleString('en-US', { month: 'short', year: 'numeric' }); // e.g., "Apr 2026"
      
      const avg = monthlyData[key].totalHours / monthlyData[key].days;
      
      return {
        month: monthName,
        average: Math.round(avg * 100) / 100 // Round to 2 decimals
      };
    });

    // Formatting final overview values
    const requiredHours = requiredHoursRecord?.hours || 486; // Fallback to 486 if not set
    const averageHoursRendered = totalDays > 0 ? (totalHours / totalDays) : 0;

    return NextResponse.json({
      summary: {
        totalHours: Math.round(totalHours * 100) / 100,
        requiredHours,
        totalDays,
        averageHours: Math.round(averageHoursRendered * 100) / 100,
      },
      chartData
    });

  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}