"use client";

import React from "react";
import Link from "next/link";

export function AuthorListHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#6B1724]/10">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#D97706]">
            Editorial Team
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#6B1724] mt-1">
          Authors & Contributors
        </h1>
        <p className="text-sm text-[#5A6065] mt-1">
          Manage writers, scholars, and editorial contributors credited across BhaktiMania articles.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/admin/authors/new"
          className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6B1724] hover:bg-[#52111C] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] cursor-pointer"
        >
          <span className="text-base leading-none">+</span>
          <span>Add Author</span>
        </Link>
      </div>
    </div>
  );
}
