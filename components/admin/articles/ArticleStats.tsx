import React from "react";
import type { AdminArticleListItem } from "@/lib/data/supabase/admin";

interface ArticleStatsProps {
  articles: AdminArticleListItem[];
}

export function ArticleStats({ articles }: ArticleStatsProps) {
  const total = articles.length;
  const published = articles.filter((a) => a.status === "published").length;
  const drafts = articles.filter((a) => a.status === "draft").length;
  const archived = articles.filter((a) => a.status === "archived").length;
  const featured = articles.filter((a) => a.featured).length;

  const stats = [
    {
      label: "Total Articles",
      value: total,
      badge: "In Catalog",
      badgeColor: "bg-[#6B1724]/10 text-[#6B1724]",
      icon: (
        <svg className="w-5 h-5 text-[#6B1724]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      label: "Published",
      value: published,
      badge: `${total > 0 ? Math.round((published / total) * 100) : 0}% Live`,
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Drafts",
      value: drafts,
      badge: drafts > 0 ? "Work in progress" : "All clear",
      badgeColor: drafts > 0 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700",
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    ...(archived > 0
      ? [
          {
            label: "Archived",
            value: archived,
            badge: "Inactive",
            badgeColor: "bg-slate-100 text-slate-800",
            icon: (
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            ),
          },
        ]
      : [
          {
            label: "Featured",
            value: featured,
            badge: "Highlighted",
            badgeColor: "bg-amber-50 text-amber-900 border border-amber-200",
            icon: (
              <svg className="w-5 h-5 text-amber-600 fill-amber-400" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ),
          },
        ]),
  ];

  return (
    <section aria-label="Article statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((card) => (
        <div
          key={card.label}
          className="bg-white border border-[#6B1724]/15 rounded-2xl p-4 shadow-xs hover:border-[#6B1724]/30 transition-colors"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-[#5A6065]">{card.label}</span>
            <div className="p-1.5 rounded-lg bg-[#FDFBF7] border border-[#6B1724]/10 shrink-0">
              {card.icon}
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-heading text-[#1F2326]">
              {card.value}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${card.badgeColor}`}>
              {card.badge}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
