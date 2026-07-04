import React from 'react';
import { Briefcase, FileText, RefreshCw, XCircle } from 'lucide-react';

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-4 h-full max-h-32">
      
      {/* Card 1: Status (Spans 3 columns on large screens) */}
      <div className="col-span-1 lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-xl border border-transparent dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center min-h-[140px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Status</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">Unemployed Hahahaha</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Actively looking for roles</p>
          </div>
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600">
            <Briefcase size={24} />
          </div>
        </div>
      </div>

      {/* Card 2: Total Applications (Spans 2 columns) */}
      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-transparent dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center min-h-[140px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Applications</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">45</h3>
          </div>
          <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600">
            <FileText size={24} />
          </div>
        </div>
      </div>

      {/* Card 3: Total Updated (Spans 2 columns) */}
      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-transparent dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center min-h-[140px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Updated</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">12</h3>
          </div>
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600">
            <RefreshCw size={24} />
          </div>
        </div>
      </div>

      {/* Card 4: Total Rejections (Spans 2 columns) */}
      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-transparent dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center min-h-[140px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Rejections</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">8</h3>
          </div>
          <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600">
            <XCircle size={24} />
          </div>
        </div>
      </div>

    </div>
  );
}