import React from 'react';
import { Clock, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';

interface SummaryCardsProps {
  summary?: {
    totalHours: number;
    requiredHours: number; 
    totalDays: number;
    averageHours: number;
  };
}

const formatTime = (decimalHours?: number) => {
  if (!decimalHours) return "0h 0m";
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    { 
      title: "Total Hours", 
      value: formatTime(summary?.totalHours), 
      icon: Clock, 
      color: "text-blue-600", 
      bg: "bg-blue-100 dark:bg-blue-900/40" 
    },
    { 
      title: "Daily Required Hours", 
      value: `${summary?.requiredHours || 0}h`, 
      subtext: "Total overall required hours is 486", // <-- Added subtext here
      icon: CheckCircle2, 
      color: "text-indigo-600", 
      bg: "bg-indigo-100 dark:bg-indigo-900/40" 
    },
    { 
      title: "Total Days Rendered", 
      value: summary?.totalDays || 0, 
      icon: Calendar, 
      color: "text-purple-600", 
      bg: "bg-purple-100 dark:bg-purple-900/40" 
    },
    { 
      title: "Avg Hours Rendered", 
      value: formatTime(summary?.averageHours), 
      icon: TrendingUp, 
      color: "text-orange-600", 
      bg: "bg-orange-100 dark:bg-orange-900/40" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-transparent dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center min-h-[140px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{card.value}</h3>
                
                {/* Conditionally render subtext if it exists */}
                {card.subtext && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {card.subtext}
                  </p>
                )}
                
              </div>
              <div className={`p-3 rounded-full ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}