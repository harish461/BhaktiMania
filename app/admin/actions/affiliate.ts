"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export interface AffiliateProductInputPayload {
  id?: string;
  name: string;
  merchant: string;
  affiliate_url: string;
  image_url?: string | null;
  short_description?: string | null;
  category?: string | null;
  is_active?: boolean;
  display_order?: number;
}

export type AffiliateActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  productId?: string;
};

export interface ArticleAffiliateRelationPayload {
  article_id: string;
  product_id: string;
  contextual_note?: string | null;
  sort_order?: number;
}

import {
  validateAffiliateUrl,
  validateImageUrl,
} from "@/lib/utils/affiliate-validation";
import { validateImageBuffer } from "@/lib/storage/image-validation";
import {
  MEDIA_BUCKET_NAME,
  isValidProductId,
  generateAffiliateProductImagePath,
  isPathInAffiliateNamespace,
  extractStoragePathFromUrl,
} from "@/lib/storage/storage-path";


/**
 * Server Action: Create an affiliate product in the master catalog.
 */
export async function createAffiliateProductAction(
  payload: AffiliateProductInputPayload
): Promise<AffiliateActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  const name = payload.name?.trim();
  const merchant = payload.merchant?.trim() || "amazon_in";
  const affiliateUrl = payload.affiliate_url?.trim();
  const imageUrl = payload.image_url?.trim() || null;
  const shortDescription = payload.short_description?.trim() || null;
  const category = payload.category?.trim() || null;
  const isActive = payload.is_active !== undefined ? Boolean(payload.is_active) : true;
  const displayOrder = Number.isInteger(payload.display_order)
    ? Number(payload.display_order)
    : 0;

  if (!name) {
    return { success: false, error: "Product name is required." };
  }

  if (!merchant) {
    return { success: false, error: "Merchant name is required." };
  }

  const urlCheck = validateAffiliateUrl(affiliateUrl);
  if (!urlCheck.isValid) {
    return { success: false, error: urlCheck.error };
  }

  const imgCheck = validateImageUrl(imageUrl);
  if (!imgCheck.isValid) {
    return { success: false, error: imgCheck.error };
  }

  const supabase = await createClient();

  const insertRecord: Record<string, unknown> = {
    name,
    merchant,
    affiliate_url: affiliateUrl,
    image_url: imageUrl,
    short_description: shortDescription,
    category,
    is_active: isActive,
    display_order: displayOrder,
  };
  const PILOT_PRODUCT_ID = "051e0c4c-b157-4725-b02f-430170314243";
  if (payload.id) {
    insertRecord.id = payload.id;
  } else if (name === "Shrimad Bhagwat – Shankar Bhashya, Gita Press Gorakhpur") {
    insertRecord.id = PILOT_PRODUCT_ID;
  }

  const { data, error } = await supabase
    .from("affiliate_products")
    .insert(insertRecord)
    .select("id")
    .single();

  if (error) {
    console.error("[createAffiliateProductAction] Database error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/affiliate-products");
  revalidatePath("/shop");
  revalidatePath("/");
  return {
    success: true,
    message: "उत्पाद सफलतापूर्वक जोड़ा गया। (Product added successfully)",
    productId: data?.id,
  };
}

/**
 * Server Action: Update an affiliate product in the master catalog.
 */
export async function updateAffiliateProductAction(
  payload: AffiliateProductInputPayload
): Promise<AffiliateActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!payload.id) {
    return { success: false, error: "Product ID is required for update." };
  }

  const name = payload.name?.trim();
  const merchant = payload.merchant?.trim() || "amazon_in";
  const affiliateUrl = payload.affiliate_url?.trim();
  const imageUrl = payload.image_url?.trim() || null;
  const shortDescription = payload.short_description?.trim() || null;
  const category = payload.category?.trim() || null;
  const isActive = payload.is_active !== undefined ? Boolean(payload.is_active) : true;
  const displayOrder = Number.isInteger(payload.display_order)
    ? Number(payload.display_order)
    : 0;

  if (!name) {
    return { success: false, error: "Product name is required." };
  }

  if (!merchant) {
    return { success: false, error: "Merchant name is required." };
  }

  const urlCheck = validateAffiliateUrl(affiliateUrl);
  if (!urlCheck.isValid) {
    return { success: false, error: urlCheck.error };
  }

  const imgCheck = validateImageUrl(imageUrl);
  if (!imgCheck.isValid) {
    return { success: false, error: imgCheck.error };
  }

  const supabase = await createClient();

  // Fetch current product to check previous image_url for cleanup if changed
  const { data: currentProduct } = await supabase
    .from("affiliate_products")
    .select("image_url")
    .eq("id", payload.id)
    .single();

  const { error } = await supabase
    .from("affiliate_products")
    .update({
      name,
      merchant,
      affiliate_url: affiliateUrl,
      image_url: imageUrl,
      short_description: shortDescription,
      category,
      is_active: isActive,
      display_order: displayOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.id);

  if (error) {
    console.error("[updateAffiliateProductAction] Database error:", error);
    return { success: false, error: error.message };
  }

  // If image was replaced or cleared, safely clean up old file from storage if within namespace
  if (currentProduct?.image_url && currentProduct.image_url !== imageUrl) {
    const oldPath = extractStoragePathFromUrl(currentProduct.image_url, MEDIA_BUCKET_NAME);
    if (oldPath && isPathInAffiliateNamespace(payload.id, oldPath)) {
      try {
        await supabase.storage.from(MEDIA_BUCKET_NAME).remove([oldPath]);
      } catch (cleanupEx) {
        console.warn("[updateAffiliateProductAction] Storage cleanup warning:", cleanupEx);
      }
    }
  }

  revalidatePath("/admin/affiliate-products");
  revalidatePath("/shop");
  revalidatePath("/");
  return {
    success: true,
    message: "उत्पाद सफलतापूर्वक अद्यतन किया गया। (Product updated successfully)",
    productId: payload.id,
  };
}

