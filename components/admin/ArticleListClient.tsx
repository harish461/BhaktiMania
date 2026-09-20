"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { AdminArticleListItem } from "@/lib/data/supabase/admin";
import type { SupabaseCategory } from "@/lib/data/supabase";
import {
  deleteArticleAction,
  unpublishArticleAction,
  publishArticleAction,
} from "@/app/admin/actions/articles";
import { DeleteConfirmModal } from "@/components/admin/editor/DeleteConfirmModal";
import { ArticleListHeader } from "./articles/ArticleListHeader";
import { ArticleStats } from "./articles/ArticleStats";
import { ArticleFilters, type SortOption } from "./articles/ArticleFilters";
import { ArticleTable } from "./articles/ArticleTable";
import { ArticleMobileCard } from "./articles/ArticleMobileCard";
import { ArticleEmptyState } from "./articles/ArticleEmptyState";

interface ArticleListClientProps {
  initialArticles: AdminArticleListItem[];
  categories: SupabaseCategory[];
  siteUrl?: string;
}

export default function ArticleListClient({
  initialArticles,
  categories,
  siteUrl = "",
}: ArticleListClientProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<AdminArticleListItem[]>(initialArticles);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("updated_desc");

  // Lifecycle action states
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<AdminArticleListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Active filter count calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count += 1;
    if (statusFilter !== "all") count += 1;
    if (categoryFilter !== "all") count += 1;
    if (featuredFilter !== "all") count += 1;
    return count;
  }, [search, statusFilter, categoryFilter, featuredFilter]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setFeaturedFilter("all");
  };

  // Filter and Sort in memory for immediate feedback
  const filteredAndSortedArticles = useMemo(() => {
    // 1. Filtering
    const filtered = articles.filter((art) => {
      // Status filter
      if (statusFilter !== "all" && art.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== "all" && art.category_id !== categoryFilter) {
        return false;
      }
      // Featured filter
      if (featuredFilter === "featured" && !art.featured) {
        return false;
      }
      if (featuredFilter === "not-featured" && art.featured) {
        return false;
      }
      // Search term (title & slug)
      if (search.trim()) {
        const term = search.trim().toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(term);
        const matchesSlug = art.slug.toLowerCase().includes(term);
        if (!matchesTitle && !matchesSlug) return false;
      }
      return true;
    });

    // 2. Sorting
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "updated_desc": {
          const dateA = new Date(a.updated_at).getTime();
          const dateB = new Date(b.updated_at).getTime();
          return dateB - dateA;
        }
        case "published_desc": {
          const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
          const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
          return dateB - dateA;
        }
        case "published_asc": {
          const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
          const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
          return dateA - dateB;
        }
        case "title_asc":
          return a.title.localeCompare(b.title, "hi");
        case "title_desc":
          return b.title.localeCompare(a.title, "hi");
        default:
          return 0;
      }
    });
  }, [articles, statusFilter, categoryFilter, featuredFilter, search, sortOption]);

  // Publish Draft Action Handler
  const handlePublish = async (article: AdminArticleListItem) => {
    setPendingActionId(article.id);
    setMessage(null);

    try {
      const res = await publishArticleAction(article.id);
      if (!res.success) {
        setMessage({ type: "error", text: res.error || "Failed to publish article." });
      } else {
        setMessage({ type: "success", text: `"${article.title}" published successfully.` });
        setArticles((prev) =>
          prev.map((a) =>
            a.id === article.id
              ? {
                  ...a,
                  status: "published" as const,
                  published_at: a.published_at || new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }
              : a
          )
        );
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("[ArticleListClient] Publish error:", err);
      setMessage({ type: "error", text: "An unexpected error occurred while publishing." });
    } finally {
      setPendingActionId(null);
    }
  };

  // Unpublish Article Action Handler
  const handleUnpublish = async (article: AdminArticleListItem) => {
    setPendingActionId(article.id);
    setMessage(null);

    try {
      const res = await unpublishArticleAction(article.id);
      if (!res.success) {
        setMessage({ type: "error", text: res.error || "Failed to unpublish article." });
      } else {
        setMessage({ type: "success", text: `"${article.title}" moved to draft.` });
        setArticles((prev) =>
          prev.map((a) =>
            a.id === article.id
              ? {
                  ...a,
                  status: "draft" as const,
                  updated_at: new Date().toISOString(),
                }
              : a
          )
        );
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("[ArticleListClient] Unpublish error:", err);
      setMessage({ type: "error", text: "An unexpected error occurred while unpublishing." });
    } finally {
      setPendingActionId(null);
    }
  };

  // Delete Draft Confirmation Handlers
  const handleDeleteTrigger = (article: AdminArticleListItem) => {
    if (article.status === "published") {
      setMessage({
        type: "error",
        text: "Published articles cannot be deleted. Move the article to draft first.",
      });
      return;
    }
    setDeletingArticle(article);
  };

  const handleConfirmDelete = async () => {
    if (!deletingArticle) return;

    setIsDeleting(true);
    setMessage(null);

    try {
      const res = await deleteArticleAction(deletingArticle.id);
      if (!res.success) {
        setMessage({ type: "error", text: res.error || "Failed to delete draft." });
      } else {
        setMessage({ type: "success", text: `"${deletingArticle.title}" deleted successfully.` });
        setArticles((prev) => prev.filter((a) => a.id !== deletingArticle.id));
        setDeletingArticle(null);
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("[ArticleListClient] Delete error:", err);
      setMessage({ type: "error", text: "An error occurred while deleting the draft." });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <ArticleListHeader />

      {/* 2. Notification Message Banner */}
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
            <span aria-hidden="true">{message.type === "success" ? "✓" : "⚠"}</span>
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

      {/* 3. Summary / Stats Cards */}
      <ArticleStats articles={articles} />

      {/* 4. Filter & Search Controls */}
      <ArticleFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        featuredFilter={featuredFilter}
        onFeaturedChange={setFeaturedFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        categories={categories}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* 5. Article List Container */}
      <div className="bg-white border border-[#6B1724]/15 rounded-2xl shadow-xs overflow-hidden">
        {articles.length === 0 ? (
          <ArticleEmptyState type="no-articles" />
        ) : filteredAndSortedArticles.length === 0 ? (
          <ArticleEmptyState
            type={search.trim() ? "no-search-results" : "no-filter-results"}
            onClearSearch={() => setSearch("")}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <ArticleTable
              articles={filteredAndSortedArticles}
              siteUrl={siteUrl}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onDelete={handleDeleteTrigger}
              isActionPending={Boolean(pendingActionId)}
            />

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-[#6B1724]/10">
              {filteredAndSortedArticles.map((article) => (
                <ArticleMobileCard
                  key={article.id}
                  article={article}
                  siteUrl={siteUrl}
                  onPublish={handlePublish}
                  onUnpublish={handleUnpublish}
                  onDelete={handleDeleteTrigger}
                  isActionPending={pendingActionId === article.id}
                />
              ))}
            </div>

            {/* List Footer / Result Counter */}
            <div className="px-6 py-3 bg-[#FDFBF7] border-t border-[#6B1724]/10 flex items-center justify-between text-xs text-[#5A6065]">
              <span>
                Showing <strong className="text-[#1F2326]">{filteredAndSortedArticles.length}</strong> of{" "}
                <strong className="text-[#1F2326]">{articles.length}</strong> articles
              </span>
              {activeFilterCount > 0 && (
                <span className="text-[11px] text-[#6B1724] font-medium">Filtered results</span>
              )}
            </div>
          </>
        )}
      </div>

      {/* 6. Accessible Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingArticle)}
        isDeleting={isDeleting}
        onCancel={() => setDeletingArticle(null)}
        onConfirm={handleConfirmDelete}
        articleTitle={deletingArticle?.title || ""}
      />
    </div>
  );
}
