// app/(view)/(panel)/global_components/profile_toggle.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function ProfileToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Hook into NextAuth
  const { data: session, status } = useSession();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format the display data safely
  const firstName = session?.user?.firstName || "";
  const lastName = session?.user?.lastName || "";
  const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : session?.user?.email || "User";
  const userField = session?.user?.fieldName || "CodeFlow User";
  
  // Grab the first initial for a clean avatar
  const initial = firstName ? firstName.charAt(0).toUpperCase() : fullName.charAt(0).toUpperCase();

  // Simple loading skeleton for the avatar button
  if (status === "loading") {
    return <div className="w-10 h-10 bg-gray-300 dark:bg-slate-700 animate-pulse rounded-full"></div>;
  }

  // If no user is logged in, you could return null or a generic login button here
  if (!session) return null; 

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Icon Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-[#D98A5F] text-white hover:ring-2 ring-gray-300 dark:ring-slate-600 rounded-full flex items-center justify-center cursor-pointer transition-all focus:outline-none font-bold text-lg"
        aria-label="User menu"
      >
        {initial}
      </button>

      {/* Profile Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden transform origin-top-right transition-all">
          
          {/* User Summary Header */}
          <div className="px-4 py-5 bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700 flex flex-col items-center">
             <div className="w-16 h-16 bg-[#D98A5F] text-white rounded-full flex items-center justify-center mb-3 text-2xl font-bold shadow-sm">
               {initial}
             </div>
             <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{fullName}</p>
             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{userField}</p>
          </div>

          {/* Menu Actions */}
          <div className="py-2">
            <Link 
              href="/settings" 
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Settings
            </Link>
            <button 
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: '/login' }); // Adjust redirect path as needed
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}