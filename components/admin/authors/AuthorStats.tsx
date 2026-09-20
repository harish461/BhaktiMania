"use client";

import React from "react";
import type { AdminAuthorListItem } from "@/lib/data/supabase/admin";

interface AuthorStatsProps {
  authors: AdminAuthorListItem[];
}

export function AuthorStats({ authors }: AuthorStatsProps) {
  const totalAuthors = authors.length;
  const activeAuthors = authors.filter((a) => a.is_active).length;
  const inactiveAuthors = totalAuthors - activeAuthors;
  const totalAssignedArticles = authors.reduce((sum, a) => sum + (a.articleCount || 0), 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {/* Metric 1: Total Authors */}
      <div className="bg-white border border-[#6B1724]/15 rounded-2xl p-4 shadow-2xs">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#5A6065]">
          Total Authors
        </p>
        <p className="text-2xl font-bold text-[#6B1724] mt-1.5">{totalAuthors}</p>
        <p className="text-[11px] text-[#5A6065] mt-0.5">Normalized catalog</p>
      </div>

      {/* Metric 2: Active */}
      <div className="bg-white border border-[#6B1724]/15 rounded-2xl p-4 shadow-2xs">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#5A6065]">
          Active
        </p>
        <p className="text-2xl font-bold text-emerald-700 mt-1.5">{activeAuthors}</p>
        <p className="text-[11px] text-[#5A6065] mt-0.5">Available for articles</p>
      </div>

      {/* Metric 3: Inactive */}
      <div className="bg-white border border-[#6B1724]/15 rounded-2xl p-4 shadow-2xs">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#5A6065]">
          Inactive
        </p>
        <p className="text-2xl font-bold text-gray-600 mt-1.5">{inactiveAuthors}</p>
        <p className="text-[11px] text-[#5A6065] mt-0.5">Excluded from new</p>
      </div>

      {/* Metric 4: Assigned Articles */}
      <div className="bg-white border border-[#6B1724]/15 rounded-2xl p-4 shadow-2xs">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#5A6065]">
          Assigned Articles
        </p>
        <p className="text-2xl font-bold text-[#D97706] mt-1.5">{totalAssignedArticles}</p>
        <p className="text-[11px] text-[#5A6065] mt-0.5">Active relationships</p>
      </div>
    </div>
  );
}
