"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { AdminAuthorListItem } from "@/lib/data/supabase/admin";
import { AuthorStatusBadge } from "./AuthorStatusBadge";
import { AuthorActionMenu } from "./AuthorActionMenu";

interface AuthorMobileCardProps {
  author: AdminAuthorListItem;
  onActivate: (author: AdminAuthorListItem) => void;
  onDeactivate: (author: AdminAuthorListItem) => void;
  isActionPending: boolean;
}

export function AuthorMobileCard({
  author,
  onActivate,
  onDeactivate,
  isActionPending,
}: AuthorMobileCardProps) {
  const initial = author.name ? author.name.trim().charAt(0).toUpperCase() : "A";

  return (
    <div className="bg-white border border-[#6B1724]/15 rounded-2xl p-4 shadow-2xs space-y-3.5">
      {/* Top row: Avatar + Name + Action Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-[#F8F4EC] border border-[#6B1724]/15 flex items-center justify-center text-[#6B1724] font-bold text-sm shrink-0 overflow-hidden relative">
            {author.avatar_url ? (
              <Image
                src={author.avatar_url}
                alt={author.name}
                fill
                sizes="44px"
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
              className="font-semibold text-[#1F2326] text-sm hover:text-[#6B1724] transition-colors block truncate"
            >
              {author.name}
            </Link>
            <span className="font-mono text-xs text-[#5A6065] block truncate">
              {author.slug}
            </span>
          </div>
        </div>

        <AuthorActionMenu
          author={author}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          isActionPending={isActionPending}
        />
      </div>

      {/* Bio snippet if present */}
      {author.bio && (
        <p className="text-xs text-[#5A6065] line-clamp-2 leading-relaxed">
          {author.bio}
        </p>
      )}

      {/* Details metadata row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#6B1724]/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-[#F8F4EC] text-[#6B1724] text-[11px] border border-[#6B1724]/15">
            {author.role}
          </span>
          <span className="text-[#5A6065]">
            <strong className="text-[#1F2326] font-semibold">{author.articleCount}</strong> article{author.articleCount !== 1 ? "s" : ""}
          </span>
        </div>

        <AuthorStatusBadge isActive={author.is_active} />
      </div>
    </div>
  );
}
