import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

function toDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00.000Z`).toISOString();
}

export async function PUT(request: Request) {
  const data = await request.json();
  const { id, userId, ...payload } = data; // <-- destructure userId out separately

  const localDate = new Date(payload.date);
  const baseDate = [
    localDate.getFullYear(),
    String(localDate.getMonth() + 1).padStart(2, '0'),
    String(localDate.getDate()).padStart(2, '0'),
  ].join('-');

  const normalizedPayload = {
    ...payload,
    date: new Date(`${baseDate}T00:00:00.000Z`),
    time_in_am:  payload.time_in_am  ? toDateTime(baseDate, payload.time_in_am)  : null,
    time_out_am: payload.time_out_am ? toDateTime(baseDate, payload.time_out_am) : null,
    time_in_pm:  payload.time_in_pm  ? toDateTime(baseDate, payload.time_in_pm)  : null,
    time_out_pm: payload.time_out_pm ? toDateTime(baseDate, payload.time_out_pm) : null,
    remarks: payload.remarks ?? null,
  };

  let savedRecord;

  if (id) {
    // UPDATE: userId is not needed since the record already belongs to the user
    savedRecord = await prisma.workHours.update({
      where: { id },
      data: normalizedPayload,
    });
  } else {
    // CREATE: userId is required to link the new record to the user
    savedRecord = await prisma.workHours.create({
      data: { ...normalizedPayload, userId },
    });
  }

  return NextResponse.json(savedRecord);
}