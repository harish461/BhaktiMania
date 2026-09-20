"use client";

import React, { useEffect } from "react";
import type { AdminAuthorListItem } from "@/lib/data/supabase/admin";

interface AuthorDeactivateModalProps {
  isOpen: boolean;
  isPending: boolean;
  author: AdminAuthorListItem | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function AuthorDeactivateModal({
  isOpen,
  isPending,
  author,
  onCancel,
  onConfirm,
}: AuthorDeactivateModalProps) {
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

  if (!isOpen || !author) return null;

  const articleCount = author.articleCount || 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deactivate-author-modal-title"
      aria-describedby="deactivate-author-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center text-lg font-bold">
            ⚠
          </div>
          <div>
            <h3 id="deactivate-author-modal-title" className="font-heading text-lg font-bold text-amber-950">
              Deactivate Author?
            </h3>
            <p className="text-xs text-amber-700 font-medium">
              Editorial Availability Update
            </p>
          </div>
        </div>

        <div id="deactivate-author-modal-desc" className="text-sm text-[#5A6065] space-y-3">
          <p>
            Are you sure you want to deactivate author &quot;<strong className="text-[#1F2326]">{author.name}</strong>&quot;?
          </p>

          {articleCount > 0 ? (
            <div className="text-xs text-amber-950 font-medium bg-amber-50 p-3.5 rounded-xl border border-amber-200 space-y-2">
              <p className="flex items-center gap-1.5 font-bold text-amber-900">
                <span>📚</span>
                <span>Active Articles Linked: {articleCount}</span>
              </p>
              <p className="leading-relaxed">
                This author is currently assigned to <strong className="text-[#1F2326]">{articleCount}</strong> article(s).
              </p>
              <p className="leading-relaxed">
                <strong>Relational Guarantee:</strong> Existing articles will <strong>strictly retain this author credit</strong>. No articles will be deleted, reassigned, or modified.
              </p>
              <p className="leading-relaxed text-amber-800">
                Once deactivated, this author will no longer be available for new article assignments in the editor.
              </p>
            </div>
          ) : (
            <div className="text-xs text-[#5A6065] bg-[#FDFBF7] p-3 rounded-xl border border-[#6B1724]/10">
              <p>
                This author currently has 0 assigned articles. Marking them inactive will exclude them from future article selections.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#6B1724]/20 text-[#6B1724] text-sm font-semibold hover:bg-[#FDFBF7] disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] cursor-pointer"
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
              <span>Confirm Deactivation</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
