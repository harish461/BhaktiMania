-- ==============================================================================
-- BhaktiMania — Phase C2: Supabase Storage Bucket & Policies (Devotional Media)
-- Scope: Media Storage only (Separated from Phase C core database migration)
-- Status: Deferred until Phase C2
-- ==============================================================================

-- 1. Create Public Devotional Media Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'bhaktimania-media',
    'bhaktimania-media',
    true,
    1572864, -- 1.5MB limit
    ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 1572864,
    allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml'];

-- 2. Storage RLS Policies
-- Public can read all objects in the devotional media bucket
CREATE POLICY "Public can read devotional media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'bhaktimania-media');

-- Admins have upload, update, and delete access
CREATE POLICY "Admins can upload devotional media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'bhaktimania-media' AND public.is_admin());

CREATE POLICY "Admins can update devotional media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'bhaktimania-media' AND public.is_admin())
    WITH CHECK (bucket_id = 'bhaktimania-media' AND public.is_admin());

CREATE POLICY "Admins can delete devotional media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'bhaktimania-media' AND public.is_admin());
