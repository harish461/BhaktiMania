"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminAuthorListItem } from "@/lib/data/supabase/admin";
import {
  createAuthorAction,
  updateAuthorAction,
  checkAuthorSlugAvailabilityAction,
} from "@/app/admin/actions/authors";
import { validateAvatarUrl } from "@/lib/validation/author";

interface AuthorFormProps {
  initialData?: AdminAuthorListItem | null;
  isEditMode?: boolean;
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function AuthorForm({
  initialData,
  isEditMode = false,
}: AuthorFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Form Field States
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEditMode);
  const [role, setRole] = useState(initialData?.role || "संपादकीय मंडल");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || "");
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  // Slug remote validation state
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [remoteCheck, setRemoteCheck] = useState<{
    slug: string;
    status: "available" | "taken";
    error?: string;
  } | null>(null);

  // Derived slug status
  const cleanSlug = slug.trim().toLowerCase();
  const isInvalidSlugFormat = Boolean(cleanSlug && !SLUG_REGEX.test(cleanSlug));

  const slugStatus: "idle" | "checking" | "available" | "taken" | "invalid" =
    !cleanSlug
      ? "idle"
      : isInvalidSlugFormat
      ? "invalid"
      : isEditMode && cleanSlug === initialData?.slug
      ? "available"
      : isCheckingSlug || (remoteCheck && remoteCheck.slug !== cleanSlug)
      ? "checking"
      : remoteCheck?.slug === cleanSlug
      ? remoteCheck.status
      : "checking";

  const slugError =
    isInvalidSlugFormat
      ? "Must contain only lowercase letters, numbers, and hyphens (e.g. 'editorial-team')."
      : remoteCheck?.status === "taken"
      ? remoteCheck.error || `Slug "${cleanSlug}" is already taken.`
      : null;

  // Avatar URL validation state
  const avatarValidation = useMemo(() => validateAvatarUrl(avatarUrl), [avatarUrl]);

  // Submission & message
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Unsaved changes tracking
  const initialSnapshot = useMemo(() => {
    return JSON.stringify({
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      role: initialData?.role || "संपादकीय मंडल",
      bio: initialData?.bio || "",
      avatarUrl: initialData?.avatar_url || "",
      isActive: initialData?.is_active ?? true,
    });
  }, [initialData]);

  const currentSnapshot = useMemo(() => {
    return JSON.stringify({
      name,
      slug,
      role,
      bio,
      avatarUrl,
      isActive,
    });
  }, [name, slug, role, bio, avatarUrl, isActive]);

  const isDirty = initialSnapshot !== currentSnapshot;

  // Auto-slug generator from name
  const handleNameChange = (newName: string) => {
    setName(newName);
    if (!isSlugManuallyEdited) {
      const generated = newName
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(newSlug.toLowerCase().replace(/\s+/g, "-"));
  };

  // Debounced remote slug uniqueness check
  useEffect(() => {
    if (!cleanSlug || isInvalidSlugFormat) return;
    if (isEditMode && cleanSlug === initialData?.slug) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsCheckingSlug(true);
      try {
        const res = await checkAuthorSlugAvailabilityAction(
          cleanSlug,
          isEditMode ? initialData?.id : undefined
        );
        if (isMounted) {
          setRemoteCheck({
            slug: cleanSlug,
            status: res.available ? "available" : "taken",
            error: res.error,
          });
        }
      } catch {
        if (isMounted) {
          setRemoteCheck({
            slug: cleanSlug,
            status: "taken",
            error: "Unable to verify slug availability.",
          });
        }
      } finally {
        if (isMounted) {
          setIsCheckingSlug(false);
        }
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [cleanSlug, isInvalidSlugFormat, isEditMode, initialData?.slug, initialData?.id]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Client-side validations
    if (!name.trim()) {
      setMessage({ type: "error", text: "Author name is required." });
      return;
    }

    if (!cleanSlug) {
      setMessage({ type: "error", text: "Author slug is required." });
      return;
    }

    if (isInvalidSlugFormat) {
      setMessage({
        type: "error",
        text: "Author slug must contain only lowercase letters, numbers, and hyphens.",
      });
      return;
    }

    if (slugStatus === "taken") {
      setMessage({
        type: "error",
        text: slugError || `Slug "${cleanSlug}" is already in use.`,
      });
      return;
    }

    if (!role.trim()) {
      setMessage({ type: "error", text: "Author role is required." });
      return;
    }

    if (avatarUrl && !avatarValidation.valid) {
      setMessage({
        type: "error",
        text: avatarValidation.error || "Avatar URL must use http:// or https://.",
      });
      return;
    }

    setIsSaving(true);

    try {
      if (isEditMode && initialData?.id) {
        const res = await updateAuthorAction(initialData.id, {
          name: name.trim(),
          slug: cleanSlug,
          role: role.trim(),
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
          is_active: isActive,
        });

        if (!res.success) {
          setMessage({ type: "error", text: res.error || "Failed to update author." });
        } else {
          setMessage({ type: "success", text: "Author updated successfully." });
          startTransition(() => {
            router.refresh();
          });
        }
      } else {
        const res = await createAuthorAction({
          name: name.trim(),
          slug: cleanSlug,
          role: role.trim(),
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
          is_active: isActive,
        });

        if (!res.success) {
          setMessage({ type: "error", text: res.error || "Failed to create author." });
        } else {
          setMessage({ type: "success", text: "Author created successfully! Redirecting..." });
          setTimeout(() => {
            router.push("/admin/authors");
          }, 600);
        }
      }
    } catch (err) {
      console.error("[AuthorForm] Submit error:", err);
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#6B1724]/10">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/authors"
              className="text-xs font-semibold text-[#5A6065] hover:text-[#6B1724] transition-colors"
            >
              ← Authors
            </Link>
            <span className="text-[#5A6065]/40">•</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#D97706]">
              {isEditMode ? "Edit Profile" : "New Profile"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#6B1724] mt-1">
            {isEditMode ? `Edit Author: ${initialData?.name}` : "Create Author Profile"}
          </h1>
          <p className="text-sm text-[#5A6065] mt-1">
            {isEditMode
              ? "Update author credentials, editorial role, bio, and availability status."
              : "Register a new contributor or scholar to credit across BhaktiMania articles."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/authors"
            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#6B1724]/20 text-[#6B1724] text-sm font-semibold hover:bg-white transition-colors flex items-center justify-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving || slugStatus === "taken" || slugStatus === "invalid"}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#6B1724] hover:bg-[#52111C] disabled:opacity-50 text-white text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEditMode ? "Save Changes" : "Create Author"}</span>
            )}
          </button>
        </div>
      </div>

      {/* Status Feedback Banner */}
      {message && (
        <div
          role="alert"
          className={`p-4 rounded-2xl border text-sm flex items-start gap-3 animate-in fade-in duration-150 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          <span className="text-base">{message.type === "success" ? "✓" : "⚠"}</span>
          <span className="flex-1 font-medium">{message.text}</span>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white border border-[#6B1724]/15 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="author-name" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
            Author Full Name <span className="text-red-600">*</span>
          </label>
          <input
            id="author-name"
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. BhaktiMania Editorial Team"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/15 outline-none transition-all"
          />
          <p className="text-[11px] text-[#5A6065] mt-1">
            Display name rendered on article bylines and metadata.
          </p>
        </div>

        {/* Slug Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="author-slug" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724]">
              Slug identifier <span className="text-red-600">*</span>
            </label>
            <div className="text-[11px]">
              {slugStatus === "checking" && (
                <span className="text-[#D97706] font-medium flex items-center gap-1">
                  <span className="w-2.5 h-2.5 border-2 border-[#D97706]/40 border-t-[#D97706] rounded-full animate-spin" />
                  Checking availability...
                </span>
              )}
              {slugStatus === "available" && (
                <span className="text-emerald-700 font-semibold">✓ Slug available</span>
              )}
              {slugStatus === "taken" && (
                <span className="text-red-600 font-semibold">✕ Slug already taken</span>
              )}
            </div>
          </div>
          <input
            id="author-slug"
            type="text"
            required
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="e.g. editorial-team"
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl font-mono text-sm border bg-white text-[#1F2326] focus:ring-2 outline-none transition-all ${
              slugStatus === "taken" || slugStatus === "invalid"
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : slugStatus === "available"
                ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100"
                : "border-[#6B1724]/20 focus:border-[#6B1724] focus:ring-[#6B1724]/15"
            }`}
          />
          {slugError && (
            <p className="text-[11px] text-red-600 mt-1 font-medium">{slugError}</p>
          )}
          <p className="text-[11px] text-[#5A6065] mt-1">
            Unique URL-safe identifier (lowercase letters, numbers, and single hyphens).
          </p>
        </div>

        {/* Role Field */}
        <div>
          <label htmlFor="author-role" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
            Role / Editorial Title <span className="text-red-600">*</span>
          </label>
          <input
            id="author-role"
            type="text"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. संपादकीय मंडल, वरिष्ठ शोधकर्ता, अतिथि लेखक"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/15 outline-none transition-all"
          />
          <p className="text-[11px] text-[#5A6065] mt-1">
            Devotional title or role designation (e.g. संपादकीय मंडल).
          </p>
        </div>

        {/* Bio Field */}
        <div>
          <label htmlFor="author-bio" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
            Biography / Description
          </label>
          <textarea
            id="author-bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short biographical background or editorial profile description..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/15 outline-none transition-all resize-y"
          />
          <p className="text-[11px] text-[#5A6065] mt-1">
            Optional editorial bio describing the scholar or writer.
          </p>
        </div>

        {/* Avatar URL Field */}
        <div>
          <label htmlFor="author-avatar" className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5">
            Avatar Image URL
          </label>
          <input
            id="author-avatar"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border bg-white text-[#1F2326] text-sm outline-none transition-all ${
              avatarUrl && !avatarValidation.valid
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-[#6B1724]/20 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/15"
            }`}
          />
          {avatarUrl && !avatarValidation.valid && (
            <p className="text-[11px] text-red-600 mt-1 font-medium">{avatarValidation.error}</p>
          )}
          <p className="text-[11px] text-[#5A6065] mt-1">
            Optional public image URL. Strictly restricted to secure <code>https://</code> or <code>http://</code> protocols.
          </p>
        </div>

        {/* Active Toggle */}
        <div className="pt-2 border-t border-[#6B1724]/10 flex items-center justify-between gap-4">
          <div>
            <label htmlFor="author-active" className="text-xs font-semibold uppercase tracking-wider text-[#6B1724] block">
              Active Status
            </label>
            <p className="text-xs text-[#5A6065] mt-0.5">
              When inactive, this author will not appear in the editor for new article assignments. Existing articles retain their credit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="author-active"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 accent-[#6B1724] rounded-md cursor-pointer"
            />
            <span className="text-sm font-semibold text-[#1F2326]">
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Existing Articles Context (if in edit mode) */}
        {isEditMode && initialData && (
          <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#6B1724]/10 text-xs text-[#5A6065] flex items-center justify-between">
            <span>
              Associated articles: <strong className="text-[#1F2326] font-semibold">{initialData.articleCount}</strong>
            </span>
            <span className="text-[11px] text-[#5A6065]">
              ID: <code className="font-mono">{initialData.id}</code>
            </span>
          </div>
        )}
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/admin/authors"
          className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#6B1724]/20 text-[#6B1724] text-sm font-semibold hover:bg-white transition-colors flex items-center justify-center"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSaving || slugStatus === "taken" || slugStatus === "invalid" || !isDirty}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#6B1724] hover:bg-[#52111C] disabled:opacity-50 text-white text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{isEditMode ? "Save Changes" : "Create Author"}</span>
          )}
        </button>
      </div>
    </form>
  );
}
