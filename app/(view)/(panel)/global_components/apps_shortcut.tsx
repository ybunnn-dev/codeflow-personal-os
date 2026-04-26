// app/(view)/(panel)/global_components/apps_shortcut.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function AppsShortcut() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if you click outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const apps = [
    { name: "Smart Doc", href: "/smart_doc", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
    { name: "PM+", href: "#", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
    { name: "Inventory++", href: "#", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
    { name: "WorkTyme", href: "/work_tyme/dashboard", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* 9-Dot Grid Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors focus:outline-none"
        aria-label="CodeFlow Apps"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>

      {/* Apps Dropdown Grid */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50 p-4 transform origin-top-right transition-all">
          <div className="grid grid-cols-2 gap-4">
            {apps.map((app) => (
              <Link 
                key={app.name} 
                href={app.href}
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className={`w-12 h-12 ${app.color} rounded-full flex items-center justify-center mb-2`}>
                   <span className="font-bold">{app.name.charAt(0)}</span>
                </div>
                <span className="text-xs text-center text-slate-700 dark:text-slate-300 font-medium">
                  {app.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}