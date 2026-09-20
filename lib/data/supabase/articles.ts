import { createClient } from "@/lib/supabase/server";
import { mapDatabaseArticleToArticle } from "./adapters";
import type { DatabaseArticleWithRelations, SupabaseArticle } from "./types";

/**
 * Standard PostgreSQL/PostgREST SELECT statement for articles with joined relations.
 * Joins categories on category_id and authors on author_id.
 */
const ARTICLE_SELECT_FIELDS = `
  id,
  slug,
  title,
  description,
  category_id,
  author_id,
  status,
  sections,
  symbol,
  read_time,
  featured,
  featured_image_url,
  featured_image_alt,
  seo_title,
  seo_description,
  published_at,
  created_at,
  updated_at,
  categories!inner (
    slug,
    title
  ),
  authors (
    name
  )
`;

/**
 * Fetches all published articles from Supabase.
 * 
 * Visibility Rule:
 *   status = 'published' AND published_at <= NOW()
 * 
 * Order:
 *   published_at DESC
 */
export async function getPublishedArticles(): Promise<SupabaseArticle[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT_FIELDS)
    .eq("status", "published")
    .lte("published_at", nowIso)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[supabase/articles] Error fetching published articles:", error);
    throw new Error(
      `Failed to fetch published articles from Supabase: ${error.message}`
    );
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data as unknown as DatabaseArticleWithRelations[]).map(
    mapDatabaseArticleToArticle
  );
}

/**
 * Fetches a single published article by its slug.
 * 
 * Visibility Rule:
 *   status = 'published' AND published_at <= NOW()
 * 
 * Returns null if the slug is invalid, empty, or not found.
 * Throws on database query failures.
 */
export async function getPublishedArticleBySlug(
  slug: string
): Promise<SupabaseArticle | null> {
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    return null;
  }

  const cleanSlug = slug.trim().toLowerCase();
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT_FIELDS)
    .eq("slug", cleanSlug)
    .eq("status", "published")
    .lte("published_at", nowIso)
    .maybeSingle();

  if (error) {
    console.error(
      `[supabase/articles] Error fetching article "${cleanSlug}":`,
      error
    );
    throw new Error(
      `Failed to fetch article "${cleanSlug}" from Supabase: ${error.message}`
    );
  }

  if (!data) {
    return null;
  }

  return mapDatabaseArticleToArticle(
    data as unknown as DatabaseArticleWithRelations
  );
}

/**
 * Fetches all published articles belonging to a specific category slug.
 * 
 * Visibility Rule:
 *   status = 'published' AND published_at <= NOW()
 */
export async function getArticlesByCategory(
  categorySlug: string
): Promise<SupabaseArticle[]> {
  if (!categorySlug || typeof categorySlug !== "string" || !categorySlug.trim()) {
    return [];
  }

  const cleanCategorySlug = categorySlug.trim().toLowerCase();
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT_FIELDS)
    .eq("categories.slug", cleanCategorySlug)
    .eq("status", "published")
    .lte("published_at", nowIso)
    .order("published_at", { ascending: false });

  if (error) {
    console.error(
      `[supabase/articles] Error fetching articles for category "${cleanCategorySlug}":`,
      error
    );
    throw new Error(
      `Failed to fetch articles for category "${cleanCategorySlug}" from Supabase: ${error.message}`
    );
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data as unknown as DatabaseArticleWithRelations[]).map(
    mapDatabaseArticleToArticle
  );
}

/**
 * Fetches related articles for a given article slug.
 * 
 * Resolution Priority:
 * 1. Curated editorial pairings from article_curated_relations (if any exist).
 * 2. Published articles from the same category (excluding current slug).
 * 3. Fallback to other published articles if fewer than limit are available.
 * 
 * Visibility Rule:
 *   All returned articles must satisfy status = 'published' AND published_at <= NOW().
 */
