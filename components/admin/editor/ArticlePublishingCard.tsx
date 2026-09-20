"use client";

import React from "react";
import type { AdminArticleDetail } from "@/lib/data/supabase/admin";

interface ArticlePublishingCardProps {
  initialArticle?: AdminArticleDetail | null;
  mode: "create" | "edit";
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "Not available";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function ArticlePublishingCard({
  initialArticle,
  mode,
}: ArticlePublishingCardProps) {
  const status = initialArticle?.status || "draft";
  const isPublished = status === "published";
  const isArchived = status === "archived";

  return (
    <div className="bg-[#FDFBF7] rounded-3xl p-5 sm:p-8 border border-[#6B1724]/12 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#6B1724]/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6B1724]" aria-hidden="true" />
          <h2 className="font-heading text-lg sm:text-xl font-bold text-[#6B1724]">
            D. Publishing & Lifecycle
          </h2>
        </div>

        {/* Status Badge */}
        {isPublished ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            ● Published
          </span>
        ) : isArchived ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">
            ● Archived
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            ● Draft
          </span>
        )}
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#6B1724]/10">
          <span className="text-[11px] font-semibold text-[#5A6065] uppercase tracking-wider block mb-1">
            Status
          </span>
          <span className="text-sm font-bold text-[#1F2326] capitalize">
            {mode === "create" ? "New Draft" : status}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#6B1724]/10">
          <span className="text-[11px] font-semibold text-[#5A6065] uppercase tracking-wider block mb-1">
            Publicly Visible
          </span>
          <span className={`text-sm font-bold ${isPublished ? "text-emerald-700" : "text-amber-700"}`}>
            {isPublished ? "Yes (Public)" : "No (Hidden)"}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#6B1724]/10">
          <span className="text-[11px] font-semibold text-[#5A6065] uppercase tracking-wider block mb-1">
            Published Date
          </span>
          <span className="text-xs font-medium text-[#1F2326] truncate block">
            {isPublished && initialArticle?.published_at
              ? formatDate(initialArticle.published_at)
              : "Not published yet"}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#6B1724]/10">
          <span className="text-[11px] font-semibold text-[#5A6065] uppercase tracking-wider block mb-1">
            Last Updated
          </span>
          <span className="text-xs font-medium text-[#1F2326] truncate block">
            {initialArticle?.updated_at
              ? formatDate(initialArticle.updated_at)
              : "Unsaved"}
          </span>
        </div>
      </div>

      {/* Status Notice Message Box */}
      <div
        className={`p-4 rounded-2xl border flex items-start gap-3 ${
          isPublished
            ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
            : isArchived
            ? "bg-gray-50 border-gray-200 text-gray-800"
            : "bg-amber-50/70 border-amber-200 text-amber-900"
        }`}
      >
        <span className="text-base leading-none mt-0.5">
          {isPublished ? "✓" : isArchived ? "📁" : "ℹ"}
        </span>
        <div className="text-xs sm:text-sm space-y-0.5">
          <p className="font-semibold">
            {isPublished
              ? "This article is currently published and visible on the public website."
              : isArchived
              ? "This article is currently archived."
              : "This article is currently a draft and is not visible publicly."}
          </p>
          <p className="text-xs opacity-85">
            {isPublished
              ? "Visitors can access this article via /bhakti-gyaan and direct links. Any updates saved will immediately reflect publicly."
              : isArchived
              ? "Archived articles are preserved for editorial reference but hidden from public listings."
              : "Draft content is strictly shielded from public visitors and search engines until published."}
          </p>
        </div>
      </div>
    </div>
  );
}
