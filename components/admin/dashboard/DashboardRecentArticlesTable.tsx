import React from "react";
import Link from "next/link";
import type { DashboardArticleItem } from "@/lib/data/supabase/admin";
import { EditIcon, EyeIcon, PlusIcon } from "@/components/admin/icons";

interface DashboardRecentArticlesTableProps {
  articles: DashboardArticleItem[];
}

export function DashboardRecentArticlesTable({ articles }: DashboardRecentArticlesTableProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="bg-white rounded-[14px] p-8 border border-[#EEEEEE] shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center">
        <h3 className="text-base font-bold text-[#111827]">No Articles Found</h3>
        <p className="text-sm text-[#6B7280] mt-1">Get started by creating your first article.</p>
        <Link
          href="/admin/articles/new"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#C85A17] hover:bg-[#A8440B] text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create Article</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[14px] border border-[#EEEEEE] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* ── Table Card Header ── */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-bold text-[#111827]">
            Recent Articles
          </h3>
          <p className="text-[12.5px] text-[#6B7280] mt-0.5">
            Latest editorial contributions and updates in your platform
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#C85A17] hover:bg-[#A8440B] text-white text-[12.5px] font-semibold rounded-[8px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17]"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Article</span>
          </Link>

          <Link
            href="/admin/articles"
            className="px-3 py-2 border border-gray-200 hover:border-gray-300 text-[12.5px] font-medium text-[#4B5563] hover:text-[#111827] rounded-[8px] transition-colors"
          >
            View All →
          </Link>
        </div>
      </div>

      {/* ── Responsive Modern Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px] border-collapse">
          <thead>
            <tr className="bg-[#FBFBFA] border-b border-gray-100 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-6 font-semibold">Article Title</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Category</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Author</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Updated</th>
              <th scope="col" className="py-3.5 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((article) => {
              const isPublished = article.status === "published";
              const isDraft = article.status === "draft";

              // Format date nicely
              const updatedDate = new Date(article.updated_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <tr
                  key={article.id}
                  className="hover:bg-[#F9FAFB] transition-colors group h-[58px]"
                >
                  {/* Title */}
                  <td className="py-3 px-6 max-w-[320px]">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="font-medium text-[#111827] hover:text-[#C85A17] transition-colors line-clamp-1"
                      title={article.title}
                    >
                      {article.title}
                    </Link>
                    <span className="text-[11px] text-[#9CA3AF] font-mono block mt-0.5">
                      /{article.slug}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 rounded-[6px] text-[11.5px] font-medium bg-[#F3F4F6] text-[#4B5563]">
                      {article.categoryTitle || "Uncategorized"}
                    </span>
                  </td>

                  {/* Author */}
                  <td className="py-3 px-4 whitespace-nowrap text-[#6B7280] text-[12.5px]">
                    {article.authorName || "Editorial Desk"}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {isPublished && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]/60">
                        Published
                      </span>
                    )}
                    {isDraft && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                        Draft
                      </span>
                    )}
                    {!isPublished && !isDraft && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                        {article.status}
                      </span>
                    )}
                  </td>

                  {/* Updated Date */}
                  <td className="py-3 px-4 whitespace-nowrap text-[12px] text-[#6B7280]">
                    {updatedDate}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="p-1.5 rounded-[6px] text-[#6B7280] hover:text-[#C85A17] hover:bg-[#FFF7ED] transition-colors"
                        title="Edit article"
                      >
                        <EditIcon className="w-4 h-4" />
                      </Link>

                      <Link
                        href={`/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-[6px] text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 transition-colors"
                        title="View live article"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 bg-[#FBFBFA] border-t border-gray-100 flex items-center justify-between text-[12px] text-[#6B7280]">
        <span>Showing {articles.length} most recently modified articles</span>
        <Link
          href="/admin/articles"
          className="font-medium text-[#C85A17] hover:underline"
        >
          Manage All Articles →
        </Link>
      </div>
    </div>
  );
}
