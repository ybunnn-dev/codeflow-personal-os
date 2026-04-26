"use client";

import { useState, useEffect, useMemo } from "react";
import ConfirmModal from "./confirm_modal";

interface WorkHourRecord {
  id?: string;
  userId: string;
  date: string;
  time_in_am: string;
  time_out_am: string;
  time_in_pm: string;
  time_out_pm: string;
}

interface SpecificDateProps {
  selectedDate: Date;
  userId: string;
  initialData?: WorkHourRecord | null;
  requiredHours: number; // We need this to calculate the status!
  onRefreshData: () => void;
}

export default function SpecificDate({ 
  selectedDate, 
  userId, 
  initialData, 
  requiredHours, 
  onRefreshData 
}: SpecificDateProps) {
  
  const toTimeInput = (val?: string) => val || "";
  const [timeInAm, setTimeInAm]   = useState(toTimeInput(initialData?.time_in_am));
  const [timeOutAm, setTimeOutAm] = useState(toTimeInput(initialData?.time_out_am));
  const [timeInPm, setTimeInPm]   = useState(toTimeInput(initialData?.time_in_pm));
  const [timeOutPm, setTimeOutPm] = useState(toTimeInput(initialData?.time_out_pm));
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state when a new date is clicked
  useEffect(() => {
    setTimeInAm(toTimeInput(initialData?.time_in_am));
    setTimeOutAm(toTimeInput(initialData?.time_out_am));
    setTimeInPm(toTimeInput(initialData?.time_in_pm));
    setTimeOutPm(toTimeInput(initialData?.time_out_pm));
  }, [selectedDate, initialData]);

  // --- Real-Time Calculation Logic ---
  const { totalHours, status, differenceHours } = useMemo(() => {
    // Helper to convert "HH:mm" to total minutes
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

    // Scenario 1: User explicitly fills out pairs
    if (timeInAm && timeOutAm) totalMins += (amOutMins - amInMins);
    if (timeInPm && timeOutPm) totalMins += (pmOutMins - pmInMins);

    // Scenario 2: "Lazy Input" - User just puts AM IN and PM OUT
    if (timeInAm && !timeOutAm && !timeInPm && timeOutPm) {
      let diff = pmOutMins - amInMins;
      // Deduct 1 hour (60 mins) for lunch if the span crosses 12:00 PM to 1:00 PM
      if (amInMins <= 12 * 60 && pmOutMins >= 13 * 60) {
        diff -= 60;
      }
      totalMins += diff;
    }

    // Convert back to hours (rounded to 2 decimal places)
    const hours = Math.max(0, totalMins / 60);
    const formattedHours = Math.round(hours * 100) / 100;

    // Determine Status & Difference
    let currentStatus = "No Record";
    let diff = 0;

    if (formattedHours > 0) {
      if (formattedHours < requiredHours) {
        currentStatus = "Undertime";
        diff = requiredHours - formattedHours;
      } else if (formattedHours > requiredHours) {
        currentStatus = "Overtime";
        diff = formattedHours - requiredHours;
      } else {
        currentStatus = "Exact Time";
      }
    }

    return { 
      totalHours: formattedHours, 
      status: currentStatus,
      differenceHours: Math.round(diff * 100) / 100 // Ensure clean decimals
    };
  }, [timeInAm, timeOutAm, timeInPm, timeOutPm, requiredHours]);

  // --- UI Helpers ---
  const getStatusColor = () => {
    switch (status) {
      case "Exact Time": return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "Overtime": return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "Undertime": return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
      default: return "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  const executeUpdate = async () => {
    setIsProcessing(true);
    try {
      const dailyData = {
        id: initialData?.id,
        userId,
        date: [
          selectedDate.getFullYear(),
          String(selectedDate.getMonth() + 1).padStart(2, '0'),
          String(selectedDate.getDate()).padStart(2, '0'),
        ].join('-'),
        time_in_am: timeInAm,
        time_out_am: timeOutAm,
        time_in_pm: timeInPm,
        time_out_pm: timeOutPm,
      };

      const response = await fetch("/api/work_tyme/work_hours/update_hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dailyData),
      });

      if (!response.ok) throw new Error("Failed to update work hours");

      setIsModalOpen(false);
      onRefreshData(); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 text-gray-900 dark:text-gray-100">
      
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-bold">
          {selectedDate.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your daily logs</p>
      </div>

      {/* Time Inputs */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">AM IN</label>
            <input type="time" value={timeInAm} onChange={(e) => setTimeInAm(e.target.value)} className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 outline-none"/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">AM OUT</label>
            <input type="time" value={timeOutAm} onChange={(e) => setTimeOutAm(e.target.value)} className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 outline-none"/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">PM IN</label>
            <input type="time" value={timeInPm} onChange={(e) => setTimeInPm(e.target.value)} className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 outline-none"/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">PM OUT</label>
            <input type="time" value={timeOutPm} onChange={(e) => setTimeOutPm(e.target.value)} className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 outline-none"/>
          </div>
        </div>

        {/* --- Real-Time Status Display --- */}
        <div className="mt-2 flex flex-col bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Rendered</span>
              <span className="text-2xl font-bold">
                {totalHours > 0 
                  ? `${Math.floor(totalHours)}h ${Math.round((totalHours % 1) * 60)}m` 
                  : '--'}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${getStatusColor()}`}>
              {status}
            </div>
          </div>


          {status !== "No Record" && status !== "Exact Time" && differenceHours > 0 && (
            <div className="px-4 py-3 bg-white/50 dark:bg-gray-900/30 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between transition-all">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {status === "Overtime" ? "Excess Time (Overtime)" : "Lacking Time (Undertime)"}
              </span>
              <span className={`text-sm font-bold ${
                status === "Overtime" ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"
              }`}>
                {status === "Overtime" ? "+" : "-"}
                {Math.floor(differenceHours)}h {Math.round((differenceHours % 1) * 60)}m
              </span>
            </div>
          )}
        </div>
        
        <button onClick={() => setIsModalOpen(true)} disabled={isProcessing} className="w-full py-2 mt-2 bg-mocha text-white rounded-md dark:bg-[#d88a64] hover:bg-mocha/80 disabled:opacity-50 disabled:cursor-not-allowed font-bold">
          Save Daily Logs
        </button>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        title="Update Work Hours"
        message={`Save time logs for ${selectedDate.toLocaleDateString()}?`}
        isLoading={isProcessing}
        onConfirm={executeUpdate}
        onCancel={() => !isProcessing && setIsModalOpen(false)}
      />
    </div>
  );
}