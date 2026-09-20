"use client";

import React, { useEffect } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  articleTitle: string;
}

export function DeleteConfirmModal({
  isOpen,
  isDeleting,
  onCancel,
  onConfirm,
  articleTitle,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-red-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-200 text-red-700 flex items-center justify-center text-lg font-bold">
            ⚠
          </div>
          <div>
            <h3 id="delete-modal-title" className="font-heading text-lg font-bold text-red-950">
              Delete this draft?
            </h3>
            <p className="text-xs text-red-600 font-medium">
              Permanent draft deletion
            </p>
          </div>
        </div>

        <div id="delete-modal-desc" className="text-sm text-[#5A6065] space-y-2">
          <p>
            Are you sure you want to delete &quot;<strong className="text-[#1F2326]">{articleTitle || "Untitled Draft"}</strong>&quot;?
          </p>
          <p className="text-xs text-red-700 font-medium bg-red-50 p-2.5 rounded-xl border border-red-200">
            This action cannot be undone. All content in this draft will be permanently removed.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#6B1724]/20 text-[#6B1724] text-sm font-semibold hover:bg-[#F8F4EC] disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 active:scale-[0.99] transition-all shadow-xs flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Draft</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
