import React from "react";
import Link from "next/link";

export interface AffiliateDisclosureProps {
  className?: string;
  variant?: "inline" | "card";
}

/**
 * AffiliateDisclosure — Transparent affiliate notice for devotional readers.
 * Clearly informs users that qualifying purchases made through prospective links
 * may support BhaktiMania without any additional cost to the reader.
 */
export function AffiliateDisclosure({
  className = "",
  variant = "card",
}: AffiliateDisclosureProps) {
  if (variant === "inline") {
    return (
      <p className={`text-xs text-[#5A6065] italic leading-relaxed ${className}`}>
        * इस पेज पर कुछ लिंक affiliate links हो सकते हैं। यदि आप इनके माध्यम से खरीदारी करते हैं, तो BhaktiMania को बिना आपके अतिरिक्त खर्च के कमीशन मिल सकता है।{" "}
        <Link
          href="/affiliate-disclosure"
          className="text-[#6B1724] underline underline-offset-2 hover:text-[#52111C]"
        >
          पूरा प्रकटीकरण पढ़ें
        </Link>
      </p>
    );
  }

  return (
    <aside
      aria-label="एफिलिएट प्रकटीकरण"
      className={`my-6 p-4 rounded-xl bg-[#F8F4EC] border border-[#6B1724]/12 flex items-start gap-3.5 shadow-xs ${className}`}
    >
      <div className="w-6 h-6 rounded-full bg-[#6B1724]/10 text-[#6B1724] flex items-center justify-center shrink-0 mt-0.5 text-xs select-none">
        ✦
      </div>
      <div className="text-xs sm:text-sm text-[#5A6065] leading-relaxed">
        <strong className="font-medium text-[#1F2326] block sm:inline mr-1.5">
          पारदर्शिता प्रकटीकरण:
        </strong>
        इस पेज पर कुछ लिंक affiliate links हो सकते हैं। यदि आप इनके माध्यम से खरीदारी करते हैं, तो BhaktiMania को बिना आपके अतिरिक्त खर्च के कमीशन मिल सकता है।{" "}
        <Link
          href="/affiliate-disclosure"
          className="text-[#6B1724] font-medium underline underline-offset-2 hover:text-[#52111C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-xs"
        >
          हमारी एफिलिएट नीति पढ़ें →
        </Link>
      </div>
    </aside>
  );
}
