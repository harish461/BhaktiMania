"use client";

import React from "react";
import Link from "next/link";

interface AuthorEmptyStateProps {
  isFiltered: boolean;
  onResetFilters: () => void;
}

export function AuthorEmptyState({ isFiltered, onResetFilters }: AuthorEmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="bg-white border border-[#6B1724]/15 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-2xs space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#FDFBF7] border border-[#6B1724]/15 text-[#6B1724] text-xl font-bold flex items-center justify-center mx-auto">
          🔍
        </div>
        <h3 className="font-heading text-lg font-bold text-[#6B1724]">
          No Authors Match Your Filters
        </h3>
        <p className="text-xs text-[#5A6065] leading-relaxed">
          We couldn&apos;t find any authors matching your current search or status filter. Try adjusting your query or resetting filters.
        </p>
        <div>
          <button
            type="button"
            onClick={onResetFilters}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#6B1724] text-white text-xs font-semibold hover:bg-[#52111C] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#6B1724]/15 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-2xs space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-[#FDFBF7] border border-[#D97706]/30 text-[#6B1724] text-2xl font-bold flex items-center justify-center mx-auto">
        ✍️
      </div>
      <h3 className="font-heading text-lg font-bold text-[#6B1724]">
        No Authors in Catalog
      </h3>
      <p className="text-xs text-[#5A6065] leading-relaxed">
        Start by creating the first author or editorial team profile for BhaktiMania.
      </p>
      <div>
        <Link
          href="/admin/authors/new"
          className="min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#6B1724] text-white text-xs font-semibold hover:bg-[#52111C] transition-colors"
        >
          Add First Author
        </Link>
      </div>
    </div>
  );
}
