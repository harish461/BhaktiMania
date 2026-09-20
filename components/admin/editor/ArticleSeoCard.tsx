"use client";

import React from "react";

interface ArticleSeoCardProps {
  seoTitle: string;
  onSeoTitleChange: (val: string) => void;
  seoDescription: string;
  onSeoDescriptionChange: (val: string) => void;
  title: string;
  description: string;
  slug: string;
  siteUrl?: string;
}

export function ArticleSeoCard({
  seoTitle,
  onSeoTitleChange,
  seoDescription,
  onSeoDescriptionChange,
  title,
  description,
  slug,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "",
}: ArticleSeoCardProps) {
  const displayTitle = seoTitle || title || "Article Title";
  const displayDesc =
    seoDescription ||
    description ||
    "Article description will appear here in search engine results...";

  let hostname = "bhaktimania.com";
  try {
    if (siteUrl) {
      hostname = new URL(siteUrl).hostname;
    }
  } catch {
    hostname = "bhaktimania.com";
  }

  return (
    <div className="bg-[#FDFBF7] rounded-3xl p-5 sm:p-8 border border-[#6B1724]/12 shadow-sm space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-[#6B1724]/10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#6B1724]" aria-hidden="true" />
        <h2 className="font-heading text-lg sm:text-xl font-bold text-[#6B1724]">
          C. Search Engine Optimization (SEO)
        </h2>
      </div>

      <div className="space-y-5">
        {/* SEO Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="seo-title"
              className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724]"
            >
              SEO Meta Title
            </label>
            <span className="text-xs text-[#5A6065]">
              {seoTitle.length} characters (Recommended: 50–60)
            </span>
          </div>
          <input
            id="seo-title"
            type="text"
            value={seoTitle}
            onChange={(e) => onSeoTitleChange(e.target.value)}
            placeholder={title ? `Defaults to: ${title}` : "Optional. Defaults to article title"}
            className="w-full px-4 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all placeholder:text-[#5A6065]/40"
          />
          <p className="text-[11px] text-[#5A6065] mt-1">
            Optional. Defaults to the article title. Appears in browser tab and search results.
          </p>
        </div>

        {/* SEO Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="seo-desc"
              className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724]"
            >
              SEO Meta Description
            </label>
            <span className="text-xs text-[#5A6065]">
              {seoDescription.length} characters (Recommended: 120–160)
            </span>
          </div>
          <textarea
            id="seo-desc"
            rows={3}
            value={seoDescription}
            onChange={(e) => onSeoDescriptionChange(e.target.value)}
            placeholder={
              description
                ? `Defaults to: ${description.substring(0, 100)}...`
                : "Optional. Defaults to article description"
            }
            className="w-full px-4 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm leading-relaxed focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all placeholder:text-[#5A6065]/40"
          />
          <p className="text-[11px] text-[#5A6065] mt-1">
            Optional. Defaults to the article description. Used by search engines for the snippet summary.
          </p>
        </div>

        {/* Live Search Result Preview Card */}
        <div className="pt-3 border-t border-[#6B1724]/8">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-2 flex items-center gap-1.5">
            <span className="text-[#D97706]">🔍</span>
            <span>Search Result Snippet Preview</span>
          </label>
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#6B1724]/15 shadow-xs max-w-2xl font-sans">
            <div className="flex items-center gap-2 mb-1.5 text-xs text-[#5A6065]">
              <div className="w-4 h-4 rounded-full bg-[#6B1724] text-white flex items-center justify-center text-[10px] font-bold">
                B
              </div>
              <span className="text-[#1F2326] font-medium">{hostname}</span>
              <span className="text-[#5A6065]/60">› bhakti-gyaan › {slug || "your-slug"}</span>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-[#1A0DAB] hover:underline cursor-pointer leading-snug line-clamp-1 mb-1">
              {displayTitle} | BhaktiMania
            </h3>
            <p className="text-xs sm:text-sm text-[#4D5156] leading-relaxed line-clamp-2">
              {displayDesc}
            </p>
          </div>
          <p className="text-[11px] text-[#5A6065] mt-2 italic">
            This is a simulated preview. Actual search engine display may vary based on query, locale, and screen size.
          </p>
        </div>
      </div>
    </div>
  );
}
