"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { validateImageBuffer } from "@/lib/storage/image-validation";
import {
  MEDIA_BUCKET_NAME,
  isValidArticleId,
  generateFeaturedImagePath,
  isPathInArticleNamespace,
  extractStoragePathFromUrl,
} from "@/lib/storage/storage-path";

export interface UploadFeaturedImageResponse {
  success: boolean;
  imageUrl?: string;
  storagePath?: string;
  error?: string;
  dimensions?: { width: number; height: number };
  dimensionAdvisory?: string;
  cleanupWarning?: string;
}

export interface DeleteFeaturedImageResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Server Action: Uploads or replaces a featured image for an existing article draft or published article.
 * 
 * Strict execution order for replacement:
 * 1. Upload new image.
 * 2. Confirm upload succeeded.
 * 3. Update article.featured_image_url in database.
 * 4. Confirm database update succeeded.
 * 5. Safely delete old storage object (if replacement).
 * 
 * Never deletes the old image first.
 * Does NOT alter article publishing lifecycle or draft privacy.
 */
export async function uploadFeaturedImageAction(
  formData: FormData
): Promise<UploadFeaturedImageResponse> {
  // 1. Authorize Admin
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to upload article media.",
    };
  }

  // 2. Validate Article UUID
  const articleId = formData.get("articleId")?.toString()?.trim() || "";
  if (!articleId || !isValidArticleId(articleId)) {
    return {
      success: false,
      error: "A valid saved article is required to upload featured media.",
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

  // 4. Verify Article Exists in Database
  const supabase = await createClient();
  const { data: article, error: articleErr } = await supabase
    .from("articles")
    .select("id, slug, status, featured_image_url")
    .eq("id", articleId)
    .single();

  if (articleErr || !article) {
    return {
      success: false,
      error: "Article record not found. Please save the article draft first.",
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
  const storagePath = generateFeaturedImagePath(articleId, validation.extension);

  // 7. Step 1: Upload new image
  const { error: uploadErr } = await supabase.storage
    .from(MEDIA_BUCKET_NAME)
    .upload(storagePath, buffer, {
      contentType: validation.mimeType || "image/webp",
      upsert: false,
    });

  if (uploadErr) {
    console.error("[actions/uploadFeaturedImageAction] Storage upload failed:", uploadErr);
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
    // Roll back new upload if public URL cannot be obtained
    await supabase.storage.from(MEDIA_BUCKET_NAME).remove([storagePath]);
    return {
      success: false,
      error: "Failed to resolve public URL for uploaded media.",
    };
  }

  // 9. Step 3: Update database featured_image_url
  const oldImageUrl = article.featured_image_url;
  const { error: updateErr } = await supabase
    .from("articles")
    .update({
      featured_image_url: newImageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId);

  // 10. Step 4: Confirm database update succeeded
  if (updateErr) {
    console.error("[actions/uploadFeaturedImageAction] Database update failed:", updateErr);
    // Roll back newly uploaded storage object to avoid orphaned storage file
    await supabase.storage.from(MEDIA_BUCKET_NAME).remove([storagePath]);
    return {
      success: false,
      error: `Database update failed: ${updateErr.message}. Old image preserved.`,
    };
  }

  // 11. Step 5: Safely clean up old storage object (if replacement)
  let cleanupWarning: string | undefined;
  if (oldImageUrl && oldImageUrl !== newImageUrl) {
    const oldPath = extractStoragePathFromUrl(oldImageUrl, MEDIA_BUCKET_NAME);
    if (oldPath && isPathInArticleNamespace(articleId, oldPath)) {
      try {
        const { error: cleanupErr } = await supabase.storage
          .from(MEDIA_BUCKET_NAME)
          .remove([oldPath]);

        if (cleanupErr) {
          console.warn("[actions/uploadFeaturedImageAction] Old image cleanup warning:", cleanupErr.message);
          cleanupWarning = `New image activated, but previous file cleanup encountered an issue: ${cleanupErr.message}`;
        }
      } catch (cleanupEx) {
        console.warn("[actions/uploadFeaturedImageAction] Old image cleanup exception:", cleanupEx);
        cleanupWarning = "New image activated. Previous file cleanup was deferred.";
      }
    }
  }

  // 12. Revalidate admin and public paths
  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${articleId}/edit`);
  if (article.status === "published" && article.slug) {
    revalidatePath(`/bhakti-gyaan/${article.slug}`);
    revalidatePath("/bhakti-gyaan");
    revalidatePath("/");
  }

  return {
    success: true,
    imageUrl: newImageUrl,
    storagePath,
    dimensions: validation.dimensions,
    dimensionAdvisory: validation.dimensionAdvisory,
    cleanupWarning,
  };
}

/**
 * Server Action: Deletes a featured image object and unsets the article's featured_image_url.
 * 
 * Strict Security Boundary:
 * 1. Current user must be an authenticated administrator.
 * 2. articleId must be a valid UUID and article must exist.
 * 3. storagePath must strictly reside in articles/{articleId}/...
 * 4. Verifies the storage path corresponds to the article's current image or namespace.
 */
export async function deleteFeaturedImageAction(
  articleId: string,
  storagePath: string
): Promise<DeleteFeaturedImageResponse> {
  // 1. Authorize Admin
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to delete article media.",
    };
  }

  // 2. Validate Article UUID
  const cleanId = articleId?.trim() || "";
  if (!cleanId || !isValidArticleId(cleanId)) {
    return {
      success: false,
      error: "Invalid article ID specified.",
    };
  }

  // 3. Validate Storage Path Namespace
  const cleanPath = storagePath?.trim() || "";
  if (!cleanPath || !isPathInArticleNamespace(cleanId, cleanPath)) {
    return {
      success: false,
      error: "Permission denied: Storage path does not belong to this article's namespace.",
    };
  }

  const supabase = await createClient();

  // 4. Fetch Article and Confirm Ownership
  const { data: article, error: fetchErr } = await supabase
    .from("articles")
    .select("id, slug, status, featured_image_url")
    .eq("id", cleanId)
    .single();

  if (fetchErr || !article) {
    return {
      success: false,
      error: "Article not found for image deletion.",
    };
  }

  // 5. Delete Object from Supabase Storage
  const { error: storageErr } = await supabase.storage
    .from(MEDIA_BUCKET_NAME)
    .remove([cleanPath]);

  if (storageErr) {
    console.error("[actions/deleteFeaturedImageAction] Storage delete failed:", storageErr);
    return {
      success: false,
      error: `Failed to delete image file from storage: ${storageErr.message}`,
    };
  }

  // 6. Clear featured_image_url on the article record if it matches
  const currentPath = article.featured_image_url
    ? extractStoragePathFromUrl(article.featured_image_url, MEDIA_BUCKET_NAME)
    : null;

  if (currentPath === cleanPath || !article.featured_image_url) {
    const { error: dbErr } = await supabase
      .from("articles")
      .update({
        featured_image_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cleanId);

    if (dbErr) {
      console.error("[actions/deleteFeaturedImageAction] Database clear failed:", dbErr);
      return {
        success: false,
        error: `Image deleted from storage, but database reference update failed: ${dbErr.message}`,
      };
    }
  }

  // 7. Revalidate paths
  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${cleanId}/edit`);
  if (article.status === "published" && article.slug) {
    revalidatePath(`/bhakti-gyaan/${article.slug}`);
    revalidatePath("/bhakti-gyaan");
    revalidatePath("/");
  }

  return {
    success: true,
    message: "Featured image deleted successfully.",
  };
}

export interface GenerateAiImageResponse {
  success: boolean;
  candidate?: {
    imageUrl: string;
    prompt: string;
    altText: string;
    seed: number;
  };
  error?: string;
}

/**
 * Server Action: Generates a topic-aware devotional AI image preview candidate.
 * This does NOT save or commit to Supabase Storage until the user confirms.
 */
export async function generateAiImagePreviewAction(params: {
  title: string;
  category?: string;
  categorySlug?: string;
  description?: string;
  seed?: number;
}): Promise<GenerateAiImageResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to generate article artwork.",
    };
  }

  if (!params.title || !params.title.trim()) {
    return {
      success: false,
      error: "An article title is required to generate a relevant devotional image.",
    };
  }

  try {
    const { generateDevotionalImageCandidate } = await import("@/lib/ai/ai-image");
    const candidate = generateDevotionalImageCandidate({
      title: params.title,
      category: params.category,
      categorySlug: params.categorySlug,
      description: params.description,
      seed: params.seed,
    });

    return {
      success: true,
      candidate,
    };
  } catch (err: unknown) {
    console.error("[actions/generateAiImagePreviewAction] Generation failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to generate AI artwork preview.",
    };
  }
}

