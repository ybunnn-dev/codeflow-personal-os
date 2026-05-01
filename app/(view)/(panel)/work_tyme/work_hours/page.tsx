"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Calendar from "./components/calendar";
import SpecificDate from "./components/specific_date";
import ReqHours from "./components/req_hours";
import DTRGenerator from "./components/dtr_generator";

export default function WorkHoursPage() {
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewingMonth, setViewingMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const [workHoursRecords, setWorkHoursRecords] = useState<any[]>([]);
  const [requiredHours, setRequiredHours] = useState<number>(8);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchWorkData = useCallback(async (month: Date) => {
    if (!currentUserId) return;

    setIsLoadingData(true);
    try {
      const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
      const res = await fetch(`/api/work_tyme/work_hours/load_page?userId=${currentUserId}&month=${monthStr}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      setWorkHoursRecords(data.workHours || []);
      if (data.requiredHours?.hours) setRequiredHours(data.requiredHours.hours);
    } catch (error) {
      console.error("Error fetching work hours:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (status === "authenticated" && currentUserId) {
      fetchWorkData(viewingMonth);
    }
  }, [fetchWorkData, status, currentUserId, viewingMonth]);

  const handleMonthChange = (newMonth: Date) => {
    setViewingMonth(newMonth);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-full p-6 text-gray-500 dark:text-gray-400">
        Authenticating...
      </div>
    );
  }

  if (status === "unauthenticated" || !currentUserId) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-red-500">
        You must be logged in to manage your work hours.
      </div>
    );
  }

  const selectedDateString = [
    selectedDate.getFullYear(),
    String(selectedDate.getMonth() + 1).padStart(2, '0'),
    String(selectedDate.getDate()).padStart(2, '0'),
  ].join('-');

  const normalizeDate = (dateVal: string) => {
    if (!dateVal) return "";
    return dateVal.substring(0, 10);
  };

  const currentDayRecord = workHoursRecords.find(
    record => normalizeDate(record.date) === selectedDateString
  );

  const timeToMins = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const dailyStatuses = workHoursRecords.reduce((acc, record) => {
    const dateKey = normalizeDate(record.date);
    let totalMins = 0;
    if (record.time_in_am && record.time_out_am)
      totalMins += timeToMins(record.time_out_am) - timeToMins(record.time_in_am);
    if (record.time_in_pm && record.time_out_pm)
      totalMins += timeToMins(record.time_out_pm) - timeToMins(record.time_in_pm);

    const hours = totalMins / 60;

    if (hours <= 0)                 acc[dateKey] = "No Record";
    else if (hours < requiredHours) acc[dateKey] = "Undertime";
    else if (hours > requiredHours) acc[dateKey] = "Overtime";
    else                            acc[dateKey] = "Exact Time";

    return acc;
  }, {} as Record<string, string>);

  // ── Export buttons passed into the Calendar header ─────────────────────
  const exportActions = (
    <>
      <DTRGenerator viewingMonth={viewingMonth} format="docx">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D98A5F] hover:bg-[#c97a4f] text-white text-xs font-semibold transition-colors shadow-sm">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export DTR
        </span>
      </DTRGenerator>

      <DTRGenerator viewingMonth={viewingMonth} format="xlsx">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold transition-colors shadow-sm">
          <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
          </svg>
          Excel
        </span>
      </DTRGenerator>
    </>
  );

  return (
    <div className="grid grid-cols-4 gap-6 h-full">

      <div className="col-span-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          viewingMonth={viewingMonth}
          onMonthChange={handleMonthChange}
          dailyStatuses={dailyStatuses}
          actions={exportActions}
        />
      </div>

      <div className="col-span-1 flex flex-col gap-6">

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex-grow">
          {isLoadingData ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">Loading data...</div>
          ) : (
            <SpecificDate
              selectedDate={selectedDate}
              userId={currentUserId}
              requiredHours={requiredHours}
              initialData={currentDayRecord}
              onRefreshData={() => fetchWorkData(viewingMonth)}
            />
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          {!isLoadingData && (
            <ReqHours
              userId={currentUserId}
              initialRequiredHours={requiredHours}
              onRefreshData={() => fetchWorkData(viewingMonth)}
            />
          )}
        </div>

      </div>

    </div>
  );
}