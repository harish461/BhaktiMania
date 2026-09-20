"use client";

import React from "react";

interface AuthorStatusBadgeProps {
  isActive: boolean;
}

export function AuthorStatusBadge({ isActive }: AuthorStatusBadgeProps) {
  if (isActive) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5" />
      Inactive
    </span>
  );
}
