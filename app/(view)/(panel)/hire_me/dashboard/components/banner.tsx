import React from 'react';

export default function Banner() {
  return (
    <div className="bg-[#F2E5B2] dark:bg-slate-800/50 p-6 sm:p-8 rounded-xl shadow-sm border border-transparent dark:border-slate-700/50 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        Hi, Welcome to <span className="text-[#D98A5F] dark:text-[#E2A07D]">HireMe.</span>
      </h2>
      <p className="text-sm text-slate-700 dark:text-slate-300 max-w-4xl leading-relaxed">
        HireMe is a personal job application tracking platform that helps job seekers organize applications, monitor progress, manage interview schedules, and streamline their journey toward employment.
      </p>
    </div>
  );
}