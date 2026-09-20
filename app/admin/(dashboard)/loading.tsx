import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse" role="status" aria-label="Loading admin dashboard">
      {/* Banner Skeleton */}
      <div className="bg-white border border-[#6B1724]/10 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="h-4 w-24 bg-amber-100 rounded mb-3" />
        <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-96 max-w-full bg-gray-100 rounded" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#6B1724]/10 rounded-xl p-5 shadow-sm space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-14 bg-gray-300 rounded" />
            <div className="h-3 w-28 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Table Section Skeleton */}
      <div className="bg-white border border-[#6B1724]/10 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-5 w-36 bg-gray-300 rounded" />
            <div className="h-3 w-56 bg-gray-100 rounded" />
          </div>
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          {[1, 2, 3].map((row) => (
            <div key={row} className="h-10 bg-gray-50 rounded-lg flex items-center px-4 justify-between">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-[#5A6065] py-4">
        <svg
          className="animate-spin h-5 w-5 text-[#6B1724]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Loading dashboard data...</span>
      </div>
    </div>
  );
}
