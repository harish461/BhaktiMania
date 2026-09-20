"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { isSlugUnique } from "@/lib/data/supabase/admin";
import type { ArticleSection } from "@/lib/data/articles";

export interface ArticleInputPayload {
  id?: string;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  author_id: string | null;
  status: "draft" | "published";
  symbol: string;
  read_time: string;
  featured: boolean;
  featured_image_url?: string | null;
  featured_image_alt?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  sections: ArticleSection[];
}

export type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  articleId?: string;
};

/**
 * Server Action: Save article (Create or Update, Draft or Published).
 * Authoritative admin check is enforced before modifying data.
 */
export async function saveArticleAction(
  payload: ArticleInputPayload
): Promise<ActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  // 1. Validation
  const title = payload.title?.trim();
  const slug = payload.slug?.trim().toLowerCase();
  const description = payload.description?.trim();
  const categoryId = payload.category_id?.trim();
  const authorId = payload.author_id?.trim() || null;
  const readTime = payload.read_time?.trim() || "5 मिनट";
  const symbol = payload.symbol?.trim() || "दीप";
  const sections = Array.isArray(payload.sections) ? payload.sections : [];

  if (!title) {
    return { success: false, error: "Article title is required." };
  }

  if (!slug) {
    return { success: false, error: "Article slug is required." };
  }

  // Slug URL-safety check
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return {
      success: false,
      error:
        "Slug must consist of lowercase letters, numbers, and single hyphens (e.g. 'sacchi-bhakti-kya-hai').",
    };
  }

  if (!description) {
    return { success: false, error: "Article description is required." };
  }

  if (!categoryId) {
    return { success: false, error: "Please select a category." };
  }

  if (sections.length === 0) {
    return {
      success: false,
      error: "Article must contain at least one content section.",
    };
  }

  // Validate slug uniqueness
  const slugAvailable = await isSlugUnique(slug, payload.id);
  if (!slugAvailable) {
    return {
      success: false,
      error: `The slug "${slug}" is already taken by another article. Please choose a unique slug.`,
    };
  }

  const supabase = await createClient();

  try {
    if (payload.id) {
      // 2. Update Existing Article
      // Fetch existing record to check published_at lifecycle
      const { data: existing, error: fetchErr } = await supabase
        .from("articles")
        .select("published_at, status")
        .eq("id", payload.id)
        .single();

      if (fetchErr || !existing) {
        return { success: false, error: "Article not found for update." };
      }

      let publishedAt = existing.published_at;
      if (payload.status === "published" && !publishedAt) {
        publishedAt = new Date().toISOString();
      }

      const { error: updateErr } = await supabase
        .from("articles")
        .update({
          title,
          slug,
          description,
          category_id: categoryId,
          author_id: authorId,
          status: payload.status,
          sections,
          symbol,
          read_time: readTime,
          featured: Boolean(payload.featured),
          featured_image_url: payload.featured_image_url?.trim() || null,
          featured_image_alt: payload.featured_image_alt?.trim() || null,
          seo_title: payload.seo_title?.trim() || null,
          seo_description: payload.seo_description?.trim() || null,
          published_at: publishedAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payload.id);

      if (updateErr) {
        console.error("[actions/saveArticleAction] Update error:", updateErr);
        return { success: false, error: `Database update error: ${updateErr.message}` };
      }

      revalidatePath("/admin/articles");
      revalidatePath("/admin/dashboard");
      revalidatePath(`/admin/articles/${payload.id}/edit`);
      revalidatePath("/");
      revalidatePath("/bhakti-gyaan");
      revalidatePath(`/bhakti-gyaan/${slug}`);
      revalidatePath("/sitemap.xml");

      return {
        success: true,
        articleId: payload.id,
        message:
          payload.status === "published"
            ? "Article published successfully."
            : "Draft saved successfully.",
      };
    } else {
      // 3. Create New Article
      const publishedAt =
        payload.status === "published" ? new Date().toISOString() : null;

      const { data: inserted, error: insertErr } = await supabase
        .from("articles")
        .insert({
          title,
          slug,
          description,
          category_id: categoryId,
          author_id: authorId,
          status: payload.status,
          sections,
          symbol,
          read_time: readTime,
          featured: Boolean(payload.featured),
          featured_image_url: payload.featured_image_url?.trim() || null,
          featured_image_alt: payload.featured_image_alt?.trim() || null,
          seo_title: payload.seo_title?.trim() || null,
          seo_description: payload.seo_description?.trim() || null,
          published_at: publishedAt,
        })
        .select("id")
        .single();

      if (insertErr || !inserted) {
        console.error("[actions/saveArticleAction] Insert error:", insertErr);
        return {
          success: false,
          error: `Database insert error: ${insertErr?.message || "Unknown error"}`,
        };
      }

      revalidatePath("/admin/articles");
      revalidatePath("/admin/dashboard");
      revalidatePath("/");
      revalidatePath("/bhakti-gyaan");
      revalidatePath(`/bhakti-gyaan/${slug}`);
      revalidatePath("/sitemap.xml");

      return {
        success: true,
        articleId: inserted.id,
        message:
          payload.status === "published"
            ? "Article published successfully."
            : "Draft saved successfully.",
      };
    }
  } catch (err: unknown) {
    console.error("[actions/saveArticleAction] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred while saving the article.",
    };
  }
}

