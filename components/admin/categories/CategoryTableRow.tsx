import React from "react";
import Link from "next/link";
import type { AdminCategoryListItem } from "@/lib/data/supabase/admin";
import { CategoryStatusBadge } from "./CategoryStatusBadge";
import { CategoryActionMenu } from "./CategoryActionMenu";

interface CategoryTableRowProps {
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

export function CategoryTableRow({
  category,
  siteUrl,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onActivate,
  onDeactivate,
  isActionPending,
}: CategoryTableRowProps) {
  const isSeoComplete = Boolean(category.meta_title && category.description);

  return (
    <tr className="hover:bg-[#FDFBF7]/80 transition-colors group">
      {/* Category: Title + Slug */}
      <td className="px-6 py-4 max-w-xs">
        <div className="space-y-1">
          <Link
            href={`/admin/categories/${category.id}/edit`}
            className="font-heading font-semibold text-sm text-[#1F2326] group-hover:text-[#6B1724] transition-colors"
          >
            {category.title}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#5A6065] font-mono">
            <span className="text-gray-400 select-none">/</span>
            <span className="truncate max-w-[200px]" title={category.slug}>
              {category.slug}
            </span>
          </div>
        </div>
      </td>

      {/* Associated Articles Count */}
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FDFBF7] border border-[#6B1724]/10 text-[#6B1724]">
          {category.articleCount} {category.articleCount === 1 ? "Article" : "Articles"}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        <CategoryStatusBadge isActive={category.is_active} />
      </td>

      {/* Display Order & Up/Down Controls */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="w-6 text-center font-heading font-bold text-sm text-[#1F2326]">
            {category.sort_order}
          </span>
          <div className="inline-flex rounded-lg border border-[#6B1724]/20 p-0.5 bg-white shadow-2xs">
            <button
              type="button"
              disabled={isFirst || isActionPending}
              onClick={() => onMoveUp(category)}
              className="p-1.5 text-[#5A6065] hover:text-[#6B1724] hover:bg-[#FDFBF7] rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
              title={isFirst ? "Already at top" : "Move up"}
              aria-label={`Move category ${category.title} up`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              disabled={isLast || isActionPending}
              onClick={() => onMoveDown(category)}
              className="p-1.5 text-[#5A6065] hover:text-[#6B1724] hover:bg-[#FDFBF7] rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
              title={isLast ? "Already at bottom" : "Move down"}
              aria-label={`Move category ${category.title} down`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </td>

      {/* SEO Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        {isSeoComplete ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <span>✓ Complete</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <span>⚠ Partial</span>
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/categories/${category.id}/edit`}
            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-[#6B1724] hover:text-[#52111C] hover:bg-[#FDFBF7] rounded-lg border border-transparent hover:border-[#6B1724]/20 transition-all cursor-pointer"
          >
            Edit
          </Link>

          <CategoryActionMenu
            category={category}
            siteUrl={siteUrl}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            isActionPending={isActionPending}
          />
        </div>
      </td>
    </tr>
  );
}
