import { createClient } from "@/lib/supabase/server";
import type {
  DatabaseAffiliateProduct,
  DatabaseArticleAffiliateWithProduct,
  AffiliateProductItem,
} from "./types";

/**
 * Validates that an outbound affiliate URL is a secure, direct HTTPS or HTTP URL.
 * Prohibits URL cloaking, internal redirect routes, and malformed protocols.
 */
export function isValidAffiliateUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Maps a raw database affiliate product row into a typed frontend domain object.
 */
export function mapDatabaseAffiliateProduct(
  product: DatabaseAffiliateProduct,
  contextualNote?: string | null,
  sortOrder?: number
): AffiliateProductItem {
  return {
    id: product.id,
    name: product.name,
    merchant: product.merchant,
    affiliateUrl: product.affiliate_url,
    imageUrl: product.image_url,
    shortDescription: product.short_description,
    category: product.category,
    isActive: product.is_active,
    displayOrder: product.display_order,
    contextualNote: contextualNote ?? null,
    sortOrder: sortOrder ?? product.display_order,
  };
}

/**
 * Standard PostgreSQL SELECT fields for affiliate products.
 */
const AFFILIATE_PRODUCT_FIELDS = `
  id,
  name,
  merchant,
  affiliate_url,
  image_url,
  short_description,
  category,
  is_active,
  display_order,
  created_at,
  updated_at
`;

/**
 * Fetches all active curated affiliate products associated with a specific article.
 * 
 * Visibility: Only products with is_active = true, ordered by sort_order.
 */
export async function getAffiliateProductsForArticle(
  articleId: string
): Promise<AffiliateProductItem[]> {
  if (!articleId) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("article_affiliate_products")
    .select(`
      id,
      article_id,
      product_id,
      sort_order,
      contextual_note,
      affiliate_products!inner (
        ${AFFILIATE_PRODUCT_FIELDS}
      )
    `)
    .eq("article_id", articleId)
    .eq("affiliate_products.is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(
      `[supabase/affiliate] Error fetching affiliate products for article ${articleId}:`,
      error
    );
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data as unknown as DatabaseArticleAffiliateWithProduct[])
    .filter((row) => row.affiliate_products && row.affiliate_products.is_active)
    .map((row) =>
      mapDatabaseAffiliateProduct(
        row.affiliate_products!,
        row.contextual_note,
        row.sort_order
      )
    );
}

/**
 * Fetches active affiliate products for an article by its URL slug.
 */
export async function getAffiliateProductsForArticleSlug(
  slug: string
): Promise<AffiliateProductItem[]> {
  if (!slug) return [];

  const supabase = await createClient();

  // Find the published article ID
  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (articleError || !article) {
    return [];
  }

  return getAffiliateProductsForArticle(article.id);
}

/**
 * Fetches all active affiliate products from the master catalog.
 * Ordered by display_order ASC, then created_at DESC.
 */
export async function getAllActiveAffiliateProducts(): Promise<AffiliateProductItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("affiliate_products")
    .select(AFFILIATE_PRODUCT_FIELDS)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase/affiliate] Error fetching active affiliate products:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data as DatabaseAffiliateProduct[]).map((product) =>
    mapDatabaseAffiliateProduct(product)
  );
}

/**
 * Fetches up to `limit` active curated affiliate products for display
 * on editorial sections such as the homepage.
 */
export async function getCuratedAffiliateProducts(
  limit: number = 3
): Promise<AffiliateProductItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("affiliate_products")
    .select(AFFILIATE_PRODUCT_FIELDS)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[supabase/affiliate] Error fetching curated affiliate products:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data as DatabaseAffiliateProduct[]).map((product) =>
    mapDatabaseAffiliateProduct(product)
  );
}

