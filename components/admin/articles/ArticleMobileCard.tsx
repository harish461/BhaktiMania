import React from "react";
import Link from "next/link";
import type { AdminArticleListItem } from "@/lib/data/supabase/admin";
import { ArticleStatusBadge } from "./ArticleStatusBadge";
import { ArticleActionMenu } from "./ArticleActionMenu";

interface ArticleMobileCardProps {
  article: AdminArticleListItem;
  siteUrl: string;
  onPublish: (article: AdminArticleListItem) => void;
  onUnpublish: (article: AdminArticleListItem) => void;
  onDelete: (article: AdminArticleListItem) => void;
  isActionPending: boolean;
}

function formatDate(isoString?: string | null) {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export function ArticleMobileCard({
  article,
  siteUrl,
  onPublish,
  onUnpublish,
  onDelete,
  isActionPending,
}: ArticleMobileCardProps) {
  return (
    <article className="p-4 sm:p-5 space-y-3.5 bg-white transition-colors">
      {/* Top row: Status, Featured & Action Menu */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <ArticleStatusBadge status={article.status} />
          {article.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/80">
              <svg className="w-3.5 h-3.5 text-amber-500 fill-amber-400" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>Featured</span>
            </span>
          )}
        </div>

        <ArticleActionMenu
          article={article}
          siteUrl={siteUrl}
          onPublish={onPublish}
          onUnpublish={onUnpublish}
          onDelete={onDelete}
          isActionPending={isActionPending}
        />
      </div>

      {/* Article Title & Slug */}
      <div className="space-y-1">
        <Link
          href={`/admin/articles/${article.id}/edit`}
          className="block font-heading font-semibold text-base text-[#1F2326] active:text-[#6B1724] leading-snug"
        >
          {article.title}
        </Link>
        <p className="text-xs text-[#5A6065] font-mono break-all">
          /{article.slug}
        </p>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs text-[#5A6065] pt-1">
        <div>
          <span className="font-semibold text-gray-700">Category: </span>
          <span>{article.categoryTitle}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Author: </span>
          <span>{article.authorName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Published: </span>
          <span>{formatDate(article.published_at)}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Updated: </span>
          <span>{formatDate(article.updated_at)}</span>
        </div>
      </div>

      {/* Bottom Actions: Edit Link (>= 44px touch target) */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-[#5A6065]">
          Read time: {article.read_time || "5 मिनट"}
        </span>

        <Link
          href={`/admin/articles/${article.id}/edit`}
          className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-xs font-bold text-[#6B1724] hover:bg-[#FDFBF7] rounded-xl border border-[#6B1724]/20 transition-all cursor-pointer"
        >
          Edit Article →
        </Link>
      </div>
    </article>
  );
}
