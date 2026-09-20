import { createClient } from "@/lib/supabase/server";
import { mapDatabaseCategoryToCategory } from "./adapters";
import type { DatabaseCategory, SupabaseCategory } from "./types";

/**
 * Fetches all active devotional categories from Supabase ordered by sort_order.
 * 
 * Visibility: Only records with is_active = true.
 */
export async function getCategories(): Promise<SupabaseCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      slug,
      title,
      meta_title,
      description,
      symbol,
      intro,
      sort_order,
      is_active
    `
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[supabase/categories] Error fetching categories:", error);
    throw new Error(`Failed to fetch categories from Supabase: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data as DatabaseCategory[]).map(mapDatabaseCategoryToCategory);
}

/**
 * Fetches all categories for admin editors (both active and inactive).
 * Used by admin article editors to preserve assignments to inactive categories.
 */
export async function getAllCategoriesForEditor(): Promise<SupabaseCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      slug,
      title,
      meta_title,
      description,
      symbol,
      intro,
      sort_order,
      is_active
    `
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[supabase/categories] Error fetching all categories for editor:", error);
    throw new Error(`Failed to fetch categories from Supabase: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data as DatabaseCategory[]).map(mapDatabaseCategoryToCategory);
}

/**
 * Fetches a single active devotional category by its canonical slug.
 * 
 * Returns null if the slug is invalid, empty, or not found.
 * Throws on database query failures to prevent silent failures.
 */
export async function getCategoryBySlug(
  slug: string
): Promise<SupabaseCategory | null> {
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    return null;
  }

  const cleanSlug = slug.trim().toLowerCase();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      slug,
      title,
      meta_title,
      description,
      symbol,
      intro,
      sort_order,
      is_active
    `
    )
    .eq("slug", cleanSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error(`[supabase/categories] Error fetching category "${cleanSlug}":`, error);
    throw new Error(
      `Failed to fetch category "${cleanSlug}" from Supabase: ${error.message}`
    );
  }

  if (!data) {
    return null;
  }

  return mapDatabaseCategoryToCategory(data as DatabaseCategory);
}

/**
 * Fetches related categories for a given category slug (excluding currentSlug).
 * Returns up to limit active categories ordered by sort_order.
 */
export async function getRelatedCategories(
  currentSlug: string,
  limit: number = 4
): Promise<SupabaseCategory[]> {
  const allCategories = await getCategories();
  const cleanSlug = currentSlug.trim().toLowerCase();
  return allCategories
    .filter((cat) => cat.slug !== cleanSlug)
    .slice(0, limit);
}
