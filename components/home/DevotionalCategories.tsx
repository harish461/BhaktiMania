import React from "react";
import Link from "next/link";

export interface DevotionalCategoryItem {
  id: string;
  title: string;
  description: string;
  route: string;
  symbol: string;
}

export interface DevotionalCategoriesProps {
  categories?: Array<{
    slug: string;
    title: string;
    description: string;
    symbol: string;
  }>;
}

export function DevotionalCategories({ categories: propCategories = [] }: DevotionalCategoriesProps = {}) {
  const displayCategories: DevotionalCategoryItem[] = propCategories.map((cat) => ({
    id: cat.slug,
    title: cat.title,
    description: cat.description,
    route: `/${cat.slug}`,
    symbol: cat.symbol,
  }));

  return (
    <section
      id="devotional-categories"
      aria-labelledby="categories-heading"
      className="py-14 sm:py-20 bg-[#F8F4EC] border-t border-[#6B1724]/8"
    >
      <div className="container-desktop">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#6B1724]/10 mb-3.5 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B1724] uppercase font-body">
              आध्यात्मिक संग्रह
            </span>
          </div>

          <h2
            id="categories-heading"
            className="font-heading text-3xl sm:text-4xl text-[#6B1724] tracking-tight leading-snug"
          >
            भक्ति के प्रमुख विषय
          </h2>

          {/* Saffron Accent Line */}
          <div
            className="h-0.5 w-12 bg-[#D97706]/70 rounded-full mx-auto my-3"
            aria-hidden="true"
          />

          <p className="text-[#5A6065] text-base sm:text-lg leading-relaxed font-body">
            अपने पसंदीदा भक्ति विषय से जुड़ी कहानियां, विचार, ज्ञान और उपयोगी
            जानकारी पढ़ें।
          </p>
        </div>

        {/* Categories Grid: 1 col (mobile xs), 2 cols (sm/tablet), 4 cols (desktop) */}
        {displayCategories.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-white border border-[#6B1724]/10">
            <p className="text-base text-[#5A6065] font-body">
              श्रेणियां लोड करने में असमर्थ। कृपया कुछ समय पश्चात पुनः प्रयास करें।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={category.route}
              className="group bg-white rounded-2xl p-5 sm:p-6 border border-[#6B1724]/10 shadow-[0_2px_10px_rgba(107,23,36,0.03)] hover:shadow-[0_8px_24px_rgba(107,23,36,0.07)] hover:border-[#6B1724]/25 transition-all duration-200 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] focus-visible:ring-offset-2"
            >
              <div>
                {/* Devotional Symbol Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-11 px-3 min-w-[44px] rounded-xl bg-[#F8F4EC] border border-[#6B1724]/10 text-[#6B1724] group-hover:bg-[#6B1724] group-hover:text-white group-hover:border-[#6B1724] transition-all duration-200 flex items-center justify-center font-heading text-sm font-medium shadow-xs">
                    <span className="select-none">{category.symbol}</span>
                  </div>
                  <span
                    className="text-xs text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-body"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                </div>

                {/* Category Title */}
                <h3 className="font-heading text-xl text-[#1F2326] group-hover:text-[#6B1724] transition-colors leading-snug mb-2">
                  {category.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-[#5A6065] leading-relaxed line-clamp-2 font-body">
                  {category.description}
                </p>
              </div>

              {/* Action Indicator */}
              <div className="pt-4 border-t border-[#6B1724]/6 mt-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#6B1724] group-hover:text-[#52111C]">
                <span>देखें</span>
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
        )}
      </div>
    </section>
  );
}
