"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminCategoryListItem } from "@/lib/data/supabase/admin";
import {
  createCategoryAction,
  updateCategoryAction,
  checkCategorySlugAvailabilityAction,
  type CategoryInputPayload,
} from "@/app/admin/actions/categories";
import { UnsavedChangesModal } from "@/components/admin/editor/UnsavedChangesModal";

interface CategoryFormProps {
  initialData?: AdminCategoryListItem | null;
  siteUrl?: string;
  defaultSortOrder?: number;
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function CategoryForm({
  initialData,
  siteUrl = "",
  defaultSortOrder = 1,
}: CategoryFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(initialData?.id);

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEditMode);
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [symbol, setSymbol] = useState(initialData?.symbol || "ॐ");
  const [intro, setIntro] = useState(initialData?.intro || "");
  const [sortOrder, setSortOrder] = useState<number>(
    initialData?.sort_order ?? defaultSortOrder
  );
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  // Remote slug check state
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [remoteCheck, setRemoteCheck] = useState<{
    slug: string;
    status: "available" | "taken";
    error?: string;
  } | null>(null);

  // Derived slug status
  const cleanSlug = slug.trim().toLowerCase();
  const isInvalidFormat = Boolean(cleanSlug && !SLUG_REGEX.test(cleanSlug));

  const slugStatus: "idle" | "checking" | "available" | "taken" | "invalid" =
    !cleanSlug
      ? "idle"
      : isInvalidFormat
      ? "invalid"
      : isEditMode && cleanSlug === initialData?.slug
      ? "available"
      : isCheckingSlug || (remoteCheck && remoteCheck.slug !== cleanSlug)
      ? "checking"
      : remoteCheck?.slug === cleanSlug
      ? remoteCheck.status
      : "checking";

  const slugError =
    isInvalidFormat
      ? "Must contain only lowercase letters, numbers, and hyphens."
      : remoteCheck?.status === "taken"
      ? remoteCheck.error || `Slug "${cleanSlug}" is already taken.`
      : null;

