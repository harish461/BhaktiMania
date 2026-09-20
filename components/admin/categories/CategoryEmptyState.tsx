import React from "react";
import Link from "next/link";

export function CategoryEmptyState() {
  return (
    <div className="p-8 sm:p-12 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-[#6B1724]/10 text-[#6B1724] flex items-center justify-center mx-auto text-xl font-bold">
        📁
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-base font-bold font-heading text-[#1F2326]">
          No categories yet
        </h3>
        <p className="text-xs sm:text-sm text-[#5A6065]">
          Organize your devotional articles by creating your first category.
        </p>
      </div>
      <div className="pt-2">
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#6B1724] hover:bg-[#52111C] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <span>+</span>
          <span>Create Category</span>
        </Link>
      </div>
    </div>
  );
}
