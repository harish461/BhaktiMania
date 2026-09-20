"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { isAuthorSlugUnique, getAdminAuthorById } from "@/lib/data/supabase/admin";
import { validateAvatarUrl } from "@/lib/validation/author";

export interface AuthorInputPayload {
  id?: string;
  name: string;
  slug: string;
  role: string;
  bio?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
}

export type AuthorActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  authorId?: string;
};

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Server Action: Create a new author record.
 */
export async function createAuthorAction(
  payload: AuthorInputPayload
): Promise<AuthorActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  const name = payload.name?.trim();
  const slug = payload.slug?.trim().toLowerCase();
  const role = payload.role?.trim() || "संपादकीय मंडल";
  const bio = payload.bio?.trim() || null;
  const avatarUrl = payload.avatar_url?.trim() || null;
  const isActive = Boolean(payload.is_active);

  if (!name) {
    return { success: false, error: "Author name is required." };
  }

  if (!slug) {
    return { success: false, error: "Author slug is required." };
  }

  if (!SLUG_REGEX.test(slug)) {
    return {
      success: false,
      error: "Slug must contain only lowercase letters, numbers, and single hyphens (e.g. 'editorial-team').",
    };
  }

  if (!role) {
    return { success: false, error: "Author role is required." };
  }

  // Avatar URL security validation
  if (avatarUrl) {
    const avatarValidation = validateAvatarUrl(avatarUrl);
    if (!avatarValidation.valid) {
      return { success: false, error: avatarValidation.error };
    }
  }

  // Slug uniqueness check
  const slugAvailable = await isAuthorSlugUnique(slug);
  if (!slugAvailable) {
    return {
      success: false,
      error: `The slug "${slug}" is already in use by another author.`,
    };
  }

  const supabase = await createClient();

  const { data: inserted, error: insertErr } = await supabase
    .from("authors")
    .insert({
      name,
      slug,
      role,
      bio,
      avatar_url: avatarUrl,
      is_active: isActive,
    })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    console.error("[actions/createAuthorAction] Insert error:", insertErr);
    return {
      success: false,
      error: `Database insert error: ${insertErr?.message || "Unknown error"}`,
    };
  }

  revalidatePath("/admin/authors");
  revalidatePath("/admin/articles");
  revalidatePath("/admin/articles/new");

  return {
    success: true,
    authorId: inserted.id,
    message: "Author created successfully.",
  };
}

/**
 * Server Action: Update an existing author.
 */
export async function updateAuthorAction(
  authorId: string,
  payload: AuthorInputPayload
): Promise<AuthorActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!authorId) {
    return { success: false, error: "Author ID is required." };
  }

  const name = payload.name?.trim();
  const slug = payload.slug?.trim().toLowerCase();
  const role = payload.role?.trim() || "संपादकीय मंडल";
  const bio = payload.bio?.trim() || null;
  const avatarUrl = payload.avatar_url?.trim() || null;
  const isActive = Boolean(payload.is_active);

  if (!name) {
    return { success: false, error: "Author name is required." };
  }

  if (!slug) {
    return { success: false, error: "Author slug is required." };
  }

  if (!SLUG_REGEX.test(slug)) {
    return {
      success: false,
      error: "Slug must contain only lowercase letters, numbers, and single hyphens (e.g. 'editorial-team').",
    };
  }

  if (!role) {
    return { success: false, error: "Author role is required." };
  }

  // Avatar URL security validation
  if (avatarUrl) {
    const avatarValidation = validateAvatarUrl(avatarUrl);
    if (!avatarValidation.valid) {
      return { success: false, error: avatarValidation.error };
    }
  }

  // Slug uniqueness check (excluding self)
  const slugAvailable = await isAuthorSlugUnique(slug, authorId);
  if (!slugAvailable) {
    return {
      success: false,
      error: `The slug "${slug}" is already in use by another author.`,
    };
  }

  const supabase = await createClient();

  const { error: updateErr } = await supabase
    .from("authors")
    .update({
      name,
      slug,
      role,
      bio,
      avatar_url: avatarUrl,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", authorId);

  if (updateErr) {
    console.error("[actions/updateAuthorAction] Update error:", updateErr);
    return {
      success: false,
      error: `Database update error: ${updateErr.message}`,
    };
  }

  revalidatePath("/admin/authors");
  revalidatePath(`/admin/authors/${authorId}/edit`);
  revalidatePath("/admin/articles");
  revalidatePath("/admin/articles/new");

  return {
    success: true,
    authorId,
    message: "Author updated successfully.",
  };
}

/**
 * Server Action: Activate an inactive author.
 */
export async function activateAuthorAction(
  authorId: string
): Promise<AuthorActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!authorId) {
    return { success: false, error: "Author ID is required." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("authors")
    .update({
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", authorId);

  if (error) {
    console.error("[actions/activateAuthorAction] Update error:", error);
    return {
      success: false,
      error: `Database update error: ${error.message}`,
    };
  }

  revalidatePath("/admin/authors");
  revalidatePath(`/admin/authors/${authorId}/edit`);
  revalidatePath("/admin/articles");
  revalidatePath("/admin/articles/new");

  return {
    success: true,
    authorId,
    message: "Author activated successfully.",
  };
}

/**
 * Server Action: Deactivate an author.
 * Relational Safety: Existing article relationships are strictly preserved.
 * Inactive authors are simply excluded from future article assignments.
 */
export async function deactivateAuthorAction(
  authorId: string
): Promise<AuthorActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!authorId) {
    return { success: false, error: "Author ID is required." };
  }

  // Check author existence and article count for logging
  const author = await getAdminAuthorById(authorId);
  if (!author) {
    return { success: false, error: "Author not found." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("authors")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", authorId);

  if (error) {
    console.error("[actions/deactivateAuthorAction] Update error:", error);
    return {
      success: false,
      error: `Database update error: ${error.message}`,
    };
  }

  revalidatePath("/admin/authors");
  revalidatePath(`/admin/authors/${authorId}/edit`);
  revalidatePath("/admin/articles");
  revalidatePath("/admin/articles/new");

  const articleNote = author.articleCount > 0 
    ? ` (${author.articleCount} existing articles retain credit).` 
    : ".";

  return {
    success: true,
    authorId,
    message: `Author deactivated successfully${articleNote}`,
  };
}

/**
 * Server Action: Validate author slug availability (uniqueness).
 */
export async function checkAuthorSlugAvailabilityAction(
  slug: string,
  excludeAuthorId?: string
): Promise<{ available: boolean; error?: string }> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return { available: false, error: "Unauthorized" };
  }

  const clean = slug?.trim().toLowerCase();
  if (!clean) {
    return { available: false, error: "Slug cannot be empty." };
  }

  if (!SLUG_REGEX.test(clean)) {
    return {
      available: false,
      error: "Slug must contain only lowercase letters, numbers, and hyphens.",
    };
  }

  try {
    const isAvailable = await isAuthorSlugUnique(clean, excludeAuthorId);
    return { available: isAvailable };
  } catch (err) {
    console.error("[actions/checkAuthorSlugAvailabilityAction] Error:", err);
    return { available: false, error: "Unable to verify slug availability." };
  }
}

