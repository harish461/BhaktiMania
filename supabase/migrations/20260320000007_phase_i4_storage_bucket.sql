-- ==============================================================================
-- BhaktiMania — Phase I4: Supabase Storage Bucket & Policies (Article Media)
-- Scope: Dedicated public storage bucket for intentionally public featured article images.
-- Bucket Name: 'bhaktimania-media'
-- File Size Limit: 5 MB (5,242,880 bytes)
-- Allowed MIME Types: image/webp, image/jpeg, image/png
-- Authorization:
--   - Public: Read-only access to intentionally public article media.
--   - Authenticated Admins: Full management (INSERT, UPDATE, DELETE) using public.is_admin().
--   - Anonymous: Zero write/update/delete permissions.
-- Security Note:
--   This bucket is strictly and exclusively for public BhaktiMania article media.
--   Private user or administrative documents MUST NOT be stored in this bucket.
-- ==============================================================================

-- 1. Create or Update Public Media Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'bhaktimania-media',
    'bhaktimania-media',
    true,
    5242880, -- 5 MB limit
    ARRAY['image/webp', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png'];

-- 2. Clean up any existing policies for idempotency
DROP POLICY IF EXISTS "Public can view public buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Admins can manage buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Public can read devotional media" ON storage.objects;
DROP POLICY IF EXISTS "Public can read article media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload devotional media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload article media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update devotional media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update article media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete devotional media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete article media" ON storage.objects;

-- 3. Bucket Table Policies (storage.buckets)
-- Least privilege: Public read-only visibility for public bucket definitions.
-- Allows the Supabase Storage REST API to confirm bucket existence under caller roles.
-- Bucket creation, modification, and deletion remain strictly a migration/infrastructure responsibility.
CREATE POLICY "Public can view public buckets"
    ON storage.buckets FOR SELECT
    USING (public = true);

-- 4. Object Read Policy (Public)
-- Anyone can view intentionally public article images
CREATE POLICY "Public can read article media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'bhaktimania-media');

-- 5. Object Insert Policy (Admins Only)
-- Authenticated users with is_admin() = true can upload
CREATE POLICY "Admins can upload article media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'bhaktimania-media' 
        AND public.is_admin()
    );

-- 6. Object Update Policy (Admins Only)
-- Authenticated users with is_admin() = true can update existing objects
CREATE POLICY "Admins can update article media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'bhaktimania-media' 
        AND public.is_admin()
    )
    WITH CHECK (
        bucket_id = 'bhaktimania-media' 
        AND public.is_admin()
    );

-- 7. Object Delete Policy (Admins Only)
-- Authenticated users with is_admin() = true can delete objects
CREATE POLICY "Admins can delete article media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'bhaktimania-media' 
        AND public.is_admin()
    );
