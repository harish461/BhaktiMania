import React from "react";
import type { SupabaseCategory } from "@/lib/data/supabase";

export type SortOption =
  | "updated_desc"
  | "published_desc"
  | "published_asc"
  | "title_asc"
  | "title_desc";

interface ArticleFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  featuredFilter: string;
  onFeaturedChange: (value: string) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  categories: SupabaseCategory[];
  onClearFilters: () => void;
  activeFilterCount: number;
}

export function ArticleFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  featuredFilter,
  onFeaturedChange,
  sortOption,
  onSortChange,
  categories,
  onClearFilters,
  activeFilterCount,
}: ArticleFiltersProps) {
  return (
    <div className="bg-white border border-[#6B1724]/15 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Filter Row: Search & Sort */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <label htmlFor="article-search" className="sr-only">
            Search articles by title or slug
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-[#5A6065]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            id="article-search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or slug..."
            className="w-full pl-10 pr-10 py-2.5 min-h-[44px] bg-[#FDFBF7] border border-[#6B1724]/20 rounded-xl text-sm text-[#1F2326] placeholder-[#5A6065]/70 focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 min-w-[44px] justify-center cursor-pointer"
              aria-label="Clear search input"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="w-full md:w-56 shrink-0">
          <label htmlFor="sort-dropdown" className="sr-only">
            Sort articles
          </label>
          <div className="relative">
            <select
              id="sort-dropdown"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full px-3.5 py-2.5 min-h-[44px] bg-white border border-[#6B1724]/20 rounded-xl text-xs sm:text-sm font-medium text-[#1F2326] focus:outline-none focus:ring-2 focus:ring-[#D97706] cursor-pointer appearance-none pr-8"
            >
              <option value="updated_desc">Recently updated</option>
              <option value="published_desc">Newest published</option>
              <option value="published_asc">Oldest published</option>
              <option value="title_asc">Title A–Z</option>
              <option value="title_desc">Title Z–A</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Filter Row: Categorical Filters & Active Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-1 border-t border-[#6B1724]/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-[11px] font-semibold text-[#5A6065] uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 min-h-[44px] bg-[#FDFBF7] border border-[#6B1724]/20 rounded-xl text-xs sm:text-sm text-[#1F2326] focus:outline-none focus:ring-2 focus:ring-[#D97706] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category-filter" className="block text-[11px] font-semibold text-[#5A6065] uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 min-h-[44px] bg-[#FDFBF7] border border-[#6B1724]/20 rounded-xl text-xs sm:text-sm text-[#1F2326] focus:outline-none focus:ring-2 focus:ring-[#D97706] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Filter */}
          <div>
            <label htmlFor="featured-filter" className="block text-[11px] font-semibold text-[#5A6065] uppercase tracking-wider mb-1">
              Featured
            </label>
            <select
              id="featured-filter"
              value={featuredFilter}
              onChange={(e) => onFeaturedChange(e.target.value)}
              className="w-full px-3 py-2 min-h-[44px] bg-[#FDFBF7] border border-[#6B1724]/20 rounded-xl text-xs sm:text-sm text-[#1F2326] focus:outline-none focus:ring-2 focus:ring-[#D97706] cursor-pointer"
            >
              <option value="all">All Articles</option>
              <option value="featured">Featured Only</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>
        </div>

        {/* Active Filter State & Reset Controls */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 self-start lg:self-end pb-0.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#6B1724]/10 text-[#6B1724] border border-[#6B1724]/20">
              <span className="w-2 h-2 rounded-full bg-[#6B1724]" aria-hidden="true" />
              <span>{activeFilterCount} {activeFilterCount === 1 ? "filter active" : "filters active"}</span>
            </span>

            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] text-xs font-semibold text-[#6B1724] hover:text-[#52111C] hover:bg-[#FDFBF7] border border-dashed border-[#6B1724]/30 rounded-xl transition-colors cursor-pointer"
              aria-label="Clear all active filters"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Clear filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
