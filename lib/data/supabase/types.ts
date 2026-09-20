import type { Article, ArticleSection } from "@/lib/data/articles";
import type { DevotionalCategory } from "@/lib/data/categories";

/**
 * Raw relational record from public.categories table in Supabase.
 */
export type DatabaseCategory = {
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
};

/**
 * Raw relational record from public.authors table in Supabase.
 */
export type DatabaseAuthor = {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Raw relational record from public.articles table in Supabase.
 */
export type DatabaseArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string;
  author_id: string | null;
  status: "draft" | "published" | "archived";
  sections: ArticleSection[];
  symbol: string;
  read_time: string;
  featured: boolean;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Database article record joined with category and author relations.
 */
export type DatabaseArticleWithRelations = DatabaseArticle & {
  categories: Pick<DatabaseCategory, "slug" | "title"> | null;
  authors?: Pick<DatabaseAuthor, "name"> | null;
};

/**
 * Frontend-compatible Article interface enriched with Supabase metadata.
 * Directly assignable to the existing Article type.
 */
export interface SupabaseArticle extends Article {
  id: string;
  featured: boolean;
  featuredImageUrl?: string | null;
  featuredImageAlt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  rawPublishedAt?: string | null;
}

/**
 * Frontend-compatible Category interface enriched with Supabase metadata.
 * Directly assignable to the existing DevotionalCategory type.
 */
export interface SupabaseCategory extends DevotionalCategory {
  id: string;
  sortOrder: number;
  isActive: boolean;
}
