"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { BarChart3 } from 'lucide-react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <div className="flex-1 min-h-[300px] flex items-center justify-center text-slate-400">Loading chart...</div>
});

interface LineGraphProps {
  chartData?: Array<{ month: string; average: number }>;
}

export default function LineGraph({ chartData = [] }: LineGraphProps) {
  
  if (!chartData || chartData.length === 0) {
    return (
      <div className="max-w-full max-h-full lg:max-h-full h-full w-full bg-slate-50 dark:bg-[#1a1b1d] rounded-md p-4 md:py-6 md:px-3 flex flex-col min-h-[350px]">
        <div className="flex justify-between items-start mb-4">
          <div className="px-3">
            <h5 className="text-lg text-slate-800 dark:text-white font-semibold">Average Hours Per Month</h5>
          </div>
        </div>
        <div className="flex-1 w-full rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
          <BarChart3 size={48} className="mb-3 opacity-50" />
          <p className="font-medium">No chart data available yet.</p>
        </div>
      </div>
    );
  }

  const brandColor = "#D98A5F"; // WorkTyme's accent color

  const series = [
    { 
      name: "Average Hours", 
      data: chartData.map((d) => d.average) 
    }
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area", // Changed to area based on the Laravel example
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
    // Kept tooltips enabled for better React Dashboard UX, using dark theme so it looks good everywhere
    tooltip: { 
      enabled: true,
      theme: "dark",
      y: { formatter: (val) => `${val} hours` }
    },
    markers: { size: 0 },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 4 },
    xaxis: {
      categories: chartData.map((d) => d.month),
      labels: { style: { colors: '#6B7280' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { 
        style: { colors: '#6B7280' },
        formatter: (val) => `${val}h`
      }
    },
    grid: {
      borderColor: 'rgba(107, 114, 128, 0.2)', // Uses an rgba value to blend seamlessly with both light and #1a1b1d dark mode
      strokeDashArray: 4
    },
  };

  return (
    <div className="max-w-full max-h-full lg:max-h-full h-full w-full bg-slate-50 dark:bg-[#1a1b1d] rounded-md p-4 md:py-6 md:px-3 flex flex-col shadow-sm">
      <div className="flex justify-between items-start">
        <div className="px-3">
          <h5 className="text-lg text-slate-800 dark:text-white font-semibold">Average Hours Rendered</h5>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Monthly breakdown of OJT hours.</p>
        </div>
      </div>
      
      <div className="flex-1 w-full -ml-3 mt-4">
        <ReactApexChart 
          options={options} 
          series={series} 
          type="area" 
          height={320} 
          width="100%"
        />
      </div>

      <div className="grid grid-cols-1 border-slate-200 dark:border-gray-700/50 border-t mt-2"></div>
    </div>
  );
}