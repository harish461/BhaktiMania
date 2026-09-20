import React from "react";
import Link from "next/link";

interface DashboardHeaderProps {
  userEmail?: string | null;
  userRole?: string | null;
  serverTimestamp: string;
}

export function DashboardHeader({
  userEmail,
  userRole,
  serverTimestamp,
}: DashboardHeaderProps) {
  return (
    <div className="bg-white border border-[#6B1724]/15 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#D97706]">
              Dashboard
            </span>
            <span className="text-xs text-[#5A6065]">•</span>
            <span className="text-xs text-[#5A6065] font-mono">
              Refreshed: {serverTimestamp}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#6B1724] mt-1">
            BhaktiMania Overview
          </h1>
          <p className="text-sm text-[#5A6065] mt-1.5">
            Administrative control center for devotional content, articles, categories, and authors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            <span className="truncate max-w-[160px] sm:max-w-none">{userEmail || "Admin"}</span>
            {userRole && (
              <span className="ml-1.5 text-[10px] uppercase font-bold text-emerald-600 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                {userRole}
              </span>
            )}
          </div>

          <Link
            href="/admin/articles/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6B1724] hover:bg-[#52111C] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors min-h-[44px] cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>New Article</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
