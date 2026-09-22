import { createClient } from "@/lib/supabase/server";
import type { ArticleSection } from "@/lib/data/articles";
import type { DatabaseArticle } from "./types";

export interface AdminArticleListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string;
  author_id: string | null;
  status: "draft" | "published" | "archived";
  symbol: string;
  read_time: string;
  featured: boolean;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categoryTitle: string;
  categorySlug: string;
  authorName: string;
}

export interface AdminArticleDetail extends DatabaseArticle {
  categoryTitle?: string;
  categorySlug?: string;
  authorName?: string;
}

interface RawAdminArticleJoin {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string;
  author_id: string | null;
  status: "draft" | "published" | "archived";
  symbol: string;
  read_time: string;
  featured: boolean;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories: {
    id: string;
    slug: string;
    title: string;
  } | null;
  authors: {
    id: string;
    name: string;
  } | null;
}

/**
 * Fetches articles for the admin article management table.
 * Admins can view draft, published, and archived articles.
 */
export async function getAdminArticles(options?: {
  search?: string;
  status?: string;
  categoryId?: string;
}): Promise<AdminArticleListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select(
      `
      id,
      slug,
      title,
      description,
      category_id,
      author_id,
      status,
      symbol,
      read_time,
      featured,
      featured_image_url,
      featured_image_alt,
      published_at,
      created_at,
      updated_at,
      categories (
        id,
        slug,
        title
      ),
      authors (
        id,
        name
      )
    `
    )
    .order("updated_at", { ascending: false });

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  if (options?.categoryId && options.categoryId !== "all") {
    query = query.eq("category_id", options.categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[supabase/admin] Error fetching admin articles:", error);
    throw new Error(`Failed to fetch admin articles from Supabase: ${error.message}`);
  }

  if (!data) return [];

  const rawList = data as unknown as RawAdminArticleJoin[];

  let items: AdminArticleListItem[] = rawList.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category_id: row.category_id,
    author_id: row.author_id,
    status: row.status,
    symbol: row.symbol,
    read_time: row.read_time,
    featured: row.featured,
    featured_image_url: row.featured_image_url || null,
    featured_image_alt: row.featured_image_alt || null,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    categoryTitle: row.categories?.title || "Unknown Category",
    categorySlug: row.categories?.slug || "",
    authorName: row.authors?.name || "BhaktiMania Editorial Team",
  }));

  // In-memory search by title or slug if provided
  if (options?.search && options.search.trim()) {
    const term = options.search.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.slug.toLowerCase().includes(term)
    );
  }

  return items;
}

/**
 * Fetches a single article by its UUID for the admin editor.
 */
export async function getAdminArticleById(id: string): Promise<AdminArticleDetail | null> {
  if (!id || typeof id !== "string") return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select(
      `
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
      categories (
        id,
        slug,
        title
      ),
      authors (
        id,
        name
      )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`[supabase/admin] Error fetching article by ID ${id}:`, error);
    throw new Error(`Failed to fetch article from Supabase: ${error.message}`);
  }

  if (!data) return null;

  const raw = data as unknown as RawAdminArticleJoin & {
    sections: ArticleSection[];
    featured_image_url: string | null;
    featured_image_alt: string | null;
    seo_title: string | null;
    seo_description: string | null;
  };

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    description: raw.description,
    category_id: raw.category_id,
    author_id: raw.author_id,
    status: raw.status,
    sections: Array.isArray(raw.sections) ? raw.sections : [],
    symbol: raw.symbol,
    read_time: raw.read_time,
    featured: raw.featured,
    featured_image_url: raw.featured_image_url,
    featured_image_alt: raw.featured_image_alt,
    seo_title: raw.seo_title,
    seo_description: raw.seo_description,
    published_at: raw.published_at,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    categoryTitle: raw.categories?.title,
    categorySlug: raw.categories?.slug,
    authorName: raw.authors?.name,
  };
}

/**
 * Validates whether a slug is unique in the public.articles table.
 * If excludeArticleId is provided, ignores that article's own record.
 */
export async function isSlugUnique(
  slug: string,
  excludeArticleId?: string
): Promise<boolean> {
  const cleanSlug = slug.trim().toLowerCase();
  if (!cleanSlug) return false;

  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select("id")
    .eq("slug", cleanSlug);

  if (excludeArticleId) {
    query = query.neq("id", excludeArticleId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[supabase/admin] Error checking slug uniqueness:", error);
    throw new Error(`Failed to check slug uniqueness: ${error.message}`);
  }

  return !data || data.length === 0;
}

export interface AdminCategoryListItem {
  id: string;
  slug: string;
  title: string;
  meta_title: string;
  description: string;
  symbol: string;
  intro: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  articleCount: number;
}

interface RawCategoryJoin {
  id: string;
  slug: string;
  title: string;
  meta_title: string;
  description: string;
  symbol: string;
  intro: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  articles?: Array<{ count: number }> | null;
}

/**
 * Fetches all categories (active and inactive) with associated article counts for admin management.
 * Ordered by sort_order ascending.
 */
export async function getAdminCategories(): Promise<AdminCategoryListItem[]> {
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
      is_active,
      created_at,
      updated_at,
      articles(count)
    `
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[supabase/admin] Error fetching admin categories:", error);
    throw new Error(`Failed to fetch admin categories from Supabase: ${error.message}`);
  }

  if (!data) return [];

  const rawList = data as unknown as RawCategoryJoin[];

  return rawList.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    meta_title: row.meta_title,
    description: row.description,
    symbol: row.symbol,
    intro: row.intro,
    sort_order: row.sort_order,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    articleCount: row.articles?.[0]?.count ?? 0,
  }));
}

