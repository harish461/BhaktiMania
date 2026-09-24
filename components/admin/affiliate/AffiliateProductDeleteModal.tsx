"use client";

import React, { useState } from "react";
import type { AdminAffiliateProductItem } from "@/lib/data/supabase/admin";
import { deleteAffiliateProductAction } from "@/app/admin/actions/affiliate";

interface AffiliateProductDeleteModalProps {
  isOpen: boolean;
  product: AdminAffiliateProductItem | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function AffiliateProductDeleteModal({
  isOpen,
  product,
  onClose,
  onSuccess,
}: AffiliateProductDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await deleteAffiliateProductAction(product.id);
      if (!res.success) {
        setError(res.error || "उत्पाद हटाने में विफलता हुई।");
        setIsDeleting(false);
        return;
      }
      onSuccess(res.message || "उत्पाद सफलतापूर्वक हटा दिया गया।");
      onClose();
    } catch (err: unknown) {
      console.error("[AffiliateProductDeleteModal] Error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-md bg-white border border-red-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>

        <div className="text-center space-y-1">
          <h2 id="delete-dialog-title" className="text-lg font-bold font-heading text-[#1F2326]">
            उत्पाद हटाएं (Delete Product)
          </h2>
          <p className="text-xs text-[#5A6065]">
            क्या आप वाकई <strong className="text-[#1F2326]">&ldquo;{product.name}&rdquo;</strong> को कैटलॉग से स्थायी रूप से हटाना चाहते हैं?
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
          <strong className="block font-semibold mb-0.5">सावधानी (Cascade Notice):</strong>
          इस उत्पाद को हटाने पर इससे संबंधित सभी लेखों के संबंध (Article Relationships) भी डेटाबेस से स्वतः हटा दिए जाएंगे।
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            रद्द करें (Cancel)
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
          >
            {isDeleting ? "हटा रहे हैं..." : "हाँ, स्थायी रूप से हटाएं"}
          </button>
        </div>
      </div>
    </div>
  );
}
