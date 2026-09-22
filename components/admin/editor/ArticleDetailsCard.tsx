"use client";

import React, { useState, useEffect } from "react";
import type { SupabaseCategory, DatabaseAuthor } from "@/lib/data/supabase";
import { checkSlugAvailabilityAction } from "@/app/admin/actions/articles";
import { FeaturedImageField } from "./FeaturedImageField";

export const DEVOTIONAL_SYMBOLS = [
  { value: "दीप", label: "दीप (Lamp)" },
  { value: "शंख", label: "शंख (Conch)" },
  { value: "कमल", label: "कमल (Lotus)" },
  { value: "धनुष", label: "धनुष (Bow)" },
  { value: "त्रिशूल", label: "त्रिशूल (Trishul)" },
  { value: "गीता", label: "गीता (Gita)" },
  { value: "बांसुरी", label: "बांसुरी (Flute)" },
  { value: "ध्वज", label: "ध्वज (Flag)" },
];

interface ArticleDetailsCardProps {
  title: string;
  onTitleChange: (title: string) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  isSlugTouched: boolean;
  onSlugTouched: () => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  categoryId: string;
  onCategoryChange: (categoryId: string) => void;
  authorId: string;
  onAuthorChange: (authorId: string) => void;
  readTime: string;
  onReadTimeChange: (readTime: string) => void;
  symbol: string;
  onSymbolChange: (symbol: string) => void;
  featured: boolean;
  onFeaturedChange: (featured: boolean) => void;
  featuredImageUrl: string;
  onFeaturedImageUrlChange: (url: string) => void;
  featuredImageAlt: string;
  onFeaturedImageAltChange: (alt: string) => void;
  categories: SupabaseCategory[];
  authors: DatabaseAuthor[];
  articleId?: string;
  onSaveDraftFirst?: () => Promise<string | null>;
  siteUrl?: string;
}

