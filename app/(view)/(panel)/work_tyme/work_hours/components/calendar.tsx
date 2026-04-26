import { useState, useEffect } from "react";

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  viewingMonth: Date;
  onMonthChange: (date: Date) => void;
  dailyStatuses?: Record<string, "Exact" | "Undertime" | "Overtime" | "No Record">;
}

export default function Calendar({ 
  selectedDate, 
  onDateSelect,
  viewingMonth,
  onMonthChange,
  dailyStatuses = {} 
}: CalendarProps) {
  const daysInMonth = new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewingMonth.getFullYear(), viewingMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handlePrevMonth = () => {
    onMonthChange(new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    onMonthChange(new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() + 1, 1));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Exact": return "bg-green-500 dark:bg-green-400";
      case "Overtime": return "bg-blue-500 dark:bg-blue-400";
      case "Undertime": return "bg-orange-500 dark:bg-orange-400";
      default: return "bg-transparent";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 p-4 rounded-xl transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {viewingMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={handlePrevMonth} 
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            &larr; Prev
          </button>
          <button 
            onClick={handleNextMonth} 
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Next &rarr;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 flex-grow">
        {paddingDays.map((_, i) => (
          <div 
            key={`pad-${i}`} 
            className="p-2 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg border border-transparent border-dashed"
          ></div>
        ))}

        {days.map((day) => {
          const currentDate = new Date(viewingMonth.getFullYear(), viewingMonth.getMonth(), day);
          const isSelected = isSameDay(currentDate, selectedDate);
          const isToday = isSameDay(currentDate, new Date());

          const dateString = [
            currentDate.getFullYear(),
            String(currentDate.getMonth() + 1).padStart(2, '0'),
            String(currentDate.getDate()).padStart(2, '0'),
          ].join('-');
          const status = dailyStatuses[dateString];

          return (
            <button
              key={day}
              onClick={() => onDateSelect(currentDate)}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all
                ${isSelected 
                  ? "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/40" 
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 bg-white dark:bg-gray-800"}
                ${isToday && !isSelected ? "ring-2 ring-blue-200 dark:ring-blue-800" : ""}
                h-24
              `}
            >
              <span className={`text-lg ${isSelected ? "font-bold text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"}`}>
                {day}
              </span>
              <div className="mt-2 h-2 flex gap-1">
                {status && status !== "No Record" && (
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} title={status}></span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}