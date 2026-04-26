// app/(view)/(panel)/work_tyme/layout.tsx
import React from "react";
import Sidebar from "./partials/sidebar";

export default function WorkTymeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // min-h-[calc(100vh-4rem)] ensures it takes full height minus the 64px (h-16) top navigation bar
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}