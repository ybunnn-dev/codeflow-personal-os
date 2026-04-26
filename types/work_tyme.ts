export interface WorkHourRecord {
  id?: string;
  userId: string;
  date: string; // ISO string for easy parsing
  time_in_am: string | null; // "08:00:00"
  time_out_am: string | null;
  time_in_pm: string | null;
  time_out_pm: string | null;
}

export interface RequiredHoursRecord {
  hours: number;
}

export interface DailyStatus {
  totalHours: number;
  status: "Exact" | "Undertime" | "Overtime" | "No Record";
  difference: number; // e.g., -1.5 for undertime, +2 for overtime
}