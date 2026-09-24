"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { AdminAffiliateProductItem } from "@/lib/data/supabase/admin";
import { toggleAffiliateProductActiveAction } from "@/app/admin/actions/affiliate";
import { AffiliateProductModal } from "./AffiliateProductModal";
import { AffiliateProductDeleteModal } from "./AffiliateProductDeleteModal";

interface AffiliateProductListClientProps {
  initialProducts: AdminAffiliateProductItem[];
}

export default function AffiliateProductListClient({
  initialProducts,
}: AffiliateProductListClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<AdminAffiliateProductItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminAffiliateProductItem | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<AdminAffiliateProductItem | null>(null);
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        categoryFilter === "all" ||
        item.category === categoryFilter ||
        (categoryFilter === "books" && item.category === "धार्मिक पुस्तकें") ||
        (categoryFilter === "धार्मिक पुस्तकें" && item.category === "books") ||
        (categoryFilter === "japa_mala" && item.category === "जप माला") ||
        (categoryFilter === "जप माला" && item.category === "japa_mala") ||
        (categoryFilter === "puja_essentials" && item.category === "पूजा सामग्री") ||
        (categoryFilter === "पूजा सामग्री" && item.category === "puja_essentials") ||
        (categoryFilter === "artwork" && item.category === "आध्यात्मिक कला") ||
        (categoryFilter === "आध्यात्मिक कला" && item.category === "artwork") ||
        (categoryFilter === "travel_guides" && item.category === "तीर्थ यात्रा") ||
        (categoryFilter === "तीर्थ यात्रा" && item.category === "travel_guides");

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.is_active) ||
        (statusFilter === "inactive" && !item.is_active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const handleToggleActive = async (product: AdminAffiliateProductItem) => {
    setIsTogglingId(product.id);
    setMessage(null);

    const nextState = !product.is_active;

    try {
      const res = await toggleAffiliateProductActiveAction(product.id, nextState);
      if (!res.success) {
        setMessage({ type: "error", text: res.error || "स्थिति अद्यतन करने में विफल।" });
      } else {
        setMessage({ type: "success", text: res.message || "स्थिति अद्यतन की गई।" });
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, is_active: nextState } : p))
        );
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("[handleToggleActive] Error:", err);
      setMessage({ type: "error", text: "स्थिति अद्यतन में त्रुटि हुई।" });
    } finally {
      setIsTogglingId(null);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: AdminAffiliateProductItem) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSuccess = (msg: string) => {
    setMessage({ type: "success", text: msg });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#6B1724]">
            अनुशंसित उत्पाद कैटलॉग (Affiliate Products)
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6065] mt-1 font-body">
            आध्यात्मिक पुस्तकों, जप माला और पूजन सामग्री का मास्टर कैटलॉग प्रबंधित करें।
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C85A17] hover:bg-[#A8440B] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17]"
        >
          <span className="text-base select-none leading-none">＋</span>
          <span>नया उत्पाद जोड़ें (Add Product)</span>
        </button>
      </div>

      {/* Notification Toast / Alert */}
      {message && (
        <div
          role="alert"
          className={`p-4 rounded-2xl text-sm flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-150 ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-start gap-2.5">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                message.type === "success" ? "bg-emerald-200 text-emerald-800" : "bg-red-200 text-red-800"
              }`}
            >
              {message.type === "success" ? "✓" : "!"}
            </span>
            <p className="font-medium text-xs sm:text-sm">{message.text}</p>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="p-1 text-gray-500 hover:text-gray-800 rounded-lg text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative grow max-w-md">
          <input
            type="text"
            placeholder="उत्पाद का नाम, मर्चेंट या श्रेणी खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A17] focus:border-transparent"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A17]"
          >
            <option value="all">सभी श्रेणियाँ (All Categories)</option>
            <option value="धार्मिक पुस्तकें">धार्मिक पुस्तकें (Books)</option>
            <option value="जप माला">जप माला (Japa Malas)</option>
            <option value="पूजा सामग्री">पूजन सामग्री (Puja Essentials)</option>
            <option value="ध्यान एवं साधना">ध्यान एवं साधना (Meditation)</option>
            <option value="आध्यात्मिक कला">आध्यात्मिक कला (Artwork)</option>
            <option value="तीर्थ यात्रा">तीर्थ यात्रा (Travel Guides)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A17]"
          >
            <option value="all">सभी स्थिति (All Status)</option>
            <option value="active">केवल सक्रिय (Active Only)</option>
            <option value="inactive">केवल निष्क्रिय (Inactive Only)</option>
          </select>
        </div>
      </div>

      {/* Product List Content: Desktop Table / Mobile Cards */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-[#C85A17] flex items-center justify-center mx-auto mb-3 text-2xl font-serif">
            ✦
          </div>
          <h3 className="text-base font-bold font-heading text-[#1F2326] mb-1">
            अभी कोई affiliate product जोड़ा नहीं गया है।
          </h3>
          <p className="text-xs text-[#5A6065] max-w-sm mx-auto mb-5 font-body">
            अनुशंसित पुस्तकों और जप सामग्री का कैटलॉग तैयार करने के लिए &ldquo;नया उत्पाद जोड़ें&rdquo; बटन पर क्लिक करें।
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C85A17] hover:bg-[#A8440B] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>＋ नया उत्पाद जोड़ें</span>
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs font-body divide-y divide-gray-200">
              <thead className="bg-[#FDFBF7] text-[#5A6065] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">उत्पाद (Product)</th>
                  <th className="px-4 py-3.5">मर्चेंट</th>
                  <th className="px-4 py-3.5">श्रेणी</th>
                  <th className="px-4 py-3.5 text-center">सक्रिय स्थिति</th>
                  <th className="px-4 py-3.5 text-center">क्रम (Order)</th>
                  <th className="px-4 py-3.5 text-center">संबद्ध लेख</th>
                  <th className="px-5 py-3.5 text-right">कार्रवाई (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#1F2326]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg border border-[rgba(200,154,60,0.25)] bg-[#FBF8F0] shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                          {product.image_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={product.image_url}
                              alt=""
                              className="w-full h-full object-contain p-0.5"
                            />
                          ) : (
                            <span className="text-xs select-none" aria-hidden="true">📖</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-[#1F2326] line-clamp-1">
                            {product.name}
                          </div>
                          {product.short_description && (
                            <div className="text-[11px] text-[#5A6065] line-clamp-1 mt-0.5">
                              {product.short_description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-gray-100 text-gray-700">
                        {product.merchant}
                      </span>
                    </td>

                    <td className="px-4 py-4 capitalize text-[#5A6065]">
                      {product.category || "—"}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(product)}
                        disabled={isTogglingId === product.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors border ${
                          product.is_active
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                        }`}
                        title="स्थिति बदलने के लिए क्लिक करें"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{product.is_active ? "सक्रिय (Active)" : "निष्क्रिय (Inactive)"}</span>
                      </button>
                    </td>

                    <td className="px-4 py-4 text-center font-mono font-medium">
                      {product.display_order}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {product.linkedArticlesCount ?? 0} लेख
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(product)}
                        className="px-2.5 py-1.5 text-xs font-medium text-[#C85A17] hover:text-[#A8440B] bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                      >
                        संपादित करें
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingProduct(product)}
                        className="px-2.5 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      >
                        हटाएं
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards (360px - 768px) */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3 font-body text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg border border-[rgba(200,154,60,0.25)] bg-[#FBF8F0] shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                      {product.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={product.image_url}
                          alt=""
                          className="w-full h-full object-contain p-0.5"
                        />
                      ) : (
                        <span className="text-sm select-none" aria-hidden="true">📖</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-[#1F2326] leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-gray-700">
                          {product.merchant}
                        </span>
                        {product.category && (
                          <span className="text-[11px] text-[#5A6065] capitalize">
                            {product.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(product)}
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      product.is_active
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-gray-100 text-gray-600 border-gray-300"
                    }`}
                  >
                    {product.is_active ? "सक्रिय" : "निष्क्रिय"}
                  </button>
                </div>

                {product.short_description && (
                  <p className="text-[#5A6065] text-[11px] line-clamp-2">
                    {product.short_description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[#5A6065]">
                  <span>संबद्ध लेख: {product.linkedArticlesCount ?? 0}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(product)}
                      className="px-2.5 py-1 text-xs font-medium text-[#C85A17] bg-amber-50 rounded-lg"
                    >
                      संपादित करें
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingProduct(product)}
                      className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg"
                    >
                      हटाएं
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add / Edit Modal */}
      <AffiliateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        productToEdit={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      <AffiliateProductDeleteModal
        isOpen={Boolean(deletingProduct)}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
