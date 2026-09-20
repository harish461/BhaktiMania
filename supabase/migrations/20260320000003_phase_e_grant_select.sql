-- ==============================================================================
-- BhaktiMania — Phase E: Grant Table Read Privileges to API Roles
-- ==============================================================================
-- In PostgreSQL, table-level SELECT permissions must be granted to the PostgREST
-- API roles (anon and authenticated) before Row Level Security (RLS) policies
-- can be evaluated.
--
-- Security Guarantee:
-- The Row Level Security (RLS) policies already defined and active from Phase C
-- strictly control the exact rows returned:
--   - public.categories: USING (is_active = true)
--   - public.authors:    USING (is_active = true)
--   - public.articles:   USING (status = 'published' AND published_at <= NOW())
--   - public.article_curated_relations: USING (EXISTS published parent article)
-- ==============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.authors TO anon, authenticated;
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT SELECT ON public.article_curated_relations TO anon, authenticated;
