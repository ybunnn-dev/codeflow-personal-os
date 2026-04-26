import React from 'react';

// 1. Removed totalRequired from the props completely so it can't be passed in
interface ProgressProps {
  currentHours?: number;
}

const formatTime = (decimalHours?: number) => {
  if (!decimalHours) return "0h 0m";
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

// 2. Removed totalRequired from the function arguments
export default function Progress({ currentHours = 0 }: ProgressProps) {
  
  // 3. HARDCODED 486 directly into the math. No variables.
  let percentage = Math.round((currentHours / 486) * 100);
  if (percentage > 100) percentage = 100;
  
  const radius = 15.9155;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-transparent dark:border-slate-700/50 shadow-sm flex flex-col items-center justify-center h-full min-h-[296px]">
      <div className="relative flex items-center justify-center w-48 h-48 mb-4">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <path
            className="text-slate-100 dark:text-slate-800"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-emerald-400 transition-all duration-1000 ease-in-out"
            strokeWidth="3.5"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{percentage}%</span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            {/* 4. HARDCODED 486h directly into the text display */}
            {formatTime(currentHours)} / 486h
          </span>
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Internship Progress</h3>
    </div>
  );
}