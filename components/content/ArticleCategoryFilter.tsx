"use client";

import React from "react";

export interface CategoryOption {
  label: string;
  slug: string;
}

export const filterCategories: CategoryOption[] = [
  { label: "सभी", slug: "all" },
  { label: "हनुमान", slug: "hanuman" },
  { label: "राधा कृष्ण", slug: "radha-krishna" },
  { label: "भगवान शिव", slug: "shiv" },
  { label: "श्रीमद्भगवद्गीता", slug: "bhagavad-gita" },
  { label: "त्योहार एवं व्रत", slug: "festivals" },
  { label: "वृंदावन एवं धाम", slug: "vrindavan" },
  { label: "भक्ति विचार", slug: "bhakti-vichar" },
  { label: "प्रेमानंद जी", slug: "premanand-ji" },
];

export interface ArticleCategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function ArticleCategoryFilter({
  selectedCategory,
  onSelectCategory,
}: ArticleCategoryFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="लेख श्रेणियां"
      className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-3 pt-1 scroll-smooth focus:outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {filterCategories.map((category) => {
        const isSelected = selectedCategory === category.slug;
        return (
          <button
            key={category.slug}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(category.slug)}
            className={`inline-flex items-center justify-center min-h-[44px] px-4 sm:px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 ease-out cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] focus-visible:ring-offset-2 ${
              isSelected
                ? "bg-[#6B1724] text-white border border-[#6B1724] shadow-sm"
                : "bg-white text-[#1F2326] border border-[#6B1724]/12 hover:bg-[#F8F4EC] hover:text-[#6B1724] hover:border-[#6B1724]/30"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
