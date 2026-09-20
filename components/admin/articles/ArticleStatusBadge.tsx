import React from "react";

interface ArticleStatusBadgeProps {
  status: "published" | "draft" | "archived" | string;
  className?: string;
}

export function ArticleStatusBadge({ status, className = "" }: ArticleStatusBadgeProps) {
  if (status === "published") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" aria-hidden="true" />
        <span>Published</span>
      </span>
    );
  }

  if (status === "draft") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" aria-hidden="true" />
        <span>Draft</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
      <span>Archived</span>
    </span>
  );
}
