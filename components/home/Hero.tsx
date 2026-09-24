import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FeaturePanel {
  id: string;
  category: string;
  title: string;
  description: string;
  ctaText: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  objectPosition: string;
}

const panels: FeaturePanel[] = [
  {
    id: "articles",
    category: "भक्ति ज्ञान",
    title: "Bhakti Articles",
    description: "भक्ति, आध्यात्मिक ज्ञान और जीवन को सरल बनाने वाले प्रेरणादायक लेख।",
    ctaText: "Explore Articles",
    href: "/#articles",
    imageSrc: "/images/hero-panel-articles.jpg",
    imageAlt: "Sacred Bhagavad Gita manuscript on sandalwood stand with brass diya and peacock feather",
    objectPosition: "center center",
  },
  {
    id: "shop",
    category: "भक्ति संग्रह",
    title: "Bhakti Shop",
    description: "भक्ति और साधना से जुड़ी चुनी हुई उपयोगी वस्तुएँ।",
    ctaText: "Explore Shop",
    href: "/#shop",
    imageSrc: "/images/hero-panel-shop.jpg",
    imageAlt: "Luxury Indian devotional boutique still life with Rudraksha mala, brass deity, incense and diya",
    objectPosition: "center center",
  },
  {
    id: "calendar",
    category: "पर्व एवं विशेष दिन",
    title: "Bhakti Calendar",
    description: "एकादशी, पूर्णिमा, पर्व और प्रमुख आध्यात्मिक तिथियों की जानकारी।",
    ctaText: "View Calendar",
    href: "/#calendar",
    imageSrc: "/images/hero-panel-calendar.jpg",
    imageAlt: "Auspicious Indian temple festival with hanging brass bells, marigold garlands, and earthen diyas",
    objectPosition: "center center",
  },
];

export function Hero() {
  return (
    <section
      aria-label="BhaktiMania Full-Width Editorial Hero"
      className="w-full bg-[#FFFFFF] overflow-x-hidden"
    >
      {/* ══════════════════════════════════════════════════════════════════
          1. CENTERED MASTHEAD / BRAND TITLE AREA (Desktop ONLY — Hidden on mobile)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex w-full pt-3 pb-3 flex-col items-center justify-center text-center px-4">
        <Link
          href="/"
          className="group inline-flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-full"
          aria-label="BhaktiMania — Home"
        >
          {/* Logo */}
          <div className="relative w-[120px] h-[120px] sm:w-[128px] sm:h-[128px] lg:w-[134px] lg:h-[134px] rounded-full p-[2.5px] bg-gradient-to-b from-[#D8B45A] via-[#C89A3C] to-[#A8440B] shadow-[0_4px_18px_rgba(200,154,60,0.18)] group-hover:scale-[1.02] transition-transform duration-300">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#FFFFFF] relative">
              <Image
                src="/images/bhaktimania-logo.jpg"
                alt="BhaktiMania — भक्ति • ज्ञान • शांति"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 640px) 120px, 134px"
              />
            </div>
          </div>

          {/* Tagline with flanking hairlines */}
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="w-12 sm:w-16 h-px bg-[#C89A3C]/50" aria-hidden="true" />
            <span
              className="text-[11.5px] tracking-[0.28em] uppercase text-[#751F2A] font-medium [font-family:var(--font-poppins)]"
              style={{ fontWeight: 500 }}
            >
              भक्ति • ज्ञान • शांति
            </span>
            <span className="w-12 sm:w-16 h-px bg-[#C89A3C]/50" aria-hidden="true" />
          </div>
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          2. TRUE FULL-WIDTH EDGE-TO-EDGE EDITORIAL TRIPTYCH
          - Mobile: Compact 215px images + ~104px captions (Articles + Shop 100% visible in 1st view)
          - Desktop: Preserved 500–560px height with absolute bottom overlay (UNCHANGED)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-none p-0 m-0 border-t md:border-t border-b border-[rgba(107,112,106,0.15)]">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full p-0 m-0 gap-0">
          {panels.map((panel, idx) => (
            <Link
              key={panel.id}
              href={panel.href}
              className={`group relative flex flex-col md:block w-full overflow-hidden md:h-[500px] lg:h-[560px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] ${
                idx < panels.length - 1
                  ? "border-b md:border-b-0 md:border-r border-[rgba(107,112,106,0.15)]"
                  : ""
              }`}
            >
              {/* Image Container: Dedicated 215px on mobile, full-bleed absolute on desktop */}
              <div className="relative w-full h-[215px] sm:h-[230px] md:absolute md:inset-0 md:h-full overflow-hidden bg-[#252824] flex-shrink-0">
                <Image
                  src={panel.imageSrc}
                  alt={panel.imageAlt}
                  fill
                  priority={idx === 0}
                  style={{ objectPosition: panel.objectPosition }}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  sizes="(max-width: 768px) 100vw, 33.333vw"
                />
              </div>

              {/* Caption Container: Integrated below image on mobile (~104px), absolute overlay on desktop (~135px) */}
              <div
                className="relative md:absolute md:bottom-0 md:inset-x-0 w-full px-4 py-3 sm:px-5 sm:py-3.5 md:px-7 md:py-5 lg:px-[30px] lg:pt-[22px] lg:pb-[24px] flex flex-col justify-end transition-colors duration-500 bg-[#FBF8F0] md:bg-[rgba(251,248,240,0.82)] group-hover:bg-[#FBF8F0] md:group-hover:bg-[rgba(251,248,240,0.88)]"
                style={{
                  borderTop: "1px solid rgba(107, 112, 106, 0.12)",
                }}
              >
                {/* 1. Category Eyebrow */}
                <span
                  className="block text-[10px] md:text-[10.5px] lg:text-[11px] font-semibold tracking-[0.06em] uppercase m-0 mb-1 leading-none [font-family:var(--font-poppins)]"
                  style={{ color: "#A8440B" }}
                >
                  {panel.category}
                </span>

                {/* 2. Main Title */}
                <h2
                  className="text-[21px] sm:text-[23px] md:text-[26px] lg:text-[28px] font-bold leading-tight tracking-tight m-0 mb-1 text-[#252824] group-hover:text-[#1C1C17] transition-colors duration-200 [font-family:var(--font-poppins)]"
                  style={{ fontWeight: 700 }}
                >
                  {panel.title}
                </h2>

                {/* 3. Description — exactly 1 line on mobile */}
                <p className="text-[11px] sm:text-[11.5px] md:text-[12px] font-normal leading-snug text-[#6B706A] line-clamp-1 m-0 mb-2 [font-family:var(--font-poppins)]">
                  {panel.description}
                </p>

                {/* 4. Editorial Text Link CTA */}
                <div className="flex flex-col items-start leading-none">
                  <div className="inline-flex items-center text-[11.5px] sm:text-[12px] md:text-[12.5px] font-semibold tracking-[0.02em] text-[#252824] group-hover:text-[#A8440B] transition-colors duration-200 [font-family:var(--font-poppins)]">
                    <span>{panel.ctaText}</span>
                    <span className="text-[#C85A17] ml-1.5 transition-transform duration-300 ease-out group-hover:translate-x-1 text-[11.5px] md:text-[12.5px]">
                      →
                    </span>
                  </div>
                  {/* Underline */}
                  <div
                    className="w-[22px] md:w-[26px] h-[1.5px] bg-[#C85A17] mt-1 transition-all duration-300 ease-out group-hover:w-[30px] md:group-hover:w-[34px] group-hover:bg-[#A8440B]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
