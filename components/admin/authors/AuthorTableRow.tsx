"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { AdminAuthorListItem } from "@/lib/data/supabase/admin";
import { AuthorStatusBadge } from "./AuthorStatusBadge";
import { AuthorActionMenu } from "./AuthorActionMenu";

interface AuthorTableRowProps {
  author: AdminAuthorListItem;
  onActivate: (author: AdminAuthorListItem) => void;
  onDeactivate: (author: AdminAuthorListItem) => void;
  isActionPending: boolean;
}

export function AuthorTableRow({
  author,
  onActivate,
  onDeactivate,
  isActionPending,
}: AuthorTableRowProps) {
  // Extract initial for avatar fallback
  const initial = author.name ? author.name.trim().charAt(0).toUpperCase() : "A";

  return (
    <tr className="hover:bg-[#FDFBF7]/60 transition-colors border-b border-[#6B1724]/10 last:border-0">
      {/* Author Name & Avatar */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F8F4EC] border border-[#6B1724]/15 flex items-center justify-center text-[#6B1724] font-bold text-sm shrink-0 overflow-hidden relative">
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
              <span>{initial}</span>
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/admin/authors/${author.id}/edit`}
              className="font-semibold text-[#1F2326] hover:text-[#6B1724] text-sm transition-colors block truncate"
            >
              {author.name}
            </Link>
            <span className="font-mono text-xs text-[#5A6065] block truncate">
              {author.slug}
            </span>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F8F4EC] text-[#6B1724] border border-[#6B1724]/15">
          {author.role}
        </span>
      </td>

      {/* Articles Count */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-[#1F2326]">
            {author.articleCount}
          </span>
          <span className="text-xs text-[#5A6065]">
            article{author.articleCount !== 1 ? "s" : ""}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <AuthorStatusBadge isActive={author.is_active} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <AuthorActionMenu
          author={author}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          isActionPending={isActionPending}
        />
      </td>
    </tr>
  );
}
