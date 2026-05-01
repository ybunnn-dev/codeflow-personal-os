"use client";

import { useState } from "react";

interface MentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mentorName: string) => void;
}

export default function MentorModal({ isOpen, onClose, onConfirm }: MentorModalProps) {
  const [mentorName, setMentorName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!mentorName.trim()) return;
    onConfirm(mentorName.trim());
    setMentorName("");
  };

  const handleClose = () => {
    setMentorName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Generate DTR
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Enter the name of your supervisor / mentor
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Mentor / In-Charge Name
          </label>
          <input
            type="text"
            value={mentorName}
            onChange={(e) => setMentorName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g. Juan Dela Cruz"
            autoFocus
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D98A5F]/50 focus:border-[#D98A5F] transition-colors text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!mentorName.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#D98A5F] hover:bg-[#c97a4f] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}