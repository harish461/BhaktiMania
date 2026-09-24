import React from "react";
import Image from "next/image";
import type { AffiliateProductItem } from "@/lib/data/supabase/types";
import { AffiliateLabel } from "./AffiliateLabel";

export interface AffiliateProductCardProps {
  product: AffiliateProductItem;
  className?: string;
}

/**
 * Maps category keys/slugs to clean Hindi display names.
 */
function getCategoryDisplayName(category: string | null): string {
  if (!category) return "धार्मिक सामग्री";
  const catLower = category.toLowerCase().trim();
  const map: Record<string, string> = {
    books: "धार्मिक पुस्तकें",
    japa_mala: "जप माला",
    puja_essentials: "पूजा सामग्री",
    meditation: "ध्यान एवं साधना",
    artwork: "आध्यात्मिक कला",
    travel_guides: "तीर्थ यात्रा",
  };
  return map[catLower] || category;
}

/**
 * AffiliateProductCard — Editorial devotional product card.
 *
 * Adheres strictly to the Sacred Folio / Saffron Manuscript aesthetic:
 * - Editorial, trustworthy, price-free design
 * - Transparent compliance labeling via AffiliateLabel
 * - Approved outbound Amazon CTA with strict rel="nofollow sponsored noopener noreferrer"
 * - Graceful devotional placeholder when product image is unavailable
 * - Balanced, compact vertical rhythm
 */
export function AffiliateProductCard({
  product,
  className = "",
}: AffiliateProductCardProps) {
  const categoryLabel = getCategoryDisplayName(product.category);

  return (
    <article
      className={`group bg-white rounded-xl border border-[rgba(200,154,60,0.22)] shadow-[0_2px_12px_-2px_rgba(40,25,15,0.04)] hover:shadow-[0_10px_30px_-4px_rgba(40,25,15,0.08)] hover:border-[rgba(200,154,60,0.4)] transition-all duration-200 flex flex-col overflow-hidden ${className}`}
    >
      {/* Product Image or Sacred Editorial Fallback Frame */}
      <div
        className={`relative w-full overflow-hidden bg-[#FBF8F0] border-b border-[rgba(200,154,60,0.15)] flex items-center justify-center ${
          product.imageUrl ? "aspect-[16/10]" : "h-32 sm:h-36"
        }`}
      >
        {product.imageUrl ? (
          <>
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            />
            {/* Top-right subtle category indicator */}
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-[#6B706A] border border-[rgba(200,154,60,0.25)] shadow-xs backdrop-blur-xs">
                {categoryLabel}
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-between px-5 sm:px-6 select-none bg-gradient-to-br from-[#FDFBF7] via-[#F8F3E8] to-[#F3ECE0] relative">
            {/* Subtle decorative manuscript border */}
            <div className="absolute inset-2.5 border border-[rgba(200,154,60,0.25)] rounded-lg pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3.5 pr-14">
              <div
                className="w-10 h-10 rounded-full bg-white text-[#C85A17] flex items-center justify-center text-lg shadow-xs border border-[rgba(200,154,60,0.25)] shrink-0"
                aria-hidden="true"
              >
                📖
              </div>
              <div className="space-y-0.5">
                <span className="block font-heading text-xs font-semibold text-[#8B7267] tracking-wider uppercase">
                  {categoryLabel}
                </span>
                <span className="block text-[11px] text-[#A3968C] font-serif italic">
                  भक्ति संग्रह • प्रामाणिक ग्रंथ
                </span>
              </div>
            </div>

            {/* Top-right badge */}
            <div className="absolute top-3.5 right-3.5 z-10">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-[#6B706A] border border-[rgba(200,154,60,0.25)] shadow-xs">
                अनुशंसित
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col grow">
        {/* Compliance Label: Always visible */}
        <div className="mb-2.5">
          <AffiliateLabel lang="bilingual" />
        </div>

        {/* Product Title */}
        <h3
          className="font-serif text-[#1C1C17] group-hover:text-[#C85A17] transition-colors duration-200 leading-snug line-clamp-2 mb-2 font-bold"
          style={{ fontSize: "1.0625rem" }}
        >
          {product.name}
        </h3>

        {/* Editorial Short Description */}
        {product.shortDescription && (
          <p className="font-serif text-xs sm:text-sm text-[#5A6065] leading-relaxed line-clamp-3 mb-3.5 grow">
            {product.shortDescription}
          </p>
        )}

        {/* Contextual Note if attached */}
        {product.contextualNote && (
          <div className="mb-3.5 p-2 rounded-lg bg-[#F8F4EC] border-l-2 border-[#C85A17] text-xs text-[#6B706A] italic font-serif">
            &ldquo;{product.contextualNote}&rdquo;
          </div>
        )}

        {/* Card Footer with Outbound Amazon CTA */}
        <div className="pt-3.5 border-t border-[rgba(107,112,106,0.12)] mt-auto flex items-center justify-between gap-3">
          <span className="font-ui text-[11px] text-[#8B7267]">
            Amazon India
          </span>

          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C85A17] hover:bg-[#A8440B] text-white text-xs sm:text-sm font-semibold transition-all duration-150 shadow-xs hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer"
            aria-label={`${product.name} - Amazon पर देखें (opens in new tab)`}
          >
            <span>Amazon पर देखें</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