/**
 * Fetches a single category by ID for the admin editor.
 */
export async function getAdminCategoryById(
  id: string
): Promise<AdminCategoryListItem | null> {
  if (!id || typeof id !== "string") return null;

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
      is_active,
      created_at,
      updated_at,
      articles(count)
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`[supabase/admin] Error fetching category by ID ${id}:`, error);
    throw new Error(`Failed to fetch category from Supabase: ${error.message}`);
  }

  if (!data) return null;

  const row = data as unknown as RawCategoryJoin;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    meta_title: row.meta_title,
    description: row.description,
    symbol: row.symbol,
    intro: row.intro,
    sort_order: row.sort_order,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    articleCount: row.articles?.[0]?.count ?? 0,
  };
}

/**
 * Validates whether a slug is unique in the public.categories table.
 * If excludeCategoryId is provided, ignores that category's own record.
 */
export async function isCategorySlugUnique(
  slug: string,
  excludeCategoryId?: string
): Promise<boolean> {
  const cleanSlug = slug.trim().toLowerCase();
  if (!cleanSlug) return false;

  const supabase = await createClient();

  let query = supabase
    .from("categories")
    .select("id")
    .eq("slug", cleanSlug);

  if (excludeCategoryId) {
    query = query.neq("id", excludeCategoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[supabase/admin] Error checking category slug uniqueness:", error);
    throw new Error(`Failed to check category slug uniqueness: ${error.message}`);
  }

  return !data || data.length === 0;
}

export interface AdminAuthorListItem {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  articleCount: number;
}

interface RawAuthorJoin {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  articles?: Array<{ count: number }> | null;
}

/**
 * Fetches all authors (active and inactive) with associated article counts for admin management.
 * Ordered by name ascending.
 */
export async function getAdminAuthors(options?: {
  search?: string;
  status?: "all" | "active" | "inactive";
}): Promise<AdminAuthorListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("authors")
    .select(
      `
      id,
      slug,
      name,
      role,
      bio,
      avatar_url,
      is_active,
      created_at,
      updated_at,
      articles(count)
    `
    )
    .order("name", { ascending: true });

  if (options?.status && options.status !== "all") {
    query = query.eq("is_active", options.status === "active");
  }

  const { data, error } = await query;

  if (error) {
    console.error("[supabase/admin] Error fetching admin authors:", error);
    throw new Error(`Failed to fetch admin authors from Supabase: ${error.message}`);
  }

  if (!data) return [];

  const rawList = data as unknown as RawAuthorJoin[];

  let items: AdminAuthorListItem[] = rawList.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    bio: row.bio,
    avatar_url: row.avatar_url,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    articleCount: row.articles?.[0]?.count ?? 0,
  }));

  if (options?.search) {
    const q = options.search.trim().toLowerCase();
    items = items.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q)
    );
  }

  return items;
}

/**
 * Fetches a single author by ID for the admin editor.
 */
