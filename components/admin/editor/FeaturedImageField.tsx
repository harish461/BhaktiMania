"use client";

import React, { useState, useRef, useId } from "react";
import { uploadFeaturedImageAction, deleteFeaturedImageAction } from "@/app/admin/actions/media";
import { extractStoragePathFromUrl, MEDIA_BUCKET_NAME } from "@/lib/storage/storage-path";

export interface FeaturedImageFieldProps {
  articleId?: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  onFeaturedImageUrlChange: (url: string) => void;
  onFeaturedImageAltChange: (alt: string) => void;
  onSaveDraftFirst?: () => Promise<string | null>;
  disabled?: boolean;
}

export function FeaturedImageField({
  articleId,
  featuredImageUrl,
  featuredImageAlt,
  onFeaturedImageUrlChange,
  onFeaturedImageAltChange,
  onSaveDraftFirst,
  disabled = false,
}: FeaturedImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const altInputId = useId();

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Upload lifecycle state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [advisoryMessage, setAdvisoryMessage] = useState<string | null>(null);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Client-side pre-validation
  const validateFileClientSide = (file: File): string | null => {
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed limit of 5 MB.`;
    }

    const name = file.name.toLowerCase();
    const ext = name.split(".").pop();
    const validExts = ["jpg", "jpeg", "png", "webp"];

    if (!ext || !validExts.includes(ext)) {
      if (ext === "svg") {
        return "SVG files are not permitted for security reasons. Please upload WebP, JPEG, or PNG.";
      }
      if (ext === "gif") {
        return "GIF animated files are not supported. Please upload WebP, JPEG, or PNG.";
      }
      return "Only WebP, JPG/JPEG, and PNG image files are supported.";
    }

    return null;
  };

  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setAdvisoryMessage(null);

    // 1. Client-side rapid validation
    const clientErr = validateFileClientSide(file);
    if (clientErr) {
      setErrorMessage(clientErr);
      return;
    }

    // 2. Check for articleId or trigger draft save
    let activeId = articleId;
    if (!activeId) {
      if (onSaveDraftFirst) {
        setUploadProgressMsg("Saving draft article first to acquire database UUID...");
        setIsUploading(true);
        try {
          const newId = await onSaveDraftFirst();
          if (!newId) {
            setErrorMessage("Please fill in the required article details (title, slug, category, description) and save draft before uploading an image.");
            setIsUploading(false);
            setUploadProgressMsg(null);
            return;
          }
          activeId = newId;
        } catch {
          setErrorMessage("Failed to auto-save draft. Please save draft manually before uploading.");
          setIsUploading(false);
          setUploadProgressMsg(null);
          return;
        }
      } else {
        setErrorMessage("Please save this article as a draft before uploading a featured image.");
        return;
      }
    }

    // 3. Initiate Server Action Upload
    setIsUploading(true);
    setUploadProgressMsg("Validating and uploading devotional media...");

    try {
      const formData = new FormData();
      formData.append("articleId", activeId);
      formData.append("file", file);

      const res = await uploadFeaturedImageAction(formData);

      if (!res.success || !res.imageUrl) {
        setErrorMessage(res.error || "Image upload failed. Please try again.");
      } else {
        onFeaturedImageUrlChange(res.imageUrl);
        setSuccessMessage("Featured artwork uploaded and updated successfully.");

        if (res.dimensionAdvisory) {
          setAdvisoryMessage(res.dimensionAdvisory);
        }

        if (res.cleanupWarning) {
          console.warn("[FeaturedImageField]", res.cleanupWarning);
        }
      }
    } catch (err: unknown) {
      console.error("[FeaturedImageField] Upload error:", err);
      setErrorMessage("Network error occurred during image upload.");
    } finally {
      setIsUploading(false);
      setUploadProgressMsg(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleTriggerFileInput = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  // Remove confirmation flow
  const handleConfirmDelete = async () => {
    if (!articleId) {
      // Just clear local state if unsaved
      onFeaturedImageUrlChange("");
      setIsDeleteModalOpen(false);
      return;
    }

    const storagePath = extractStoragePathFromUrl(featuredImageUrl, MEDIA_BUCKET_NAME);
    if (!storagePath) {
      // Not a Supabase storage path or already cleared
      onFeaturedImageUrlChange("");
      setIsDeleteModalOpen(false);
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await deleteFeaturedImageAction(articleId, storagePath);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to remove image from storage.");
      } else {
        onFeaturedImageUrlChange("");
        setSuccessMessage("Featured image removed successfully.");
      }
    } catch (err) {
      console.error("[FeaturedImageField] Delete error:", err);
      setErrorMessage("Network error while removing image.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const hasImage = Boolean(featuredImageUrl && featuredImageUrl.trim().length > 0);

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileInputChange}
        disabled={disabled || isUploading}
        className="hidden"
        aria-label="Upload featured image"
      />

      {/* Advisory & Recommendation Notice */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-[#6B1724]">
          Featured Devotional Image
        </span>
        <span className="text-[#5A6065] bg-[#F8F4EC] px-2.5 py-1 rounded-md border border-[#6B1724]/10">
          Recommended: 1200 × 630 or larger • Max 5 MB
        </span>
      </div>

      {/* Main Dropzone / Image Preview Area */}
      {hasImage ? (
        <div className="rounded-2xl border border-[#6B1724]/15 bg-white p-4 space-y-4 shadow-xs">
          {/* Image Display */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#F8F4EC] border border-[#6B1724]/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featuredImageUrl}
              alt={featuredImageAlt || "Article featured image"}
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white text-center">
                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mb-2" />
                <span className="text-xs font-medium">{uploadProgressMsg || "Uploading image..."}</span>
              </div>
            )}
          </div>

          {/* Action Buttons with min 44px touch targets */}
          <div className="flex items-center flex-wrap gap-3">
            <button
              type="button"
              onClick={handleTriggerFileInput}
              disabled={disabled || isUploading}
              className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#6B1724] text-xs font-semibold hover:bg-[#6B1724]/5 active:bg-[#6B1724]/10 transition-colors focus:ring-2 focus:ring-[#6B1724]/20 outline-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Replace Image</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={disabled || isUploading}
              className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl border border-red-200 bg-red-50/50 text-red-700 text-xs font-semibold hover:bg-red-100/60 active:bg-red-200/50 transition-colors focus:ring-2 focus:ring-red-500/20 outline-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Remove Image</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleTriggerFileInput}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleTriggerFileInput();
            }
          }}
          className={`min-h-[160px] p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#6B1724]/20 ${
            isDragging
              ? "border-[#6B1724] bg-[#6B1724]/5 scale-[0.99]"
              : "border-[#6B1724]/20 bg-[#FDFBF7] hover:bg-[#F8F4EC] hover:border-[#6B1724]/40"
          } ${disabled || isUploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-3 border-[#6B1724]/30 border-t-[#6B1724] rounded-full animate-spin mb-3" />
              <span className="text-xs font-medium text-[#6B1724]">{uploadProgressMsg || "Uploading image..."}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-white border border-[#6B1724]/15 flex items-center justify-center text-[#6B1724] shadow-xs">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-[#6B1724]">Click to upload</span> or drag and drop artwork
              </div>
              <p className="text-[11px] text-[#5A6065]">
                Supports WebP, JPEG, PNG (up to 5 MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Alt Text Input Field */}
      <div>
        <label htmlFor={altInputId} className="block text-xs font-semibold text-[#5A6065] mb-1">
          Featured Image Alt Text
        </label>
        <input
          id={altInputId}
          type="text"
          value={featuredImageAlt}
          onChange={(e) => onFeaturedImageAltChange(e.target.value)}
          placeholder="Descriptive text for accessibility and screen readers..."
          disabled={disabled || isUploading}
          className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-xs focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all placeholder:text-[#5A6065]/40 disabled:opacity-50"
        />
        {!featuredImageAlt.trim() && hasImage && (
          <p className="text-[11px] text-amber-700 mt-1 font-medium flex items-center gap-1">
            <span>⚠</span> Alt text is recommended for accessibility.
          </p>
        )}
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
          <span className="font-bold">Error:</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in duration-200">
          <span className="font-bold">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {advisoryMessage && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2 animate-in fade-in duration-200">
          <span className="font-bold">ℹ</span>
          <span>{advisoryMessage}</span>
        </div>
      )}

      {/* Accessible Confirmation Modal for Image Deletion */}
      {isDeleteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-image-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#6B1724]/15 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h4 id="delete-image-modal-title" className="text-base font-bold text-[#6B1724]">
              Remove Featured Image?
            </h4>
            <p className="text-xs text-[#5A6065] leading-relaxed">
              Are you sure you want to remove this featured image? It will be deleted from storage and cleared from this article.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl border border-[#6B1724]/20 text-[#5A6065] text-xs font-semibold hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-[#6B1724]/20 outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 active:bg-red-800 transition-colors focus:ring-2 focus:ring-red-500/20 outline-none flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? "Removing..." : "Confirm Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
