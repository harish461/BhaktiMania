import React from "react";
import Link from "next/link";
import Image from "next/image";
import { socialConfig } from "@/lib/social/config";

// ─── Verified routes only ────────────────────────────────────────────────────
const exploreLinks = [
  { label: "श्रीमद्भगवद्गीता", href: "/bhagavad-gita" },
  { label: "भक्ति साधना", href: "/bhakti-gyaan" },
  { label: "दैनिक भक्ति वाणी", href: "/bhakti-vichar" },
  { label: "राधा-कृष्ण प्रेम", href: "/radha-krishna" },
  { label: "पावन धाम वृंदावन", href: "/vrindavan" },
  { label: "पर्व एवं विशेष दिन", href: "/festivals" },
];

const importantLinks = [
  { label: "About BhaktiMania", href: "/about" },
  { label: "Bhakti Articles", href: "/#articles" },
  { label: "Bhakti Shop", href: "/#shop" },
  { label: "Devotional Calendar", href: "/#calendar" },
  { label: "Social Links", href: "/#social" },
  { label: "Contact Editorial", href: "/contact" },
];

const legalBottomLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Satsang", href: "/terms" },
  { label: "Editorial Ethics", href: "/disclaimer" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-white text-[#1C1C17] border-t border-gray-200 mt-auto relative overflow-hidden"
      style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
      aria-label="साइट फ़ुटर"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-12 lg:pt-14 pb-8">
        {/* ── Main 4-column grid (Desktop: 4/12 + 2/12 + 2/12 + 4/12) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-10 xl:gap-8">

          {/* ── COLUMN 1: Upper Brand Logo & Sacred Mission (Desktop: 4/12) ── */}
          <div className="md:col-span-1 xl:col-span-4 flex flex-col space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3.5 group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] w-fit"
              aria-label="BhaktiMania — Home"
            >
              {/* Upper Circular Logo with Sacred Gradient Ring */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] bg-gradient-to-b from-[#D8B45A] via-[#C89A3C] to-[#A8440B] shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                  <Image
                    src="/images/bhaktimania-logo.jpg"
                    alt="BhaktiMania Logo"
                    fill
                    className="object-cover object-center"
                    sizes="56px"
                  />
                </div>
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col">
                <span className="text-[22px] sm:text-[24px] text-[#1C1C17] tracking-tight leading-none font-bold group-hover:text-[#C85A17] transition-colors duration-200">
                  BhaktiMania
                </span>
                <span className="text-[10px] text-[#A8440B] tracking-[0.2em] uppercase mt-1.5 leading-none font-semibold">
                  भक्ति • ज्ञान • शांति
                </span>
              </div>
            </Link>

            {/* Brand Hindi description */}
            <p className="text-[13px] text-[#6B706A] leading-relaxed max-w-sm">
              सनातन धर्म, भक्ति कला, वेदांत दर्शन और ईश्वरीय प्रेम के प्रति
              समर्पित एक शांतिपूर्ण डिजिटल आध्यात्मिक मंच।
            </p>

            {/* Sacred Sanskrit Inscription */}
            <div className="pt-1 flex items-center gap-2.5 text-[#C85A17] text-[13px] tracking-wide font-medium">
              <span className="text-[15px] select-none">ॐ</span>
              <span className="opacity-40">•</span>
              <span>हरि ॐ तत् सत्</span>
            </div>
          </div>

          {/* ── COLUMN 2: Explore Gyaan (Desktop: 2/12) ── */}
          <div className="md:col-span-1 xl:col-span-2 flex flex-col space-y-3.5">
            <h3 className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#1C1C17] pb-2 border-b border-gray-100">
              Explore Gyaan
            </h3>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#6B706A] hover:text-[#C85A17] hover:translate-x-0.5 transition-all duration-150 inline-block rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C85A17]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLUMN 3: Important Navigation (Desktop: 2/12) ── */}
          <div className="md:col-span-1 xl:col-span-2 flex flex-col space-y-3.5">
            <h3 className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#1C1C17] pb-2 border-b border-gray-100">
              Important
            </h3>
            <ul className="space-y-2">
              {importantLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#6B706A] hover:text-[#C85A17] hover:translate-x-0.5 transition-all duration-150 inline-block rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C85A17]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLUMN 4: Social & Community (Desktop: 4/12) ── */}
          <div className="md:col-span-1 xl:col-span-4 flex flex-col space-y-3.5">
            <h3 className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#1C1C17] pb-2 border-b border-gray-100">
              Social Community
            </h3>

            <p className="text-[13px] text-[#6B706A] leading-relaxed">
              हमारे दैनिक विचार, श्लोक, रील्स और सुंदर भजनों से सोशल मीडिया पर भी जुड़े रहें।
            </p>

            {/* Social Buttons with Platform Brand Accents */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* YouTube Shorts Button */}
              <a
                href={socialConfig.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Shorts पर BhaktiMania देखें (opens in new tab)"
                className="group flex items-center gap-2 px-3 h-9 rounded-[4px] bg-[#FAF8F5] hover:bg-[#FF0000]/5 border border-gray-200 hover:border-[#FF0000]/40 text-[#252824] hover:text-[#FF0000] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0000]"
              >
                <svg
                  className="w-4 h-4 text-[#FF0000] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="text-[12px] font-semibold tracking-wide">
                  YouTube Shorts
                </span>
              </a>

              {/* Facebook Button */}
              <a
                href={socialConfig.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook पर BhaktiMania पेज से जुड़ें (opens in new tab)"
                className="group flex items-center gap-2 px-3 h-9 rounded-[4px] bg-[#FAF8F5] hover:bg-[#1877F2]/5 border border-gray-200 hover:border-[#1877F2]/40 text-[#252824] hover:text-[#1877F2] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2]"
              >
                <svg
                  className="w-4 h-4 text-[#1877F2] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-[12px] font-semibold tracking-wide">
                  Facebook
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* ── BOTTOM BAR: Legal & Copyright ── */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Left: Copyright & Dedication */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-[12px] text-[#6B706A]">
            <span>© {currentYear} BhaktiMania. All rights reserved.</span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span className="text-[#C85A17]">
              Dedicated to Sanatana Dharma, Sacred Arts &amp; Divine Love.
            </span>
          </div>

          {/* Right: Legal links */}
          <nav
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] text-[#6B706A]"
            aria-label="फ़ुटर कानूनी नीतियां"
          >
            {legalBottomLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[#C85A17] transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C85A17]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
