"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminCategoryListItem } from "@/lib/data/supabase/admin";
import {
  toggleCategoryStatusAction,
  updateCategoryOrderAction,
} from "@/app/admin/actions/categories";
import { CategoryListHeader } from "./CategoryListHeader";
import { CategoryTable } from "./CategoryTable";
import { CategoryMobileCard } from "./CategoryMobileCard";
import { CategoryDeactivateModal } from "./CategoryDeactivateModal";
import { CategoryEmptyState } from "./CategoryEmptyState";

interface CategoryListClientProps {
  initialCategories: AdminCategoryListItem[];
  siteUrl?: string;
}

export default function CategoryListClient({
  initialCategories,
  siteUrl = "",
}: CategoryListClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategoryListItem[]>(initialCategories);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [deactivatingCategory, setDeactivatingCategory] = useState<AdminCategoryListItem | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Reordering handler
  const handleReorder = async (category: AdminCategoryListItem, direction: "up" | "down") => {
    setPendingActionId(category.id);
    setMessage(null);

    try {
      const res = await updateCategoryOrderAction(category.id, direction);
      if (!res.success) {
        setMessage({ type: "error", text: res.error || "Failed to update category order." });
      } else {
        setMessage({ type: "success", text: res.message || "Category order updated." });
        // Optimistically swap adjacent categories
        setCategories((prev) => {
          const idx = prev.findIndex((c) => c.id === category.id);
          if (idx === -1) return prev;
          const targetIdx = direction === "up" ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= prev.length) return prev;
          const copy = [...prev];
          const temp = copy[idx];
          copy[idx] = copy[targetIdx];
          copy[targetIdx] = temp;
          // Reassign sequential sort_order: 1..N
          return copy.map((c, i) => ({ ...c, sort_order: i + 1 }));
        });
        router.refresh();
      }
    } catch (err) {
      console.error("[CategoryListClient] Reorder error:", err);
      setMessage({ type: "error", text: "An error occurred while updating order." });
    } finally {
      setPendingActionId(null);
    }
  };

  // Activation handler
  const handleActivate = async (category: AdminCategoryListItem) => {
    setPendingActionId(category.id);
    setMessage(null);

    try {
      const res = await toggleCategoryStatusAction(category.id, true);
      if (!res.success) {
        setMessage({ type: "error", text: res.error || "Failed to activate category." });
      } else {
        setMessage({ type: "success", text: res.message || "Category activated." });
        setCategories((prev) =>
          prev.map((c) => (c.id === category.id ? { ...c, is_active: true } : c))
        );
        router.refresh();
      }
    } catch (err) {
      console.error("[CategoryListClient] Activate error:", err);
      setMessage({ type: "error", text: "An error occurred while activating category." });
    } finally {
      setPendingActionId(null);
    }
  };

  // Deactivation confirmation handler
  const handleConfirmDeactivate = async () => {
    if (!deactivatingCategory) return;

    setIsDeactivating(true);
    setMessage(null);

    try {
      const res = await toggleCategoryStatusAction(deactivatingCategory.id, false);
      if (!res.success) {
        setMessage({ type: "error", text: res.error || "Failed to deactivate category." });
      } else {
        setMessage({ type: "success", text: res.message || "Category deactivated." });
        setCategories((prev) =>
          prev.map((c) => (c.id === deactivatingCategory.id ? { ...c, is_active: false } : c))
        );
        setDeactivatingCategory(null);
        router.refresh();
      }
    } catch (err) {
      console.error("[CategoryListClient] Deactivate error:", err);
      setMessage({ type: "error", text: "An error occurred while deactivating category." });
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <CategoryListHeader />

      {/* 2. Notification Message */}
      {message && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span aria-hidden="true">{message.type === "success" ? "✓" : "⚠"}</span>
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg cursor-pointer"
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Category List Table & Cards */}
      <div className="bg-white border border-[#6B1724]/15 rounded-2xl shadow-xs overflow-hidden">
        {categories.length === 0 ? (
          <CategoryEmptyState />
        ) : (
          <>
            {/* Desktop Table View */}
            <CategoryTable
              categories={categories}
              siteUrl={siteUrl}
              onMoveUp={(cat) => handleReorder(cat, "up")}
              onMoveDown={(cat) => handleReorder(cat, "down")}
              onActivate={handleActivate}
              onDeactivate={(cat) => setDeactivatingCategory(cat)}
              isActionPending={Boolean(pendingActionId)}
            />

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-[#6B1724]/10">
              {categories.map((cat, idx) => (
                <CategoryMobileCard
                  key={cat.id}
                  category={cat}
                  siteUrl={siteUrl}
                  isFirst={idx === 0}
                  isLast={idx === categories.length - 1}
                  onMoveUp={(c) => handleReorder(c, "up")}
                  onMoveDown={(c) => handleReorder(c, "down")}
                  onActivate={handleActivate}
                  onDeactivate={(c) => setDeactivatingCategory(c)}
                  isActionPending={pendingActionId === cat.id}
                />
              ))}
            </div>

            {/* List Footer */}
            <div className="px-6 py-3 bg-[#FDFBF7] border-t border-[#6B1724]/10 flex items-center justify-between text-xs text-[#5A6065]">
              <span>
                Total <strong className="text-[#1F2326]">{categories.length}</strong> categories configured
              </span>
              <span className="text-[11px] text-[#6B1724] font-medium">
                {categories.filter((c) => c.is_active).length} Active •{" "}
                {categories.filter((c) => !c.is_active).length} Inactive
              </span>
            </div>
          </>
        )}
      </div>

      {/* 4. Deactivate Safety Confirmation Modal */}
      <CategoryDeactivateModal
        isOpen={Boolean(deactivatingCategory)}
        isPending={isDeactivating}
        categoryTitle={deactivatingCategory?.title || ""}
        onCancel={() => setDeactivatingCategory(null)}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}
