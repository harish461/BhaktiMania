/**
 * BhaktiMania — Scoped Storage Path Utilities
 * 
 * Enforces strict object namespace partitioning in Supabase Storage:
 * Format: articles/{articleId}/featured-{uniqueId}.{extension}
 */

import crypto from "crypto";

export const MEDIA_BUCKET_NAME = "bhaktimania-media";

/**
 * UUID v4 validation regex.
 */
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates whether a string is a valid UUID.
 */
export function isValidArticleId(articleId: string): boolean {
  if (!articleId || typeof articleId !== "string") return false;
  return UUID_REGEX.test(articleId.trim());
}

/**
 * Constructs a secure, collision-resistant server-side storage path for an article featured image.
 */
export function generateFeaturedImagePath(
  articleId: string,
  extension: string
): string {
  const cleanId = articleId.trim();
  if (!isValidArticleId(cleanId)) {
    throw new Error(`Invalid article ID: ${articleId}. Must be a valid UUID.`);
  }

  const cleanExt = extension.replace(/^\./, "").trim().toLowerCase();
  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(4).toString("hex");
  const uniqueId = `${timestamp}-${randomSuffix}`;

  return `articles/${cleanId}/featured-${uniqueId}.${cleanExt}`;
}

/**
 * Verifies that a storage path strictly belongs to the expected article namespace:
 * articles/{articleId}/...
 */
export function isPathInArticleNamespace(
  articleId: string,
  storagePath: string
): boolean {
  if (!articleId || !storagePath) return false;
  const cleanId = articleId.trim().toLowerCase();
  const cleanPath = storagePath.trim().replace(/^\/+/, "");

  if (!isValidArticleId(cleanId)) return false;

  const expectedPrefix = `articles/${cleanId}/`;
  return cleanPath.startsWith(expectedPrefix);
}

/**
 * Validates whether a string is a valid UUID for products.
 */
export function isValidProductId(productId: string): boolean {
  if (!productId || typeof productId !== "string") return false;
  return UUID_REGEX.test(productId.trim());
}

/**
 * Constructs a secure, collision-resistant server-side storage path for an affiliate product image.
 * Format: affiliate-products/{productId}/{timestamp}-{randomHex}.{extension}
 */
export function generateAffiliateProductImagePath(
  productId: string,
  extension: string
): string {
  const cleanId = productId.trim();
  if (!isValidProductId(cleanId)) {
    throw new Error(`Invalid product ID: ${productId}. Must be a valid UUID.`);
  }

  const cleanExt = extension.replace(/^\./, "").trim().toLowerCase();
  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(4).toString("hex");
  const uniqueId = `${timestamp}-${randomSuffix}`;

  return `affiliate-products/${cleanId}/${uniqueId}.${cleanExt}`;
}

/**
 * Verifies that a storage path strictly belongs to the expected affiliate product namespace:
 * affiliate-products/{productId}/...
 */
export function isPathInAffiliateNamespace(
  productId: string,
  storagePath: string
): boolean {
  if (!productId || !storagePath) return false;
  const cleanId = productId.trim().toLowerCase();
  const cleanPath = storagePath.trim().replace(/^\/+/, "");

  if (!isValidProductId(cleanId)) return false;

  const expectedPrefix = `affiliate-products/${cleanId}/`;
  return cleanPath.startsWith(expectedPrefix);
}

/**
 * Extracts the storage object path from a Supabase public URL or returns the path if already relative.
 * 
 * Example URL:
 * https://<project>.supabase.co/storage/v1/object/public/bhaktimania-media/articles/123/featured-xxx.webp
 * -> articles/123/featured-xxx.webp
 */
export function extractStoragePathFromUrl(
  urlOrPath: string,
  bucketName: string = MEDIA_BUCKET_NAME
): string | null {
  if (!urlOrPath) return null;
  const trimmed = urlOrPath.trim();

  // If it's already a relative storage path (e.g. articles/uuid/... or affiliate-products/uuid/...)
  if (trimmed.startsWith("articles/") || trimmed.startsWith("affiliate-products/")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const marker = `/storage/v1/object/public/${bucketName}/`;
    const idx = url.pathname.indexOf(marker);
    if (idx !== -1) {
      return decodeURIComponent(url.pathname.substring(idx + marker.length));
    }

    // Secondary pattern if sign or alternative path
    const altMarker = `/${bucketName}/`;
    const altIdx = url.pathname.indexOf(altMarker);
    if (altIdx !== -1) {
      return decodeURIComponent(url.pathname.substring(altIdx + altMarker.length));
    }

    return null;
  } catch {
    return null;
  }
}
