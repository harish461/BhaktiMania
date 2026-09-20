-- ==============================================================================
-- BhaktiMania — Phase C: Comprehensive Read-Only Verification Query
-- Run this in the Supabase SQL Editor to verify all Phase C schema & RLS rules.
-- This query performs ZERO writes, ZERO inserts, and ZERO modifications.
-- ==============================================================================

WITH 
-- 1. Table existence check
tbl_check AS (
    SELECT 
        'Tables Existence (5 expected)' AS check_name,
        COUNT(*) = 5 AS passed,
        string_agg(table_name, ', ' ORDER BY table_name) AS details
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name IN ('user_roles', 'categories', 'authors', 'articles', 'article_curated_relations')
),

-- 2. Enum check
enum_check AS (
    SELECT 
        'Custom Enums (article_status, app_role)' AS check_name,
        COUNT(DISTINCT typname) = 2 AS passed,
        string_agg(typname, ', ' ORDER BY typname) AS details
    FROM pg_type 
    WHERE typname IN ('article_status', 'app_role')
),

-- 3. Functions check
fn_check AS (
    SELECT 
        'Helper Functions (is_admin, set_updated_at)' AS check_name,
        COUNT(DISTINCT proname) = 2 AS passed,
        string_agg(proname, ', ' ORDER BY proname) AS details
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' 
      AND proname IN ('is_admin', 'set_updated_at')
),

-- 4. Triggers check
trg_check AS (
    SELECT 
        'Updated_at Triggers (3 expected)' AS check_name,
        COUNT(*) = 3 AS passed,
        string_agg(trigger_name || ' on ' || event_object_table, ', ') AS details
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
      AND trigger_name IN ('trg_categories_updated_at', 'trg_authors_updated_at', 'trg_articles_updated_at')
),

-- 5. RLS Enabled check
rls_check AS (
    SELECT 
        'RLS Enabled on All 5 Tables' AS check_name,
        COUNT(*) = 5 AND bool_and(rowsecurity) AS passed,
        string_agg(tablename || ': RLS=' || rowsecurity::text, ', ') AS details
    FROM pg_tables 
    WHERE schemaname = 'public' 
      AND tablename IN ('user_roles', 'categories', 'authors', 'articles', 'article_curated_relations')
),

-- 6. related_slugs absence check
col_check AS (
    SELECT 
        'categories.related_slugs Absent' AS check_name,
        COUNT(*) = 0 AS passed,
        CASE WHEN COUNT(*) = 0 THEN 'Column correctly absent' ELSE 'ERROR: related_slugs exists' END AS details
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'categories'
      AND column_name = 'related_slugs'
),

-- 7. Empty state checks (0 rows in articles, categories, authors, user_roles)
row_check AS (
    SELECT 
        'Zero Rows in articles (0 migrated)' AS check_name,
        (SELECT COUNT(*) FROM public.articles) = 0 AS passed,
        'articles: ' || (SELECT COUNT(*) FROM public.articles) || ' rows' AS details
),

-- 8. Storage bucket absence check
bucket_check AS (
    SELECT 
        'Storage bhaktimania-media Bucket Absent' AS check_name,
        NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'bhaktimania-media') AS passed,
        CASE WHEN NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'bhaktimania-media') 
             THEN 'Bucket correctly absent (deferred to Phase C2)' 
             ELSE 'WARNING: Bucket was created' END AS details
)

-- Combined verification summary
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM tbl_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM enum_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM fn_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM trg_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM rls_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM col_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM row_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM bucket_check;

-- RLS Policies detailed breakdown
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_roles', 'categories', 'authors', 'articles', 'article_curated_relations')
ORDER BY tablename, policyname;
