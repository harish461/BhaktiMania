import React from "react";
import Link from "next/link";
import type { DevotionalCategory } from "@/lib/data/categories";

export interface RelatedCategoriesProps {
  currentSlug: string;
  relatedCategories?: DevotionalCategory[];
}

export function RelatedCategories({
  currentSlug,
  relatedCategories: propCategories,
}: RelatedCategoriesProps) {
  const relatedCategories = (propCategories || []).filter(
    (cat) => cat.slug !== currentSlug
  );

  if (relatedCategories.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-categories-heading"
      className="mt-16 sm:mt-20 pt-12 border-t border-[#6B1724]/10"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#D97706] font-body">
            अन्य पावन विषय
          </span>
          <h2
            id="related-categories-heading"
            className="font-heading text-2xl sm:text-3xl text-[#6B1724] tracking-tight mt-1"
          >
            संबंधित भक्ति विषय
          </h2>
        </div>
        <Link
          href="/#devotional-categories"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#6B1724] hover:text-[#52111C] underline-offset-4 hover:underline"
        >
          <span>सभी विषय देखें</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {relatedCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-[#6B1724]/10 shadow-[0_2px_10px_rgba(107,23,36,0.03)] hover:shadow-[0_8px_24px_rgba(107,23,36,0.07)] hover:border-[#6B1724]/25 transition-all duration-200 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] focus-visible:ring-offset-2 min-h-[160px]"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="h-10 px-3 min-w-[40px] rounded-xl bg-[#F8F4EC] border border-[#6B1724]/10 text-[#6B1724] group-hover:bg-[#6B1724] group-hover:text-white group-hover:border-[#6B1724] transition-all duration-200 flex items-center justify-center font-heading text-xs font-medium shadow-xs">
                  <span className="select-none">{category.symbol}</span>
                </div>
                <span
                  className="text-xs text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-body"
                  aria-hidden="true"
                >
                  ✦
                </span>
              </div>

              <h3 className="font-heading text-lg text-[#1F2326] group-hover:text-[#6B1724] transition-colors leading-snug mb-1.5">
                {category.title}
              </h3>

              <p className="text-xs text-[#5A6065] leading-relaxed line-clamp-2 font-body">
                {category.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#6B1724]/6 mt-3.5 flex items-center justify-between text-xs font-semibold text-[#6B1724] group-hover:text-[#52111C]">
              <span>लेख देखें</span>
              <span
                className="group-hover:translate-x-1 transition-transform duration-200"
                aria-hidden="true"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
