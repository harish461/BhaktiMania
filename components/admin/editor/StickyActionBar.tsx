"use client";

import React from "react";

export type SaveState =
  | "saved"
  | "unsaved"
  | "saving"
  | "publishing"
  | "unpublishing"
  | "deleting";

interface StickyActionBarProps {
  mode: "create" | "edit";
  currentStatus: "draft" | "published" | "archived";
  saveState: SaveState;
  lastSavedAt: Date | null;
  onSaveDraft: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onDeleteClick: () => void;
  onPreviewClick: () => void;
  isSubmitting: boolean;
}

function formatTime(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function StickyActionBar({
  mode,
  currentStatus,
  saveState,
  lastSavedAt,
  onSaveDraft,
  onPublish,
  onUnpublish,
  onDeleteClick,
  onPreviewClick,
  isSubmitting,
}: StickyActionBarProps) {
  const isPublished = mode === "edit" && currentStatus === "published";
  const isDraft = mode === "create" || currentStatus === "draft";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#6B1724]/15 py-3 px-4 sm:px-8 shadow-[0_-6px_25px_rgba(107,23,36,0.08)]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Save State Status Indicator */}
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium" role="status" aria-live="polite">
          {saveState === "saving" && (
            <div className="flex items-center gap-2 text-[#6B1724]">
              <span className="w-3.5 h-3.5 border-2 border-[#6B1724]/30 border-t-[#6B1724] rounded-full animate-spin" />
              <span>Saving draft...</span>
            </div>
          )}

          {saveState === "publishing" && (
            <div className="flex items-center gap-2 text-[#D97706]">
              <span className="w-3.5 h-3.5 border-2 border-[#D97706]/30 border-t-[#D97706] rounded-full animate-spin" />
              <span>Publishing article...</span>
            </div>
          )}

          {saveState === "unpublishing" && (
            <div className="flex items-center gap-2 text-amber-700">
              <span className="w-3.5 h-3.5 border-2 border-amber-500/30 border-t-amber-600 rounded-full animate-spin" />
              <span>Moving to draft...</span>
            </div>
          )}

          {saveState === "deleting" && (
            <div className="flex items-center gap-2 text-red-600">
              <span className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-600 rounded-full animate-spin" />
              <span>Deleting draft...</span>
            </div>
          )}

          {saveState === "unsaved" && (
            <div className="flex items-center gap-2 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
              <span>Unsaved changes</span>
            </div>
          )}

          {saveState === "saved" && (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <span className="text-emerald-600 font-bold" aria-hidden="true">✓</span>
              <span>
                {lastSavedAt ? `Saved at ${formatTime(lastSavedAt)}` : "All changes saved"}
              </span>
            </div>
          )}
        </div>

        {/* Right: Adaptive Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          {/* Delete Draft Button (Draft only) */}
          {mode === "edit" && isDraft && (
            <button
              type="button"
              onClick={onDeleteClick}
              disabled={isSubmitting}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-40 border border-transparent hover:border-red-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              Delete Draft
            </button>
          )}

          {/* Live Preview Button */}
          <button
            type="button"
            onClick={onPreviewClick}
            disabled={isSubmitting}
            className="min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#6B1724] bg-[#F8F4EC] hover:bg-[#F1EADF] disabled:opacity-40 border border-[#6B1724]/15 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
          >
            <span className="text-[#D97706]" aria-hidden="true">👁</span>
            <span>Preview</span>
          </button>

          {/* If Published Article */}
          {isPublished && (
            <>
              <button
                type="button"
                onClick={onUnpublish}
                disabled={isSubmitting}
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 border border-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
              >
                Unpublish to Draft
              </button>

              <button
                type="button"
                onClick={onPublish}
                disabled={isSubmitting}
                className="min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#6B1724] hover:bg-[#52111C] disabled:opacity-50 active:scale-[0.99] transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] focus-visible:ring-offset-2"
              >
                {saveState === "publishing" ? "Saving Changes..." : "Save Changes"}
              </button>
            </>
          )}

          {/* If Draft / New Article */}
          {isDraft && (
            <>
              <button
                type="button"
                onClick={onSaveDraft}
                disabled={isSubmitting}
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#6B1724] bg-white hover:bg-[#F8F4EC] disabled:opacity-40 border border-[#6B1724]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
              >
                {saveState === "saving" ? "Saving Draft..." : "Save Draft"}
              </button>

              <button
                type="button"
                onClick={onPublish}
                disabled={isSubmitting}
                className="min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#6B1724] to-[#8C1D2F] hover:from-[#52111C] hover:to-[#6B1724] disabled:opacity-50 active:scale-[0.99] transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] focus-visible:ring-offset-2"
              >
                {saveState === "publishing" ? "Publishing..." : "Publish Article"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
