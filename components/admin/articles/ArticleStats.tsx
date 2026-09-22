import React from "react";
import type { AdminArticleListItem } from "@/lib/data/supabase/admin";

interface ArticleStatsProps {
  articles: AdminArticleListItem[];
  onSelectImageFilter?: (filter: "all" | "available" | "missing") => void;
  activeImageFilter?: "all" | "available" | "missing";
}

export function ArticleStats({
  articles,
  onSelectImageFilter,
  activeImageFilter = "all",
}: ArticleStatsProps) {
  const total = articles.length;
  const published = articles.filter((a) => a.status === "published").length;
  const drafts = articles.filter((a) => a.status === "draft").length;

  // Devotional Featured Image metrics (Requirement 12: Total articles, Images available, Images missing)
  const imagesAvailable = articles.filter(
    (a) => a.featured_image_url && a.featured_image_url.trim().length > 0
  ).length;
  const imagesMissing = total - imagesAvailable;

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
      onClick: () => onSelectImageFilter?.("all"),
      isActive: activeImageFilter === "all",
    },
    {
      label: "Images Available",
      value: imagesAvailable,
      badge: `${total > 0 ? Math.round((imagesAvailable / total) * 100) : 0}% Covered`,
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      onClick: () => onSelectImageFilter?.("available"),
      isActive: activeImageFilter === "available",
    },
    {
      label: "Images Missing",
      value: imagesMissing,
      badge: imagesMissing > 0 ? "Action needed" : "All set",
      badgeColor: imagesMissing > 0 ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-gray-100 text-gray-700",
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      onClick: () => onSelectImageFilter?.("missing"),
      isActive: activeImageFilter === "missing",
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
      badge: drafts > 0 ? "In progress" : "All clear",
      badgeColor: drafts > 0 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700",
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
  ];

  return (
    <section aria-label="Article statistics" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {stats.map((card) => {
        const isClickable = Boolean(card.onClick);
        const CardWrapper = isClickable ? "button" : "div";

        return (
          <CardWrapper
            key={card.label}
            onClick={card.onClick}
            type={isClickable ? "button" : undefined}
            className={`text-left bg-white border rounded-2xl p-4 shadow-xs transition-all ${
              card.isActive
                ? "border-[#D97706] ring-2 ring-[#D97706]/20 bg-[#FFFDF9]"
                : "border-[#6B1724]/15 hover:border-[#6B1724]/30"
            } ${isClickable ? "cursor-pointer" : ""}`}
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
          </CardWrapper>
        );
      })}
    </section>
  );
}
