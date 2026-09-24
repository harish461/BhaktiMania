"use client";

import React, { useState, useEffect } from "react";
import type { AffiliateProductItem } from "@/lib/data/supabase/types";
import {
  attachProductToArticleAction,
  updateArticleAffiliateRelationAction,
  removeProductFromArticleAction,
  getArticleAttachedProductsAction,
  type AttachedProductRelationItem,
} from "@/app/admin/actions/affiliate";

interface ArticleAffiliateCardProps {
  articleId?: string;
  onSaveDraftFirst?: () => Promise<string | null>;
  allActiveProducts: AffiliateProductItem[];
}

interface AttachedProductState {
  id: string;
  article_id: string;
  product_id: string;
  sort_order: number;
  contextual_note: string | null;
  product: {
    id: string;
    name: string;
    merchant: string;
    category: string | null;
    is_active: boolean;
  } | null;
}

export function ArticleAffiliateCard({
  articleId,
  onSaveDraftFirst,
  allActiveProducts,
}: ArticleAffiliateCardProps) {
  const [attached, setAttached] = useState<AttachedProductState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [contextualNote, setContextualNote] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isAttaching, setIsAttaching] = useState(false);

  // Load attached products whenever articleId changes
  useEffect(() => {
    if (!articleId) {
      return;
    }

    let isMounted = true;
    const fetchAttached = async () => {
      setIsLoading(true);
      try {
        const rows: AttachedProductRelationItem[] =
          await getArticleAttachedProductsAction(articleId);
        if (isMounted) {
          setAttached(
            rows.map((r) => ({
              id: r.id,
              article_id: r.article_id,
              product_id: r.product_id,
              sort_order: r.sort_order,
              contextual_note: r.contextual_note,
              product: r.affiliate_products,
            }))
          );
        }
      } catch (err) {
        console.error("[ArticleAffiliateCard] Fetch error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAttached();
    return () => {
      isMounted = false;
    };
  }, [articleId]);

  // Filter out products already attached
  const availableProducts = allActiveProducts.filter(
    (p) => !attached.some((att) => att.product_id === p.id)
  );

  const handleAttach = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage(null);

    let targetArticleId = articleId;
    if (!targetArticleId) {
      if (onSaveDraftFirst) {
        const savedId = await onSaveDraftFirst();
        if (!savedId) {
          setActionMessage({
            type: "error",
            text: "उत्पाद जोड़ने से पहले कृपया लेख को ड्राफ्ट के रूप में सहेजें।",
          });
          return;
        }
        targetArticleId = savedId;
      } else {
        setActionMessage({
          type: "error",
          text: "Article ID missing. Please save draft first.",
        });
        return;
      }
    }

    if (!selectedProductId) {
      setActionMessage({ type: "error", text: "कृपया कैटलॉग से एक उत्पाद चुनें।" });
      return;
    }

    if (attached.length >= 3) {
      setActionMessage({
        type: "error",
        text: "इस लेख में अधिकतम 3 उत्पाद ही जोड़े जा सकते हैं।",
      });
      return;
    }

    setIsAttaching(true);

    try {
      const res = await attachProductToArticleAction(
        targetArticleId,
        selectedProductId,
        contextualNote.trim() || null,
        sortOrder
      );

      if (!res.success) {
        setActionMessage({ type: "error", text: res.error || "उत्पाद जोड़ने में विफल।" });
      } else {
        setActionMessage({
          type: "success",
          text: res.message || "उत्पाद सफलतापूर्वक जोड़ा गया।",
        });
        // Reset form
        setSelectedProductId("");
        setContextualNote("");
        setSortOrder(attached.length + 2);
        // Refresh attached list
        const updated: AttachedProductRelationItem[] =
          await getArticleAttachedProductsAction(targetArticleId);
        setAttached(
          updated.map((r) => ({
            id: r.id,
            article_id: r.article_id,
            product_id: r.product_id,
            sort_order: r.sort_order,
            contextual_note: r.contextual_note,
            product: r.affiliate_products,
          }))
        );
      }
    } catch (err: unknown) {
      console.error("[handleAttach] Error:", err);
      setActionMessage({ type: "error", text: "उत्पाद जोड़ने में त्रुटि हुई।" });
    } finally {
      setIsAttaching(false);
    }
  };

  const handleUpdateNote = async (productId: string, newNote: string, order: number) => {
    if (!articleId) return;

    try {
      const res = await updateArticleAffiliateRelationAction(
        articleId,
        productId,
        newNote,
        order
      );
      if (res.success) {
        setAttached((prev) =>
          prev.map((item) =>
            item.product_id === productId
              ? { ...item, contextual_note: newNote, sort_order: order }
              : item
          )
        );
      }
    } catch (err) {
      console.error("[handleUpdateNote] Error:", err);
    }
  };

  const handleRemove = async (productId: string) => {
    if (!articleId) return;

    try {
      const res = await removeProductFromArticleAction(articleId, productId);
      if (!res.success) {
        setActionMessage({ type: "error", text: res.error || "हटाने में विफलता।" });
      } else {
        setAttached((prev) => prev.filter((item) => item.product_id !== productId));
        setActionMessage({ type: "success", text: "उत्पाद लेख से हटाया गया।" });
      }
    } catch (err) {
      console.error("[handleRemove] Error:", err);
    }
  };

  return (
    <div className="bg-[#FDFBF7] rounded-3xl p-5 sm:p-8 border border-[#6B1724]/12 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#6B1724]/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17]" aria-hidden="true" />
          <h2 className="font-heading text-lg sm:text-xl font-bold text-[#6B1724]">
            D. सुझाई गई पुस्तकें एवं सामग्री (Affiliate Recommendations)
          </h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          {attached.length} / 3 संबद्ध
        </span>
      </div>

      <p className="text-xs sm:text-sm text-[#5A6065] leading-relaxed">
        इस लेख के अंत में पाठकों के स्वाध्याय हेतु अधिकतम <strong>3 प्रामाणिक पुस्तकें या साधन</strong> जोड़ें।
        प्रत्येक उत्पाद के लिए एक संक्षिप्त संपादकीय टिप्पणी (Contextual Note) अवश्य लिखें।
      </p>

      {/* Notifications */}
      {actionMessage && (
        <div
          role="alert"
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-2 ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-gray-400 hover:text-gray-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Attached Products List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B1724]">
          वर्तमान में जुड़े उत्पाद ({attached.length})
        </h3>

        {isLoading ? (
          <div className="p-4 text-center text-xs text-[#5A6065]">लोड हो रहा है...</div>
        ) : attached.length === 0 ? (
          <div className="p-4 text-center text-xs text-[#5A6065] bg-white rounded-xl border border-dashed border-gray-300">
            इस लेख से अभी कोई उत्पाद संबद्ध नहीं है।
          </div>
        ) : (
          attached.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-[#C85A17] font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-[#1F2326]">
                      {item.product?.name || "Product"}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1 pl-7">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-mono">
                      {item.product?.merchant || "amazon_in"}
                    </span>
                    {item.product?.category && (
                      <span className="text-[11px] text-[#5A6065] capitalize">
                        {item.product.category}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(item.product_id)}
                  className="text-xs text-red-600 hover:text-red-800 px-2 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                >
                  हटाएं (Remove)
                </button>
              </div>

              {/* Contextual Note Editor */}
              <div className="pl-7 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-[#5A6065] mb-1">
                    संपादकीय टिप्पणी (Contextual Note)
                  </label>
                  <input
                    type="text"
                    defaultValue={item.contextual_note || ""}
                    onBlur={(e) =>
                      handleUpdateNote(item.product_id, e.target.value, item.sort_order)
                    }
                    placeholder="e.g. इस लेख में वर्णित श्लोकों के विस्तृत अध्ययन हेतु"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C85A17]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5A6065] mb-1">
                    क्रम (Order)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={3}
                    defaultValue={item.sort_order}
                    onBlur={(e) =>
                      handleUpdateNote(
                        item.product_id,
                        item.contextual_note || "",
                        parseInt(e.target.value, 10) || 1
                      )
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C85A17]"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Attach New Product Form */}
      {attached.length < 3 ? (
        <form
          onSubmit={handleAttach}
          className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/70 space-y-3"
        >
          <h4 className="text-xs font-bold text-[#6B1724]">
            ＋ नया उत्पाद संबद्ध करें (Attach Product)
          </h4>

          {availableProducts.length === 0 ? (
            <p className="text-xs text-[#5A6065]">
              कैटलॉग में कोई अतिरिक्त सक्रिय उत्पाद उपलब्ध नहीं है। पहले कैटलॉग में नया उत्पाद जोड़ें।
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1F2326] mb-1">
                  उत्पाद चुनें (Select Product) <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C85A17]"
                >
                  <option value="">-- कैटलॉग से उत्पाद चुनें --</option>
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.merchant} - {p.category || "General"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <label className="block font-semibold text-[#1F2326] mb-1">
                    संपादकीय संदर्भ टिप्पणी (Contextual Note - Optional)
                  </label>
                  <input
                    type="text"
                    value={contextualNote}
                    onChange={(e) => setContextualNote(e.target.value)}
                    placeholder="e.g. इस अध्याय के गूढ़ रहस्य को समझने के लिए प्रामाणिक पुस्तक"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C85A17]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1F2326] mb-1">
                    क्रम (Sort Order)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={3}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C85A17]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isAttaching || !selectedProductId}
                  className="px-4 py-2 bg-[#C85A17] hover:bg-[#A8440B] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isAttaching ? "जोड़ रहे हैं..." : "उत्पाद संलग्न करें (Attach)"}
                </button>
              </div>
            </div>
          )}
        </form>
      ) : (
        <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-[#5A6065] text-center">
          ✓ इस लेख में अधिकतम 3 उत्पाद जुड़े हुए हैं। अतिरिक्त जोड़ने के लिए पहले किसी मौजूदा उत्पाद को हटाएं।
        </div>
      )}
    </div>
  );
}
