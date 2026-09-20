"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { isCategorySlugUnique } from "@/lib/data/supabase/admin";

export interface CategoryInputPayload {
  id?: string;
  title: string;
  slug: string;
  meta_title: string;
  description: string;
  symbol: string;
  intro?: string | null;
  sort_order: number;
  is_active: boolean;
}

export type CategoryActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  categoryId?: string;
};

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Server Action: Create a new devotional category.
 */
export async function createCategoryAction(
  payload: CategoryInputPayload
): Promise<CategoryActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  const title = payload.title?.trim();
  const slug = payload.slug?.trim().toLowerCase();
  const metaTitle = payload.meta_title?.trim();
  const description = payload.description?.trim();
  const symbol = payload.symbol?.trim() || "ॐ";
  const intro = payload.intro?.trim() || null;
  const sortOrder = Number.isInteger(payload.sort_order) ? payload.sort_order : 0;
  const isActive = Boolean(payload.is_active);

  if (!title) {
    return { success: false, error: "Category title is required." };
  }

  if (!slug) {
    return { success: false, error: "Category slug is required." };
  }

  if (!SLUG_REGEX.test(slug)) {
    return {
      success: false,
      error: "Slug must contain only lowercase letters, numbers, and single hyphens (e.g. 'hanuman').",
    };
  }

  if (!metaTitle) {
    return { success: false, error: "Meta title (SEO) is required." };
  }

  if (!description) {
    return { success: false, error: "Category description is required." };
  }

  // Slug uniqueness check
  const slugAvailable = await isCategorySlugUnique(slug);
  if (!slugAvailable) {
    return {
      success: false,
      error: `The slug "${slug}" is already in use by another category.`,
    };
  }

  const supabase = await createClient();

  const { data: inserted, error: insertErr } = await supabase
    .from("categories")
    .insert({
      title,
      slug,
      meta_title: metaTitle,
      description,
      symbol,
      intro,
      sort_order: sortOrder,
      is_active: isActive,
    })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    console.error("[actions/createCategoryAction] Insert error:", insertErr);
    return {
      success: false,
      error: `Database insert error: ${insertErr?.message || "Unknown error"}`,
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/articles");
  revalidatePath("/admin/articles/new");
  revalidatePath("/");
  revalidatePath("/bhakti-gyaan");
  revalidatePath(`/${slug}`);
  revalidatePath("/sitemap.xml");

  return {
    success: true,
    categoryId: inserted.id,
    message: "Category created successfully.",
  };
}

/**
 * Server Action: Update an existing category.
 */
