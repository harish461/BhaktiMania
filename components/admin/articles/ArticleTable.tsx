import React from "react";
import type { AdminArticleListItem } from "@/lib/data/supabase/admin";
import { ArticleTableRow } from "./ArticleTableRow";

interface ArticleTableProps {
  articles: AdminArticleListItem[];
  siteUrl: string;
  onPublish: (article: AdminArticleListItem) => void;
  onUnpublish: (article: AdminArticleListItem) => void;
  onDelete: (article: AdminArticleListItem) => void;
  isActionPending: boolean;
}

export function ArticleTable({
  articles,
  siteUrl,
  onPublish,
  onUnpublish,
  onDelete,
  isActionPending,
}: ArticleTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-[#FDFBF7] text-[11px] font-semibold text-[#5A6065] uppercase tracking-wider border-b border-[#6B1724]/10">
          <tr>
            <th scope="col" className="px-6 py-3.5">
              Article
            </th>
            <th scope="col" className="px-4 py-3.5">
              Category
            </th>
            <th scope="col" className="px-4 py-3.5">
              Status
            </th>
            <th scope="col" className="px-4 py-3.5">
              Featured
            </th>
            <th scope="col" className="px-4 py-3.5">
              Published
            </th>
            <th scope="col" className="px-4 py-3.5">
              Updated
            </th>
            <th scope="col" className="px-6 py-3.5 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#6B1724]/10 bg-white">
          {articles.map((article) => (
            <ArticleTableRow
              key={article.id}
              article={article}
              siteUrl={siteUrl}
              onPublish={onPublish}
              onUnpublish={onUnpublish}
              onDelete={onDelete}
              isActionPending={isActionPending}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
