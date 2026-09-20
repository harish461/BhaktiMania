-- ==============================================================================
-- BhaktiMania — Phase G: Grant Table Mutation Privileges to Authenticated Role
-- ==============================================================================
-- In PostgreSQL, table-level INSERT, UPDATE, and DELETE privileges must be granted
-- to the authenticated API role before PostgREST will allow data mutation requests.
--
-- Security Guarantee:
-- The Row Level Security (RLS) policy defined in Phase C:
--   CREATE POLICY "Admins have full access to articles"
--       ON public.articles FOR ALL
--       TO authenticated
--       USING (public.is_admin())
--       WITH CHECK (public.is_admin());
-- strictly ensures that ONLY authenticated users with the 'admin' role in
-- public.user_roles can insert, update, or delete articles.
--
-- Anonymous (public) users retain SELECT privileges only on published articles
-- whose publication timestamp has passed (published_at <= NOW()).
-- ==============================================================================

GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.article_curated_relations TO authenticated;
