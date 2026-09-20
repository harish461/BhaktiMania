-- ==============================================================================
-- BhaktiMania — Phase F: Grant Table Privilege on user_roles
-- ==============================================================================
-- In PostgreSQL, table-level SELECT privilege must be granted to authenticated
-- users so they can read their own assigned roles under Row Level Security (RLS).
--
-- Security Guarantee:
-- The Row Level Security (RLS) policy defined in Phase C:
--   CREATE POLICY "Users can read their own role"
--     ON public.user_roles FOR SELECT
--     TO authenticated
--     USING (user_id = auth.uid());
-- strictly restricts row visibility so each authenticated user can only query
-- their own user_id records.
-- ==============================================================================

GRANT SELECT ON public.user_roles TO authenticated;
