// app/(view)/(panel)/homepage/components/tools_section.tsx

import React from 'react';

// Define your integrated applications here
const applications = [
  {
    name: "Smart Doc",
    description: "An archiving system for managing, routing, and tracking soft copies of documents.",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    name: "PM+",
    description: "A comprehensive project manager system containing essential project management and tracking tools.",
    color: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    name: "Inventory++",
    description: "A smart inventory management system designed to seamlessly track stocks and resources.",
    color: "bg-green-100 dark:bg-green-900/30",
  },
  {
    name: "WorkTyme",
    description: "A smart OJT time tracker for logging hours and managing internship progress.",
    color: "bg-orange-100 dark:bg-orange-900/30",
  }
];

export default function ToolsSection() {
  return (
    <section>
      <div className="border-b border-slate-800/20 dark:border-slate-700 pb-2 mb-8 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-[#1E293B] dark:text-slate-100">
          Tools
        </h2>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Render Actual Apps */}
        {applications.map((app, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex gap-4 h-40 cursor-pointer border border-transparent dark:border-slate-700"
          >
            {/* App Icon Placeholder (Colored block) */}
            <div className={`w-24 h-24 ${app.color} rounded-lg flex-shrink-0 flex items-center justify-center`}>
               {/* You can swap this text out for actual SVG icons later */}
               <span className="text-2xl font-bold opacity-40">{app.name.charAt(0)}</span>
            </div>
            
            {/* App Details */}
            <div className="flex flex-col">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">
                {app.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-4 leading-relaxed">
                {app.description}
              </p>
            </div>
          </div>
        ))}

        {/* Render 2 Empty Placeholders to complete the 3x2 grid look */}
        {[...Array(2)].map((_, index) => (
          <div 
            key={`empty-${index}`} 
            className="bg-gray-50 dark:bg-slate-800/50 border border-dashed border-gray-200 dark:border-slate-700 rounded-xl h-40 flex items-center justify-center"
          >
            <span className="text-gray-400 dark:text-slate-500 text-sm font-medium">Coming Soon</span>
          </div>
        ))}

      </div>
    </section>
  );
}