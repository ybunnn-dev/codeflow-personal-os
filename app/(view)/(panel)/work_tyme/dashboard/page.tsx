"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Import the hook
import Banner from './components/banner';
import SummaryCards from './components/summary_cards';
import Progress from './components/progress';
import LineGraph from './components/linegraph';

export default function DashboardPage() {
  // 1. Grab the session data and loading status
  const { data: session, status } = useSession();
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 2. Safely extract the userId (it will be undefined while loading)
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`/api/work_tyme/dashboard?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        
        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    // 3. Only fetch once the session has successfully loaded the userId
    if (userId) {
      fetchDashboard();
    } else if (status === "unauthenticated") {
      // Failsafe in case a logged-out user bypasses middleware
      setIsDataLoading(false);
    }
  }, [userId, status]);

  // 4. Show the loading spinner if NextAuth is loading OR if your data is fetching
  if (status === "loading" || isDataLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[60vh] text-slate-500">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-[#D98A5F] rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading CodeFlow OS...</p>
        </div>
      </div>
    );
  }

  // Failsafe UI
  if (!session) {
    return <div className="p-4 text-slate-500">Access Denied. Please log in.</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full text-slate-900 dark:text-slate-100 p-2 sm:p-4">
      <Banner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SummaryCards summary={dashboardData?.summary} />
        </div>
        <div className="lg:col-span-1">
          {/* Using optional chaining to prevent undefined errors before render */}
          <Progress 
            currentHours={dashboardData?.summary?.totalHours} 
          />
        </div>
      </div>

      <LineGraph chartData={dashboardData?.chartData} />
    </div>
  );
}