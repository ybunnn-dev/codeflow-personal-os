import React from 'react';

export default function Banner() {
  return (
    <div className="bg-[#F2E5B2] dark:bg-slate-800/50 p-6 sm:p-8 rounded-xl shadow-sm border border-transparent dark:border-slate-700/50 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        Hi, Welcome to <span className="text-[#D98A5F] dark:text-[#E2A07D]">WorkTyme.</span>
      </h2>
      <p className="text-sm text-slate-700 dark:text-slate-300 max-w-4xl leading-relaxed">
        WorkTyme is a smart OJT time tracking system designed to help students efficiently log their working hours, monitor internship progress, and stay organized throughout their on-the-job training. By providing a structured and reliable way to record daily activities, WorkTyme ensures transparency, accountability, and a smoother overall internship experience.
      </p>
    </div>
  );
}