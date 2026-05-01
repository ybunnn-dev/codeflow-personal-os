import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// ── Helpers ────────────────────────────────────────────────────────────────

function toTimeString(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(11, 16);
}

/** "HH:mm" → "H:MM AM/PM" */
function fmt(t: string): string {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  let h = parseInt(hStr);
  const ampm = h < 12 ? "AM" : "PM";
  h = h % 12 || 12;
  return `${h}:${mStr} ${ampm}`;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// ── DOCX — two DTRs side-by-side on one Letter page ───────────────────────

async function buildDocx(params: {
  userName: string;
  mentorName: string;
  year: number;
  month: number; // 0-based
  records: Record<number, { time_in_am: string; time_out_am: string; time_in_pm: string; time_out_pm: string }>;
}): Promise<Buffer> {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    AlignmentType,
    BorderStyle,
    WidthType,
    VerticalAlign,
  } = await import("docx");

  const { userName, mentorName, year, month, records } = params;

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const totalDays = daysInMonth(year, month);

  // ── A4 dimensions (DXA / twips) ─────────────────────────────
  // A4 = 11906 × 16838
  // 0.5" margins = 720 twips

  const PAGE_W   = 11906;
  const PAGE_H   = 16838;

  const MARGIN_H = 720;
  const MARGIN_V = 720;

  // usable width
  const CONTENT_W = PAGE_W - (MARGIN_H * 2);

  // spacing between two DTRs
  const GUTTER = 360;

  // width of each DTR column
  const DTR_W = (CONTENT_W - GUTTER) / 2;

  // ── Border helpers ────────────────────────────────────────────────────────
  const thin = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
  const none = { style: BorderStyle.NONE,   size: 0, color: "FFFFFF" };
  const allB  = { top: thin, bottom: thin, left: thin, right: thin };
  const noneB = { top: none, bottom: none, left: none, right: none };
  
  const bottomOnlyB = { 
    top: none, 
    bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" }, 
    left: none, 
    right: none 
  };

  // ── Font / size constants (7pt body, compact for 31 rows) ─────────────────
  const FS       = 14; // 7pt
  const FS_SUB   = 15; // 7.5pt sub-labels
  const FS_HEAD  = 16; // 8pt
  const FS_TITLE = 20; // 10pt
  const FONT = "Arial";

  const tr = (text: string, opts?: { bold?: boolean; italics?: boolean; size?: number; underline?: boolean }) =>
    new TextRun({
      text,
      font: FONT,
      size: opts?.size ?? FS,
      bold: opts?.bold,
      italics: opts?.italics,
      underline: opts?.underline ? {} : undefined,
    });

  const p = (runs: TextRun[], align = AlignmentType.LEFT, spacingAfter = 0) =>
    new Paragraph({
      alignment: align,
      spacing: { before: 0, after: spacingAfter },
      children: runs,
    });

  // Bordered cell
  const bc = (
    content: TextRun[],
    opts?: {
      w?: number;
      span?: number;
      align?: (typeof AlignmentType)[keyof typeof AlignmentType];
      border?: boolean;
    }
  ) =>
    new TableCell({
      columnSpan: opts?.span,
      borders: opts?.border === false ? noneB : allB,
      width: opts?.w ? { size: opts.w, type: WidthType.DXA } : undefined,
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 25, bottom: 25, left: 50, right: 50 },
      children: [p(content, opts?.align ?? AlignmentType.CENTER)],
    });

  // Empty bordered cell
  const ec = (w: number) => bc([tr("")], { w });

  // ── Inner time-record table (fits inside DTR_W = 5220) ───────────────────
  // 7 cols: Day | AM-Arr | AM-Dep | PM-Arr | PM-Dep | UT-Hrs | UT-Min
  const C = [430, 890, 890, 890, 890, 520, 510]; // sum = 5020 (leaves room for cell padding)
  const TW = C.reduce((a, b) => a + b, 0);

  function buildTimeTable(): Table {
    const row1 = new TableRow({
      children: [
        bc([tr("Day", { bold: true, size: FS_HEAD })], { w: C[0] }),
        bc([tr("A.M.", { bold: true, size: FS_HEAD })], { w: C[1]+C[2], span: 2 }),
        bc([tr("P.M.", { bold: true, size: FS_HEAD })], { w: C[3]+C[4], span: 2 }),
        bc([tr("Undertime", { bold: true, size: FS_HEAD })], { w: C[5]+C[6], span: 2 }),
      ],
    });

    const row2 = new TableRow({
      children: [
        ec(C[0]),
        bc([tr("Arrival",   { bold: true, size: FS_SUB })], { w: C[1] }),
        bc([tr("Departure",{ bold: true, size: FS_SUB })], { w: C[2] }),
        bc([tr("Arrival",   { bold: true, size: FS_SUB })], { w: C[3] }),
        bc([tr("Departure",{ bold: true, size: FS_SUB })], { w: C[4] }),
        bc([tr("Hour-s",     { bold: true, size: FS_SUB })], { w: C[5] }),
        bc([tr("Min-utes",  { bold: true, size: FS_SUB })], { w: C[6] }),
      ],
    });

    const dataRows: TableRow[] = [];
    for (let d = 1; d <= 31; d++) {
      const r       = records[d];
      const isEmpty = d > totalDays;
      dataRows.push(
        new TableRow({
          height: { value: 220, rule: "atLeast" },
          children: [
            bc([tr(isEmpty ? "" : String(d))], { w: C[0] }),
            bc([tr(!isEmpty && r?.time_in_am  ? fmt(r.time_in_am)  : "")], { w: C[1] }),
            bc([tr(!isEmpty && r?.time_out_am ? fmt(r.time_out_am) : "")], { w: C[2] }),
            bc([tr(!isEmpty && r?.time_in_pm  ? fmt(r.time_in_pm)  : "")], { w: C[3] }),
            bc([tr(!isEmpty && r?.time_out_pm ? fmt(r.time_out_pm) : "")], { w: C[4] }),
            ec(C[5]),
            ec(C[6]),
          ],
        })
      );
    }

    const totalRow = new TableRow({
      children: [
        new TableCell({
          columnSpan: 5,
          borders: allB,
          width: { size: C[0]+C[1]+C[2]+C[3]+C[4], type: WidthType.DXA },
          margins: { top: 25, bottom: 25, left: 50, right: 50 },
          children: [p([tr("Total", { bold: true })], AlignmentType.RIGHT)],
        }),
        ec(C[5]),
        ec(C[6]),
      ],
    });

    return new Table({
      width: { size: TW, type: WidthType.DXA },
      columnWidths: C,
      rows: [row1, row2, ...dataRows, totalRow],
    });
  }

  // ── All content blocks for one DTR panel ─────────────────────────────────
  function buildDtrChildren(): (Paragraph | Table)[] {
    return [
      p([tr("Civil Service Form No. 48", { italics: true, size: FS })], AlignmentType.LEFT),
      p([tr("DAILY TIME RECORD", { bold: true, size: FS_TITLE })], AlignmentType.CENTER),
      p([tr("-----o0o-----", { size: FS })], AlignmentType.CENTER, 20),

      // Header Name Section
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noneB,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: bottomOnlyB,
                children: [p([tr(userName, { bold: true, size: FS_HEAD })], AlignmentType.CENTER)],
              })
            ]
          })
        ]
      }),
      p([tr("(Name)", { size: FS })], AlignmentType.CENTER, 40),

      // Metadata Invisible Table (Month & Official Hours)
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [1700, 1600, 1920],
        borders: noneB,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: noneB,
                verticalAlign: VerticalAlign.BOTTOM,
                children: [p([tr("For the month of", { italics: true, size: FS })], AlignmentType.LEFT)],
              }),
              new TableCell({
                borders: bottomOnlyB, 
                verticalAlign: VerticalAlign.BOTTOM,
                children: [p([tr(monthLabel, { italics: true, size: FS })], AlignmentType.CENTER)],
              }),
              new TableCell({ borders: noneB, children: [] }),
            ]
          }),
          new TableRow({
            height: { value: 80, rule: "exact" },
            children: [
              new TableCell({ borders: noneB, children: [] }),
              new TableCell({ borders: noneB, children: [] }),
              new TableCell({ borders: noneB, children: [] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: noneB,
                rowSpan: 2, 
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  p([tr("Official hours for", { italics: true, size: FS })], AlignmentType.CENTER),
                  p([tr("arrival and departure", { italics: true, size: FS })], AlignmentType.CENTER),
                ],
              }),
              new TableCell({
                borders: noneB,
                verticalAlign: VerticalAlign.CENTER,
                children: [p([tr("Regular days", { italics: true, size: FS })], AlignmentType.RIGHT)],
              }),
              new TableCell({
                borders: allB, 
                margins: { top: 20, bottom: 20 },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  p([tr("8:00 AM – 5:00PM", { italics: true, size: 12 })], AlignmentType.CENTER),
                  p([tr("(Monday to Friday)", { italics: true, size: 12 })], AlignmentType.CENTER),
                ],
              }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: noneB,
                verticalAlign: VerticalAlign.CENTER,
                children: [p([tr("Saturdays", { italics: true, size: FS })], AlignmentType.RIGHT)],
              }),
              new TableCell({
                borders: allB, 
                children: [p([tr("")])],
              }),
            ]
          }),
        ]
      }),

      p([tr("")], AlignmentType.LEFT, 60),

      buildTimeTable(),

      p([tr("")], AlignmentType.LEFT, 60),

      p(
        [tr(
          "I certify on my honor that the above is a true and correct report of the hours of work performed, record of which was made daily at the time of arrival and departure from office.",
          { italics: true, size: FS }
        )],
        AlignmentType.BOTH,
        80
      ),

      // Employee Signature
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noneB,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: bottomOnlyB,
                children: [p([tr(userName, { bold: true, size: FS_HEAD })], AlignmentType.CENTER)],
              })
            ]
          })
        ]
      }),
      p([tr("")], AlignmentType.LEFT, 40),

      p([tr("VERIFIED as to the prescribed office hours:", { italics: true, size: FS })], AlignmentType.LEFT, 60),

      // Mentor Signature
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noneB,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: bottomOnlyB,
                children: [p([tr(mentorName, { bold: true, size: FS_HEAD })], AlignmentType.CENTER)],
              })
            ]
          })
        ]
      }),
      p([tr("In Charge", { italics: true, size: FS })], AlignmentType.CENTER),
    ];
  }

  // ── Outer wrapper: invisible 3-col table [DTR | gap | DTR] ───────────────
  const outerRow = new TableRow({
    children: [
      new TableCell({
        borders: noneB,
        width: { size: DTR_W, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        children: buildDtrChildren(),
      }),
      new TableCell({
        borders: noneB,
        width: { size: GUTTER, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        children: [p([tr("")])],
      }),
      new TableCell({
        borders: noneB,
        width: { size: DTR_W, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        children: buildDtrChildren(),
      }),
    ],
  });

  const outerTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [DTR_W, GUTTER, DTR_W],
    rows: [outerRow],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_W, height: 15840 },
            margin: { top: MARGIN_V, right: MARGIN_H, bottom: MARGIN_V, left: MARGIN_H },
          },
        },
        children: [outerTable],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

