"use client";

import React from "react";
import type { AdminAuthorListItem } from "@/lib/data/supabase/admin";
import { AuthorTableRow } from "./AuthorTableRow";

interface AuthorTableProps {
  authors: AdminAuthorListItem[];
  onActivate: (author: AdminAuthorListItem) => void;
  onDeactivate: (author: AdminAuthorListItem) => void;
  isActionPending: boolean;
}

export function AuthorTable({
  authors,
  onActivate,
  onDeactivate,
  isActionPending,
}: AuthorTableProps) {
  return (
    <div className="hidden md:block bg-white border border-[#6B1724]/15 rounded-2xl shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FDFBF7] text-xs font-semibold text-[#5A6065] uppercase tracking-wider border-b border-[#6B1724]/10">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Author & Slug
              </th>
              <th scope="col" className="px-6 py-3.5">
                Role
              </th>
              <th scope="col" className="px-6 py-3.5">
                Articles
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <AuthorTableRow
                key={author.id}
                author={author}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
                isActionPending={isActionPending}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
