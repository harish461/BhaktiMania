import React from "react";
import Link from "next/link";
import type { DashboardArticleItem } from "@/lib/data/supabase/admin";

interface RecentlyPublishedSectionProps {
  articles: DashboardArticleItem[];
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

export function RecentlyPublishedSection({ articles }: RecentlyPublishedSectionProps) {
  return (
    <div className="bg-white border border-[#6B1724]/15 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-[#6B1724]/10 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold font-heading text-[#6B1724]">
              Recently Published
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Live Content
            </span>
          </div>
          <p className="text-xs text-[#5A6065] mt-0.5">
            Published devotional articles currently visible to public visitors
          </p>
        </div>

        <Link
          href="/admin/articles?status=published"
          className="text-xs font-semibold text-[#6B1724] hover:text-[#52111C] hover:underline transition-colors shrink-0 min-h-[44px] inline-flex items-center"
        >
          All Published →
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#5A6065]">
          No published articles found.
        </div>
      ) : (
        <div className="divide-y divide-[#6B1724]/10">
          {articles.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FDFBF7]/60 transition-colors"
            >
              <div className="space-y-1 max-w-xl">
                <Link
                  href={`/bhakti-gyaan/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#1F2326] hover:text-[#6B1724] line-clamp-1 transition-colors"
                >
                  {item.title}
                </Link>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5A6065]">
                  <span className="font-medium text-[#6B1724]">📁 {item.categoryTitle}</span>
                  <span>•</span>
                  <span>✍️ {item.authorName}</span>
                  <span>•</span>
                  <span className="font-mono">📅 {formatDate(item.published_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs font-semibold self-end sm:self-center">
                <Link
                  href={`/bhakti-gyaan/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg border border-emerald-300 text-emerald-800 hover:bg-emerald-50 transition-colors min-h-[44px] inline-flex items-center"
                >
                  View Live ↗
                </Link>

                <Link
                  href={`/admin/articles/${item.id}/edit`}
                  className="px-3 py-2 rounded-lg border border-[#6B1724]/20 text-[#6B1724] hover:bg-[#6B1724] hover:text-white transition-colors min-h-[44px] inline-flex items-center"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