export async function getAdminAuthorById(
  id: string
): Promise<AdminAuthorListItem | null> {
  if (!id || typeof id !== "string") return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("authors")
    .select(
      `
      id,
      slug,
      name,
      role,
      bio,
      avatar_url,
      is_active,
      created_at,
      updated_at,
      articles(count)
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`[supabase/admin] Error fetching author by ID ${id}:`, error);
    throw new Error(`Failed to fetch author from Supabase: ${error.message}`);
  }

  if (!data) return null;

  const row = data as unknown as RawAuthorJoin;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    bio: row.bio,
    avatar_url: row.avatar_url,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    articleCount: row.articles?.[0]?.count ?? 0,
  };
}

/**
 * Fetches all authors (both active and inactive) for the article editor.
 * Allows displaying inactive authors when already assigned to an article.
 */
export async function getAllAuthorsForEditor() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("authors")
    .select("id, slug, name, role, bio, avatar_url, is_active, created_at, updated_at")
    .order("name", { ascending: true });

  if (error) {
    console.error("[supabase/admin] Error fetching all authors for editor:", error);
    throw new Error(`Failed to fetch authors for editor: ${error.message}`);
  }

  return (data || []) as import("./types").DatabaseAuthor[];
}

/**
 * Validates whether an author slug is unique in the public.authors table.
 * If excludeAuthorId is provided, ignores that author's own record.
 */
export async function isAuthorSlugUnique(
  slug: string,
  excludeAuthorId?: string
): Promise<boolean> {
  const cleanSlug = slug.trim().toLowerCase();
  if (!cleanSlug) return false;

  const supabase = await createClient();

  let query = supabase
    .from("authors")
    .select("id")
    .eq("slug", cleanSlug);

  if (excludeAuthorId) {
    query = query.neq("id", excludeAuthorId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[supabase/admin] Error checking author slug uniqueness:", error);
    throw new Error(`Failed to check author slug uniqueness: ${error.message}`);
  }

  return !data || data.length === 0;
}

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  archivedArticles: number;
  totalCategories: number;
  activeCategories: number;
  totalAuthors: number;
  activeAuthors: number;
}

export interface DashboardArticleItem {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published" | "archived";
  categoryTitle: string;
  categorySlug: string;
  authorName: string;
  published_at: string | null;
  updated_at: string;
}

export interface AdminDashboardData {
  stats: DashboardStats | null;
  recentUpdatedArticles: DashboardArticleItem[];
  recentPublishedArticles: DashboardArticleItem[];
  categoriesOverview: AdminCategoryListItem[];
  authorsOverview: AdminAuthorListItem[];
  errors: {
    stats?: string;
    recentUpdated?: string;
    recentPublished?: string;
    categories?: string;
    authors?: string;
  };
}

/**
 * Fetches targeted, highly efficient server-side data for the admin dashboard.
 * Uses focused queries and Promise.allSettled so individual section failures do not crash the dashboard.
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = await createClient();

  const errors: AdminDashboardData["errors"] = {};

  // Execute all 5 targeted queries concurrently
  const [
    articleStatusResult,
    recentUpdatedResult,
    recentPublishedResult,
    categoriesResult,
    authorsResult,
  ] = await Promise.allSettled([
    // 1. Lightweight status query for aggregate stats
    supabase.from("articles").select("status"),

    // 2. Focused query: 7 most recently updated articles
    supabase
      .from("articles")
      .select(
        `
        id,
        slug,
        title,
        status,
        published_at,
        updated_at,
        categories ( id, slug, title ),
        authors ( id, name )
      `
      )
      .order("updated_at", { ascending: false })
      .limit(7),

    // 3. Focused query: 5 most recently published articles
    supabase
      .from("articles")
      .select(
        `
        id,
        slug,
        title,
        status,
        published_at,
        updated_at,
        categories ( id, slug, title ),
        authors ( id, name )
      `
      )
      .eq("status", "published")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(5),

    // 4. Categories overview with article counts
    getAdminCategories(),

    // 5. Authors overview with article counts
    getAdminAuthors(),
  ]);

  // Parse Categories
  let categoriesOverview: AdminCategoryListItem[] = [];
  let totalCategories = 0;
  let activeCategories = 0;
  if (categoriesResult.status === "fulfilled") {
    categoriesOverview = categoriesResult.value;
    totalCategories = categoriesOverview.length;
    activeCategories = categoriesOverview.filter((c) => c.is_active).length;
  } else {
    console.error("[getAdminDashboardData] Error fetching categories:", categoriesResult.reason);
    errors.categories = "Categories overview could not be retrieved at this time.";
  }

  // Parse Authors
  let authorsOverview: AdminAuthorListItem[] = [];
  let totalAuthors = 0;
  let activeAuthors = 0;
  if (authorsResult.status === "fulfilled") {
    authorsOverview = authorsResult.value;
    totalAuthors = authorsOverview.length;
    activeAuthors = authorsOverview.filter((a) => a.is_active).length;
  } else {
    console.error("[getAdminDashboardData] Error fetching authors:", authorsResult.reason);
    errors.authors = "Authors overview could not be retrieved at this time.";
  }

  // Parse Article Stats
  let stats: DashboardStats | null = null;
  if (articleStatusResult.status === "fulfilled") {
    const { data: statusRows, error: statusErr } = articleStatusResult.value;
    if (statusErr) {
      console.error("[getAdminDashboardData] Error fetching article statuses:", statusErr);
      errors.stats = "Article statistics could not be loaded.";
    } else if (statusRows) {
      const totalArticles = statusRows.length;
      const publishedArticles = statusRows.filter((r) => r.status === "published").length;
      const draftArticles = statusRows.filter((r) => r.status === "draft").length;
      const archivedArticles = statusRows.filter((r) => r.status === "archived").length;

      stats = {
        totalArticles,
        publishedArticles,
        draftArticles,
        archivedArticles,
        totalCategories,
        activeCategories,
        totalAuthors,
        activeAuthors,
      };
    }
  } else {
    console.error("[getAdminDashboardData] Error in articleStatusResult:", articleStatusResult.reason);
    errors.stats = "Article statistics could not be loaded.";
  }

  interface RawDashboardArticleJoin {
    id: string;
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    published_at: string | null;
    updated_at: string;
    categories:
      | { id: string; slug: string; title: string }
      | Array<{ id: string; slug: string; title: string }>
      | null;
    authors:
      | { id: string; name: string }
      | Array<{ id: string; name: string }>
      | null;
  }

  // Helper to map raw join to DashboardArticleItem
  const mapArticleRow = (row: RawDashboardArticleJoin): DashboardArticleItem => {
    const categories = Array.isArray(row.categories) ? row.categories[0] : row.categories;
    const authors = Array.isArray(row.authors) ? row.authors[0] : row.authors;

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      status: row.status,
      categoryTitle: categories?.title || "Unknown Category",
      categorySlug: categories?.slug || "",
      authorName: authors?.name || "BhaktiMania Editorial Team",
      published_at: row.published_at,
      updated_at: row.updated_at,
    };
  };

  // Parse Recently Updated Articles
  let recentUpdatedArticles: DashboardArticleItem[] = [];
  if (recentUpdatedResult.status === "fulfilled") {
    const { data: updatedRows, error: updatedErr } = recentUpdatedResult.value;
    if (updatedErr) {
      console.error("[getAdminDashboardData] Error fetching recently updated:", updatedErr);
      errors.recentUpdated = "Recently updated articles could not be loaded.";
    } else if (updatedRows) {
      recentUpdatedArticles = updatedRows.map(mapArticleRow);
    }
  } else {
    console.error("[getAdminDashboardData] Error in recentUpdatedResult:", recentUpdatedResult.reason);
    errors.recentUpdated = "Recently updated articles could not be loaded.";
  }

  // Parse Recently Published Articles
  let recentPublishedArticles: DashboardArticleItem[] = [];
  if (recentPublishedResult.status === "fulfilled") {
    const { data: publishedRows, error: publishedErr } = recentPublishedResult.value;
    if (publishedErr) {
      console.error("[getAdminDashboardData] Error fetching recently published:", publishedErr);
      errors.recentPublished = "Recently published articles could not be loaded.";
    } else if (publishedRows) {
      recentPublishedArticles = publishedRows.map(mapArticleRow);
    }
  } else {
    console.error("[getAdminDashboardData] Error in recentPublishedResult:", recentPublishedResult.reason);
    errors.recentPublished = "Recently published articles could not be loaded.";
  }

  return {
    stats,
    recentUpdatedArticles,
    recentPublishedArticles,
    categoriesOverview,
    authorsOverview,
    errors,
  };
}

