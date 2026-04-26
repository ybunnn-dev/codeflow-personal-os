// app/(view)/(panel)/work_tyme/dashboard/page.tsx
import React from 'react';

export default function DashboardPage() {
  return (
    <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl flex items-center justify-center bg-gray-50/50 dark:bg-slate-800/20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">WorkTyme Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Overview module coming soon.</p>
      </div>
    </div>
  );
}