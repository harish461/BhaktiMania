import React from "react";
import Link from "next/link";

export function ArticleListHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#6B1724]/10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#6B1724] tracking-tight">
          Articles
        </h1>
        <p className="text-xs sm:text-sm text-[#5A6065] mt-1">
          Manage, publish, and organize your devotional articles.
        </p>
      </div>

      <Link
        href="/admin/articles/new"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#6B1724] hover:bg-[#52111C] active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] focus-visible:ring-offset-2 shrink-0 cursor-pointer"
        aria-label="Create new article"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Create Article</span>
      </Link>
    </header>
  );
}
