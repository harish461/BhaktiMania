import type {
  DatabaseCategory,
  DatabaseArticleWithRelations,
  SupabaseArticle,
  SupabaseCategory,
} from "./types";

const HINDI_MONTHS = [
  "जनवरी",
  "फ़रवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्टूबर",
  "नवंबर",
  "दिसंबर",
];

/**
 * Formats an ISO 8601 timestamp into a Hindi date string (e.g., "18 मार्च 2026").
 * Ensures compatibility with existing UI date presentation.
 */
export function formatHindiDate(
  dateInput: string | Date | null | undefined
): string {
  if (!dateInput) return "";

  // If already Hindi text or not containing ISO date markers, preserve as is
  if (
    typeof dateInput === "string" &&
    !dateInput.includes("T") &&
    !dateInput.includes("-")
  ) {
    return dateInput.trim();
  }

  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);

    const day = d.toLocaleDateString("en-US", {
      day: "numeric",
      timeZone: "Asia/Kolkata",
    });

    const monthNum = parseInt(
      d.toLocaleDateString("en-US", {
        month: "numeric",
        timeZone: "Asia/Kolkata",
      }),
      10
    );

    const monthName = HINDI_MONTHS[monthNum - 1] || "";

    const year = d.toLocaleDateString("en-US", {
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });

    return `${day} ${monthName} ${year}`.trim();
  } catch {
    return String(dateInput);
  }
}

/**
 * Adapts a raw database category record into the DevotionalCategory model.
 */
export function mapDatabaseCategoryToCategory(
  row: DatabaseCategory
): SupabaseCategory {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    description: row.description,
    symbol: row.symbol,
    intro: row.intro || undefined,
    relatedSlugs: [],
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

/**
 * Adapts a raw database article record (with joined relations) into the Article model.
 * 
 * Maps:
 * - database `read_time` → existing `readTime`
 * - database category relation → `category` (title) and `categorySlug` (slug)
 * - database author relation → `author` (name)
 * - `sections` JSONB → `ArticleSection[]`
 * - database image/SEO overrides → optional frontend fields
 * - `published_at` → formatted Hindi `publishedAt` + `rawPublishedAt`
 */
export function mapDatabaseArticleToArticle(
  row: DatabaseArticleWithRelations
): SupabaseArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.categories?.title || "",
    categorySlug: row.categories?.slug || "",
    symbol: row.symbol,
    readTime: row.read_time,
    publishedAt: formatHindiDate(row.published_at),
    author: row.authors?.name || undefined,
    sections: Array.isArray(row.sections) ? row.sections : [],
    featured: Boolean(row.featured),
    featuredImageUrl: row.featured_image_url || undefined,
    featuredImageAlt: row.featured_image_alt || undefined,
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    rawPublishedAt: row.published_at || undefined,
  };
}