// ── XLSX generation (single sheet, unchanged) ──────────────────────────────

async function buildXlsx(params: {
  userName: string;
  mentorName: string;
  year: number;
  month: number;
  records: Record<number, { time_in_am: string; time_out_am: string; time_in_pm: string; time_out_pm: string }>;
}): Promise<Buffer> {
  const ExcelJS = (await import("exceljs")).default;
  const { userName, mentorName, year, month, records } = params;
  const totalDays = daysInMonth(year, month);
  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("DTR");

  ws.columns = [
    { width: 6 }, { width: 12 }, { width: 12 },
    { width: 12 }, { width: 12 }, { width: 10 }, { width: 10 },
  ];

  const center: Partial<ExcelJS.Alignment> = { horizontal: "center", vertical: "middle" };
  const thin: Partial<ExcelJS.Border> = { style: "thin" };
  const allBord: Partial<ExcelJS.Borders> = { top: thin, bottom: thin, left: thin, right: thin };

  const setRow = (addr: string, value: string, bold: boolean, size: number, underline = false) => {
    ws.getCell(addr).value = value;
    ws.getCell(addr).alignment = center;
    ws.getCell(addr).font = { bold, name: "Arial Narrow", size, underline };
  };

  ws.mergeCells("A1:G1"); setRow("A1", "Civil Service Form No. 48", true, 10);
  ws.mergeCells("A2:G2"); setRow("A2", "DAILY TIME RECORD", true, 14);
  ws.mergeCells("A3:G3"); setRow("A3", userName, true, 11, true);

  ws.mergeCells("A4:G4");
  ws.getCell("A4").value = `For the month of: ${monthLabel}`;
  ws.getCell("A4").alignment = { horizontal: "left", vertical: "middle" };
  ws.getCell("A4").font = { name: "Arial Narrow", size: 10 };

  ws.mergeCells("A5:G5");
  ws.getCell("A5").value = "Official hours: 8:00 AM – 5:00 PM (Monday to Friday)";
  ws.getCell("A5").alignment = { horizontal: "left", vertical: "middle" };
  ws.getCell("A5").font = { name: "Arial Narrow", size: 10 };

  ws.getRow(6).height = 18;
  ["A6","B6","C6","D6","E6","F6","G6"].forEach(c => {
    ws.getCell(c).border = allBord;
    ws.getCell(c).alignment = center;
    ws.getCell(c).font = { bold: true, name: "Arial Narrow", size: 9 };
  });
  ws.getCell("A6").value = "Day";
  ws.mergeCells("B6:C6"); ws.getCell("B6").value = "A.M.";
  ws.mergeCells("D6:E6"); ws.getCell("D6").value = "P.M.";
  ws.mergeCells("F6:G6"); ws.getCell("F6").value = "Undertime";

  ws.getRow(7).height = 18;
  ["A","B","C","D","E","F","G"].forEach((col, i) => {
    const c = ws.getCell(`${col}7`);
    c.value = ["Day","Arrival","Departure","Arrival","Departure","Hours","Minutes"][i];
    c.border = allBord;
    c.alignment = center;
    c.font = { bold: true, name: "Arial Narrow", size: 9 };
  });

  for (let d = 1; d <= 31; d++) {
    const rowNum = d + 7;
    const r = records[d];
    ws.getRow(rowNum).height = 16;
    ["A","B","C","D","E","F","G"].forEach((col, i) => {
      const c = ws.getCell(`${col}${rowNum}`);
      c.value = [
        d <= totalDays ? d : "",
        r?.time_in_am  ? fmt(r.time_in_am)  : "",
        r?.time_out_am ? fmt(r.time_out_am) : "",
        r?.time_in_pm  ? fmt(r.time_in_pm)  : "",
        r?.time_out_pm ? fmt(r.time_out_pm) : "",
        "", "",
      ][i];
      c.border = allBord;
      c.alignment = center;
      c.font = { name: "Arial Narrow", size: 9 };
    });
  }

  const TR = 39;
  ws.mergeCells(`A${TR}:E${TR}`);
  ws.getCell(`A${TR}`).value = "Total";
  ws.getCell(`A${TR}`).alignment = { horizontal: "right", vertical: "middle" };
  ws.getCell(`A${TR}`).font = { bold: true, name: "Arial Narrow", size: 9 };
  ws.getCell(`A${TR}`).border = allBord;
  ["F","G"].forEach(col => { ws.getCell(`${col}${TR}`).border = allBord; });

  ws.mergeCells("A41:G42");
  ws.getCell("A41").value =
    "I certify on my honor that the above is a true and correct report of the hours of work performed, record of which was made daily at the time of arrival and departure from office.";
  ws.getCell("A41").alignment = { horizontal: "left", vertical: "top", wrapText: true };
  ws.getCell("A41").font = { name: "Arial Narrow", size: 9 };
  ws.getRow(41).height = 30;

  ws.mergeCells("A44:G44");
  ws.getCell("A44").value = userName;
  ws.getCell("A44").font = { bold: true, name: "Arial Narrow", size: 10, underline: true };

  ws.mergeCells("A46:G46");
  ws.getCell("A46").value = "VERIFIED as to the prescribed office hours:";
  ws.getCell("A46").font = { name: "Arial Narrow", size: 9 };

  ws.mergeCells("A48:G48");
  ws.getCell("A48").value = mentorName;
  ws.getCell("A48").font = { bold: true, name: "Arial Narrow", size: 10, underline: true };

  ws.mergeCells("A49:G49");
  ws.getCell("A49").value = "In Charge";
  ws.getCell("A49").font = { name: "Arial Narrow", size: 9 };

  return Buffer.from(await wb.xlsx.writeBuffer());
}

