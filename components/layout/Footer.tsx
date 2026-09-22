import React from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Verified routes only — no 404s ──────────────────────────────────────────
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
  { label: "Editorial Heritage", href: "/about" },
  { label: "Devotional Calendar", href: "/festivals" },
  { label: "Contact Editorial", href: "/contact" },
  { label: "Privacy & Terms", href: "/privacy-policy" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
];

const legalBottomLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Satsang", href: "/terms" },
  { label: "Editorial Ethics", href: "/disclaimer" },
];

// ─── Exact Approved Social Destinations ──────────────────────────────────────
const SOCIAL_URLS = {
  youtube: "https://www.youtube.com/@BhaktiMania1630/shorts",
  facebook: "https://www.facebook.com/share/16FqSftNCDM/?mibextid=wwXIfr",
} as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-[#7A270D] text-[#FBF8F0] mt-auto relative overflow-hidden"
      aria-label="साइट फ़ुटर"
    >
      {/* Subtle antique gold top hairline */}
      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(216,180,90,0.45)] to-transparent"
        aria-hidden="true"
      />

      <div className="container-desktop pt-14 lg:pt-16 pb-10">
        {/* ── Main 4-column grid (Desktop: 30%/20%/20%/30%, Tablet: 2x2, Mobile: 1-col) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-10 xl:gap-8">

          {/* ── COLUMN 1: Brand & Sacred Motto (Desktop: 4/12 ~ 33%) ── */}
          <div className="md:col-span-1 xl:col-span-4 flex flex-col space-y-5">
            {/* Logo treatment: [Icon] + BhaktiMania + A JOURNEY WITHIN */}
            <Link
              href="/"
              className="inline-flex items-center gap-3.5 group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B45A] w-fit"
              aria-label="BhaktiMania — A Journey Within — होम पर जाएं"
            >
              <Image
                src="/images/logo-icon.png"
                alt="BhaktiMania Logo"
                width={44}
                height={44}
                className="w-11 h-11 object-contain flex-shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-200"
              />
              <div className="flex flex-col">
                <span className="font-heading text-[25px] sm:text-[27px] text-[#FBF8F0] tracking-tight leading-none group-hover:text-[#D8B45A] transition-colors duration-200 font-bold">
                  BhaktiMania
                </span>
                <span className="font-ui text-[9.5px] text-[#D8B45A] tracking-[0.2em] uppercase mt-1.5 leading-none font-semibold">
                  A JOURNEY WITHIN
                </span>
              </div>
            </Link>

            {/* Short Hindi brand description */}
            <p className="font-serif text-[0.9375rem] text-[#EDE2CF]/85 leading-relaxed max-w-sm">
              सनातन धर्म, भक्ति कला, वेदांत दर्शन और ईश्वरीय प्रेम के प्रति
              समर्पित एक शांतिपूर्ण डिजिटल आध्यात्मिक मंच।
            </p>

            {/* Sacred Sanskrit Inscription */}
            <div className="pt-2 flex items-center gap-2.5 text-[#D8B45A] font-serif text-sm tracking-wide">
              <span className="text-base select-none">ॐ</span>
              <span className="opacity-60">•</span>
              <span>हरि ॐ तत् सत्</span>
            </div>
          </div>

          {/* ── COLUMN 2: Explore Gyaan (Desktop: 2/12 ~ 17-20%) ── */}
          <div className="md:col-span-1 xl:col-span-2 flex flex-col space-y-4">
            <h3 className="font-ui text-[12px] font-bold tracking-[0.14em] uppercase text-[#D8B45A] pb-2.5 border-b border-[rgba(216,180,90,0.25)]">
              Explore Gyaan
            </h3>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="font-serif text-[0.9375rem] text-[#EDE2CF]/80 hover:text-[#D8B45A] hover:translate-x-0.5 transition-all duration-150 inline-block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B45A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLUMN 3: Important (Desktop: 2/12 ~ 17-20%) ── */}
          <div className="md:col-span-1 xl:col-span-2 flex flex-col space-y-4">
            <h3 className="font-ui text-[12px] font-bold tracking-[0.14em] uppercase text-[#D8B45A] pb-2.5 border-b border-[rgba(216,180,90,0.25)]">
              Important
            </h3>
            <ul className="space-y-2.5">
              {importantLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="font-serif text-[0.9375rem] text-[#EDE2CF]/80 hover:text-[#D8B45A] hover:translate-x-0.5 transition-all duration-150 inline-block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B45A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLUMN 4: Social & Satsang (Desktop: 4/12 ~ 33%) ── */}
          <div className="md:col-span-1 xl:col-span-4 flex flex-col space-y-4">
            <h3 className="font-ui text-[12px] font-bold tracking-[0.14em] uppercase text-[#D8B45A] pb-2.5 border-b border-[rgba(216,180,90,0.25)]">
              Social &amp; Satsang
            </h3>

            <p className="font-serif text-[0.9375rem] text-[#EDE2CF]/85 leading-relaxed">
              हमारे दैनिक विचार, श्लोक और सुंदर भजनों से सोशल मीडिया पर भी जुड़े
              रहें।
            </p>

            {/* Small rounded-square buttons */}
            <div className="flex items-center gap-3 pt-2">
              {/* YouTube Shorts Button */}
              <a
                href={SOCIAL_URLS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Shorts पर BhaktiMania देखें (नए टैब में खुलेगा)"
                className="group flex items-center gap-2.5 px-3.5 h-11 rounded-[6px] bg-[rgba(251,248,240,0.08)] hover:bg-[#C85A17] border border-[rgba(216,180,90,0.3)] hover:border-[#D8B45A] text-[#FBF8F0] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B45A]"
              >
                {/* YouTube Icon */}
                <svg
                  className="w-5 h-5 text-[#FF4444] group-hover:text-white transition-colors flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="font-ui text-xs font-semibold tracking-wide">
                  YouTube Shorts
                </span>
              </a>

              {/* Facebook Button */}
              <a
                href={SOCIAL_URLS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook पर BhaktiMania पेज से जुड़ें (नए टैब में खुलेगा)"
                className="group flex items-center gap-2.5 px-3.5 h-11 rounded-[6px] bg-[rgba(251,248,240,0.08)] hover:bg-[#C85A17] border border-[rgba(216,180,90,0.3)] hover:border-[#D8B45A] text-[#FBF8F0] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B45A]"
              >
                {/* Facebook Icon */}
                <svg
                  className="w-5 h-5 text-[#4293FF] group-hover:text-white transition-colors flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="font-ui text-xs font-semibold tracking-wide">
                  Facebook
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* ── BOTTOM BAR: Legal & Copyright ── */}
        <div className="mt-12 lg:mt-16 pt-6 border-t border-[rgba(216,180,90,0.2)] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Left: Copyright & Dedication */}
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-xs text-[#EDE2CF]/75 font-ui">
            <span>© {currentYear} BhaktiMania. All rights reserved.</span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="text-[#D8B45A]/90 font-serif">
              Dedicated to Sanatana Dharma, Sacred Arts &amp; Divine Love.
            </span>
          </div>

          {/* Right: Legal links */}
          <nav
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-ui text-[#EDE2CF]/80"
            aria-label="फ़ुटर कानूनी नीतियां"
          >
            {legalBottomLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[#D8B45A] transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B45A]"
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

