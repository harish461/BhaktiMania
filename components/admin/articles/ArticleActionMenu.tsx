"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { AdminArticleListItem } from "@/lib/data/supabase/admin";

interface ArticleActionMenuProps {
  article: AdminArticleListItem;
  siteUrl: string;
  onPublish: (article: AdminArticleListItem) => void;
  onUnpublish: (article: AdminArticleListItem) => void;
  onDelete: (article: AdminArticleListItem) => void;
  isActionPending: boolean;
}

export function ArticleActionMenu({
  article,
  siteUrl,
  onPublish,
  onUnpublish,
  onDelete,
  isActionPending,
}: ArticleActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Clean site url for public link
  const cleanBase = siteUrl ? siteUrl.replace(/\/$/, "") : "";
  const publicArticleUrl = cleanBase ? `${cleanBase}/bhakti-gyaan/${article.slug}` : `/bhakti-gyaan/${article.slug}`;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* 3-dots trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isActionPending}
        className="w-10 h-10 inline-flex items-center justify-center rounded-xl text-[#5A6065] hover:text-[#1F2326] hover:bg-[#FDFBF7] border border-transparent hover:border-[#6B1724]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] transition-all cursor-pointer disabled:opacity-50"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Actions for article ${article.title}`}
      >
        <span className="sr-only">Actions</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1 w-52 rounded-2xl bg-white border border-[#6B1724]/15 shadow-xl py-1.5 z-40 focus:outline-none animate-in fade-in zoom-in-95 duration-100 divide-y divide-gray-100"
        >
          {/* Primary Navigation / View Actions */}
          <div className="py-1">
            <Link
              href={`/admin/articles/${article.id}/edit`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#1F2326] hover:bg-[#FDFBF7] hover:text-[#6B1724] transition-colors"
              role="menuitem"
            >
              <svg className="w-4 h-4 text-[#5A6065]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Article</span>
            </Link>

            {article.status === "published" && (
              <a
                href={publicArticleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#1F2326] hover:bg-[#FDFBF7] hover:text-[#6B1724] transition-colors"
                role="menuitem"
              >
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>View Live Article</span>
              </a>
            )}
          </div>

          {/* Lifecycle Actions */}
          <div className="py-1">
            {article.status === "draft" ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onPublish(article);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer text-left"
                role="menuitem"
              >
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Publish Draft</span>
              </button>
            ) : article.status === "published" ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onUnpublish(article);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer text-left"
                role="menuitem"
              >
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span>Move to Draft</span>
              </button>
            ) : null}

            {/* Delete Draft - Only permitted for draft articles */}
            {article.status === "draft" && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onDelete(article);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                role="menuitem"
              >
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete Draft...</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
