import React from "react";
import type { AdminCategoryListItem } from "@/lib/data/supabase/admin";
import { CategoryTableRow } from "./CategoryTableRow";

interface CategoryTableProps {
  categories: AdminCategoryListItem[];
  siteUrl: string;
  onMoveUp: (category: AdminCategoryListItem) => void;
  onMoveDown: (category: AdminCategoryListItem) => void;
  onActivate: (category: AdminCategoryListItem) => void;
  onDeactivate: (category: AdminCategoryListItem) => void;
  isActionPending: boolean;
}

export function CategoryTable({
  categories,
  siteUrl,
  onMoveUp,
  onMoveDown,
  onActivate,
  onDeactivate,
  isActionPending,
}: CategoryTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-[#FDFBF7] text-[11px] font-semibold text-[#5A6065] uppercase tracking-wider border-b border-[#6B1724]/10">
          <tr>
            <th scope="col" className="px-6 py-3.5">
              Category
            </th>
            <th scope="col" className="px-5 py-3.5">
              Articles
            </th>
            <th scope="col" className="px-4 py-3.5">
              Status
            </th>
            <th scope="col" className="px-4 py-3.5">
              Order
            </th>
            <th scope="col" className="px-4 py-3.5">
              SEO
            </th>
            <th scope="col" className="px-6 py-3.5 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#6B1724]/10 bg-white">
          {categories.map((cat, idx) => (
            <CategoryTableRow
              key={cat.id}
              category={cat}
              siteUrl={siteUrl}
              isFirst={idx === 0}
              isLast={idx === categories.length - 1}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
              isActionPending={isActionPending}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
