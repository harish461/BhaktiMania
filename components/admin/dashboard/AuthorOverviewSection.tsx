import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { AdminAuthorListItem } from "@/lib/data/supabase/admin";

interface AuthorOverviewSectionProps {
  authors: AdminAuthorListItem[];
}

export function AuthorOverviewSection({ authors }: AuthorOverviewSectionProps) {
  return (
    <div className="bg-white border border-[#6B1724]/15 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-[#6B1724]/10 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-heading text-[#6B1724]">
            Author Overview
          </h2>
          <p className="text-xs text-[#5A6065] mt-0.5">
            Editorial scholars, contributors, and publication credits
          </p>
        </div>

        <Link
          href="/admin/authors"
          className="text-xs font-semibold text-[#6B1724] hover:text-[#52111C] hover:underline transition-colors shrink-0 min-h-[44px] inline-flex items-center"
        >
          Manage Authors →
        </Link>
      </div>

      {authors.length === 0 ? (
        <div className="p-6 text-center text-sm text-[#5A6065]">
          No authors found in the database.
        </div>
      ) : (
        <div className="p-4 sm:p-5 space-y-3 flex-1">
          {authors.map((author) => (
            <Link
              key={author.id}
              href="/admin/authors"
              className="p-3.5 rounded-xl border border-[#6B1724]/10 hover:border-[#6B1724]/30 hover:bg-[#FDFBF7] transition-all flex items-center justify-between gap-3 min-h-[44px] group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#6B1724]/15 flex items-center justify-center text-[#6B1724] font-bold text-sm shrink-0 overflow-hidden relative">
                  {author.avatar_url ? (
                    <Image
                      src={author.avatar_url}
                      alt={author.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>{author.name.charAt(0)}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#1F2326] group-hover:text-[#6B1724] truncate">
                      {author.name}
                    </span>
                    {!author.is_active && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 border border-gray-200 uppercase">
                        Inactive
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#5A6065] truncate block">
                    {author.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FDFBF7] border border-[#6B1724]/15 text-[#6B1724]">
                  {author.articleCount} {author.articleCount === 1 ? "article" : "articles"}
                </span>

                <span
                  className={`w-2 h-2 rounded-full ${
                    author.is_active ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                  title={author.is_active ? "Active" : "Inactive"}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
