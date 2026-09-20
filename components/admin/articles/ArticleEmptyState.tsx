import React from "react";
import Link from "next/link";

interface ArticleEmptyStateProps {
  type: "no-articles" | "no-search-results" | "no-filter-results";
  onClearSearch?: () => void;
  onClearFilters?: () => void;
}

export function ArticleEmptyState({
  type,
  onClearSearch,
  onClearFilters,
}: ArticleEmptyStateProps) {
  if (type === "no-articles") {
    return (
      <div className="p-8 sm:p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#6B1724]/10 text-[#6B1724] flex items-center justify-center mx-auto text-xl font-bold">
          📜
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="text-base font-bold font-heading text-[#1F2326]">
            No articles yet
          </h3>
          <p className="text-xs sm:text-sm text-[#5A6065]">
            Get started by creating your first devotional article for BhaktiMania.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#6B1724] hover:bg-[#52111C] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>+</span>
            <span>Create Article</span>
          </Link>
        </div>
      </div>
    );
  }

  if (type === "no-search-results") {
    return (
      <div className="p-8 sm:p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto text-xl">
          🔍
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="text-base font-bold font-heading text-[#1F2326]">
            No articles match your search
          </h3>
          <p className="text-xs sm:text-sm text-[#5A6065]">
            Try checking for typos or searching with different keywords.
          </p>
        </div>
        {onClearSearch && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex items-center justify-center px-4 py-2 min-h-[44px] bg-white border border-[#6B1724]/20 hover:bg-[#FDFBF7] text-[#6B1724] text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-12 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center mx-auto text-xl">
        ⚡
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-base font-bold font-heading text-[#1F2326]">
          No articles match the selected filters
        </h3>
        <p className="text-xs sm:text-sm text-[#5A6065]">
          Try broadening your criteria or reset all active filters.
        </p>
      </div>
      {onClearFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center justify-center px-4 py-2 min-h-[44px] bg-white border border-[#6B1724]/20 hover:bg-[#FDFBF7] text-[#6B1724] text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
