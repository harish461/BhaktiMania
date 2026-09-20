-- ==============================================================================
-- BhaktiMania — Phase C: Database Schema & Role-Based Row Level Security (RLS)
-- Architecture: Relational Core + JSONB Content Body
-- Engine: PostgreSQL 15+ (Supabase)
-- Scope: Core Database Schema & RLS (Storage deferred to Phase C2)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & CUSTOM ENUM TYPES
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Lifecycle state of articles:
-- 'draft'     : Work-in-progress; invisible on public website.
-- 'published' : Live and visible when published_at <= NOW().
-- 'archived'  : Retired from public view, retained for editorial history.
DO $$ BEGIN
    CREATE TYPE public.article_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Role-based access control roles:
-- 'admin'  : Full CRUD administrative privileges across all tables and content.
-- 'editor' : Reserved for future scoped editorial workflows (e.g., draft-only access).
--            In this initial phase, 'editor' is not granted elevated DB permissions yet.
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'editor');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 2. HELPER FUNCTIONS & TRIGGERS
-- ------------------------------------------------------------------------------

-- Automatic updated_at timestamp updater
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. TABLE: user_roles (Role-Based Authorization)
-- Avoids hardcoding email addresses in RLS policies.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles (user_id, role);

-- Helper function to check if current authenticated user has admin role.
-- Evaluates both Supabase JWT app_metadata and the user_roles table.
-- Note: 'editor' role does not grant administrative database access in this phase.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT (
        COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
        OR
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
$$;

-- ------------------------------------------------------------------------------
-- 4. TABLE: categories
-- Canonical master record for all 8 devotional categories.
-- Note: Inter-category relationship slugs removed in favor of article-level
-- curated relations and automatic same-category recommendations.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,                  -- e.g. 'हनुमान जी', 'भगवान शिव'
    meta_title TEXT NOT NULL,             -- e.g. 'हनुमान जी | भक्ति, प्रेरणा और ज्ञान'
    description TEXT NOT NULL,            -- Short category summary
    symbol TEXT NOT NULL,                 -- Sacred motif label, e.g. 'श्री राम', 'ॐ नमः शिवाय'
    intro TEXT,                           -- Detailed devotional introduction
    sort_order INT DEFAULT 0 NOT NULL,    -- Display sequence in category bars
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON public.categories (is_active, sort_order);

CREATE OR REPLACE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 5. TABLE: authors
-- Supports current editorial team credit and future individual writers/scholars.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,                   -- e.g. 'BhaktiMania Editorial Team'
    role TEXT DEFAULT 'संपादकीय मंडल' NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_authors_slug ON public.authors (slug);

CREATE OR REPLACE TRIGGER trg_authors_updated_at
    BEFORE UPDATE ON public.authors
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 6. TABLE: articles
-- Core publication entity with structured JSONB content and relational metadata.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
    status public.article_status DEFAULT 'draft' NOT NULL,

    -- Structured content body (array of ArticleSection objects: heading, highlight, paragraphs, bullets)
    sections JSONB DEFAULT '[]'::JSONB NOT NULL,

    -- Presentation and devotional motif
    symbol TEXT NOT NULL,
    read_time TEXT NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    featured_image_url TEXT,
    featured_image_alt TEXT,

    -- Custom SEO overrides (optional; falls back to title/description if NULL)
    seo_title TEXT,
    seo_description TEXT,

    -- Lifecycle timestamps
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON public.articles (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category_id, status);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles (featured, status);

CREATE OR REPLACE TRIGGER trg_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 7. TABLE: article_curated_relations
-- Optional manual overrides for related articles.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.article_curated_relations (
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    related_article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (article_id, related_article_id),
    CONSTRAINT chk_no_self_relation CHECK (article_id <> related_article_id)
);

CREATE INDEX IF NOT EXISTS idx_curated_relations_order ON public.article_curated_relations (article_id, sort_order);

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_curated_relations ENABLE ROW LEVEL SECURITY;

-- 8.1 user_roles Policies
CREATE POLICY "Users can read their own role"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Admins have full access to user_roles"
    ON public.user_roles FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 8.2 categories Policies
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins have full access to categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 8.3 authors Policies
CREATE POLICY "Public can view active authors"
    ON public.authors FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins have full access to authors"
    ON public.authors FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 8.4 articles Policies
-- Public can only read articles that are explicitly published and whose publish date has passed
CREATE POLICY "Public can view published articles"
    ON public.articles FOR SELECT
    USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Admins have full access to articles"
    ON public.articles FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 8.5 article_curated_relations Policies
CREATE POLICY "Public can view curated relations for published articles"
    ON public.article_curated_relations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_curated_relations.article_id
              AND status = 'published'
              AND published_at <= NOW()
        )
    );

CREATE POLICY "Admins have full access to curated relations"
    ON public.article_curated_relations FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