  // Submission & message
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Unsaved changes state
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);

  // Initial snapshot for dirty tracking
  const initialSnapshot = useMemo(() => {
    return JSON.stringify({
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      metaTitle: initialData?.meta_title || "",
      description: initialData?.description || "",
      symbol: initialData?.symbol || "ॐ",
      intro: initialData?.intro || "",
      sortOrder: initialData?.sort_order ?? defaultSortOrder,
      isActive: initialData?.is_active ?? true,
    });
  }, [initialData, defaultSortOrder]);

  const currentSnapshot = useMemo(() => {
    return JSON.stringify({
      title,
      slug,
      metaTitle,
      description,
      symbol,
      intro,
      sortOrder,
      isActive,
    });
  }, [title, slug, metaTitle, description, symbol, intro, sortOrder, isActive]);

  const isDirty = initialSnapshot !== currentSnapshot;

  // Auto-slug generator from title (if not manually edited)
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isSlugManuallyEdited) {
      const generated = newTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  // Debounced remote slug uniqueness check
  useEffect(() => {
    if (!cleanSlug || isInvalidFormat || (isEditMode && cleanSlug === initialData?.slug)) {
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsCheckingSlug(true);
      try {
        const res = await checkCategorySlugAvailabilityAction(cleanSlug, initialData?.id);
        if (!isMounted) return;
        if (res.available) {
          setRemoteCheck({ slug: cleanSlug, status: "available" });
        } else {
          setRemoteCheck({
            slug: cleanSlug,
            status: "taken",
            error: res.error || `Slug "${cleanSlug}" is already taken.`,
          });
        }
      } catch {
        if (isMounted) setRemoteCheck(null);
      } finally {
        if (isMounted) setIsCheckingSlug(false);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [cleanSlug, isInvalidFormat, isEditMode, initialData?.id, initialData?.slug]);

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) {
      setMessage({ type: "error", text: "Category slug is required." });
      return;
    }

    if (slugStatus === "taken" || slugStatus === "invalid") {
      setMessage({ type: "error", text: slugError || "Please choose a valid and unique slug." });
      return;
    }

    setIsSaving(true);

    const payload: CategoryInputPayload = {
      title: title.trim(),
      slug: cleanSlug,
      meta_title: metaTitle.trim(),
      description: description.trim(),
      symbol: symbol.trim() || "ॐ",
      intro: intro.trim() || null,
      sort_order: sortOrder,
      is_active: isActive,
    };

    try {
      if (isEditMode && initialData?.id) {
        const res = await updateCategoryAction(initialData.id, payload);
        if (!res.success) {
          setMessage({ type: "error", text: res.error || "Failed to update category." });
        } else {
          setMessage({ type: "success", text: "Category updated successfully." });
          router.refresh();
        }
      } else {
        const res = await createCategoryAction(payload);
        if (!res.success) {
          setMessage({ type: "error", text: res.error || "Failed to create category." });
        } else {
          setMessage({ type: "success", text: "Category created successfully." });
          router.push("/admin/categories");
        }
      }
    } catch (err) {
      console.error("[CategoryForm] Save error:", err);
      setMessage({ type: "error", text: "An error occurred while saving the category." });
    } finally {
      setIsSaving(false);
    }
  };

  // Safe navigation intercept for dirty form
  const handleCancel = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDirty) {
      e.preventDefault();
      setPendingNavigationUrl("/admin/categories");
      setShowUnsavedModal(true);
    }
  };

  // SEO Preview values
  const cleanBase = siteUrl ? siteUrl.replace(/\/$/, "") : "";
  const previewUrl = cleanBase ? `${cleanBase}/${slug || "category-slug"}` : `/${slug || "category-slug"}`;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#6B1724]/10">
        <div>
          <Link
            href="/admin/categories"
            onClick={handleCancel}
            className="text-xs font-semibold text-[#6B1724] hover:underline inline-flex items-center gap-1 mb-1 cursor-pointer"
          >
            ← Back to Categories
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#6B1724]">
            {isEditMode ? `Edit Category: ${initialData?.title}` : "Create Category"}
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6065] mt-0.5">
            Configure devotional category details, SEO metadata, and display sequence.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            onClick={handleCancel}
            className="px-4 py-2.5 min-h-[44px] inline-flex items-center justify-center rounded-xl border border-[#6B1724]/20 text-[#6B1724] text-xs sm:text-sm font-semibold hover:bg-[#FDFBF7] transition-colors cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2.5 min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#6B1724] hover:bg-[#52111C] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEditMode ? "Save Changes" : "Create Category"}</span>
            )}
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{message.type === "success" ? "✓" : "⚠"}</span>
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg cursor-pointer"
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Core Details */}
        <div className="bg-[#FDFBF7] rounded-3xl p-5 sm:p-8 border border-[#6B1724]/12 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#6B1724]/10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6B1724]" aria-hidden="true" />
            <h2 className="font-heading text-lg font-bold text-[#6B1724]">
              1. Category Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div>
              <label htmlFor="category-title" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
                Title (Hindi/Devotional) <span className="text-red-600">*</span>
              </label>
              <input
                id="category-title"
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. हनुमान जी"
                className="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm font-medium focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="category-slug" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724]">
                  URL Slug <span className="text-red-600">*</span>
                </label>
                {isCheckingSlug ? (
                  <span className="text-[11px] text-gray-500">Checking...</span>
                ) : slugStatus === "available" ? (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Available
                  </span>
                ) : slugStatus === "taken" ? (
                  <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    ⚠ Taken
                  </span>
                ) : null}
              </div>
              <input
                id="category-slug"
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setIsSlugManuallyEdited(true);
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                }}
                placeholder="e.g. hanuman"
                className={`w-full px-4 py-2.5 min-h-[44px] rounded-xl border font-mono text-sm bg-white text-[#1F2326] outline-none transition-all ${
                  slugStatus === "taken" || slugStatus === "invalid"
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-[#6B1724]/20 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20"
                }`}
              />
              {slugError && (
                <p className="text-xs text-red-600 mt-1 font-medium">{slugError}</p>
              )}
            </div>

            {/* Symbol */}
            <div>
              <label htmlFor="category-symbol" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
                Sacred Motif / Symbol
              </label>
              <input
                id="category-symbol"
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g. श्री राम, ॐ नमः शिवाय"
                className="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label htmlFor="category-order" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
                Sort Order (Display Sequence)
              </label>
              <input
                id="category-order"
                type="number"
                min={0}
                max={999}
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all"
              />
            </div>

            {/* Status Toggle */}
            <div className="md:col-span-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 rounded border-[#6B1724]/30 text-[#6B1724] focus:ring-[#6B1724] cursor-pointer"
                />
                <div>
                  <span className="text-sm font-semibold text-[#1F2326]">
                    Active Category
                  </span>
                  <p className="text-xs text-[#5A6065]">
                    Active categories appear in public navigation and can be assigned to articles.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Card 2: SEO & Meta */}
        <div className="bg-[#FDFBF7] rounded-3xl p-5 sm:p-8 border border-[#6B1724]/12 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#6B1724]/10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6B1724]" aria-hidden="true" />
            <h2 className="font-heading text-lg font-bold text-[#6B1724]">
              2. SEO & Descriptions
            </h2>
          </div>

          <div className="space-y-5">
            {/* Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="meta-title" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724]">
                  Meta Title (SEO) <span className="text-red-600">*</span>
                </label>
                <span className={`text-xs font-mono ${metaTitle.length > 60 ? "text-amber-600 font-bold" : "text-[#5A6065]"}`}>
                  {metaTitle.length}/60 characters (recommended: 50–60)
                </span>
              </div>
              <input
                id="meta-title"
                type="text"
                required
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="e.g. हनुमान जी | भक्ति, प्रेरणा और ज्ञान"
                className="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="category-desc" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724]">
                  Category Description (SEO Summary) <span className="text-red-600">*</span>
                </label>
                <span className={`text-xs font-mono ${description.length > 160 ? "text-amber-600 font-bold" : "text-[#5A6065]"}`}>
                  {description.length}/160 characters (recommended: 120–160)
                </span>
              </div>
              <textarea
                id="category-desc"
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="संक्षिप्त विवरण जो सर्च इंजन और सोशल मीडिया पर दिखाई देगा..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all"
              />
            </div>

            {/* Intro (Editorial) */}
            <div>
              <label htmlFor="category-intro" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
                Editorial Introduction (Optional)
              </label>
              <textarea
                id="category-intro"
                rows={3}
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="विस्तृत परिचयात्मक लेख जो श्रेणी पृष्ठ के शीर्ष पर प्रदर्शित किया जा सकता है..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Google Search Preview */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#6B1724]/12 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Google Search Preview
            </span>
          </div>

          <div className="space-y-1.5 p-3 rounded-2xl bg-gray-50/70 border border-gray-100 font-sans">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-4 h-4 rounded-full bg-[#6B1724] text-white text-[9px] flex items-center justify-center font-bold">
                B
              </span>
              <span className="font-semibold text-gray-800">BhaktiMania</span>
              <span>›</span>
              <span className="text-gray-500 font-mono text-[11px] truncate max-w-xs">{previewUrl}</span>
            </div>
            <div className="text-blue-800 hover:underline font-medium text-base sm:text-lg leading-snug cursor-pointer">
              {metaTitle || title || "Category Title"} | BhaktiMania
            </div>
            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
              {description || "संक्षिप्त विवरण जो सर्च इंजन परिणामों में दिखाई देगा..."}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/categories"
            onClick={handleCancel}
            className="px-5 py-2.5 min-h-[44px] inline-flex items-center justify-center rounded-xl border border-[#6B1724]/20 text-[#6B1724] text-xs sm:text-sm font-semibold hover:bg-[#FDFBF7] transition-colors cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#6B1724] hover:bg-[#52111C] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEditMode ? "Save Changes" : "Create Category"}</span>
            )}
          </button>
        </div>
      </form>

      {/* Unsaved Changes Confirmation Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onStay={() => setShowUnsavedModal(false)}
        onLeave={() => {
          setShowUnsavedModal(false);
          if (pendingNavigationUrl) {
            router.push(pendingNavigationUrl);
          }
        }}
      />
    </div>
  );
}