export async function updateCategoryAction(
  categoryId: string,
  payload: CategoryInputPayload
): Promise<CategoryActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!categoryId) {
    return { success: false, error: "Category ID is required." };
  }

  const title = payload.title?.trim();
  const slug = payload.slug?.trim().toLowerCase();
  const metaTitle = payload.meta_title?.trim();
  const description = payload.description?.trim();
  const symbol = payload.symbol?.trim() || "ॐ";
  const intro = payload.intro?.trim() || null;
  const sortOrder = Number.isInteger(payload.sort_order) ? payload.sort_order : 0;
  const isActive = Boolean(payload.is_active);

  if (!title) {
    return { success: false, error: "Category title is required." };
  }

  if (!slug) {
    return { success: false, error: "Category slug is required." };
  }

  if (!SLUG_REGEX.test(slug)) {
    return {
      success: false,
      error: "Slug must contain only lowercase letters, numbers, and single hyphens.",
    };
  }

  if (!metaTitle) {
    return { success: false, error: "Meta title (SEO) is required." };
  }

  if (!description) {
    return { success: false, error: "Category description is required." };
  }

  // Slug uniqueness check excluding current category
  const slugAvailable = await isCategorySlugUnique(slug, categoryId);
  if (!slugAvailable) {
    return {
      success: false,
      error: `The slug "${slug}" is already in use by another category.`,
    };
  }

  const supabase = await createClient();

  const { error: updateErr } = await supabase
    .from("categories")
    .update({
      title,
      slug,
      meta_title: metaTitle,
      description,
      symbol,
      intro,
      sort_order: sortOrder,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", categoryId);

  if (updateErr) {
    console.error("[actions/updateCategoryAction] Update error:", updateErr);
    return {
      success: false,
      error: `Database update error: ${updateErr?.message || "Unknown error"}`,
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${categoryId}/edit`);
  revalidatePath("/admin/articles");
  revalidatePath("/");
  revalidatePath("/bhakti-gyaan");
  revalidatePath(`/${slug}`);
  revalidatePath("/sitemap.xml");

  return {
    success: true,
    categoryId,
    message: "Category updated successfully.",
  };
}

/**
 * Server Action: Activate or deactivate a category.
 * Safety Guarantee: Does not modify or reassign existing articles.
 */
export async function toggleCategoryStatusAction(
  categoryId: string,
  isActive: boolean
): Promise<CategoryActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!categoryId) {
    return { success: false, error: "Category ID is required." };
  }

  const supabase = await createClient();

  const { data: cat, error: fetchErr } = await supabase
    .from("categories")
    .select("slug, title")
    .eq("id", categoryId)
    .single();

  if (fetchErr || !cat) {
    return { success: false, error: "Category not found." };
  }

  const { error: updateErr } = await supabase
    .from("categories")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", categoryId);

  if (updateErr) {
    console.error("[actions/toggleCategoryStatusAction] Error:", updateErr);
    return {
      success: false,
      error: `Failed to update status: ${updateErr?.message || "Unknown error"}`,
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/articles");
  revalidatePath("/admin/articles/new");
  revalidatePath("/");
  revalidatePath("/bhakti-gyaan");
  if (cat.slug) {
    revalidatePath(`/${cat.slug}`);
  }
  revalidatePath("/sitemap.xml");

  return {
    success: true,
    message: `Category "${cat.title}" ${isActive ? "activated" : "deactivated"} successfully.`,
  };
}

/**
 * Server Action: Reorder categories safely with Move Up / Move Down.
 * Normalizes sequence to 1..N and prevents duplicate or corrupted ordering.
 */
export async function updateCategoryOrderAction(
  categoryId: string,
  direction: "up" | "down"
): Promise<CategoryActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!categoryId) {
    return { success: false, error: "Category ID is required." };
  }

  const supabase = await createClient();

  // 1. Fetch all categories sorted by current sort_order
  const { data: allCategories, error: fetchErr } = await supabase
    .from("categories")
    .select("id, sort_order, title")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (fetchErr || !allCategories || allCategories.length === 0) {
    return { success: false, error: "Unable to retrieve categories." };
  }

  // 2. Find target index
  const currentIndex = allCategories.findIndex((c) => c.id === categoryId);
  if (currentIndex === -1) {
    return { success: false, error: "Category not found." };
  }

  // 3. Boundary checks
  if (direction === "up" && currentIndex === 0) {
    return { success: false, error: "Category is already at the top." };
  }
  if (direction === "down" && currentIndex === allCategories.length - 1) {
    return { success: false, error: "Category is already at the bottom." };
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  // 4. Swap positions in the normalized array
  const reordered = [...allCategories];
  const temp = reordered[currentIndex];
  reordered[currentIndex] = reordered[targetIndex];
  reordered[targetIndex] = temp;

  // 5. Update sort orders sequentially: 1, 2, 3...
  // To avoid temporary duplicate sort_order conflicts, assign 1-based indexes
  for (let i = 0; i < reordered.length; i++) {
    const item = reordered[i];
    const newOrder = i + 1;
    if (item.sort_order !== newOrder) {
      const { error: updErr } = await supabase
        .from("categories")
        .update({
          sort_order: newOrder,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      if (updErr) {
        console.error(`[actions/updateCategoryOrderAction] Order update failed for ${item.id}:`, updErr);
        return {
          success: false,
          error: `Failed to update ordering: ${updErr.message}`,
        };
      }
    }
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/bhakti-gyaan");

  return {
    success: true,
    message: "Category ordering updated successfully.",
  };
}

/**
 * Server Action: Validate category slug availability (uniqueness).
 */
export async function checkCategorySlugAvailabilityAction(
  slug: string,
  excludeCategoryId?: string
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
    const isAvailable = await isCategorySlugUnique(clean, excludeCategoryId);
    return { available: isAvailable };
  } catch (err) {
    console.error("[actions/checkCategorySlugAvailabilityAction] Error:", err);
    return { available: false, error: "Unable to verify slug availability." };
  }
}