// ── GET handler ────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId     = searchParams.get("userId");
  const month      = searchParams.get("month");
  const mentorName = searchParams.get("mentor") ?? "";
  const format     = searchParams.get("format") ?? "docx";

  if (!userId || !month)
    return NextResponse.json({ error: "Missing userId or month" }, { status: 400 });

  const [yearStr, monthStr] = month.split("-");
  const year       = parseInt(yearStr);
  const monthIndex = parseInt(monthStr) - 1;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const userName = [user.firstName, user.middleName, user.lastName, user.suffix]
    .filter(Boolean).join(" ");

  const startDate = new Date(Date.UTC(year, monthIndex, 1));
  const endDate   = new Date(Date.UTC(year, monthIndex + 1, 1));

  const workHours = await prisma.workHours.findMany({
    where: { userId, date: { gte: startDate, lt: endDate } },
  });

  const records: Record<number, { time_in_am: string; time_out_am: string; time_in_pm: string; time_out_pm: string }> = {};
  for (const wh of workHours) {
    const day = wh.date.getUTCDate();
    records[day] = {
      time_in_am:  toTimeString(wh.time_in_am),
      time_out_am: toTimeString(wh.time_out_am),
      time_in_pm:  toTimeString(wh.time_in_pm),
      time_out_pm: toTimeString(wh.time_out_pm),
    };
  }

  const buildParams = { userName, mentorName, year, month: monthIndex, records };

  if (format === "xlsx") {
    const buffer = await buildXlsx(buildParams);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="DTR_${month}.xlsx"`,
      },
    });
  }

  const buffer = await buildDocx(buildParams);
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="DTR_${month}.docx"`,
    },
  });
}