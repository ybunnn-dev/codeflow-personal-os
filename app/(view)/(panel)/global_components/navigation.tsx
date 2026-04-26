// app/(view)/(panel)/global_components/navigation.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; 
import { useTheme } from "../../../providers";
import AppsShortcut from "./apps_shortcut";
import ProfileToggle from "./profile_toggle";

export default function Navigation() {
  const { isDarkMode, toggleTheme } = useTheme();
  const pathname = usePathname(); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide the navigation entirely on the login page
  if (pathname?.includes("/login")) {
    return null;
  }

  const isHomepage = pathname === "/homepage"; 

  // Map the current URL path to an Application Name
  const getActiveApp = (path: string | null) => {
    if (!path) return null;
    if (path.includes("/smart_doc")) return "Smart Doc";
    if (path.includes("/pm_plus")) return "PM+";       
    if (path.includes("/inventory")) return "Inventory++";
    if (path.includes("/work_tyme")) return "WorkTyme";
    return null; 
  };

  const activeApp = getActiveApp(pathname);

  return (
    <nav className="w-full bg-[#F4F4F0] dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${
            isHomepage ? "max-w-7xl" : "max-w-full"
        }`}
        >
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand Area */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tight flex items-center">
              <div>
                <span className="text-slate-800 dark:text-slate-100">Code</span>
                <span className="text-[#D98A5F]">Flow</span>
              </div>
              
              {/* Dynamic App Name Injection */}
              {activeApp && (
                <div className="flex items-center ml-2 text-slate-500 dark:text-slate-400 font-medium border-l-2 border-slate-300 dark:border-slate-700 pl-2">
                  <span className="text-lg">{activeApp}</span>
                </div>
              )}
            </Link>
          </div>

          {/* Controls & Profile Area */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className={`relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none ${
                mounted && isDarkMode ? "bg-slate-700" : "bg-gray-300"
              }`}
              aria-label="Toggle Dark Mode"
            >
              <svg className="absolute left-1.5 w-4 h-4 text-gray-100" viewBox="0 0 64 64" fill="currentColor">
                <circle cx="32" cy="32" r="16"></circle>
              </svg>
              <svg className="absolute right-1.5 w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
              <div 
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 z-10 flex items-center justify-center ${
                  mounted && isDarkMode ? "translate-x-8" : "translate-x-0"
                }`}
              ></div>
            </button>

            {/* --- NEW: Home Button --- */}
            <Link 
              href="/homepage" // Adjust to "/" if your root page is your actual homepage
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors focus:outline-none flex items-center justify-center"
              aria-label="Go to Homepage"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            {/* Google-style Apps Grid */}
            <AppsShortcut />

            {/* Profile Dropdown */}
            <ProfileToggle />

          </div>
        </div>
      </div>
    </nav>
  );
}