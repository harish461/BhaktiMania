import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { AffiliateProductItem } from "@/lib/data/supabase/types";

interface CuratedAffiliateSectionProps {
  products?: AffiliateProductItem[];
}

interface DisplayProduct {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  badge: string;
  description: string;
  affiliateUrl: string;
  imageUrl: string;
  merchantName: string;
}

const fallbackProducts: DisplayProduct[] = [
  {
    id: "gita-press-bhagwat",
    name: "श्रीमद्भागवत – शंकर भाष्य (गीता प्रेस गोरखपुर)",
    category: "धार्मिक पुस्तकें",
    categoryColor: "#C85A17",
    badge: "Gita Press",
    description:
      "श्रीमद्भागवत के आध्यात्मिक अध्ययन और गहन समझ के लिए गीता प्रेस गोरखपुर का प्रामाणिक एवं मूल श्लोक-सहित संस्करण।",
    affiliateUrl:
      "https://www.amazon.in/Shrimad-Bhagwat-Shankar-Bhashya-Gorakhpur/dp/B0BGX5ZGWX?tag=bhaktimania79-21",
    imageUrl: "/images/shop/gita-press-bhagwat.jpg",
    merchantName: "Amazon / Gita Press",
  },
  {
    id: "tulsi-japa-mala",
    name: "मूल वृंदावन तुलसी जप माला (108 मनके) + गौमुखी",
    category: "जप एवं साधना",
    categoryColor: "#8F2617",
    badge: "Natural Tulsi",
    description:
      "प्रामाणिक वृंदावन तुलसी काष्ठ से निर्मित 108+1 मनकों की पवित्र जप माला, साथ में सुंदर सूती महामंत्र मुद्रित गौमुखी थैली।",
    affiliateUrl:
      "https://www.amazon.in/s?k=tulsi+japa+mala+108+beads&tag=bhaktimania79-21",
    imageUrl: "/images/shop/tulsi-japa-mala.jpg",
    merchantName: "Amazon.in",
  },
  {
    id: "brass-akhand-diya",
    name: "शुद्ध पीतल अखंड ज्योति दीप एवं पारंपरिक आरती थाली",
    category: "पूजा सामग्री",
    categoryColor: "#C89A3C",
    badge: "Pure Brass",
    description:
      "दैनिक पूजा, नवरात्र और दीप-दान के लिए भारी शुद्ध पीतल का अखंड दीप और हस्त-नक्काशीदार सुंदर आरती पूजा थाली सेट।",
    affiliateUrl:
      "https://www.amazon.in/s?k=brass+akhand+diya+pooja+thali&tag=bhaktimania79-21",
    imageUrl: "/images/shop/brass-puja-set.jpg",
    merchantName: "Amazon.in",
  },
];

const fallbackImages = [
  "/images/shop/gita-press-bhagwat.jpg",
  "/images/shop/tulsi-japa-mala.jpg",
  "/images/shop/brass-puja-set.jpg",
];

export function CuratedAffiliateSection({
  products = [],
}: CuratedAffiliateSectionProps) {
  // Merge live products from Supabase with curated fallbacks to guarantee 3 beautiful cards
  const displayItems: DisplayProduct[] = [];

  if (products && products.length > 0) {
    products.forEach((p, idx) => {
      displayItems.push({
        id: p.id,
        name: p.name,
        category: p.category || "भक्ति संग्रह",
        categoryColor: idx === 1 ? "#8F2617" : idx === 2 ? "#C89A3C" : "#C85A17",
        badge: p.merchant === "amazon_in" ? "Amazon" : "Curated",
        description:
          p.shortDescription ||
          "साधना, अध्ययन और आध्यात्मिक जीवन के लिए चुनी गई उपयोगी वस्तु।",
        affiliateUrl: p.affiliateUrl,
        imageUrl:
          p.imageUrl && p.imageUrl.startsWith("http")
            ? p.imageUrl
            : fallbackImages[idx % fallbackImages.length],
        merchantName: p.merchant === "amazon_in" ? "Amazon.in" : "BhaktiMania",
      });
    });
  }

  // Fill up to 3 with fallbacks if needed
  while (displayItems.length < 3) {
    const nextFallback = fallbackProducts[displayItems.length];
    if (nextFallback) {
      displayItems.push(nextFallback);
    } else {
      break;
    }
  }

  return (
    <section
      id="shop"
      aria-labelledby="shop-heading"
      className="pt-4 pb-4 lg:pt-6 lg:pb-6 bg-white [scroll-margin-top:80px]"
      style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="flex items-start justify-between mb-6 pb-3 border-b border-gray-200">
          <div>
            <h2
              id="shop-heading"
              className="text-[17px] md:text-[22px] font-bold text-[#1C1C17] leading-tight"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 700 }}
            >
              Bhakti Shop
            </h2>
            <p
              className="text-[13px] text-[#6B706A] mt-1"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              Curated sacred books, japa malas and puja essentials for your sadhana
            </p>
          </div>
          <Link
            href="/shop"
            className="text-[13px] font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors whitespace-nowrap mt-1 flex items-center gap-1"
            style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
          >
            View All Shop →
          </Link>
        </div>

        {/* ── 3-column Shop Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-8">
          {displayItems.map((product) => (
            <article key={product.id} className="group flex flex-col">

              {/* Product Image */}
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="relative block overflow-hidden rounded-[4px] mb-3.5 bg-gray-50"
                style={{ aspectRatio: "16/10" }}
                tabIndex={-1}
                aria-hidden="true"
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                />

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 z-10 overflow-hidden rounded-[4px] shadow-sm bg-white/95 backdrop-blur-sm border border-amber-200/80 px-2.5 py-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A17]">
                    {product.badge}
                  </span>
                </div>
              </a>

              {/* Card body */}
              <div className="flex flex-col flex-1">

                {/* Category label & Merchant */}
                <div className="mb-1.5 flex items-center justify-between">
                  <span
                    className="text-[11px] font-semibold tracking-[0.06em] uppercase"
                    style={{
                      fontFamily: "var(--font-poppins), Poppins, sans-serif",
                      color: product.categoryColor,
                    }}
                  >
                    {product.category}
                  </span>
                  <span className="text-[11px] text-[#8B7267] font-medium">
                    {product.merchantName}
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="mb-1.5">
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="text-[16px] font-bold text-[#1C1C17] leading-snug hover:text-[#C85A17] transition-colors line-clamp-2"
                    style={{
                      fontFamily: "var(--font-poppins), Poppins, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {product.name}
                  </a>
                </h3>

                {/* Short Description */}
                <p
                  className="text-[13px] text-[#6B706A] leading-relaxed line-clamp-2 mb-3 flex-1"
                  style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
                >
                  {product.description}
                </p>

                {/* Card footer — Buy / Explore Button */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-[12px]">
                  <span className="text-[#8B7267] font-medium text-[11.5px] flex items-center gap-1">
                    <svg className="w-3 h-3 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    प्रामाणिक संग्रह
                  </span>
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors flex items-center gap-1"
                  >
                    उत्पाद देखें →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center lg:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-7 py-2.5 border border-[#C85A17] text-[13px] font-semibold text-[#C85A17] hover:bg-[#FFF5EF] transition-colors rounded"
            style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
          >
            View All Shop →
          </Link>
        </div>
      </div>
    </section>
  );
}
