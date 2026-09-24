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
          1. CENTERED MASTHEAD / BRAND TITLE AREA
      ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full pt-3 pb-3 flex flex-col items-center justify-center text-center px-4">
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
          - 3 equal columns on desktop
          - Preserved heights, crops, positions, and anchor links
          - Redesigned sophisticated editorial bottom overlay
      ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-none p-0 m-0 border-t border-b border-[rgba(107,112,106,0.15)]">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full p-0 m-0 gap-0">
          {panels.map((panel, idx) => (
            <Link
              key={panel.id}
              href={panel.href}
              className={`group relative block w-full overflow-hidden h-[480px] sm:h-[520px] lg:h-[560px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] ${
                idx < panels.length - 1
                  ? "md:border-r border-b md:border-b-0 border-[rgba(107,112,106,0.15)]"
                  : ""
              }`}
            >
              {/* Full-bleed cinematic image with subtle 1.02–1.03 scale on hover */}
              <div className="absolute inset-0 overflow-hidden bg-[#252824]">
                <Image
                  src={panel.imageSrc}
                  alt={panel.imageAlt}
                  fill
                  priority
                  style={{ objectPosition: panel.objectPosition }}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  sizes="(max-width: 768px) 100vw, 33.333vw"
                />
              </div>

              {/* ── Modern Premium Editorial Caption Overlay ──
                  - Subtle warm ivory overlay: rgba(251, 248, 240, 0.82)
                  - Image clearly visible underneath, feels like one composition
                  - Height: compact ~130–145px
                  - Disciplined editorial typography & spacing
              ── */}
              <div
                className="absolute bottom-0 inset-x-0 px-6 py-5 sm:px-7 sm:py-5 lg:px-[30px] lg:pt-[22px] lg:pb-[24px] flex flex-col justify-end transition-colors duration-500 group-hover:bg-[rgba(251,248,240,0.88)]"
                style={{
                  backgroundColor: "rgba(251, 248, 240, 0.82)",
                  borderTop: "1px solid rgba(107, 112, 106, 0.12)",
                }}
              >
                {/* 1. Refined Category Eyebrow — Poppins 600, 10.5–11px, #A8440B */}
                <div
                  className="text-[10.5px] sm:text-[11px] font-semibold tracking-[0.06em] uppercase mb-[7px] [font-family:var(--font-poppins)]"
                  style={{ color: "#A8440B" }}
                >
                  {panel.category}
                </div>

                {/* 2. Main Title — Poppins 700, 28–30px, #252824, line-height 1.15 */}
                <h2
                  className="text-[26px] sm:text-[28px] lg:text-[30px] font-bold leading-[1.15] tracking-tight mb-[6px] text-[#252824] group-hover:text-[#1C1C17] transition-colors duration-200 [font-family:var(--font-poppins)]"
                  style={{ fontWeight: 700 }}
                >
                  {panel.title}
                </h2>

                {/* 3. Subdued Description — Poppins 400, 11.5–12px, #6B706A, 1 line */}
                <p className="text-[11.5px] sm:text-[12px] font-normal leading-[1.45] text-[#6B706A] line-clamp-1 mb-0 [font-family:var(--font-poppins)]">
                  {panel.description}
                </p>

                {/* 4. Editorial Text Link CTA with subtle short saffron accent line */}
                <div className="mt-3 sm:mt-3.5 flex flex-col items-start">
                  <div className="inline-flex items-center text-[12.5px] sm:text-[13px] font-semibold tracking-[0.02em] text-[#252824] group-hover:text-[#A8440B] transition-colors duration-200 [font-family:var(--font-poppins)]">
                    <span>{panel.ctaText}</span>
                    <span className="text-[#C85A17] ml-1.5 transition-transform duration-300 ease-out group-hover:translate-x-1 text-[13px]">
                      →
                    </span>
                  </div>
                  {/* Editorial Accent Underline: ~26px wide, 1.5px high */}
                  <div
                    className="w-[26px] h-[1.5px] bg-[#C85A17] mt-1 transition-all duration-300 ease-out group-hover:w-[34px] group-hover:bg-[#A8440B]"
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
