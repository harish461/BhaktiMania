"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ArticleSection } from "@/lib/data/articles";
import type { SupabaseCategory, DatabaseAuthor } from "@/lib/data/supabase";
import type { AdminArticleDetail } from "@/lib/data/supabase/admin";
import {
  saveArticleAction,
  unpublishArticleAction,
  deleteArticleAction,
} from "@/app/admin/actions/articles";

import { ArticleDetailsCard } from "./editor/ArticleDetailsCard";
import { ArticleContentCard } from "./editor/ArticleContentCard";
import { ArticleSeoCard } from "./editor/ArticleSeoCard";
import { ArticleAffiliateCard } from "./editor/ArticleAffiliateCard";
import { ArticlePublishingCard } from "./editor/ArticlePublishingCard";
import { StickyActionBar, SaveState } from "./editor/StickyActionBar";
import { ArticlePreviewModal } from "./editor/ArticlePreviewModal";
import { UnsavedChangesModal } from "./editor/UnsavedChangesModal";
import { DeleteConfirmModal } from "./editor/DeleteConfirmModal";
import type { AffiliateProductItem } from "@/lib/data/supabase/types";

function generateSlugFromTitle(title: string): string {
  if (!title) return "";
  const latinClean = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (latinClean) return latinClean;
  return `article-${Date.now().toString(36)}`;
}

interface ArticleEditorProps {
  mode: "create" | "edit";
  initialArticle?: AdminArticleDetail | null;
  categories: SupabaseCategory[];
  authors: DatabaseAuthor[];
  allActiveProducts?: AffiliateProductItem[];
  siteUrl?: string;
}

