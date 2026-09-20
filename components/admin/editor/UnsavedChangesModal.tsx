"use client";

import React, { useEffect } from "react";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export function UnsavedChangesModal({
  isOpen,
  onStay,
  onLeave,
}: UnsavedChangesModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onStay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onStay]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-modal-title"
      aria-describedby="unsaved-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#6B1724]/15 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center text-lg font-bold">
            !
          </div>
          <div>
            <h3 id="unsaved-modal-title" className="font-heading text-lg font-bold text-[#1F2326]">
              Unsaved changes
            </h3>
            <p className="text-xs text-[#5A6065]">
              Form has pending modifications
            </p>
          </div>
        </div>

        <p id="unsaved-modal-desc" className="text-sm text-[#5A6065] leading-relaxed">
          You have unsaved changes. Are you sure you want to leave? Any unsaved edits will be discarded.
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onStay}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#6B1724]/20 text-[#6B1724] text-sm font-semibold hover:bg-[#F8F4EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
          >
            Stay
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 active:scale-[0.99] transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
