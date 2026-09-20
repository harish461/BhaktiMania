"use client";

import React, { useState, useMemo } from "react";
import { Article } from "@/lib/data/articles";
import { ArticleCategoryFilter } from "@/components/content/ArticleCategoryFilter";
import { ArticleGrid } from "@/components/content/ArticleGrid";

export interface BhaktiGyaanListingProps {
  initialArticles: Article[];
}

export function BhaktiGyaanListing({
  initialArticles,
}: BhaktiGyaanListingProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "all") {
      return initialArticles;
    }
    return initialArticles.filter(
      (article) => article.categorySlug === selectedCategory
    );
  }, [initialArticles, selectedCategory]);

  return (
    <div>
      {/* Category Navigation / Filter */}
      <div className="mb-6">
        <ArticleCategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Article Cards Grid */}
      <ArticleGrid articles={filteredArticles} />

      {/* Bottom Placeholder / More Content Notice */}
      <div className="mt-14 sm:mt-16 text-center py-8 px-6 rounded-2xl bg-[#F8F4EC] border border-[#6B1724]/8">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <span className="text-[#D97706] text-xs select-none" aria-hidden="true">
            ✦
          </span>
          <p className="font-heading text-lg sm:text-xl text-[#6B1724]">
            और लेख जल्द ही जोड़े जाएंगे
          </p>
          <span className="text-[#D97706] text-xs select-none" aria-hidden="true">
            ✦
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#5A6065] max-w-md mx-auto font-body">
          सनातन धर्म, भक्ति ज्ञान, सत्संग और धार्मिक पर्वों से जुड़ी नई रचनाएं
          निरंतर प्रकाशित की जा रही हैं।
        </p>
      </div>
    </div>
  );
}