/**
 * Server Action: Toggle active status of an affiliate product.
 * Preserves the product and article relationships; merely hides/shows from public views.
 */
export async function toggleAffiliateProductActiveAction(
  id: string,
  isActive: boolean
): Promise<AffiliateActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!id) {
    return { success: false, error: "Product ID is required." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("affiliate_products")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[toggleAffiliateProductActiveAction] Database error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/affiliate-products");
  revalidatePath("/shop");
  revalidatePath("/");
  return {
    success: true,
    message: isActive ? "उत्पाद सक्रिय किया गया।" : "उत्पाद निष्क्रिय किया गया।",
  };
}

/**
 * Server Action: Delete an affiliate product from the catalog.
 * Database foreign key cascade automatically cleans up article_affiliate_products junction records.
 * Also safely removes product image from storage if within affiliate namespace.
 */
export async function deleteAffiliateProductAction(
  id: string
): Promise<AffiliateActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!id) {
    return { success: false, error: "Product ID is required." };
  }

  const supabase = await createClient();

  // Clean up any storage image belonging to this product
  const { data: prodData } = await supabase
    .from("affiliate_products")
    .select("image_url")
    .eq("id", id)
    .single();

  if (prodData?.image_url) {
    const path = extractStoragePathFromUrl(prodData.image_url, MEDIA_BUCKET_NAME);
    if (path && isPathInAffiliateNamespace(id, path)) {
      try {
        await supabase.storage.from(MEDIA_BUCKET_NAME).remove([path]);
      } catch (e) {
        console.warn("[deleteAffiliateProductAction] Storage cleanup warning:", e);
      }
    }
  }

  const { error } = await supabase
    .from("affiliate_products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[deleteAffiliateProductAction] Database error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/affiliate-products");
  revalidatePath("/shop");
  revalidatePath("/");
  return {
    success: true,
    message: "उत्पाद सफलतापूर्वक हटाया गया। (Product deleted successfully)",
  };
}

/**
 * Server Action: Attach a product to an article.
 * Enforces maximum of 3 products per article limit.
 */
export async function attachProductToArticleAction(
  articleId: string,
  productId: string,
  contextualNote?: string | null,
  sortOrder?: number
): Promise<AffiliateActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!articleId || !productId) {
    return { success: false, error: "Both article ID and product ID are required." };
  }

  const supabase = await createClient();

  // Enforce maximum 3 products per article
  const { count, error: countError } = await supabase
    .from("article_affiliate_products")
    .select("id", { count: "exact", head: true })
    .eq("article_id", articleId);

  if (countError) {
    console.error("[attachProductToArticleAction] Count error:", countError);
    return { success: false, error: countError.message };
  }

  if ((count ?? 0) >= 3) {
    return {
      success: false,
      error:
        "इस लेख के लिए अधिकतम 3 उत्पाद पहले से जुड़े हैं। (Maximum 3 products allowed per article)",
    };
  }

  const assignedOrder =
    Number.isInteger(sortOrder) && (sortOrder ?? 0) > 0
      ? Number(sortOrder)
      : (count ?? 0) + 1;

  const { error } = await supabase.from("article_affiliate_products").insert({
    article_id: articleId,
    product_id: productId,
    contextual_note: contextualNote?.trim() || null,
    sort_order: assignedOrder,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "यह उत्पाद इस लेख में पहले से जुड़ा हुआ है। (Product already attached)",
      };
    }
    console.error("[attachProductToArticleAction] Insert error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/articles");
  return {
    success: true,
    message: "उत्पाद सफलतापूर्वक लेख से जोड़ा गया।",
  };
}

