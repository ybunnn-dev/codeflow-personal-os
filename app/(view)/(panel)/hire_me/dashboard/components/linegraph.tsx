"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { BarChart3 } from 'lucide-react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <div className="flex-1 min-h-[300px] flex items-center justify-center text-slate-400">Loading chart...</div>
});

// 1. Updated Interface for Applications with Real Dates
interface ApplicationData {
  date: string;
  applications: number;
}

interface LineGraphProps {
  chartData?: ApplicationData[];
}

// 2. Dummy Data for the past week using real dates
const dummyData: ApplicationData[] = [
  { date: "Jun 28", applications: 2 },
  { date: "Jun 29", applications: 5 },
  { date: "Jun 30", applications: 3 },
  { date: "Jul 01", applications: 8 },
  { date: "Jul 02", applications: 4 },
  { date: "Jul 03", applications: 1 },
  { date: "Jul 04", applications: 6 },
];

export default function DailyApplicationsGraph({ chartData = dummyData }: LineGraphProps) {
  
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-transparent dark:border-slate-700/50 shadow-sm min-h-[350px] flex flex-col w-full h-full max-w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h5 className="text-lg font-bold text-slate-900 dark:text-slate-100">Daily Applications</h5>
          </div>
        </div>
        <div className="flex-1 w-full rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
          <BarChart3 size={48} className="mb-3 opacity-50" />
          <p className="font-medium">No chart data available yet.</p>
        </div>
      </div>
    );
  }

  const brandColor = "#D98A5F";

  const series = [
    { 
      name: "Applications", 
      data: chartData.map((d) => d.applications) 
    }
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area", 
      fontFamily: "inherit",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 100
        },
        dynamicAnimation: {
          enabled: true,
          speed: 500
        }
      }
    },
    colors: [brandColor],
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: brandColor,
        gradientToColors: [brandColor],
      },
    },
    tooltip: { 
      enabled: true,
      theme: "dark",
      y: { formatter: (val) => `${val} applications` } 
    },
    markers: { size: 0 },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 4 },
    xaxis: {
      // Mapped to the new 'date' property
      categories: chartData.map((d) => d.date), 
      labels: { style: { colors: '#6B7280' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { 
        style: { colors: '#6B7280' },
        formatter: (val) => val.toFixed(0) 
      }
    },
    grid: {
      borderColor: 'rgba(107, 114, 128, 0.2)',
      strokeDashArray: 4
    },
  };

  return (
    <div className="bg-white mt-2 dark:bg-slate-900 p-4 md:py-6 md:px-6 rounded-xl border border-transparent dark:border-slate-700/50 shadow-sm flex flex-col w-full h-full max-w-full">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h5 className="text-lg font-bold text-slate-900 dark:text-slate-100">Daily Applications</h5>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Daily breakdown of applications sent over the past week.</p>
        </div>
      </div>
      
      <div className="flex-1 w-full -ml-3 mt-2">
        <ReactApexChart 
          options={options} 
          series={series} 
          type="area" 
          height={320} 
          width="100%"
        />
      </div>

      <div className="grid grid-cols-1 border-t border-slate-200 dark:border-slate-700/50 mt-2"></div>
    </div>
  );
}