export async function getRelatedArticles(
  currentSlug: string,
  categorySlug?: string,
  limit: number = 3
): Promise<SupabaseArticle[]> {
  if (!currentSlug || typeof currentSlug !== "string" || !currentSlug.trim()) {
    return [];
  }

  const cleanSlug = currentSlug.trim().toLowerCase();
  const targetLimit = Math.max(1, limit);
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  // Step 1: If categorySlug was not provided, look up the current article's category
  let resolvedCategorySlug = categorySlug?.trim().toLowerCase();
  if (!resolvedCategorySlug) {
    const currentArticle = await getPublishedArticleBySlug(cleanSlug);
    if (!currentArticle) {
      return [];
    }
    resolvedCategorySlug = currentArticle.categorySlug;
  }

  // Step 2: Check for explicit curated relations in article_curated_relations
  // Curated relations table contains article_id and related_article_id
  const { data: currentArticleRow } = await supabase
    .from("articles")
    .select("id")
    .eq("slug", cleanSlug)
    .maybeSingle();

  const relatedArticles: SupabaseArticle[] = [];
  const seenSlugs = new Set<string>([cleanSlug]);

  if (currentArticleRow?.id) {
    const { data: curatedRows } = await supabase
      .from("article_curated_relations")
      .select(
        `
        sort_order,
        related_article:articles!related_article_id (
          ${ARTICLE_SELECT_FIELDS}
        )
      `
      )
      .eq("article_id", currentArticleRow.id)
      .order("sort_order", { ascending: true })
      .limit(targetLimit);

    if (curatedRows && curatedRows.length > 0) {
      for (const row of curatedRows) {
        const related = row.related_article as unknown as DatabaseArticleWithRelations | null;
        if (
          related &&
          related.status === "published" &&
          related.published_at &&
          related.published_at <= nowIso &&
          !seenSlugs.has(related.slug)
        ) {
          relatedArticles.push(mapDatabaseArticleToArticle(related));
          seenSlugs.add(related.slug);
          if (relatedArticles.length >= targetLimit) {
            return relatedArticles;
          }
        }
      }
    }
  }

  // Step 3: Fill from same category
  if (relatedArticles.length < targetLimit && resolvedCategorySlug) {
    const { data: sameCategoryData, error: categoryError } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT_FIELDS)
      .eq("categories.slug", resolvedCategorySlug)
      .neq("slug", cleanSlug)
      .eq("status", "published")
      .lte("published_at", nowIso)
      .order("published_at", { ascending: false })
      .limit(targetLimit - relatedArticles.length + 5); // Fetch slight buffer for filtering

    if (categoryError) {
      console.error(
        `[supabase/articles] Error fetching related category articles:`,
        categoryError
      );
    } else if (sameCategoryData) {
      for (const row of sameCategoryData as unknown as DatabaseArticleWithRelations[]) {
        if (!seenSlugs.has(row.slug)) {
          relatedArticles.push(mapDatabaseArticleToArticle(row));
          seenSlugs.add(row.slug);
          if (relatedArticles.length >= targetLimit) {
            return relatedArticles;
          }
        }
      }
    }
  }

  // Step 4: Fallback to any published articles across all categories if still needed
  if (relatedArticles.length < targetLimit) {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT_FIELDS)
      .neq("slug", cleanSlug)
      .eq("status", "published")
      .lte("published_at", nowIso)
      .order("published_at", { ascending: false })
      .limit(targetLimit - relatedArticles.length + 5);

    if (fallbackError) {
      console.error(
        `[supabase/articles] Error fetching fallback related articles:`,
        fallbackError
      );
    } else if (fallbackData) {
      for (const row of fallbackData as unknown as DatabaseArticleWithRelations[]) {
        if (!seenSlugs.has(row.slug)) {
          relatedArticles.push(mapDatabaseArticleToArticle(row));
          seenSlugs.add(row.slug);
          if (relatedArticles.length >= targetLimit) {
            break;
          }
        }
      }
    }
  }

  return relatedArticles.slice(0, targetLimit);
}
