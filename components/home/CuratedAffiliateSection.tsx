import React from "react";
import Link from "next/link";
import type { AffiliateProductItem } from "@/lib/data/supabase/types";
import { AffiliateProductCard } from "@/components/affiliate/AffiliateProductCard";

interface CuratedAffiliateSectionProps {
  products?: AffiliateProductItem[];
}

/**
 * CuratedAffiliateSection — Subtle devotional recommendation section for the homepage.
 *
 * Features:
 * - Editorial, non-intrusive presentation aligned with the Sacred Folio design system
 * - Displays a maximum of 3 curated active products
 * - Smooth fallback when products are empty (renders nothing to prevent layout clutter)
 * - Clear link to the dedicated /shop page
 */
export function CuratedAffiliateSection({
  products = [],
}: CuratedAffiliateSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = products.slice(0, 3);

  return (
    <section
      id="curated-bhakti-shop"
      aria-labelledby="curated-shop-heading"
      className="py-16 lg:py-24 bg-[#FBF8F0] border-t border-[rgba(200,154,60,0.18)]"
    >
      <div className="container-desktop">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-4 pb-5 border-b border-[rgba(200,154,60,0.2)]">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="accent-dot" aria-hidden="true" />
              <span className="label-ui text-[#C85A17]">साधना एवं स्वाध्याय</span>
            </div>
            <h2
              id="curated-shop-heading"
              className="font-serif text-[#1C1C17] leading-tight"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.125rem)", fontWeight: 500 }}
            >
              भक्ति के लिए उपयोगी चीज़ें
            </h2>
            <p className="font-serif text-sm sm:text-base text-[#5A6065] mt-2">
              साधना, अध्ययन और आध्यात्मिक जीवन के लिए चुनी गई उपयोगी वस्तुएँ।
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden lg:inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded py-1"
          >
            <span>सभी उत्पाद देखें</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* 1 to 3 Product Grid */}
        <div
          className={`grid grid-cols-1 ${
            displayProducts.length === 1
              ? "max-w-md lg:max-w-lg"
              : displayProducts.length === 2
              ? "md:grid-cols-2 max-w-3xl"
              : "md:grid-cols-2 lg:grid-cols-3"
          } gap-6 lg:gap-7`}
        >
          {displayProducts.map((product) => (
            <AffiliateProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center lg:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors duration-150 py-2.5 px-5 rounded-xl border border-[rgba(200,154,60,0.3)] bg-white shadow-xs"
          >
            <span>सभी उत्पाद देखें</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
