import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

function toDateTime(date: string, time: string): string {
  // date is already "YYYY-MM-DD" from the fix below
  return new Date(`${date}T${time}:00.000Z`).toISOString();
}

export async function PUT(request: Request) {
  const data = await request.json();
  const { id, ...payload } = data;

  // ✅ Extract the correct local date string from the ISO date sent by client
  // e.g. "2026-02-19T16:00:00.000Z" in UTC = Feb 20 in PHT
  // So we parse it as local time instead
  const localDate = new Date(payload.date);
  const baseDate = [
    localDate.getFullYear(),
    String(localDate.getMonth() + 1).padStart(2, '0'),
    String(localDate.getDate()).padStart(2, '0'),
  ].join('-'); // "2026-02-20"

  const normalizedPayload = {
    ...payload,
    date: new Date(`${baseDate}T00:00:00.000Z`),
    time_in_am:  payload.time_in_am  ? toDateTime(baseDate, payload.time_in_am)  : null,
    time_out_am: payload.time_out_am ? toDateTime(baseDate, payload.time_out_am) : null,
    time_in_pm:  payload.time_in_pm  ? toDateTime(baseDate, payload.time_in_pm)  : null,
    time_out_pm: payload.time_out_pm ? toDateTime(baseDate, payload.time_out_pm) : null,
  };

  let savedRecord;

  if (id) {
    savedRecord = await prisma.workHours.update({
      where: { id },
      data: normalizedPayload,
    });
  } else {
    savedRecord = await prisma.workHours.create({
      data: normalizedPayload,
    });
  }

  return NextResponse.json(savedRecord);
}