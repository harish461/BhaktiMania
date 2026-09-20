"use client";

import React, { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminAuthorListItem } from "@/lib/data/supabase/admin";
import { activateAuthorAction, deactivateAuthorAction } from "@/app/admin/actions/authors";
import { AuthorListHeader } from "./AuthorListHeader";
import { AuthorStats } from "./AuthorStats";
import { AuthorFilters } from "./AuthorFilters";
import { AuthorTable } from "./AuthorTable";
import { AuthorMobileCard } from "./AuthorMobileCard";
import { AuthorEmptyState } from "./AuthorEmptyState";
import { AuthorDeactivateModal } from "./AuthorDeactivateModal";

interface AuthorListClientProps {
  initialAuthors: AdminAuthorListItem[];
}

export default function AuthorListClient({ initialAuthors }: AuthorListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local state for authors (updated optimistically on toggle)
  const [authors, setAuthors] = useState<AdminAuthorListItem[]>(initialAuthors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Deactivate Modal state
  const [authorToDeactivate, setAuthorToDeactivate] = useState<AdminAuthorListItem | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // In-memory filtered authors
  const filteredAuthors = useMemo(() => {
    return authors.filter((author) => {
      // Status filter
      if (statusFilter === "active" && !author.is_active) return false;
      if (statusFilter === "inactive" && author.is_active) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesName = author.name.toLowerCase().includes(q);
        const matchesSlug = author.slug.toLowerCase().includes(q);
        const matchesRole = author.role.toLowerCase().includes(q);
        if (!matchesName && !matchesSlug && !matchesRole) return false;
      }

      return true;
    });
  }, [authors, searchQuery, statusFilter]);

  // Activate handler
  const handleActivate = async (author: AdminAuthorListItem) => {
    setToastMessage(null);
    try {
      const res = await activateAuthorAction(author.id);
      if (!res.success) {
        setToastMessage({ type: "error", text: res.error || "Failed to activate author." });
      } else {
        setToastMessage({ type: "success", text: `Author "${author.name}" activated.` });
        setAuthors((prev) =>
          prev.map((a) => (a.id === author.id ? { ...a, is_active: true } : a))
        );
        startTransition(() => {
          router.refresh();
        });
      }
    } catch {
      setToastMessage({ type: "error", text: "An error occurred while activating author." });
    }
  };

  // Open Deactivate Modal
  const handlePromptDeactivate = (author: AdminAuthorListItem) => {
    setAuthorToDeactivate(author);
  };

  // Confirm Deactivate Action
  const handleConfirmDeactivate = async () => {
    if (!authorToDeactivate) return;

    setIsDeactivating(true);
    setToastMessage(null);

    try {
      const res = await deactivateAuthorAction(authorToDeactivate.id);
      if (!res.success) {
        setToastMessage({ type: "error", text: res.error || "Failed to deactivate author." });
      } else {
        setToastMessage({ type: "success", text: res.message || `Author "${authorToDeactivate.name}" deactivated.` });
        setAuthors((prev) =>
          prev.map((a) => (a.id === authorToDeactivate.id ? { ...a, is_active: false } : a))
        );
        setAuthorToDeactivate(null);
        startTransition(() => {
          router.refresh();
        });
      }
    } catch {
      setToastMessage({ type: "error", text: "An error occurred while deactivating author." });
    } finally {
      setIsDeactivating(false);
    }
  };

  const isFiltered = Boolean(searchQuery.trim() || statusFilter !== "all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <AuthorListHeader />

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          className={`p-4 rounded-2xl border text-sm flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
            toastMessage.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span>{toastMessage.type === "success" ? "✓" : "⚠"}</span>
            <span className="font-medium">{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs font-semibold p-1 hover:opacity-70 cursor-pointer"
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <AuthorStats authors={authors} />

      {/* Filters */}
      <AuthorFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        resultCount={filteredAuthors.length}
      />

      {/* Author Table / Mobile Cards / Empty State */}
      {filteredAuthors.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <AuthorTable
            authors={filteredAuthors}
            onActivate={handleActivate}
            onDeactivate={handlePromptDeactivate}
            isActionPending={isPending}
          />

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {filteredAuthors.map((author) => (
              <AuthorMobileCard
                key={author.id}
                author={author}
                onActivate={handleActivate}
                onDeactivate={handlePromptDeactivate}
                isActionPending={isPending}
              />
            ))}
          </div>
        </>
      ) : (
        <AuthorEmptyState
          isFiltered={isFiltered}
          onResetFilters={() => {
            setSearchQuery("");
            setStatusFilter("all");
          }}
        />
      )}

      {/* Deactivate Confirmation Modal */}
      <AuthorDeactivateModal
        isOpen={Boolean(authorToDeactivate)}
        isPending={isDeactivating}
        author={authorToDeactivate}
        onCancel={() => setAuthorToDeactivate(null)}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}
