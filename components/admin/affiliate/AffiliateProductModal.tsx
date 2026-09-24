"use client";

import React, { useState, useRef } from "react";
import type { AdminAffiliateProductItem } from "@/lib/data/supabase/admin";
import {
  createAffiliateProductAction,
  updateAffiliateProductAction,
  uploadAffiliateProductImageAction,
  deleteAffiliateProductImageAction,
} from "@/app/admin/actions/affiliate";
import {
  validateAffiliateUrl,
  validateImageUrl,
} from "@/lib/utils/affiliate-validation";

interface AffiliateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  productToEdit?: AdminAffiliateProductItem | null;
}

interface AffiliateProductFormProps {
  productToEdit?: AdminAffiliateProductItem | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const ALLOWED_MIME_TYPES = ["image/webp", "image/jpeg", "image/png"];
const ALLOWED_EXTENSIONS = ["webp", "jpg", "jpeg", "png"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function validateClientImageFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `फ़ाइल का आकार (${sizeMb} MB) 5 MB की सीमा से अधिक है। कृपया 5 MB से छोटी छवि चुनें।`,
    };
  }

  const name = file.name.trim().toLowerCase();
  const ext = name.split(".").pop() || "";

  if (ext === "svg" || file.type.includes("svg")) {
    return {
      valid: false,
      error: "SVG फ़ाइलें सुरक्षा कारणों से अस्वीकृत हैं। कृपया WebP, JPEG या PNG चुनें।",
    };
  }

  if (ext === "gif" || file.type.includes("gif")) {
    return {
      valid: false,
      error: "GIF फ़ाइलें समर्थित नहीं हैं। कृपया WebP, JPEG या PNG चुनें।",
    };
  }

  if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "केवल WebP, JPEG/JPG और PNG छवि प्रारूप समर्थित हैं।",
    };
  }

  return { valid: true };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function AffiliateProductForm({
  productToEdit,
  onClose,
  onSuccess,
}: AffiliateProductFormProps) {
  const isEdit = Boolean(productToEdit);

  const [name, setName] = useState(productToEdit?.name || "");
  const [merchant, setMerchant] = useState(productToEdit?.merchant || "amazon_in");
  const [affiliateUrl, setAffiliateUrl] = useState(productToEdit?.affiliate_url || "");
  const [imageUrl, setImageUrl] = useState(productToEdit?.image_url || "");
  const [shortDescription, setShortDescription] = useState(
    productToEdit?.short_description || ""
  );
  const [category, setCategory] = useState(
    productToEdit?.category || "धार्मिक पुस्तकें"
  );
  const [displayOrder, setDisplayOrder] = useState(productToEdit?.display_order ?? 0);
  const [isActive, setIsActive] = useState(productToEdit?.is_active ?? true);

  // Image Management State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(productToEdit?.image_url || null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    size: string;
    dimensions?: { width: number; height: number };
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<{
    type: "success" | "info" | "error";
    text: string;
  } | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(
    Boolean(productToEdit?.image_url && !productToEdit.image_url.includes("affiliate-products"))
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelected = async (file: File) => {
    setUploadNotice(null);
    setError(null);

    // 1. Client-side validation
    const check = validateClientImageFile(file);
    if (!check.valid) {
      setUploadNotice({ type: "error", text: check.error || "अमान्य फ़ाइल।" });
      return;
    }

    // 2. Read dimensions & set preview
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setFileDetails({
        name: file.name,
        size: formatFileSize(file.size),
        dimensions: { width: img.naturalWidth, height: img.naturalHeight },
      });
    };
    img.src = objectUrl;

    // If EDITING existing product with an active DB ID:
    if (isEdit && productToEdit?.id) {
      setIsUploading(true);
      setPreviewUrl(objectUrl);
      try {
        const formData = new FormData();
        formData.append("productId", productToEdit.id);
        formData.append("file", file);

        const res = await uploadAffiliateProductImageAction(formData);
        if (!res.success || !res.imageUrl) {
          setUploadNotice({ type: "error", text: res.error || "छवि अपलोड विफल रही।" });
          setPreviewUrl(imageUrl || null);
        } else {
          setImageUrl(res.imageUrl);
          setPreviewUrl(res.imageUrl);
          setSelectedFile(null);
          setUploadNotice({ type: "success", text: "Image uploaded (छवि अपलोड हो गई)" });
          if (res.dimensions) {
            setFileDetails({
              name: file.name,
              size: formatFileSize(file.size),
              dimensions: res.dimensions,
            });
          }
        }
      } catch (err: unknown) {
        console.error("[AffiliateProductModal] Upload error:", err);
        setUploadNotice({ type: "error", text: "छवि अपलोड में त्रुटि हुई।" });
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } else {
      // NEW PRODUCT creation flow: stage file for upload upon record creation
      setSelectedFile(file);
      setPreviewUrl(objectUrl);
      setUploadNotice({ type: "info", text: "छवि चुनी गई। उत्पाद जोड़ते समय अपलोड होगी।" });
    }
  };

  const handleRemoveImage = async () => {
    setUploadNotice(null);
    setError(null);

    // Staged file for new product
    if (selectedFile) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setFileDetails(null);
      setUploadNotice({ type: "info", text: "छवि चयन हटाया गया।" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Existing product in DB
    if (isEdit && productToEdit?.id && (imageUrl || productToEdit.image_url)) {
      setIsUploading(true);
      try {
        const res = await deleteAffiliateProductImageAction(productToEdit.id);
        if (!res.success) {
          setUploadNotice({ type: "error", text: res.error || "छवि हटाने में त्रुटि हुई।" });
        } else {
          setImageUrl("");
          setPreviewUrl(null);
          setFileDetails(null);
          setUploadNotice({ type: "success", text: "छवि हटा दी गई।" });
        }
      } catch (err) {
        console.error("[AffiliateProductModal] Remove error:", err);
        setUploadNotice({ type: "error", text: "छवि हटाने में त्रुटि हुई।" });
      } finally {
        setIsUploading(false);
      }
    } else {
      setImageUrl("");
      setPreviewUrl(null);
      setFileDetails(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Product name is required.");
      return;
    }

    const trimmedMerchant = merchant.trim();
    if (!trimmedMerchant) {
      setError("Merchant name is required.");
      return;
    }

    const urlValidation = validateAffiliateUrl(affiliateUrl);
    if (!urlValidation.isValid) {
      setError(urlValidation.error || "Invalid affiliate URL.");
      return;
    }

    const imgValidation = validateImageUrl(imageUrl);
    if (!imgValidation.isValid) {
      setError(imgValidation.error || "Invalid image URL.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit && productToEdit) {
        const res = await updateAffiliateProductAction({
          id: productToEdit.id,
          name: trimmedName,
          merchant: trimmedMerchant,
          affiliate_url: affiliateUrl.trim(),
          image_url: imageUrl.trim() || null,
          short_description: shortDescription.trim() || null,
          category: category.trim() || null,
          display_order: displayOrder,
          is_active: isActive,
        });

        if (!res.success) {
          setError(res.error || "Failed to update product.");
          setIsSubmitting(false);
          return;
        }

        onSuccess(res.message || "Product updated successfully.");
        onClose();
      } else {
        // Create new product first to obtain UUID
        const res = await createAffiliateProductAction({
          name: trimmedName,
          merchant: trimmedMerchant,
          affiliate_url: affiliateUrl.trim(),
          image_url: selectedFile ? null : (imageUrl.trim() || null),
          short_description: shortDescription.trim() || null,
          category: category.trim() || null,
          display_order: displayOrder,
          is_active: isActive,
        });

        if (!res.success || !res.productId) {
          setError(res.error || "Failed to create product.");
          setIsSubmitting(false);
          return;
        }

        // If a file was staged for this new product, upload it now
        if (selectedFile) {
          setIsUploading(true);
          const formData = new FormData();
          formData.append("productId", res.productId);
          formData.append("file", selectedFile);

          const uploadRes = await uploadAffiliateProductImageAction(formData);
          if (!uploadRes.success) {
            setError(`उत्पाद तैयार हो गया, परंतु छवि अपलोड विफल रही: ${uploadRes.error}`);
            setIsSubmitting(false);
            setIsUploading(false);
            return;
          }
        }

        onSuccess("उत्पाद सफलतापूर्वक जोड़ा गया। (Product added successfully)");
        onClose();
      }
    } catch (err: unknown) {
      console.error("[AffiliateProductModal] Submit error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white border border-[#6B1724]/15 rounded-2xl shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#FDFBF7]">
        <div>
          <h2 id="modal-title" className="text-lg font-bold font-heading text-[#6B1724]">
            {isEdit ? "उत्पाद संपादित करें (Edit Product)" : "नया उत्पाद जोड़ें (Add Product)"}
          </h2>
          <p className="text-xs text-[#5A6065]">
            {isEdit
              ? "मास्टर कैटलॉग में उत्पाद विवरण अद्यतन करें।"
              : "मास्टर कैटलॉग में नया अनुशंसित उत्पाद जोड़ें।"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm font-body max-h-[85vh] overflow-y-auto">
        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
          >
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#1F2326] mb-1">
            उत्पाद का नाम (Product Name) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. श्रीमद्भगवद्गीता (साधक-संजीवनी - गीताप्रेस)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A17] focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F2326] mb-1">
              मर्चेंट (Merchant) <span className="text-red-500">*</span>
            </label>
            <select
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A17] focus:border-transparent bg-white"
            >
              <option value="amazon_in">Amazon India (amazon.in)</option>
              <option value="gitapress">Gita Press Direct</option>
              <option value="other">Other / Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2326] mb-1">
              श्रेणी (Category)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A17] focus:border-transparent bg-white"
            >
              <option value="धार्मिक पुस्तकें">धार्मिक पुस्तकें (Books)</option>
              <option value="जप माला">जप माला (Japa Malas)</option>
              <option value="पूजा सामग्री">पूजा सामग्री (Puja Essentials)</option>
              <option value="ध्यान एवं साधना">ध्यान एवं साधना (Meditation & Sadhana)</option>
              <option value="आध्यात्मिक कला">आध्यात्मिक कला (Spiritual Art)</option>
              <option value="तीर्थ यात्रा">तीर्थ यात्रा (Travel & Pilgrimage)</option>
              <option value="books">धार्मिक पुस्तकें (books - legacy)</option>
              <option value="japa_mala">जप माला (japa_mala - legacy)</option>
              <option value="puja_essentials">पूजन सामग्री (puja_essentials - legacy)</option>
              <option value="artwork">धार्मिक चित्र (artwork - legacy)</option>
              <option value="travel_guides">तीर्थ यात्रा (travel_guides - legacy)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1F2326] mb-1">
            एफिलिएट लिंक (Affiliate URL) <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            required
            value={affiliateUrl}
            onChange={(e) => setAffiliateUrl(e.target.value)}
            placeholder="https://www.amazon.in/dp/...?tag=bhaktimania-21"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A17] focus:border-transparent font-mono text-xs"
          />
          <p className="text-[11px] text-[#5A6065] mt-1">
            प्रत्यक्ष Amazon लिंक या amzn.to लिंक दें। आंतरिक रिडायरेक्ट या URL Cloaking प्रतिबंधित है।
          </p>
        </div>

        {/* Product Image Management Section */}
        <div className="space-y-2 pt-1 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-[#1F2326]">
              उत्पाद छवि (Product Image)
            </label>
            <button
              type="button"
              onClick={() => setShowManualUrl(!showManualUrl)}
              className="text-[11px] text-[#C85A17] hover:underline cursor-pointer"
            >
              {showManualUrl ? "छवि अपलोड मोड" : "या सीधा URL दर्ज करें"}
            </button>
          </div>

          <input
            id="affiliate-product-file-input"
            ref={fileInputRef}
            type="file"
            accept="image/webp,image/jpeg,image/png"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelected(f);
            }}
            className="hidden"
          />

          {/* Active / Preview State */}
          {previewUrl ? (
            <div className="p-3.5 rounded-xl border border-[rgba(200,154,60,0.25)] bg-[#FDFBF7] space-y-3">
              <div className="relative w-full max-h-36 py-2 bg-[#FBF8F0] rounded-lg border border-[rgba(200,154,60,0.15)] flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={name || "उत्पाद पूर्वावलोकन"}
                  className="max-h-32 object-contain rounded-md shadow-2xs"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs font-medium">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mb-1.5" />
                    <span>Uploading…</span>
                  </div>
                )}
              </div>

              {/* File metadata tags if available */}
              {fileDetails && (
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5A6065]">
                  <span className="font-medium text-[#1F2326] truncate max-w-[200px]" title={fileDetails.name}>
                    📄 {fileDetails.name}
                  </span>
                  {fileDetails.dimensions && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200/60 font-mono text-[10px]">
                      {fileDetails.dimensions.width} × {fileDetails.dimensions.height} px
                    </span>
                  )}
                  {fileDetails.size && (
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-[10px]">
                      {fileDetails.size}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons: Replace / Remove */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isSubmitting}
                  className="px-3 py-1.5 rounded-lg border border-[#C85A17]/30 text-[#C85A17] hover:bg-amber-50 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  🔄 Replace Image (छवि बदलें)
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploading || isSubmitting}
                  className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  🗑 Remove Image (छवि हटाएं)
                </button>
              </div>
            </div>
          ) : (
            /* Empty State: Upload Button & Drag/Drop Area */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isUploading) setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                if (isUploading) return;
                const f = e.dataTransfer.files?.[0];
                if (f) handleFileSelected(f);
              }}
              onClick={() => {
                if (!isUploading) fileInputRef.current?.click();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={`p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer select-none ${
                isDragging
                  ? "border-[#C85A17] bg-amber-50/50"
                  : "border-gray-300 bg-[#FDFBF7] hover:bg-[#F8F4EC] hover:border-[#C85A17]/50"
              } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center py-2 text-[#C85A17]">
                  <span className="w-6 h-6 border-2 border-[#C85A17]/30 border-t-[#C85A17] rounded-full animate-spin mb-2" />
                  <span className="text-xs font-medium">Uploading…</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-1.5 py-1">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#C85A17]/20 flex items-center justify-center text-[#C85A17] shadow-2xs text-base">
                    📁
                  </div>
                  <div className="text-xs font-semibold text-[#1F2326]">
                    Upload Image (छवि अपलोड करें)
                  </div>
                  <p className="text-[11px] text-[#5A6065] max-w-sm">
                    Upload an image you have the right to use. Recommended: WebP or JPEG.
                  </p>
                  <span className="text-[10px] text-gray-400">
                    WebP, JPEG, PNG • अधिकतम 5 MB
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Status / Alert Messages */}
          {uploadNotice && (
            <div
              role="status"
              className={`p-2.5 rounded-lg text-xs font-medium flex items-center justify-between gap-2 ${
                uploadNotice.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : uploadNotice.type === "error"
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              <span>{uploadNotice.text}</span>
              <button
                type="button"
                onClick={() => setUploadNotice(null)}
                className="text-gray-400 hover:text-gray-700 text-xs p-0.5"
              >
                ✕
              </button>
            </div>
          )}

          {/* Collapsible Manual URL Option */}
          {showManualUrl && (
            <div className="pt-2 animate-in fade-in duration-150">
              <label className="block text-[11px] font-semibold text-[#5A6065] mb-1">
                सीधा इमेज CDN URL (Manual Image URL — Optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  const val = e.target.value;
                  setImageUrl(val);
                  setPreviewUrl(val.trim() || null);
                }}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C85A17]"
              />
              <p className="text-[10px] text-[#5A6065] mt-1">
                अधिकृत सीधा CDN लिंक या SiteStripe लिंक।
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1F2326] mb-1">
            संक्षिप्त विवरण (Short Description - Optional)
          </label>
          <textarea
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="गीताप्रेस गोरखपुर द्वारा प्रकाशित प्रामाणिक संस्करण, सरल हिंदी टीका सहित।"
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A17] focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#1F2326] mb-1">
              प्रदर्शन क्रम (Display Order)
            </label>
            <input
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A17]"
            />
          </div>

          <div className="flex items-center gap-2 sm:mt-5">
            <input
              type="checkbox"
              id="is-active-toggle"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-[#C85A17] rounded border-gray-300 focus:ring-[#C85A17]"
            />
            <label htmlFor="is-active-toggle" className="text-xs font-medium text-[#1F2326] cursor-pointer">
              सक्रिय रखें (Active Status)
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting || isUploading}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            रद्द करें (Cancel)
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#C85A17] hover:bg-[#A8440B] rounded-xl transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
          >
            {isUploading
              ? "अपलोड जारी है..."
              : isSubmitting
              ? "सहेज रहे हैं..."
              : isEdit
              ? "अद्यतन करें (Save Changes)"
              : "उत्पाद जोड़ें (Add Product)"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function AffiliateProductModal({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
}: AffiliateProductModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
    >
      <AffiliateProductForm
        key={productToEdit?.id ?? "new"}
        productToEdit={productToEdit}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </div>
  );
}
