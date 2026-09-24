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
 *
 * Compliant with Amazon Associates India Operating Agreement and ASCI digital guidelines.
 */
export function AffiliateDisclosure({
  className = "",
  variant = "card",
}: AffiliateDisclosureProps) {
  if (variant === "inline") {
    return (
      <p className={`text-xs text-[#5A6065] leading-relaxed ${className}`}>
        * इस पेज पर कुछ लिंक affiliate links हो सकते हैं। यदि आप इनके माध्यम से खरीदारी करते हैं, तो BhaktiMania को बिना आपके अतिरिक्त खर्च के कमीशन मिल सकता है।{" "}
        <span className="text-[#6B706A] italic">
          (As an Amazon Associate I earn from qualifying purchases.){" "}
        </span>
        <Link
          href="/affiliate-disclosure"
          className="text-[#C85A17] underline underline-offset-2 hover:text-[#A8440B]"
        >
          पूरा प्रकटीकरण पढ़ें
        </Link>
      </p>
    );
  }

  return (
    <aside
      aria-label="एफिलिएट प्रकटीकरण"
      className={`my-6 p-4 sm:p-5 rounded-xl bg-[#F8F4EC] border border-[rgba(200,154,60,0.28)] flex items-start gap-3.5 shadow-xs ${className}`}
    >
      <div
        className="w-6 h-6 rounded-full bg-[#C85A17]/10 text-[#C85A17] flex items-center justify-center shrink-0 mt-0.5 text-xs select-none"
        aria-hidden="true"
      >
        ✦
      </div>
      <div className="text-xs sm:text-sm text-[#5A6065] leading-relaxed space-y-1.5 grow">
        <p>
          <strong className="font-semibold text-[#1F2326] mr-1.5">
            पारदर्शिता प्रकटीकरण:
          </strong>
          इस पेज पर कुछ लिंक affiliate links हो सकते हैं। यदि आप इनके माध्यम से खरीदारी करते हैं, तो BhaktiMania को बिना आपके अतिरिक्त खर्च के कमीशन मिल सकता है।{" "}
          <Link
            href="/affiliate-disclosure"
            className="text-[#C85A17] font-medium underline underline-offset-2 hover:text-[#A8440B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-xs"
          >
            हमारी एफिलिएट नीति पढ़ें →
          </Link>
        </p>
        <p className="text-[11px] sm:text-xs text-[#6B706A] italic font-serif">
          As an Amazon Associate I earn from qualifying purchases.
        </p>
      </div>
    </aside>
  );
}