/**
 * Server Action: Update relationship metadata (contextual note, sort order) for an article.
 */
export async function updateArticleAffiliateRelationAction(
  articleId: string,
  productId: string,
  contextualNote?: string | null,
  sortOrder?: number
): Promise<AffiliateActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!articleId || !productId) {
    return { success: false, error: "Both article ID and product ID are required." };
  }

  const supabase = await createClient();

  const updates: Record<string, unknown> = {
    contextual_note: contextualNote?.trim() || null,
  };

  if (Number.isInteger(sortOrder)) {
    updates.sort_order = Number(sortOrder);
  }

  const { error } = await supabase
    .from("article_affiliate_products")
    .update(updates)
    .eq("article_id", articleId)
    .eq("product_id", productId);

  if (error) {
    console.error("[updateArticleAffiliateRelationAction] Error:", error);
    return { success: false, error: error.message };
  }

  return { success: true, message: "संबंध विवरण अद्यतन किया गया।" };
}

/**
 * Server Action: Remove product relationship from an article.
 */
export async function removeProductFromArticleAction(
  articleId: string,
  productId: string
): Promise<AffiliateActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!articleId || !productId) {
    return { success: false, error: "Both article ID and product ID are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("article_affiliate_products")
    .delete()
    .eq("article_id", articleId)
    .eq("product_id", productId);

  if (error) {
    console.error("[removeProductFromArticleAction] Delete error:", error);
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "उत्पाद लेख से हटाया गया। (Removed from article)",
  };
}

export interface AttachedProductRelationItem {
  id: string;
  article_id: string;
  product_id: string;
  sort_order: number;
  contextual_note: string | null;
  affiliate_products: {
    id: string;
    name: string;
    merchant: string;
    affiliate_url: string;
    image_url: string | null;
    category: string | null;
    is_active: boolean;
  } | null;
}

/**
 * Server Action: Retrieve products attached to an article for the editor.
 */
export async function getArticleAttachedProductsAction(
  articleId: string
): Promise<AttachedProductRelationItem[]> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return [];
  }

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
      affiliate_products (
        id,
        name,
        merchant,
        affiliate_url,
        image_url,
        category,
        is_active
      )
    `)
    .eq("article_id", articleId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getArticleAttachedProductsAction] Error:", error);
    return [];
  }

  return (data as unknown as AttachedProductRelationItem[]) || [];
}

export interface UploadAffiliateProductImageResponse {
  success: boolean;
  imageUrl?: string;
  storagePath?: string;
  error?: string;
  dimensions?: { width: number; height: number };
}

export interface DeleteAffiliateProductImageResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Server Action: Uploads or replaces an image for an affiliate product.
 * Stored in Supabase Storage bucket 'bhaktimania-media' under:
 * affiliate-products/{productId}/{uniqueId}.{extension}
 * 
 * Strict execution order for replacement:
 * 1. Authorize admin.
 * 2. Validate product UUID & file buffer.
 * 3. Upload new image.
 * 4. Confirm upload succeeded & resolve public URL.
 * 5. Update affiliate_products.image_url in database.
 * 6. Confirm database update succeeded.
 * 7. Safely delete old storage object (only if within affiliate-products/{productId}/).
 * 
 * Never deletes the old image first.
 * Never touches external URLs or objects outside affiliate-products/{productId}/.
 */
export async function uploadAffiliateProductImageAction(
  formData: FormData
): Promise<UploadAffiliateProductImageResponse> {
  // 1. Authorize Admin
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to upload product media.",
    };
  }

  // 2. Validate Product UUID
  const productId = formData.get("productId")?.toString()?.trim() || "";
  if (!productId || !isValidProductId(productId)) {
    return {
      success: false,
      error: "A valid product ID is required to upload product media.",
    };
  }

  // 3. Validate File Presence
  const file = formData.get("file") as File | null;
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return {
      success: false,
      error: "Please select an image file to upload.",
    };
  }

  // 4. Verify Product Exists in Database
  const supabase = await createClient();
  const { data: product, error: productErr } = await supabase
    .from("affiliate_products")
    .select("id, image_url")
    .eq("id", productId)
    .single();

  if (productErr || !product) {
    return {
      success: false,
      error: "Product record not found in catalog.",
    };
  }

  // 5. Server-side Image Buffer Validation (Magic bytes, format, size, dimensions)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const validation = validateImageBuffer(buffer, file.name);

  if (!validation.valid || !validation.extension) {
    return {
      success: false,
      error: validation.error || "Invalid image file.",
    };
  }

  // 6. Generate Scoped Server-side Storage Path
  const storagePath = generateAffiliateProductImagePath(productId, validation.extension);

  // 7. Step 1: Upload new image to Supabase Storage
  const { error: uploadErr } = await supabase.storage
    .from(MEDIA_BUCKET_NAME)
    .upload(storagePath, buffer, {
      contentType: validation.mimeType || "image/webp",
      upsert: false,
    });

  if (uploadErr) {
    console.error("[uploadAffiliateProductImageAction] Storage upload failed:", uploadErr);
    return {
      success: false,
      error: `Storage upload failed: ${uploadErr.message}`,
    };
  }

  // 8. Step 2: Confirm upload succeeded & get public URL
  const { data: publicUrlData } = supabase.storage
    .from(MEDIA_BUCKET_NAME)
    .getPublicUrl(storagePath);

  const newImageUrl = publicUrlData?.publicUrl;
  if (!newImageUrl) {
    await supabase.storage.from(MEDIA_BUCKET_NAME).remove([storagePath]);
    return {
      success: false,
      error: "Failed to resolve public URL for uploaded media.",
    };
  }

  // 9. Step 3: Update database affiliate_products.image_url
  const oldImageUrl = product.image_url;
  const { error: updateErr } = await supabase
    .from("affiliate_products")
    .update({
      image_url: newImageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  // 10. Step 4: Confirm database update succeeded
  if (updateErr) {
    console.error("[uploadAffiliateProductImageAction] Database update failed:", updateErr);
    await supabase.storage.from(MEDIA_BUCKET_NAME).remove([storagePath]);
    return {
      success: false,
      error: `Database update failed: ${updateErr.message}. Old image preserved.`,
    };
  }

  // 11. Step 5: Safely clean up old storage object (if replacement)
  if (oldImageUrl && oldImageUrl !== newImageUrl) {
    const oldPath = extractStoragePathFromUrl(oldImageUrl, MEDIA_BUCKET_NAME);
    if (oldPath && isPathInAffiliateNamespace(productId, oldPath)) {
      try {
        await supabase.storage.from(MEDIA_BUCKET_NAME).remove([oldPath]);
      } catch (cleanupEx) {
        console.warn("[uploadAffiliateProductImageAction] Old image cleanup warning:", cleanupEx);
      }
    }
  }

  // 12. Revalidate admin and public paths
  revalidatePath("/admin/affiliate-products");
  revalidatePath("/shop");
  revalidatePath("/");

  return {
    success: true,
    imageUrl: newImageUrl,
    storagePath,
    dimensions: validation.dimensions,
  };
}

/**
 * Server Action: Removes product image from Supabase Storage (if inside affiliate namespace)
 * and sets affiliate_products.image_url = NULL.
 * 
 * Strict Security Boundary:
 * 1. Current user must be an authenticated administrator.
 * 2. productId must be a valid UUID and product must exist.
 * 3. Never attempts to delete external URLs or files outside affiliate-products/{productId}/.
 */
export async function deleteAffiliateProductImageAction(
  productId: string
): Promise<DeleteAffiliateProductImageResponse> {
  // 1. Authorize Admin
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to delete product media.",
    };
  }

  // 2. Validate Product UUID
  const cleanId = productId?.trim() || "";
  if (!cleanId || !isValidProductId(cleanId)) {
    return {
      success: false,
      error: "Invalid product ID specified.",
    };
  }

  const supabase = await createClient();

  // 3. Fetch product
  const { data: product, error: fetchErr } = await supabase
    .from("affiliate_products")
    .select("id, image_url")
    .eq("id", cleanId)
    .single();

  if (fetchErr || !product) {
    return {
      success: false,
      error: "Product not found.",
    };
  }

  // 4. If current image is in our affiliate storage namespace, delete it
  if (product.image_url) {
    const currentPath = extractStoragePathFromUrl(product.image_url, MEDIA_BUCKET_NAME);
    if (currentPath && isPathInAffiliateNamespace(cleanId, currentPath)) {
      const { error: storageErr } = await supabase.storage
        .from(MEDIA_BUCKET_NAME)
        .remove([currentPath]);

      if (storageErr) {
        console.error("[deleteAffiliateProductImageAction] Storage delete failed:", storageErr);
      }
    }
  }

  // 5. Clear image_url in database
  const { error: dbErr } = await supabase
    .from("affiliate_products")
    .update({
      image_url: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cleanId);

  if (dbErr) {
    console.error("[deleteAffiliateProductImageAction] Database clear failed:", dbErr);
    return {
      success: false,
      error: `Database clear failed: ${dbErr.message}`,
    };
  }

  // 6. Revalidate paths
  revalidatePath("/admin/affiliate-products");
  revalidatePath("/shop");
  revalidatePath("/");

  return {
    success: true,
    message: "Product image removed successfully.",
  };
}