/**
 * Server Action: Unpublish an existing published article back to 'draft'.
 */
export async function unpublishArticleAction(
  articleId: string
): Promise<ActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!articleId) {
    return { success: false, error: "Article ID is required." };
  }

  const supabase = await createClient();

  // Fetch article slug for exact cache invalidation
  const { data: targetArticle } = await supabase
    .from("articles")
    .select("slug")
    .eq("id", articleId)
    .single();

  const { error } = await supabase
    .from("articles")
    .update({
      status: "draft",
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId);

  if (error) {
    console.error("[actions/unpublishArticleAction] Error:", error);
    return { success: false, error: `Failed to unpublish article: ${error.message}` };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/articles/${articleId}/edit`);
  revalidatePath("/");
  revalidatePath("/bhakti-gyaan");
  if (targetArticle?.slug) {
    revalidatePath(`/bhakti-gyaan/${targetArticle.slug}`);
  }
  revalidatePath("/sitemap.xml");

  return {
    success: true,
    message: "Article moved to draft.",
  };
}

/**
 * Server Action: Publish an existing draft article.
 * Preserves existing published_at if present; sets to now if null.
 */
export async function publishArticleAction(
  articleId: string
): Promise<ActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!articleId) {
    return { success: false, error: "Article ID is required." };
  }

  const supabase = await createClient();

  // Fetch article to get slug and existing published_at
  const { data: targetArticle, error: fetchErr } = await supabase
    .from("articles")
    .select("slug, published_at")
    .eq("id", articleId)
    .single();

  if (fetchErr || !targetArticle) {
    return { success: false, error: "Article not found." };
  }

  const publishedAt = targetArticle.published_at || new Date().toISOString();

  const { error } = await supabase
    .from("articles")
    .update({
      status: "published",
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId);

  if (error) {
    console.error("[actions/publishArticleAction] Error:", error);
    return { success: false, error: `Failed to publish article: ${error.message}` };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/articles/${articleId}/edit`);
  revalidatePath("/");
  revalidatePath("/bhakti-gyaan");
  if (targetArticle?.slug) {
    revalidatePath(`/bhakti-gyaan/${targetArticle.slug}`);
  }
  revalidatePath("/sitemap.xml");

  return {
    success: true,
    message: "Article published successfully.",
  };
}

/**
 * Server Action: Delete an article.
 * Safety Rule: Only allowed if status === 'draft'. Published articles cannot be deleted.
 */
export async function deleteArticleAction(
  articleId: string
): Promise<ActionResponse> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      success: false,
      error: "You must be an administrator to perform this action.",
    };
  }

  if (!articleId) {
    return { success: false, error: "Article ID is required." };
  }

  const supabase = await createClient();

  // 1. Check article status before attempting deletion
  const { data: article, error: fetchErr } = await supabase
    .from("articles")
    .select("status, title, slug")
    .eq("id", articleId)
    .single();

  if (fetchErr || !article) {
    return { success: false, error: "Article not found." };
  }

  if (article.status === "published") {
    return {
      success: false,
      error: "Published articles cannot be deleted. Move the article to draft first.",
    };
  }

  // 2. Perform deletion for draft/archived
  const { error: deleteErr } = await supabase
    .from("articles")
    .delete()
    .eq("id", articleId);

  if (deleteErr) {
    console.error("[actions/deleteArticleAction] Delete error:", deleteErr);
    return { success: false, error: `Failed to delete article: ${deleteErr.message}` };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  revalidatePath("/bhakti-gyaan");
  if (article.slug) {
    revalidatePath(`/bhakti-gyaan/${article.slug}`);
  }
  revalidatePath("/sitemap.xml");

  return {
    success: true,
    message: "Article deleted successfully.",
  };
}

/**
 * Server Action: Validate slug availability (uniqueness).
 * Debounced by client-side editor.
 */
export async function checkSlugAvailabilityAction(
  slug: string,
  excludeArticleId?: string
): Promise<{ available: boolean; error?: string }> {
  const auth = await getCurrentAdmin();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return { available: false, error: "Unauthorized" };
  }

  const clean = slug?.trim().toLowerCase();
  if (!clean) {
    return { available: false, error: "Slug cannot be empty." };
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(clean)) {
    return {
      available: false,
      error: "Slug must consist of lowercase letters, numbers, and hyphens.",
    };
  }

  try {
    const isAvailable = await isSlugUnique(clean, excludeArticleId);
    return { available: isAvailable };
  } catch (err) {
    console.error("[actions/checkSlugAvailabilityAction] Error:", err);
    return { available: false, error: "Unable to verify slug availability." };
  }
}

