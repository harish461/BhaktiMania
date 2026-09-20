import React from "react";
import Link from "next/link";
import type { AdminArticleListItem } from "@/lib/data/supabase/admin";
import { ArticleStatusBadge } from "./ArticleStatusBadge";
import { ArticleActionMenu } from "./ArticleActionMenu";

interface ArticleTableRowProps {
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

export function ArticleTableRow({
  article,
  siteUrl,
  onPublish,
  onUnpublish,
  onDelete,
  isActionPending,
}: ArticleTableRowProps) {
  return (
    <tr className="hover:bg-[#FDFBF7]/80 transition-colors group">
      {/* Article: Title + Slug */}
      <td className="px-6 py-4 max-w-sm">
        <div className="space-y-1">
          <Link
            href={`/admin/articles/${article.id}/edit`}
            className="line-clamp-2 font-heading font-semibold text-sm text-[#1F2326] group-hover:text-[#6B1724] transition-colors"
          >
            {article.title}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#5A6065] font-mono">
            <span className="text-gray-400 select-none">/</span>
            <span className="truncate max-w-[220px]" title={article.slug}>
              {article.slug}
            </span>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-4 text-xs font-medium text-[#1F2326] whitespace-nowrap">
        <span className="inline-block px-2.5 py-1 rounded-lg bg-[#FDFBF7] border border-[#6B1724]/10 text-xs text-[#5A6065]">
          {article.categoryTitle}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        <ArticleStatusBadge status={article.status} />
      </td>

      {/* Featured Indicator */}
      <td className="px-4 py-4 whitespace-nowrap">
        {article.featured ? (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/80"
            title="Featured article"
          >
            <svg className="w-3.5 h-3.5 text-amber-500 fill-amber-400" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span>Featured</span>
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>

      {/* Published Date */}
      <td className="px-4 py-4 text-xs text-[#5A6065] whitespace-nowrap">
        {formatDate(article.published_at)}
      </td>

      {/* Updated Date */}
      <td className="px-4 py-4 text-xs text-[#5A6065] whitespace-nowrap">
        {formatDate(article.updated_at)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/articles/${article.id}/edit`}
            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-[#6B1724] hover:text-[#52111C] hover:bg-[#FDFBF7] rounded-lg border border-transparent hover:border-[#6B1724]/20 transition-all cursor-pointer"
          >
            Edit
          </Link>

          <ArticleActionMenu
            article={article}
            siteUrl={siteUrl}
            onPublish={onPublish}
            onUnpublish={onUnpublish}
            onDelete={onDelete}
            isActionPending={isActionPending}
          />
        </div>
      </td>
    </tr>
  );
}
