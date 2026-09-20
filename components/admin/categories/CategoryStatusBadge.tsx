import React from "react";

interface CategoryStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export function CategoryStatusBadge({ isActive, className = "" }: CategoryStatusBadgeProps) {
  if (isActive) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
        <span>Active</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
      <span>Inactive</span>
    </span>
  );
}
