"use client";

import React, { useState, useRef, useId } from "react";
import {
  uploadFeaturedImageAction,
  deleteFeaturedImageAction,
  generateAiImagePreviewAction,
  applyAiGeneratedImageAction,
} from "@/app/admin/actions/media";
import { extractStoragePathFromUrl, MEDIA_BUCKET_NAME } from "@/lib/storage/storage-path";

export interface FeaturedImageFieldProps {
  articleId?: string;
  title?: string;
  categoryName?: string;
  categorySlug?: string;
  description?: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  onFeaturedImageUrlChange: (url: string) => void;
  onFeaturedImageAltChange: (alt: string) => void;
  onSaveDraftFirst?: () => Promise<string | null>;
  disabled?: boolean;
}

interface AiCandidate {
  imageUrl: string;
  prompt: string;
  altText: string;
  seed: number;
}

export function FeaturedImageField({
  articleId,
  title = "",
  categoryName = "",
  categorySlug = "",
  description = "",
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

  // AI Generation State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSavingAiImage, setIsSavingAiImage] = useState(false);
  const [aiCandidate, setAiCandidate] = useState<AiCandidate | null>(null);
  const [showPromptDetails, setShowPromptDetails] = useState(false);

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
            setErrorMessage("Please fill in the required article details and save draft before uploading an image.");
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

  // AI Preview Generation
  const handleGenerateAiImage = async (overrideSeed?: number) => {
    if (!title || !title.trim()) {
      setErrorMessage("कृपया AI चित्र बनाने से पहले लेख का शीर्षक (Title) दर्ज करें।");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setAdvisoryMessage(null);
    setIsGeneratingAi(true);

    try {
      const res = await generateAiImagePreviewAction({
        title,
        category: categoryName,
        categorySlug,
        description,
        seed: overrideSeed,
      });

      if (!res.success || !res.candidate) {
        setErrorMessage(res.error || "चित्र निर्माण में त्रुटि हुई। कृपया पुनः प्रयास करें।");
      } else {
        setAiCandidate(res.candidate);
        setSuccessMessage("AI द्वारा भक्तिमय चित्र तैयार कर लिया गया है। कृपया पूर्वावलोकन (Preview) देखें।");
      }
    } catch (err) {
      console.error("[FeaturedImageField] AI Generation Error:", err);
      setErrorMessage("AI सेवा से संपर्क करने में समस्या आई। कृपया पुनः प्रयास करें।");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Commit Candidate AI Image to Supabase Storage and activate
  const handleUseAiImage = async () => {
    if (!aiCandidate) return;

    let activeId = articleId;
    if (!activeId) {
      if (onSaveDraftFirst) {
        setIsSavingAiImage(true);
        try {
          const newId = await onSaveDraftFirst();
          if (!newId) {
            setErrorMessage("चित्र सुरक्षित करने से पहले कृपया आवश्यक लेख विवरण भरें और ड्राफ्ट सहेजें।");
            setIsSavingAiImage(false);
            return;
          }
          activeId = newId;
        } catch {
          setErrorMessage("ड्राफ्ट स्वतः सहेजने में विफल। कृपया पहले ड्राफ्ट सहेजें।");
          setIsSavingAiImage(false);
          return;
        }
      } else {
        setErrorMessage("चित्र सुरक्षित करने से पहले इस लेख को सहेजना आवश्यक है।");
        return;
      }
    }

    setIsSavingAiImage(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const chosenAltText = featuredImageAlt.trim() ? featuredImageAlt : aiCandidate.altText;
      const res = await applyAiGeneratedImageAction({
        articleId: activeId,
        imageUrl: aiCandidate.imageUrl,
        altText: chosenAltText,
      });

      if (!res.success || !res.imageUrl) {
        setErrorMessage(res.error || "चित्र सुरक्षित करने में त्रुटि हुई।");
      } else {
        onFeaturedImageUrlChange(res.imageUrl);
        if (!featuredImageAlt.trim()) {
          onFeaturedImageAltChange(chosenAltText);
        }
        setAiCandidate(null);
        setSuccessMessage("चित्र सफलतापूर्वक Supabase Storage में सुरक्षित और लेख पर सक्रिय कर दिया गया है।");
      }
    } catch (err) {
      console.error("[FeaturedImageField] Error saving AI image:", err);
      setErrorMessage("चित्र सुरक्षित करते समय नेटवर्क त्रुटि हुई।");
    } finally {
      setIsSavingAiImage(false);
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
    if (!disabled && !isUploading && !isGeneratingAi) {
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

    if (disabled || isUploading || isGeneratingAi) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleTriggerFileInput = () => {
    if (disabled || isUploading || isGeneratingAi) return;
    fileInputRef.current?.click();
  };

  // Remove confirmation flow
  const handleConfirmDelete = async () => {
    if (!articleId) {
      onFeaturedImageUrlChange("");
      setIsDeleteModalOpen(false);
      return;
    }

    const storagePath = extractStoragePathFromUrl(featuredImageUrl, MEDIA_BUCKET_NAME);
    if (!storagePath) {
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
        disabled={disabled || isUploading || isGeneratingAi}
        className="hidden"
        aria-label="Upload featured image"
      />

      {/* Advisory & Recommendation Notice */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-[#6B1724]">
          Featured Devotional Image (विशेष चित्र)
        </span>
        <span className="text-[#5A6065] bg-[#F8F4EC] px-2.5 py-1 rounded-md border border-[#6B1724]/10">
          Target: 1200 × 630 (16:9) • Max 5 MB
        </span>
      </div>

      {/* 1. AI Generated Candidate Preview Modal / Banner (Review First Workflow) */}
      {aiCandidate && (
        <div className="rounded-2xl border-2 border-[#D97706]/40 bg-[#FFFDF9] p-4.5 space-y-4 shadow-md transition-all animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#D97706]/20">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#D97706] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                AI Generated Artwork — Preview (पूर्वावलोकन)
              </span>
            </div>
            <span className="text-[11px] font-medium text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
              Not yet saved to article
            </span>
          </div>

          {/* 16:9 Image Preview Frame */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#F8F4EC] border border-[#D97706]/30 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aiCandidate.imageUrl}
              alt={aiCandidate.altText}
              className="w-full h-full object-cover"
            />
            {isSavingAiImage && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white text-center">
                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mb-2" />
                <span className="text-xs font-medium">Storing to Supabase Storage & activating...</span>
              </div>
            )}
          </div>

          {/* Action Buttons: Use This Image / Regenerate / Discard */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <div className="flex items-center flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleUseAiImage}
                disabled={disabled || isSavingAiImage || isGeneratingAi}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#6B1724] hover:bg-[#52111C] active:bg-[#3D0A13] text-white text-xs font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>{isSavingAiImage ? "Saving Artwork..." : "Use This Image (चित्र उपयोग करें)"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateAiImage(Math.floor(Math.random() * 10000000))}
                disabled={disabled || isSavingAiImage || isGeneratingAi}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#D97706]/40 bg-white hover:bg-amber-50 text-[#B45309] text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <svg className={`w-4 h-4 ${isGeneratingAi ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isGeneratingAi ? "Regenerating..." : "Regenerate (नया चित्र बनाएं)"}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAiCandidate(null)}
              disabled={disabled || isSavingAiImage}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-gray-500 hover:text-gray-800 text-xs font-medium transition-colors hover:bg-gray-100 cursor-pointer"
            >
              Cancel / Discard
            </button>
          </div>

          {/* Collapsible Prompt Inspector */}
          <div className="pt-2 border-t border-[#D97706]/15">
            <button
              type="button"
              onClick={() => setShowPromptDetails((prev) => !prev)}
              className="text-[11px] text-[#B45309] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>{showPromptDetails ? "Hide Prompt Details ▲" : "View AI Prompt Details ▼"}</span>
            </button>
            {showPromptDetails && (
              <div className="mt-2 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-[11px] text-[#5A6065] font-mono leading-relaxed break-words">
                <strong className="text-[#873600]">Generated Prompt:</strong> {aiCandidate.prompt}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Main Current Image Display OR Empty Dropzone */}
      {hasImage ? (
        <div className="rounded-2xl border border-[#6B1724]/15 bg-white p-4 space-y-4 shadow-xs">
          {/* Active Image Display */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#F8F4EC] border border-[#6B1724]/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featuredImageUrl}
              alt={featuredImageAlt || title || "Article featured image"}
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white text-center">
                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mb-2" />
                <span className="text-xs font-medium">{uploadProgressMsg || "Uploading image..."}</span>
              </div>
            )}
          </div>

          {/* Action Buttons for Existing Image */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* AI Image Generation / Replacement */}
            <button
              type="button"
              onClick={() => handleGenerateAiImage()}
              disabled={disabled || isUploading || isGeneratingAi}
              className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#D97706]/40 bg-[#FFFDF9] hover:bg-[#FEF3C7] text-[#92400E] text-xs font-semibold transition-all focus:ring-2 focus:ring-[#D97706]/30 outline-none flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <svg className={`w-4 h-4 text-[#D97706] ${isGeneratingAi ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span>{isGeneratingAi ? "Generating AI Image..." : "Replace with AI Image"}</span>
            </button>

            {/* Manual File Replacement */}
            <button
              type="button"
              onClick={handleTriggerFileInput}
              disabled={disabled || isUploading || isGeneratingAi}
              className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#6B1724] text-xs font-semibold hover:bg-[#6B1724]/5 active:bg-[#6B1724]/10 transition-colors focus:ring-2 focus:ring-[#6B1724]/20 outline-none flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Upload New Image</span>
            </button>

            {/* Remove */}
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={disabled || isUploading || isGeneratingAi}
              className="min-h-[44px] px-4 py-2.5 rounded-xl border border-red-200 bg-red-50/50 text-red-700 text-xs font-semibold hover:bg-red-100/60 active:bg-red-200/50 transition-colors focus:ring-2 focus:ring-red-500/20 outline-none flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty State: AI Generation Hero Card + Drag/Drop Upload */
        <div className="space-y-3">
          {/* Prominent AI Generator Action Card */}
          <div className="p-4 rounded-2xl border border-[#D97706]/30 bg-gradient-to-br from-[#FFFDF9] via-[#FEFBF2] to-[#FDF6E3] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[#B45309] font-bold text-xs">
                <span>✦</span>
                <span>Topic-Aware AI Devotional Artwork</span>
              </div>
              <p className="text-[11px] text-[#5A6065] leading-relaxed">
                Creates an Indian spiritual editorial image automatically from article title and devotional category.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleGenerateAiImage()}
              disabled={disabled || isGeneratingAi || isUploading}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B45309] to-[#873600] hover:from-[#92400E] hover:to-[#6E2C00] text-white text-xs font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
            >
              <svg className={`w-4 h-4 text-amber-200 ${isGeneratingAi ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{isGeneratingAi ? "Generating Artwork..." : "Generate AI Image"}</span>
            </button>
          </div>

          {/* Drag & Drop Manual Upload Area */}
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
            className={`min-h-[140px] p-5 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#6B1724]/20 ${
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
              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-white border border-[#6B1724]/15 flex items-center justify-center text-[#6B1724] shadow-xs">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-[#6B1724]">Upload custom file</span> or drag & drop here
                </div>
                <p className="text-[11px] text-[#5A6065]">
                  Supports WebP, JPEG, PNG (recommended 1200 × 630)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alt Text Input Field */}
      <div>
        <label htmlFor={altInputId} className="block text-xs font-semibold text-[#5A6065] mb-1">
          Featured Image Alt Text (विवरणात्मक टेक्स्ट)
        </label>
        <input
          id={altInputId}
          type="text"
          value={featuredImageAlt}
          onChange={(e) => onFeaturedImageAltChange(e.target.value)}
          placeholder="जैसे: राधा-कृष्ण भक्ति में प्रेम और समर्पण..."
          disabled={disabled || isUploading || isSavingAiImage}
          className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-xs focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all placeholder:text-[#5A6065]/40 disabled:opacity-50"
        />
        {!featuredImageAlt.trim() && hasImage && (
          <p className="text-[11px] text-amber-700 mt-1 font-medium flex items-center gap-1">
            <span>⚠</span> Alt text is recommended for accessibility and SEO.
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
                className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl border border-[#6B1724]/20 text-[#5A6065] text-xs font-semibold hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-[#6B1724]/20 outline-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 active:bg-red-800 transition-colors focus:ring-2 focus:ring-red-500/20 outline-none flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
