import React from "react";
import Link from "next/link";
import type { AdminCategoryListItem } from "@/lib/data/supabase/admin";
import { CategoryStatusBadge } from "./CategoryStatusBadge";
import { CategoryActionMenu } from "./CategoryActionMenu";

interface CategoryMobileCardProps {
  category: AdminCategoryListItem;
  siteUrl: string;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: (category: AdminCategoryListItem) => void;
  onMoveDown: (category: AdminCategoryListItem) => void;
  onActivate: (category: AdminCategoryListItem) => void;
  onDeactivate: (category: AdminCategoryListItem) => void;
  isActionPending: boolean;
}

export function CategoryMobileCard({
  category,
  siteUrl,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onActivate,
  onDeactivate,
  isActionPending,
}: CategoryMobileCardProps) {
  const isSeoComplete = Boolean(category.meta_title && category.description);

  return (
    <article className="p-4 sm:p-5 space-y-3.5 bg-white transition-colors">
      {/* Top bar: Status, Order, Action Menu */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CategoryStatusBadge isActive={category.is_active} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FDFBF7] border border-[#6B1724]/10 text-[#6B1724]">
            Order #{category.sort_order}
          </span>
        </div>

        <CategoryActionMenu
          category={category}
          siteUrl={siteUrl}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          isActionPending={isActionPending}
        />
      </div>

      {/* Title & Slug */}
      <div className="space-y-1">
        <Link
          href={`/admin/categories/${category.id}/edit`}
          className="block font-heading font-semibold text-base text-[#1F2326] active:text-[#6B1724] leading-snug"
        >
          {category.title}
        </Link>
        <p className="text-xs text-[#5A6065] font-mono break-all">
          /{category.slug}
        </p>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs text-[#5A6065] pt-1">
        <div>
          <span className="font-semibold text-gray-700">Articles: </span>
          <span>{category.articleCount}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">SEO: </span>
          <span className={isSeoComplete ? "text-emerald-700 font-semibold" : "text-amber-700 font-semibold"}>
            {isSeoComplete ? "Complete" : "Partial"}
          </span>
        </div>
      </div>

      {/* Bottom controls: Move Up / Down & Edit CTA */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
        {/* Reordering buttons (44px min targets) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={isFirst || isActionPending}
            onClick={() => onMoveUp(category)}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-[#6B1724]/20 text-[#6B1724] hover:bg-[#FDFBF7] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label={`Move ${category.title} up`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            disabled={isLast || isActionPending}
            onClick={() => onMoveDown(category)}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-[#6B1724]/20 text-[#6B1724] hover:bg-[#FDFBF7] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label={`Move ${category.title} down`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <Link
          href={`/admin/categories/${category.id}/edit`}
          className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-xs font-bold text-[#6B1724] hover:bg-[#FDFBF7] rounded-xl border border-[#6B1724]/20 transition-all cursor-pointer"
        >
          Edit Category →
        </Link>
      </div>
    </article>
  );
}
