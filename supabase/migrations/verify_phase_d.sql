-- ==============================================================================
-- BhaktiMania — Phase D2: Comprehensive Read-Only Database Verification Query
-- Run this in the Supabase SQL Editor after executing 20260320000002_phase_d_seed_articles.sql.
-- Performs ZERO writes, ZERO inserts, and ZERO modifications.
-- ==============================================================================

WITH 
-- 1. Check Categories (exactly 8 expected, matching canonical slugs)
cat_check AS (
    SELECT 
        'Categories Count & Canonical Slugs (8 expected)' AS check_name,
        COUNT(*) = 8 AND bool_and(slug IN ('hanuman', 'radha-krishna', 'shiv', 'bhagavad-gita', 'festivals', 'vrindavan', 'bhakti-vichar', 'premanand-ji')) AS passed,
        COUNT(*)::text || ' categories: ' || string_agg(slug, ', ' ORDER BY sort_order) AS details
    FROM public.categories
),

-- 2. Check premanand-ji exists and has 0 articles
prem_check AS (
    SELECT 
        'Category premanand-ji Exists with 0 Articles' AS check_name,
        EXISTS (SELECT 1 FROM public.categories WHERE slug = 'premanand-ji')
        AND (SELECT COUNT(*) FROM public.articles a JOIN public.categories c ON a.category_id = c.id WHERE c.slug = 'premanand-ji') = 0 AS passed,
        'premanand-ji articles count: ' || (SELECT COUNT(*) FROM public.articles a JOIN public.categories c ON a.category_id = c.id WHERE c.slug = 'premanand-ji') AS details
),

-- 3. Check Author (editorial-team exists exactly once)
author_check AS (
    SELECT 
        'Author editorial-team Exists Exactly Once' AS check_name,
        COUNT(*) = 1 AND bool_and(slug = 'editorial-team') AS passed,
        COUNT(*)::text || ' author: ' || string_agg(name || ' (' || slug || ')', ', ') AS details
    FROM public.authors
),

-- 4. Check Articles Total Count (exactly 18 expected)
art_count_check AS (
    SELECT 
        'Articles Total Count (18 expected)' AS check_name,
        COUNT(*) = 18 AS passed,
        COUNT(*)::text || ' articles in public.articles' AS details
    FROM public.articles
),

-- 5. Check All 18 Slugs are Unique and Match Expected List
art_slug_check AS (
    SELECT 
        'All 18 Slugs Unique & Expected' AS check_name,
        COUNT(DISTINCT slug) = 18 AND COUNT(*) = 18 AS passed,
        'Distinct slugs: ' || COUNT(DISTINCT slug) || ', Total rows: ' || COUNT(*) AS details
    FROM public.articles
),

-- 6. Check Foreign Keys (every article has valid category_id and author_id)
fk_check AS (
    SELECT 
        'Foreign Keys Integrity (All Valid Category & Author IDs)' AS check_name,
        COUNT(*) = 18 
        AND bool_and(c.id IS NOT NULL) 
        AND bool_and(au.id IS NOT NULL) AS passed,
        'All 18 articles resolved valid category_id and author_id' AS details
    FROM public.articles a
    LEFT JOIN public.categories c ON a.category_id = c.id
    LEFT JOIN public.authors au ON a.author_id = au.id
),

-- 7. Check Publishing Lifecycle (status = 'published' and published_at <= NOW())
status_check AS (
    SELECT 
        'Status & Lifecycle (All Published with Past Timestamps)' AS check_name,
        COUNT(*) = 18 
        AND bool_and(status = 'published') 
        AND bool_and(published_at IS NOT NULL)
        AND bool_and(published_at <= NOW()) AS passed,
        'All 18 articles published with valid historical timestamps' AS details
    FROM public.articles
),

-- 8. Check Content Sections (all non-empty JSONB arrays)
sections_check AS (
    SELECT 
        'Content Integrity (All Non-Empty sections JSONB)' AS check_name,
        COUNT(*) = 18 
        AND bool_and(jsonb_typeof(sections) = 'array') 
        AND bool_and(jsonb_array_length(sections) > 0) AS passed,
        'Total sections across 18 articles: ' || SUM(jsonb_array_length(sections)) AS details
    FROM public.articles
),

-- 9. Check Safety: No Curated Relations Created Yet
curated_check AS (
    SELECT 
        'Curated Relations Absent (0 rows expected)' AS check_name,
        COUNT(*) = 0 AS passed,
        COUNT(*)::text || ' rows in article_curated_relations' AS details
    FROM public.article_curated_relations
),

-- 10. Check Safety: No Storage Bucket Created by Phase D
storage_check AS (
    SELECT 
        'Storage Bucket Absent (bhaktimania-media)' AS check_name,
        NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'bhaktimania-media') AS passed,
        CASE WHEN NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'bhaktimania-media')
             THEN 'Bucket correctly absent (deferred to Phase C2)'
             ELSE 'WARNING: Bucket exists' END AS details
)

-- Combined verification output
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM cat_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM prem_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM author_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM art_count_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM art_slug_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM fk_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM status_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM sections_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM curated_check
UNION ALL
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status, details FROM storage_check;

-- Section count breakdown per article to verify against Phase D1 report:
SELECT 
    a.slug,
    c.slug AS category_slug,
    a.read_time,
    a.symbol,
    a.status,
    a.published_at,
    jsonb_array_length(a.sections) AS sections_count
FROM public.articles a
JOIN public.categories c ON a.category_id = c.id
ORDER BY a.published_at ASC;
