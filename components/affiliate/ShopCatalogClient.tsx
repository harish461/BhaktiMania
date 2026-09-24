"use client";

import React, { useState, useMemo } from "react";
import type { AffiliateProductItem } from "@/lib/data/supabase/types";
import { AffiliateProductCard } from "./AffiliateProductCard";

interface ShopCatalogClientProps {
  products: AffiliateProductItem[];
}

/**
 * Normalizes category strings (handling legacy slugs and English keys)
 * into canonical Hindi category names.
 */
function normalizeCategory(category: string | null | undefined): string {
  if (!category) return "अन्य";
  const cat = category.trim();
  const lower = cat.toLowerCase();

  const slugMap: Record<string, string> = {
    books: "धार्मिक पुस्तकें",
    japa_mala: "जप माला",
    puja_essentials: "पूजा सामग्री",
    meditation: "ध्यान एवं साधना",
    artwork: "आध्यात्मिक कला",
    travel_guides: "तीर्थ यात्रा",
  };

  return slugMap[lower] || cat;
}

export function ShopCatalogClient({ products }: ShopCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("सभी");

  // Determine categories that are actively present among the products
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const normalized = normalizeCategory(p.category);
      if (normalized) {
        set.add(normalized);
      }
    });

    // Return "सभी" first, followed by available categories in stable order
    const preferredOrder = [
      "धार्मिक पुस्तकें",
      "जप माला",
      "पूजा सामग्री",
      "ध्यान एवं साधना",
      "आध्यात्मिक कला",
      "तीर्थ यात्रा",
    ];

    const sortedActive = Array.from(set).sort((a, b) => {
      const idxA = preferredOrder.indexOf(a);
      const idxB = preferredOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b, "hi");
    });

    return ["सभी", ...sortedActive];
  }, [products]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "सभी") {
      return products;
    }
    return products.filter(
      (p) => normalizeCategory(p.category) === selectedCategory
    );
  }, [products, selectedCategory]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Category Filter Bar — Only renders if there are products with categories */}
      {availableCategories.length > 1 && (
        <nav
          aria-label="उत्पाद श्रेणियाँ"
          className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none"
        >
          {availableCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] ${
                  isSelected
                    ? "bg-[#6B1724] text-white shadow-xs font-semibold"
                    : "bg-white text-[#5A6065] border border-[rgba(200,154,60,0.25)] hover:border-[#C85A17] hover:text-[#1F2326]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>
      )}

      {/* Product Grid / Empty State */}
      {filteredProducts.length > 0 ? (
        <div
          className={`grid grid-cols-1 ${
            filteredProducts.length === 1
              ? "max-w-md lg:max-w-lg"
              : filteredProducts.length === 2
              ? "md:grid-cols-2 max-w-3xl"
              : "md:grid-cols-2 lg:grid-cols-3"
          } gap-6 sm:gap-7`}
        >
          {filteredProducts.map((product) => (
            <AffiliateProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 sm:p-16 text-center bg-white rounded-2xl border border-dashed border-[rgba(200,154,60,0.3)] max-w-xl mx-auto my-6 shadow-xs">
          <div
            className="w-14 h-14 rounded-full bg-[rgba(200,154,60,0.12)] text-[#C85A17] flex items-center justify-center mx-auto mb-4 text-2xl font-serif select-none"
            aria-hidden="true"
          >
            ✦
          </div>
          <h2 className="text-lg font-bold font-heading text-[#1F2326] mb-2">
            जल्द ही यहाँ भक्ति से जुड़ी उपयोगी वस्तुएँ उपलब्ध होंगी।
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6065] font-serif leading-relaxed max-w-md mx-auto">
            हम केवल प्रामाणिक, उच्च-गुणवत्ता एवं साधना के लिए अनुशंसित वस्तुओं
            का ही चयन करते हैं।
          </p>
        </div>
      )}
    </div>
  );
}
