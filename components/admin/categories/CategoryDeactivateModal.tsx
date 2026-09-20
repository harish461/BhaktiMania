"use client";

import React, { useEffect } from "react";

interface CategoryDeactivateModalProps {
  isOpen: boolean;
  isPending: boolean;
  categoryTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CategoryDeactivateModal({
  isOpen,
  isPending,
  categoryTitle,
  onCancel,
  onConfirm,
}: CategoryDeactivateModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deactivate-modal-title"
      aria-describedby="deactivate-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center text-lg font-bold">
            ⚠
          </div>
          <div>
            <h3 id="deactivate-modal-title" className="font-heading text-lg font-bold text-amber-950">
              Deactivate Category?
            </h3>
            <p className="text-xs text-amber-700 font-medium">
              Visibility update
            </p>
          </div>
        </div>

        <div id="deactivate-modal-desc" className="text-sm text-[#5A6065] space-y-2.5">
          <p>
            Are you sure you want to deactivate &quot;<strong className="text-[#1F2326]">{categoryTitle}</strong>&quot;?
          </p>
          <div className="text-xs text-amber-900 font-medium bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
            <p>
              This category will become inactive and will no longer appear as an active category on the public website.
            </p>
            <p className="font-bold">
              Existing articles assigned to it will remain unchanged.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#6B1724]/20 text-[#6B1724] text-sm font-semibold hover:bg-[#F8F4EC] disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 disabled:opacity-50 active:scale-[0.99] transition-all shadow-xs flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deactivating...</span>
              </>
            ) : (
              <span>Deactivate</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
