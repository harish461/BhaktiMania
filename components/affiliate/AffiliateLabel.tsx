import React from "react";

export interface AffiliateLabelProps {
  className?: string;
  lang?: "hi" | "en" | "bilingual";
}

/**
 * AffiliateLabel — Minimal reusable compliance badge for future product cards and affiliate links.
 * Meets ASCI (India) and Amazon Associates disclosure standards for commercial transparency.
 */
export function AffiliateLabel({
  className = "",
  lang = "bilingual",
}: AffiliateLabelProps) {
  let labelText = "एफिलिएट • Affiliate";
  if (lang === "hi") labelText = "एफिलिएट लिंक";
  if (lang === "en") labelText = "Affiliate Link";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10px] font-ui font-semibold uppercase tracking-wider bg-[rgba(200,154,60,0.12)] text-[#A8440B] border border-[rgba(200,154,60,0.3)] select-none ${className}`}
      title="Commercial affiliate recommendation"
    >
      <span className="text-[#C89A3C]" aria-hidden="true">
        ✦
      </span>
      <span>{labelText}</span>
    </span>
  );
}
