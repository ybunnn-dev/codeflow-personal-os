"use client";

import { useState, useEffect } from "react";
import ConfirmModal from "./confirm_modal";

interface ReqHoursProps {
  userId: string;
  initialRequiredHours: number;
  onRefreshData: () => void;
}

export default function ReqHours({ userId, initialRequiredHours, onRefreshData }: ReqHoursProps) {
  const [requiredHours, setRequiredHours] = useState<number>(initialRequiredHours);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  // Keep synced if parent data changes
  useEffect(() => {
    setRequiredHours(initialRequiredHours);
  }, [initialRequiredHours]);

  const handleUpdateClick = () => {
    setModalConfig({
      isOpen: true,
      title: "Change Required Hours",
      message: `This will change your daily target to ${requiredHours} hours. Proceed?`,
    });
  };

  const executeUpdate = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/work_tyme/work_hours/required_hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, hours: Number(requiredHours) }),
      });

      if (!response.ok) throw new Error("Failed to update required hours");

      setModalConfig({ ...modalConfig, isOpen: false });
      onRefreshData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-3 text-gray-900 dark:text-gray-100">
      <h4 className="text-sm font-bold border-b border-gray-200 dark:border-gray-700 pb-2">Target Settings</h4>
      <div className="grid grid-cols-1 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Required Hours</label>
          <input 
            type="number" 
            step="0.5"
            value={requiredHours} 
            onChange={(e) => setRequiredHours(Number(e.target.value))}
            className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button 
          onClick={handleUpdateClick}
          disabled={isProcessing || requiredHours === initialRequiredHours}
          className="w-full py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Update Target
        </button>
      </div>

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        isLoading={isProcessing}
        onConfirm={executeUpdate}
        onCancel={() => !isProcessing && setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  );
}