import React from "react";
import Link from "next/link";
import type { AdminCategoryListItem } from "@/lib/data/supabase/admin";

interface CategoryOverviewSectionProps {
  categories: AdminCategoryListItem[];
}

export function CategoryOverviewSection({ categories }: CategoryOverviewSectionProps) {
  return (
    <div className="bg-white border border-[#6B1724]/15 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-[#6B1724]/10 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-heading text-[#6B1724]">
            Category Overview
          </h2>
          <p className="text-xs text-[#5A6065] mt-0.5">
            Devotional topics and linked article distribution
          </p>
        </div>

        <Link
          href="/admin/categories"
          className="text-xs font-semibold text-[#6B1724] hover:text-[#52111C] hover:underline transition-colors shrink-0 min-h-[44px] inline-flex items-center"
        >
          Manage Categories →
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="p-6 text-center text-sm text-[#5A6065]">
          No categories found in the database.
        </div>
      ) : (
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 content-start">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href="/admin/categories"
              className="p-3.5 rounded-xl border border-[#6B1724]/10 hover:border-[#6B1724]/30 hover:bg-[#FDFBF7] transition-all flex items-center justify-between gap-2 min-h-[44px] group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-[#1F2326] group-hover:text-[#6B1724] truncate">
                    {cat.title}
                  </span>
                  {cat.symbol && (
                    <span className="text-xs text-[#D97706] font-serif shrink-0">
                      ({cat.symbol})
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#5A6065] font-mono block">
                  /{cat.slug}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#FDFBF7] border border-[#6B1724]/15 text-[#6B1724]">
                  {cat.articleCount} {cat.articleCount === 1 ? "article" : "articles"}
                </span>

                <span
                  className={`w-2 h-2 rounded-full ${
                    cat.is_active ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                  title={cat.is_active ? "Active" : "Inactive"}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
