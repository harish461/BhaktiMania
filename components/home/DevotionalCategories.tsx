import React from "react";
import Link from "next/link";

/** Hardcoded 6 devotional categories per design spec */
interface CategoryItem {
  title: string;
  description: string;
  route: string;
  symbol: string;
  symbolLabel: string;
}

const categories: CategoryItem[] = [
  {
    title: "भगवान श्री कृष्ण",
    description:
      "श्री कृष्ण की लीलाएं, भागवत कथाएं और उनकी अमृत शिक्षाएं।",
    route: "/radha-krishna",
    symbol: "✦",
    symbolLabel: "श्री कृष्ण",
  },
  {
    title: "भगवान शिव",
    description:
      "महादेव के स्वरूप, शिव पुराण और 'ॐ नमः शिवाय' का आध्यात्मिक रहस्य।",
    route: "/shiv",
    symbol: "ॐ",
    symbolLabel: "भगवान शिव",
  },
  {
    title: "हनुमान जी",
    description:
      "हनुमान जी की भक्ति, हनुमान चालीसा और उनके जीवन की प्रेरणाएं।",
    route: "/hanuman",
    symbol: "✿",
    symbolLabel: "हनुमान जी",
  },
  {
    title: "राधा-कृष्ण प्रेम",
    description:
      "राधा-कृष्ण का दिव्य प्रेम, भक्ति रस और वृंदावन की आध्यात्मिक सुंदरता।",
    route: "/radha-krishna",
    symbol: "♡",
    symbolLabel: "राधा कृष्ण",
  },
  {
    title: "मंत्र एवं स्तोत्र",
    description:
      "वैदिक मंत्र, स्तोत्र, उनके उच्चारण और आध्यात्मिक प्रभाव।",
    route: "/mantra-stotra",
    symbol: "ᯓ",
    symbolLabel: "मंत्र",
  },
  {
    title: "आध्यात्मिक जीवन",
    description:
      "दैनिक भक्ति दिनचर्या, ध्यान, और जीवन में आध्यात्मिकता को अपनाना।",
    route: "/bhakti-gyaan",
    symbol: "☸",
    symbolLabel: "आध्यात्मिक जीवन",
  },
];

export interface DevotionalCategoriesProps {
  categories?: Array<{
    slug: string;
    title: string;
    description: string;
    symbol: string;
  }>;
}

export function DevotionalCategories({}: DevotionalCategoriesProps = {}) {
  // Per design spec, show the 6 hardcoded categories with editorial icons
  return (
    <section
      id="devotional-categories"
      aria-labelledby="categories-heading"
      className="py-20 lg:py-28 bg-[#F5EFE2]"
    >
      <div className="container-desktop">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#C89A3C]/50" aria-hidden="true" />
            <span className="label-ui text-[#C85A17]">आध्यात्मिक संग्रह</span>
            <div className="w-8 h-px bg-[#C89A3C]/50" aria-hidden="true" />
          </div>

          <h2
            id="categories-heading"
            className="font-serif text-[#1C1C17] mb-3"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.375rem)",
              fontWeight: 500,
            }}
          >
            भक्ति के प्रमुख विषय
          </h2>

          {/* Gold accent line */}
          <div className="w-10 h-0.5 bg-[#C89A3C]/55 rounded-full mx-auto my-3" aria-hidden="true" />

          <p className="font-serif text-[#6B706A] leading-relaxed" style={{ fontSize: "1rem" }}>
            अपने मन और आत्मा के लिए एक ऐसा विषय चुनें जो आज आपको प्रेरित करे।
          </p>
        </div>

        {/* 3 × 2 Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.route + category.title}
              href={category.route}
              className="group bg-white rounded-[6px] p-6 lg:p-7 border border-[rgba(107,112,106,0.18)] shadow-[0_2px_12px_-2px_rgba(40,25,15,0.05)] hover:shadow-[0_8px_28px_-4px_rgba(40,25,15,0.09)] hover:border-[rgba(200,154,60,0.35)] transition-all duration-200 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] focus-visible:ring-offset-2"
              aria-label={`${category.title} — ${category.symbolLabel}`}
            >
              {/* Icon + Arrow Row */}
              <div className="flex items-center justify-between mb-5">
                {/* Category icon badge */}
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-[4px] border border-[rgba(200,154,60,0.3)] text-[#C89A3C] group-hover:bg-[#C85A17] group-hover:text-white group-hover:border-[#C85A17] transition-all duration-200 text-lg font-serif select-none"
                  aria-hidden="true"
                >
                  {category.symbol}
                </div>
                {/* Arrow — reveals on hover */}
                <span
                  className="text-[#C89A3C] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-sm"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>

              {/* Category title */}
              <h3
                className="font-serif text-[#1C1C17] group-hover:text-[#C85A17] transition-colors duration-200 mb-2.5 leading-snug"
                style={{ fontSize: "1.125rem", fontWeight: 600 }}
              >
                {category.title}
              </h3>

              {/* Description */}
              <p className="font-serif text-sm text-[#6B706A] leading-relaxed line-clamp-2 grow">
                {category.description}
              </p>

              {/* Bottom link */}
              <div className="mt-5 pt-4 border-t border-[rgba(107,112,106,0.12)] flex items-center justify-between">
                <span className="font-ui text-xs font-semibold text-[#C85A17] group-hover:text-[#A8440B] transition-colors">
                  अन्वेषण करें
                </span>
                <span
                  className="font-ui text-xs text-[#C89A3C] group-hover:translate-x-0.5 transition-transform duration-200"
                  aria-hidden="true"
                >
                  ✦
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export type { CategoryItem };