export interface ApplyAiImageResponse {
  success: boolean;
  imageUrl?: string;
  altText?: string;
  storagePath?: string;
  cleanupWarning?: string;
  error?: string;
}

/**
 * Server Action: Commits an AI-generated preview image to Supabase Storage and attaches it to the article.
 */
export async function applyAiGeneratedImageAction(params: {
  articleId: string;
  imageUrl: string;
  altText?: string;
}): Promise<ApplyAiImageResponse> {
  // 1. Authorize Admin
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to save article artwork.",
    };
  }

  // 2. Validate Article UUID
  const cleanId = params.articleId?.trim() || "";
  if (!cleanId || !isValidArticleId(cleanId)) {
    return {
      success: false,
      error: "A valid saved article is required to store featured media.",
    };
  }

  if (!params.imageUrl || !params.imageUrl.startsWith("http")) {
    return {
      success: false,
      error: "A valid image URL is required to save artwork.",
    };
  }

  const supabase = await createClient();

  // 3. Verify Article Exists
  const { data: article, error: articleErr } = await supabase
    .from("articles")
    .select("id, slug, status, featured_image_url")
    .eq("id", cleanId)
    .single();

  if (articleErr || !article) {
    return {
      success: false,
      error: "Article record not found. Please save the article draft first.",
    };
  }

  try {
    // 4. Download image buffer server-side
    const response = await fetch(params.imageUrl);
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to download candidate image from provider (HTTP ${response.status}).`,
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Validate Image Buffer
    const validation = validateImageBuffer(buffer, "ai-devotional.jpg");
    if (!validation.valid || !validation.extension) {
      return {
        success: false,
        error: validation.error || "Generated artwork could not be validated.",
      };
    }

    // 6. Generate Scoped Server-side Storage Path
    const storagePath = generateFeaturedImagePath(cleanId, validation.extension);

    // 7. Upload to Supabase Storage
    const { error: uploadErr } = await supabase.storage
      .from(MEDIA_BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: validation.mimeType || "image/jpeg",
        upsert: false,
      });

    if (uploadErr) {
      console.error("[actions/useAiGeneratedImageAction] Storage upload failed:", uploadErr);
      return {
        success: false,
        error: `Storage upload failed: ${uploadErr.message}`,
      };
    }

    // 8. Confirm upload & get public URL
    const { data: publicUrlData } = supabase.storage
      .from(MEDIA_BUCKET_NAME)
      .getPublicUrl(storagePath);

    const permanentUrl = publicUrlData?.publicUrl;
    if (!permanentUrl) {
      await supabase.storage.from(MEDIA_BUCKET_NAME).remove([storagePath]);
      return {
        success: false,
        error: "Failed to resolve public URL for stored artwork.",
      };
    }

    // 9. Update database record
    const oldImageUrl = article.featured_image_url;
    const updatePayload: Record<string, unknown> = {
      featured_image_url: permanentUrl,
      updated_at: new Date().toISOString(),
    };
    if (params.altText && params.altText.trim()) {
      updatePayload.featured_image_alt = params.altText.trim();
    }

    const { error: updateErr } = await supabase
      .from("articles")
      .update(updatePayload)
      .eq("id", cleanId);

    if (updateErr) {
      console.error("[actions/useAiGeneratedImageAction] Database update failed:", updateErr);
      await supabase.storage.from(MEDIA_BUCKET_NAME).remove([storagePath]);
      return {
        success: false,
        error: `Database update failed: ${updateErr.message}.`,
      };
    }

    // 10. Clean up old storage object if replacement
    let cleanupWarning: string | undefined;
    if (oldImageUrl && oldImageUrl !== permanentUrl) {
      const oldPath = extractStoragePathFromUrl(oldImageUrl, MEDIA_BUCKET_NAME);
      if (oldPath && isPathInArticleNamespace(cleanId, oldPath)) {
        try {
          const { error: cleanupErr } = await supabase.storage
            .from(MEDIA_BUCKET_NAME)
            .remove([oldPath]);

          if (cleanupErr) {
            cleanupWarning = `Artwork activated, but previous file cleanup warning: ${cleanupErr.message}`;
          }
        } catch {
          cleanupWarning = "Artwork activated. Previous file cleanup was deferred.";
        }
      }
    }

    // 11. Revalidate paths
    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${cleanId}/edit`);
    if (article.status === "published" && article.slug) {
      revalidatePath(`/bhakti-gyaan/${article.slug}`);
      revalidatePath("/bhakti-gyaan");
      revalidatePath("/");
    }

    return {
      success: true,
      imageUrl: permanentUrl,
      altText: params.altText,
      storagePath,
      cleanupWarning,
    };
  } catch (err: unknown) {
    console.error("[actions/useAiGeneratedImageAction] Exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred while storing artwork.",
    };
  }
}