export default function ArticleEditor({
  mode,
  initialArticle,
  categories,
  authors,
  allActiveProducts = [],
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "",
}: ArticleEditorProps) {
  const router = useRouter();


  // 1. Primary Form State
  const [title, setTitle] = useState(initialArticle?.title || "");
  const [slug, setSlug] = useState(initialArticle?.slug || "");
  const [isSlugTouched, setIsSlugTouched] = useState(mode === "edit");
  const [description, setDescription] = useState(initialArticle?.description || "");
  const [categoryId, setCategoryId] = useState(
    initialArticle?.category_id || (categories[0]?.id ?? "")
  );
  const [authorId, setAuthorId] = useState(
    initialArticle?.author_id || (authors[0]?.id ?? "")
  );
  const [readTime, setReadTime] = useState(initialArticle?.read_time || "5 मिनट");
  const [symbol, setSymbol] = useState(initialArticle?.symbol || "दीप");
  const [featured, setFeatured] = useState(Boolean(initialArticle?.featured));
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    initialArticle?.featured_image_url || ""
  );
  const [featuredImageAlt, setFeaturedImageAlt] = useState(
    initialArticle?.featured_image_alt || ""
  );

  // 2. SEO State
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(
    initialArticle?.seo_description || ""
  );

  // 3. Content Sections State
  const [sections, setSections] = useState<ArticleSection[]>(() => {
    if (initialArticle?.sections && initialArticle.sections.length > 0) {
      return initialArticle.sections;
    }
    return [
      {
        heading: "",
        highlight: "",
        paragraphs: [""],
        bullets: [],
      },
    ];
  });

  // 4. Save Status & Lifecycle State
  const [submittingOperation, setSubmittingOperation] = useState<
    "saving" | "publishing" | "unpublishing" | "deleting" | null
  >(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(
    initialArticle?.updated_at ? new Date(initialArticle.updated_at) : null
  );
  const [currentStatus, setCurrentStatus] = useState<"draft" | "published" | "archived">(
    initialArticle?.status || "draft"
  );
  const [currentArticleId, setCurrentArticleId] = useState<string | undefined>(
    initialArticle?.id
  );

  // 5. Modals State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);

  // 6. UI Feedback Banners
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Compute baseline snapshot for dirty tracking
  const initialSnapshot = useMemo(() => {
    return JSON.stringify({
      title: initialArticle?.title || "",
      slug: initialArticle?.slug || "",
      description: initialArticle?.description || "",
      categoryId: initialArticle?.category_id || (categories[0]?.id ?? ""),
      authorId: initialArticle?.author_id || (authors[0]?.id ?? ""),
      readTime: initialArticle?.read_time || "5 मिनट",
      symbol: initialArticle?.symbol || "दीप",
      featured: Boolean(initialArticle?.featured),
      featuredImageUrl: initialArticle?.featured_image_url || "",
      featuredImageAlt: initialArticle?.featured_image_alt || "",
      seoTitle: initialArticle?.seo_title || "",
      seoDescription: initialArticle?.seo_description || "",
      sections: initialArticle?.sections && initialArticle.sections.length > 0
        ? initialArticle.sections
        : [{ heading: "", highlight: "", paragraphs: [""], bullets: [] }],
    });
  }, [initialArticle, categories, authors]);

  const currentSnapshot = useMemo(() => {
    return JSON.stringify({
      title,
      slug,
      description,
      categoryId,
      authorId,
      readTime,
      symbol,
      featured,
      featuredImageUrl,
      featuredImageAlt,
      seoTitle,
      seoDescription,
      sections,
    });
  }, [
    title,
    slug,
    description,
    categoryId,
    authorId,
    readTime,
    symbol,
    featured,
    featuredImageUrl,
    featuredImageAlt,
    seoTitle,
    seoDescription,
    sections,
  ]);

  const isDirty = initialSnapshot !== currentSnapshot;

  const saveState: SaveState = submittingOperation
    ? submittingOperation
    : isDirty
    ? "unsaved"
    : "saved";

  // Browser beforeunload listener when unsaved
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Handle Title Change with auto-slug generation
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isSlugTouched && mode === "create") {
      const generated = generateSlugFromTitle(newTitle);
      if (generated) setSlug(generated);
    }
  };

  // Intercept Navigation if dirty
  const handleSafeNavigation = (url: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isDirty) {
      setPendingNavigationUrl(url);
      setIsUnsavedModalOpen(true);
    } else {
      router.push(url);
    }
  };

  const handleLeaveWithoutSaving = () => {
    setIsUnsavedModalOpen(false);
    if (pendingNavigationUrl) {
      router.push(pendingNavigationUrl);
    }
  };

  const handleStay = () => {
    setIsUnsavedModalOpen(false);
    setPendingNavigationUrl(null);
  };

  // Clean sections for payload
  const prepareSectionsPayload = useCallback((): ArticleSection[] => {
    return sections
      .map((sec) => {
        const cleanedParas = (sec.paragraphs || []).map((p) => p.trim()).filter(Boolean);
        const cleanedBullets = (sec.bullets || []).map((b) => b.trim()).filter(Boolean);
        const heading = sec.heading?.trim() || undefined;
        const highlight = sec.highlight?.trim() || undefined;

        return {
          ...(heading ? { heading } : {}),
          ...(highlight ? { highlight } : {}),
          ...(cleanedParas.length > 0 ? { paragraphs: cleanedParas } : {}),
          ...(cleanedBullets.length > 0 ? { bullets: cleanedBullets } : {}),
        };
      })
      .filter(
        (sec) =>
          sec.heading ||
          sec.highlight ||
          (sec.paragraphs && sec.paragraphs.length > 0) ||
          (sec.bullets && sec.bullets.length > 0)
      );
  }, [sections]);

  // Helper: Save draft first to acquire authoritative database UUID for image upload
  const handleSaveDraftFirst = async (): Promise<string | null> => {
    setErrorMessage(null);
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setErrorMessage("Please enter an article title before saving draft.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return null;
    }

    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) {
      setErrorMessage("Please enter a valid URL slug before saving draft.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return null;
    }

    const cleanDesc = description.trim();
    if (!cleanDesc) {
      setErrorMessage("Please enter an article description before saving draft.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return null;
    }

    if (!categoryId) {
      setErrorMessage("Please select a devotional category before saving draft.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return null;
    }

    const cleanSections = prepareSectionsPayload();
    if (cleanSections.length === 0) {
      setErrorMessage("Please add at least one content paragraph or section before saving draft.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return null;
    }

    setSubmittingOperation("saving");
    try {
      const res = await saveArticleAction({
        id: currentArticleId || initialArticle?.id,
        title: cleanTitle,
        slug: cleanSlug,
        description: cleanDesc,
        category_id: categoryId,
        author_id: authorId || null,
        status: "draft",
        symbol: symbol || "दीप",
        read_time: readTime.trim() || "5 मिनट",
        featured,
        featured_image_url: featuredImageUrl.trim() || null,
        featured_image_alt: featuredImageAlt.trim() || null,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
        sections: cleanSections,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Unable to save article draft.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return null;
      }

      if (res.articleId) {
        setCurrentArticleId(res.articleId);
        setLastSavedAt(new Date());
        setCurrentStatus("draft");
        return res.articleId;
      }
      return null;
    } catch (err: unknown) {
      console.error("[ArticleEditor] Error auto-saving draft:", err);
      setErrorMessage("Network error while saving draft.");
      return null;
    } finally {
      setSubmittingOperation(null);
    }
  };

  // Core Save / Publish Handler
  const handleSave = async (targetStatus: "draft" | "published") => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setErrorMessage("Please enter an article title.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) {
      setErrorMessage("Please enter a valid URL slug.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(cleanSlug)) {
      setErrorMessage(
        "Slug must consist of lowercase letters, numbers, and single hyphens (e.g. 'sacchi-bhakti-kya-hai')."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const cleanDesc = description.trim();
    if (!cleanDesc) {
      setErrorMessage("Please enter an article description.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!categoryId) {
      setErrorMessage("Please select a devotional category.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const cleanSections = prepareSectionsPayload();
    if (cleanSections.length === 0) {
      setErrorMessage("Please add at least one content paragraph or section.");
      return;
    }

    if (targetStatus === "published") {
      setSubmittingOperation("publishing");
    } else {
      setSubmittingOperation("saving");
    }

    try {
      const res = await saveArticleAction({
        id: currentArticleId || initialArticle?.id,
        title: cleanTitle,
        slug: cleanSlug,
        description: cleanDesc,
        category_id: categoryId,
        author_id: authorId || null,
        status: targetStatus,
        symbol: symbol || "दीप",
        read_time: readTime.trim() || "5 मिनट",
        featured,
        featured_image_url: featuredImageUrl.trim() || null,
        featured_image_alt: featuredImageAlt.trim() || null,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
        sections: cleanSections,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Unable to save the article. Please try again.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const now = new Date();
        setLastSavedAt(now);
        setCurrentStatus(targetStatus);
        if (res.articleId) {
          setCurrentArticleId(res.articleId);
        }
        setSuccessMessage(
          targetStatus === "published"
            ? "Article published successfully."
            : "Draft saved successfully."
        );

        if (mode === "create" && res.articleId) {
          setTimeout(() => {
            router.push(`/admin/articles/${res.articleId}/edit`);
          }, 600);
        } else {
          router.refresh();
        }
      }
    } catch (err: unknown) {
      console.error("[ArticleEditor] Error saving article:", err);
      setErrorMessage("Unable to save the article. Please check your connection and try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmittingOperation(null);
    }
  };

  // Unpublish Handler
  const handleUnpublish = async () => {
    if (!initialArticle?.id) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmittingOperation("unpublishing");

    try {
      const res = await unpublishArticleAction(initialArticle.id);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to unpublish article.");
      } else {
        const now = new Date();
        setLastSavedAt(now);
        setCurrentStatus("draft");
        setSuccessMessage("Article moved back to draft.");
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("[ArticleEditor] Error unpublishing article:", err);
      setErrorMessage("An error occurred while unpublishing the article.");
    } finally {
      setSubmittingOperation(null);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!initialArticle?.id) return;
    setSubmittingOperation("deleting");

    try {
      const res = await deleteArticleAction(initialArticle.id);
      if (!res.success) {
        setIsDeleteModalOpen(false);
        setErrorMessage(res.error || "Failed to delete article.");
      } else {
        setIsDeleteModalOpen(false);
        setSuccessMessage("Draft deleted successfully.");
        setTimeout(() => {
          router.push("/admin/articles");
        }, 500);
      }
    } catch (err: unknown) {
      console.error("[ArticleEditor] Error deleting article:", err);
      setIsDeleteModalOpen(false);
      setErrorMessage("An error occurred while deleting the article.");
    } finally {
      setSubmittingOperation(null);
    }
  };

  const isSubmitting =
    saveState === "saving" ||
    saveState === "publishing" ||
    saveState === "unpublishing" ||
    saveState === "deleting";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      {/* Top Navigation & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#6B1724]/10">
        <div>
          <button
            type="button"
            onClick={(e) => handleSafeNavigation("/admin/articles", e)}
            className="text-xs font-semibold text-[#6B1724] hover:text-[#52111C] transition-colors inline-flex items-center gap-1.5 mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-sm"
          >
            <span aria-hidden="true">←</span>
            <span>Back to Articles</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#6B1724]">
            {mode === "create" ? "Create Article" : "Edit Article"}
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6065] mt-0.5">
            {mode === "create"
              ? "Compose devotional content with structured sections, SEO metadata, and live preview"
              : `Editing "${initialArticle?.title || "Devotional Article"}"`}
          </p>
        </div>

        {/* Header Right Status Indicator */}
        <div className="flex items-center gap-3">
          {mode === "edit" && (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                currentStatus === "published"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : currentStatus === "archived"
                  ? "bg-gray-50 text-gray-700 border-gray-300"
                  : "bg-amber-50 text-amber-800 border-amber-300"
              }`}
            >
              ● {currentStatus === "published" ? "Published" : currentStatus === "archived" ? "Archived" : "Draft"}
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-[#6B1724] bg-white hover:bg-[#F8F4EC] border border-[#6B1724]/20 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
          >
            <span className="text-[#D97706]" aria-hidden="true">👁</span>
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Notifications: Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-150"
        >
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              !
            </span>
            <p className="font-medium">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            aria-label="Dismiss error"
            className="text-red-600 hover:text-red-900 p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Notifications: Success Banner */}
      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-150"
        >
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              ✓
            </span>
            <p className="font-medium">{successMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            aria-label="Dismiss success message"
            className="text-emerald-600 hover:text-emerald-900 p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Section A: Article Details */}
      <ArticleDetailsCard
        title={title}
        onTitleChange={handleTitleChange}
        slug={slug}
        onSlugChange={setSlug}
        isSlugTouched={isSlugTouched}
        onSlugTouched={() => setIsSlugTouched(true)}
        description={description}
        onDescriptionChange={setDescription}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        authorId={authorId}
        onAuthorChange={setAuthorId}
        readTime={readTime}
        onReadTimeChange={setReadTime}
        symbol={symbol}
        onSymbolChange={setSymbol}
        featured={featured}
        onFeaturedChange={setFeatured}
        featuredImageUrl={featuredImageUrl}
        onFeaturedImageUrlChange={setFeaturedImageUrl}
        featuredImageAlt={featuredImageAlt}
        onFeaturedImageAltChange={setFeaturedImageAlt}
        categories={categories}
        authors={authors}
        articleId={currentArticleId || initialArticle?.id}
        onSaveDraftFirst={handleSaveDraftFirst}
        siteUrl={siteUrl}
      />

      {/* Section B: Content Sections */}
      <ArticleContentCard
        sections={sections}
        onChange={setSections}
      />

      {/* Section C: SEO */}
      <ArticleSeoCard
        seoTitle={seoTitle}
        onSeoTitleChange={setSeoTitle}
        seoDescription={seoDescription}
        onSeoDescriptionChange={setSeoDescription}
        title={title}
        description={description}
        slug={slug}
        siteUrl={siteUrl}
      />

      {/* Section D: Affiliate Recommendations */}
      <ArticleAffiliateCard
        articleId={currentArticleId || initialArticle?.id}
        onSaveDraftFirst={handleSaveDraftFirst}
        allActiveProducts={allActiveProducts}
      />

      {/* Section E: Publishing & Lifecycle */}
      <ArticlePublishingCard
        initialArticle={initialArticle}
        mode={mode}
      />


      {/* Sticky Bottom Action Bar */}
      <StickyActionBar
        mode={mode}
        currentStatus={currentStatus}
        saveState={saveState}
        lastSavedAt={lastSavedAt}
        onSaveDraft={() => handleSave("draft")}
        onPublish={() => handleSave("published")}
        onUnpublish={handleUnpublish}
        onDeleteClick={() => setIsDeleteModalOpen(true)}
        onPreviewClick={() => setIsPreviewOpen(true)}
        isSubmitting={isSubmitting}
      />

      {/* Live Preview Modal */}
      <ArticlePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        description={description}
        sections={sections}
        categoryId={categoryId}
        authorId={authorId}
        readTime={readTime}
        symbol={symbol}
        featuredImageUrl={featuredImageUrl}
        featuredImageAlt={featuredImageAlt}
        categories={categories}
        authors={authors}
      />

      {/* Unsaved Changes Confirmation Modal */}
      <UnsavedChangesModal
        isOpen={isUnsavedModalOpen}
        onStay={handleStay}
        onLeave={handleLeaveWithoutSaving}
      />

      {/* Delete Draft Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        isDeleting={saveState === "deleting"}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        articleTitle={title}
      />
    </div>
  );
}
