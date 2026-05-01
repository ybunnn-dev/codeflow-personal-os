"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import MentorModal from "./mentor_modal";
import ConfirmModal from "./confirm_modal"; // reuse existing

interface DTRGeneratorProps {
  /** The currently viewed month (used to scope data fetching) */
  viewingMonth: Date;
  /** Export format */
  format: "docx" | "xlsx";
  children: React.ReactNode; // button label / icon slot
}

type Step = "idle" | "mentor" | "confirm" | "loading";

export default function DTRGenerator({ viewingMonth, format, children }: DTRGeneratorProps) {
  const { data: session } = useSession();
  const [step, setStep] = useState<Step>("idle");
  const [mentorName, setMentorName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const monthLabel = viewingMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // ── Step handlers ──────────────────────────────────────────────────────────
  const handleTrigger = () => setStep("mentor");

  const handleMentorConfirm = (name: string) => {
    setMentorName(name);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    if (!session?.user?.id) return;
    setStep("loading");
    setError(null);

    try {
      const monthParam = [
        viewingMonth.getFullYear(),
        String(viewingMonth.getMonth() + 1).padStart(2, "0"),
      ].join("-");

      const res = await fetch(
        `/api/work_tyme/work_hours/dtr/generate?userId=${session.user.id}&month=${monthParam}&mentor=${encodeURIComponent(mentorName)}&format=${format}`
      );

      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DTR_${monthParam}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message ?? "Failed to generate DTR.");
    } finally {
      setStep("idle");
    }
  };

  const handleCancel = () => {
    setStep("idle");
    setMentorName("");
  };

  return (
    <>
      {/* Trigger — renders whatever children are passed */}
      <button
        onClick={handleTrigger}
        disabled={step === "loading"}
        className="contents"  // lets parent control all button styling
      >
        {children}
      </button>

      {/* Step 1: Mentor name */}
      <MentorModal
        isOpen={step === "mentor"}
        onClose={handleCancel}
        onConfirm={handleMentorConfirm}
      />

      {/* Step 2: Confirmation (reuse existing ConfirmModal) */}
      <ConfirmModal
        isOpen={step === "confirm" || step === "loading"}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        isLoading={step === "loading"}
        title="Generate DTR"
        message={`Export DTR for ${monthLabel} as a ${format.toUpperCase()} file? Mentor / In-Charge: ${mentorName}`}
        confirmText={`Export ${format.toUpperCase()}`}
      />

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-sm px-5 py-3 rounded-xl shadow-lg">
          {error}
        </div>
      )}
    </>
  );
}