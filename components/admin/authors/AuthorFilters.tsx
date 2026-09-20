"use client";

import React from "react";

interface AuthorFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (val: "all" | "active" | "inactive") => void;
  resultCount: number;
}

export function AuthorFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  resultCount,
}: AuthorFiltersProps) {
  return (
    <div className="bg-white border border-[#6B1724]/15 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <label htmlFor="author-search" className="sr-only">
            Search authors by name, role, or slug
          </label>
          <input
            id="author-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, role, or slug (e.g. 'editorial')..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-sm text-[#1F2326] placeholder:text-[#5A6065]/70 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/15 outline-none transition-all"
          />
          <svg
            className="w-4 h-4 text-[#5A6065] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5A6065] hover:text-[#1F2326] p-1"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FDFBF7] rounded-xl border border-[#6B1724]/10 shrink-0 self-start sm:self-auto">
          {(
            [
              { id: "all", label: "All" },
              { id: "active", label: "Active" },
              { id: "inactive", label: "Inactive" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => onStatusFilterChange(filter.id)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === filter.id
                  ? "bg-[#6B1724] text-white shadow-xs"
                  : "text-[#5A6065] hover:text-[#1F2326] hover:bg-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#5A6065] pt-1">
        <span>
          Showing <strong className="text-[#1F2326] font-semibold">{resultCount}</strong> author{resultCount !== 1 ? "s" : ""}
        </span>
        {(searchQuery || statusFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              onSearchChange("");
              onStatusFilterChange("all");
            }}
            className="text-xs font-semibold text-[#6B1724] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