export function ArticleDetailsCard({
  title,
  onTitleChange,
  slug,
  onSlugChange,
  isSlugTouched,
  onSlugTouched,
  description,
  onDescriptionChange,
  categoryId,
  onCategoryChange,
  authorId,
  onAuthorChange,
  readTime,
  onReadTimeChange,
  symbol,
  onSymbolChange,
  featured,
  onFeaturedChange,
  featuredImageUrl,
  onFeaturedImageUrlChange,
  featuredImageAlt,
  onFeaturedImageAltChange,
  categories,
  authors,
  articleId,
  onSaveDraftFirst,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "",
}: ArticleDetailsCardProps) {
  const cleanSlug = slug.trim().toLowerCase();
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const isInvalidFormat = Boolean(cleanSlug && !slugRegex.test(cleanSlug));

  // Async remote validation check result
  const [remoteCheck, setRemoteCheck] = useState<{
    slug: string;
    status: "available" | "taken";
    error?: string;
  } | null>(null);
  const [isCheckingRemote, setIsCheckingRemote] = useState(false);

  const cleanBaseUrl = siteUrl ? siteUrl.replace(/\/$/, "") : "";
  const previewUrl = `${cleanBaseUrl}/bhakti-gyaan/${slug || "your-slug"}`;

  useEffect(() => {
    if (!cleanSlug || isInvalidFormat) {
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsCheckingRemote(true);
      try {
        const res = await checkSlugAvailabilityAction(cleanSlug, articleId);
        if (!isMounted) return;
        if (res.available) {
          setRemoteCheck({ slug: cleanSlug, status: "available" });
        } else {
          setRemoteCheck({
            slug: cleanSlug,
            status: "taken",
            error: res.error || "This slug is already in use. Please choose another.",
          });
        }
      } catch {
        if (isMounted) setRemoteCheck(null);
      } finally {
        if (isMounted) setIsCheckingRemote(false);
      }
    }, 450);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [cleanSlug, isInvalidFormat, articleId]);

  // Derive status
  const slugStatus: "idle" | "checking" | "available" | "taken" | "invalid" =
    !cleanSlug
      ? "idle"
      : isInvalidFormat
      ? "invalid"
      : isCheckingRemote || (remoteCheck && remoteCheck.slug !== cleanSlug)
      ? "checking"
      : remoteCheck?.slug === cleanSlug
      ? remoteCheck.status
      : "checking";

  const slugErrorMessage =
    isInvalidFormat
      ? "Must contain lowercase letters, numbers, and hyphens only."
      : remoteCheck?.status === "taken"
      ? remoteCheck.error || "This slug is already in use."
      : null;

  const handleManualSlugInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSlugTouched();
    const val = e.target.value.toLowerCase().replace(/\s+/g, "-");
    onSlugChange(val);
  };

  return (
    <div className="bg-[#FDFBF7] rounded-3xl p-5 sm:p-8 border border-[#6B1724]/12 shadow-sm space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-[#6B1724]/10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#6B1724]" aria-hidden="true" />
        <h2 className="font-heading text-lg sm:text-xl font-bold text-[#6B1724]">
          A. Article Details
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="article-title" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
            Article Title (Hindi) <span className="text-red-600">*</span>
          </label>
          <input
            id="article-title"
            type="text"
            required
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. कर्म योग क्या है? श्रीमद्भगवद्गीता की दृष्टि से सरल समझ"
            className="w-full px-4 py-3 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-base font-heading font-medium focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all placeholder:text-[#5A6065]/40"
          />
        </div>

        {/* Slug & URL Preview */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="article-slug" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724]">
              URL Slug <span className="text-red-600">*</span>
            </label>
            {isSlugTouched && (
              <span className="text-[11px] text-[#5A6065]">Manual edit mode</span>
            )}
          </div>
          <div className="relative">
            <input
              id="article-slug"
              type="text"
              required
              value={slug}
              onChange={handleManualSlugInput}
              placeholder="e.g. karma-yoga-kya-hai"
              className="w-full px-4 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white font-mono text-sm text-[#1F2326] focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all placeholder:text-[#5A6065]/40"
            />
          </div>

          {/* URL Preview & Validation Feedback */}
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#5A6065] truncate font-mono">
              <span className="text-[#D97706]">🔗</span>
              <span className="truncate">{previewUrl}</span>
            </div>

            {/* Validation Feedback */}
            <div className="shrink-0 flex items-center gap-1.5">
              {slugStatus === "checking" && (
                <span className="text-xs text-[#5A6065] flex items-center gap-1">
                  <span className="animate-spin text-xs">⟳</span> Checking availability...
                </span>
              )}
              {slugStatus === "available" && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ✓ Slug available
                </span>
              )}
              {slugStatus === "taken" && (
                <span className="text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                  ⚠ {slugErrorMessage || "This slug is already in use."}
                </span>
              )}
              {slugStatus === "invalid" && (
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  ⚠ {slugErrorMessage}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="article-desc" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724]">
              Article Description (Hindi) <span className="text-red-600">*</span>
            </label>
            <span className="text-xs text-[#5A6065]">
              {description.length} characters
            </span>
          </div>
          <textarea
            id="article-desc"
            required
            rows={3}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="संक्षिप्त विवरण जो लेख की मुख्य बातें सरल शब्दों में प्रस्तुत करे..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm leading-relaxed focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all placeholder:text-[#5A6065]/40"
          />
          <p className="text-[11px] text-[#5A6065] mt-1">
            Keep the description concise and useful (typically 120–160 characters for search and social previews).
          </p>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="article-category" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
            Category <span className="text-red-600">*</span>
          </label>
          <select
            id="article-category"
            required
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.slug}){c.isActive === false ? " — [Inactive]" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Author */}
        <div>
          <label htmlFor="article-author" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
            Editorial Author
          </label>
          <select
            id="article-author"
            value={authorId}
            onChange={(e) => onAuthorChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all"
          >
            <option value="">None (Site Default: BhaktiMania)</option>
            {authors
              .filter((a) => a.is_active || a.id === authorId)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}{!a.is_active ? " [Inactive]" : ""}
                </option>
              ))}
          </select>
        </div>

        {/* Read Time */}
        <div>
          <label htmlFor="article-read-time" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
            Reading Time
          </label>
          <input
            id="article-read-time"
            type="text"
            value={readTime}
            onChange={(e) => onReadTimeChange(e.target.value)}
            placeholder="e.g. 5 मिनट"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all"
          />
        </div>

        {/* Devotional Symbol */}
        <div>
          <label htmlFor="article-symbol" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
            Devotional Symbol (Icon Motif)
          </label>
          <select
            id="article-symbol"
            value={symbol}
            onChange={(e) => onSymbolChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all"
          >
            {DEVOTIONAL_SYMBOLS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Toggle */}
        <div className="md:col-span-2 pt-2 border-t border-[#6B1724]/8">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => onFeaturedChange(e.target.checked)}
              className="w-4 h-4 rounded text-[#6B1724] focus:ring-[#6B1724] border-[#6B1724]/30"
            />
            <div>
              <span className="text-sm font-semibold text-[#1F2326]">
                Featured Devotional Article
              </span>
              <p className="text-xs text-[#5A6065]">
                Highlight this article prominently across homepage features and recommendations.
              </p>
            </div>
          </label>
        </div>

        {/* Media / Featured Image */}
        <div className="md:col-span-2 pt-2 border-t border-[#6B1724]/8">
          {(() => {
            const selectedCategory = categories.find((c) => c.id === categoryId);
            return (
              <FeaturedImageField
                articleId={articleId}
                title={title}
                categoryName={selectedCategory?.title || ""}
                categorySlug={selectedCategory?.slug || ""}
                description={description}
                featuredImageUrl={featuredImageUrl}
                featuredImageAlt={featuredImageAlt}
                onFeaturedImageUrlChange={onFeaturedImageUrlChange}
                onFeaturedImageAltChange={onFeaturedImageAltChange}
                onSaveDraftFirst={onSaveDraftFirst}
              />
            );
          })()}
        </div>
      </div>
    </div>
  );
}
