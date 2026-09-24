-- ==============================================================================
-- BhaktiMania — Phase 3B: Affiliate Product Data Architecture & RLS
-- ==============================================================================
-- Creates normalized relational tables for curated devotional affiliate products
-- and article-product mappings. Enforces row-level security (RLS) guaranteeing:
--   1. Anonymous and authenticated public visitors can ONLY read active products
--      associated with published articles whose publication date has passed.
--   2. Only verified administrators (public.is_admin() = true) can create, update,
--      deactivate, or delete affiliate products and article relationships.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE: affiliate_products
-- Master catalog of curated devotional products (books, malas, puja essentials).
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.affiliate_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,                                   -- e.g. 'श्रीमद्भगवद्गीता (साधक-संजीवनी)'
    merchant TEXT NOT NULL DEFAULT 'amazon_in',           -- 'amazon_in' (extensible for future partners)
    affiliate_url TEXT NOT NULL,                          -- Direct approved outbound affiliate tracking URL
    image_url TEXT,                                       -- Approved product image asset URL
    short_description TEXT,                               -- Brief editorial summary of the item
    category TEXT,                                        -- e.g. 'books', 'japa_mala', 'puja_essentials'
    is_active BOOLEAN NOT NULL DEFAULT true,              -- Master active toggle (hides if discontinued/out-of-stock)
    display_order INTEGER NOT NULL DEFAULT 0,             -- General display priority in product listings
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_products_active ON public.affiliate_products (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_category ON public.affiliate_products (category, is_active);

-- Automatic timestamp trigger using existing public.set_updated_at() function
CREATE OR REPLACE TRIGGER trg_affiliate_products_updated_at
    BEFORE UPDATE ON public.affiliate_products
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 2. TABLE: article_affiliate_products
-- Relational mapping between articles and curated affiliate recommendations.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.article_affiliate_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.affiliate_products(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,                -- Priority order in article recommendations (1, 2, 3)
    contextual_note TEXT,                                 -- Article-specific editorial note (e.g. 'इस अध्याय के गूढ़ अध्ययन हेतु')
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_article_affiliate_product UNIQUE (article_id, product_id)
);

-- Indexes for relational joins
CREATE INDEX IF NOT EXISTS idx_article_affiliate_article ON public.article_affiliate_products (article_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_article_affiliate_product ON public.article_affiliate_products (product_id);

-- ------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on both tables
ALTER TABLE public.affiliate_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_affiliate_products ENABLE ROW LEVEL SECURITY;

-- 3.1 affiliate_products Policies
-- Public can only view active products
CREATE POLICY "Public can view active affiliate products"
    ON public.affiliate_products FOR SELECT
    USING (is_active = true);

-- Admins have full access to manage affiliate products
CREATE POLICY "Admins have full access to affiliate products"
    ON public.affiliate_products FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3.2 article_affiliate_products Policies
-- Public can only view relationships for published articles and active products
CREATE POLICY "Public can view active article affiliate relations"
    ON public.article_affiliate_products FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.articles a
            WHERE a.id = article_affiliate_products.article_id
              AND a.status = 'published'
              AND a.published_at <= NOW()
        )
        AND
        EXISTS (
            SELECT 1 FROM public.affiliate_products ap
            WHERE ap.id = article_affiliate_products.product_id
              AND ap.is_active = true
        )
    );

-- Admins have full access to manage article affiliate relations
CREATE POLICY "Admins have full access to article affiliate relations"
    ON public.article_affiliate_products FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. TABLE PRIVILEGES / API GRANTS
-- ------------------------------------------------------------------------------
-- Grant SELECT permissions to API roles so RLS can evaluate
GRANT SELECT ON public.affiliate_products TO anon, authenticated;
GRANT SELECT ON public.article_affiliate_products TO anon, authenticated;

-- Grant mutation privileges to authenticated role (strictly guarded by is_admin() RLS)
GRANT INSERT, UPDATE, DELETE ON public.affiliate_products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.article_affiliate_products TO authenticated;
