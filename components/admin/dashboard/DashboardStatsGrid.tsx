import React from "react";
import Link from "next/link";
import type { DashboardStats } from "@/lib/data/supabase/admin";

interface DashboardStatsGridProps {
  stats: DashboardStats | null;
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  if (!stats) {
    return (
      <div className="bg-white border border-[#6B1724]/15 rounded-xl p-6 text-center shadow-sm">
        <p className="text-sm text-[#5A6065]">
          Statistics are temporarily unavailable due to a database connection issue.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Articles",
      value: stats.totalArticles,
      subtext: "All database records",
      href: "/admin/articles",
      colorClass: "text-[#6B1724]",
      borderClass: "border-[#6B1724]/20",
    },
    {
      label: "Published Articles",
      value: stats.publishedArticles,
      subtext: "Live on public website",
      href: "/admin/articles?status=published",
      colorClass: "text-emerald-700",
      borderClass: "border-emerald-200",
      bgBadge: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Draft Articles",
      value: stats.draftArticles,
      subtext: "Unpublished drafts",
      href: "/admin/articles?status=draft",
      colorClass: "text-amber-700",
      borderClass: "border-amber-200",
      bgBadge: "bg-amber-50 text-amber-700",
    },
    {
      label: "Archived Articles",
      value: stats.archivedArticles,
      subtext: "Archived content",
      href: "/admin/articles?status=archived",
      colorClass: "text-slate-600",
      borderClass: "border-slate-200",
    },
    {
      label: "Total Categories",
      value: stats.totalCategories,
      subtext: "Devotional topics",
      href: "/admin/categories",
      colorClass: "text-[#D97706]",
      borderClass: "border-[#D97706]/20",
    },
    {
      label: "Active Categories",
      value: stats.activeCategories,
      subtext: "Visible on public site",
      href: "/admin/categories",
      colorClass: "text-emerald-700",
      borderClass: "border-emerald-200",
      bgBadge: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Total Authors",
      value: stats.totalAuthors,
      subtext: "Editorial contributors",
      href: "/admin/authors",
      colorClass: "text-[#6B1724]",
      borderClass: "border-[#6B1724]/20",
    },
    {
      label: "Active Authors",
      value: stats.activeAuthors,
      subtext: "Available for bylines",
      href: "/admin/authors",
      colorClass: "text-emerald-700",
      borderClass: "border-emerald-200",
      bgBadge: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#6B1724]">
          Content Metrics
        </h2>
        <span className="text-xs text-[#5A6065]">Live database aggregates</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group bg-white border ${card.borderClass} rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#6B1724]/30 transition-all min-h-[44px] flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[#5A6065] uppercase tracking-wide truncate">
                  {card.label}
                </span>
                {card.bgBadge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded border border-current/20 ${card.bgBadge}`}
                  >
                    Active
                  </span>
                )}
              </div>
              <p className={`text-2xl sm:text-3xl font-bold font-heading mt-2 ${card.colorClass}`}>
                {card.value}
              </p>
            </div>

            <p className="text-xs text-[#5A6065] mt-2 group-hover:text-[#6B1724] transition-colors">
              {card.subtext} →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
