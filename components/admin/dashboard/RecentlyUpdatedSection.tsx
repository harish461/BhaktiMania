import React from "react";
import Link from "next/link";
import type { DashboardArticleItem } from "@/lib/data/supabase/admin";

interface RecentlyUpdatedSectionProps {
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

function StatusBadge({ status }: { status: DashboardArticleItem["status"] }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        Published
      </span>
    );
  }
  if (status === "draft") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        Draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
      Archived
    </span>
  );
}

export function RecentlyUpdatedSection({ articles }: RecentlyUpdatedSectionProps) {
  return (
    <div className="bg-white border border-[#6B1724]/15 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-[#6B1724]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading text-[#6B1724]">
            Recently Updated Articles
          </h2>
          <p className="text-xs text-[#5A6065] mt-0.5">
            Content recently edited or created across all publication statuses
          </p>
        </div>

        <Link
          href="/admin/articles"
          className="text-xs font-semibold text-[#6B1724] hover:text-[#52111C] hover:underline transition-colors shrink-0 min-h-[44px] inline-flex items-center"
        >
          View All Articles ({articles.length > 0 ? "18" : "0"}) →
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#5A6065]">
          No articles found in the database.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FDFBF7] text-xs font-semibold text-[#5A6065] uppercase tracking-wider border-b border-[#6B1724]/10">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Article
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6B1724]/10">
                {articles.map((item) => {
                  const isPublished = item.status === "published";
                  return (
                    <tr key={item.id} className="hover:bg-[#FDFBF7]/60 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#1F2326] max-w-xs">
                        <Link
                          href={`/admin/articles/${item.id}/edit`}
                          className="hover:text-[#6B1724] line-clamp-1 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <span className="text-xs text-[#5A6065] font-mono block mt-0.5">
                          /{item.slug}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-[#5A6065] whitespace-nowrap">
                        {item.categoryTitle}
                      </td>

                      <td className="px-6 py-4 text-xs text-[#5A6065] whitespace-nowrap">
                        {item.authorName}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-6 py-4 text-xs text-[#5A6065] whitespace-nowrap font-mono">
                        {formatDate(item.updated_at)}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap text-xs font-semibold space-x-3">
                        {isPublished && (
                          <Link
                            href={`/bhakti-gyaan/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:text-emerald-800 hover:underline min-h-[44px] inline-flex items-center"
                          >
                            View ↗
                          </Link>
                        )}
                        <Link
                          href={`/admin/articles/${item.id}/edit`}
                          className="text-[#6B1724] hover:text-[#52111C] hover:underline min-h-[44px] inline-flex items-center"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (< 768px) */}
          <div className="md:hidden divide-y divide-[#6B1724]/10">
            {articles.map((item) => {
              const isPublished = item.status === "published";
              return (
                <div key={item.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/admin/articles/${item.id}/edit`}
                      className="font-medium text-sm text-[#1F2326] hover:text-[#6B1724] line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5A6065]">
                    <span>📁 {item.categoryTitle}</span>
                    <span>✍️ {item.authorName}</span>
                    <span>🕒 {formatDate(item.updated_at)}</span>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-1 border-t border-gray-100 text-xs font-semibold">
                    {isPublished && (
                      <Link
                        href={`/bhakti-gyaan/${item.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 py-2 min-h-[44px] inline-flex items-center"
                      >
                        View Public Article ↗
                      </Link>
                    )}
                    <Link
                      href={`/admin/articles/${item.id}/edit`}
                      className="text-[#6B1724] hover:text-[#52111C] py-2 min-h-[44px] inline-flex items-center"
                    >
                      Edit Article →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
