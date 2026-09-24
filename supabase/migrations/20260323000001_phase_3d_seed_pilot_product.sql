-- ==============================================================================
-- BhaktiMania — Phase 3D: Seed Migration for Pilot Affiliate Product
-- Engine: PostgreSQL 15+ (Supabase)
-- Safety: Idempotent - Checks for existing affiliate_url or name before insert.
-- Status: PREPARED FOR SUPABASE DASHBOARD SQL EDITOR / CLI EXECUTION
-- ==============================================================================

INSERT INTO public.affiliate_products (
    name,
    merchant,
    affiliate_url,
    image_url,
    short_description,
    category,
    is_active,
    display_order
)
SELECT
    'Shrimad Bhagwat – Shankar Bhashya, Gita Press Gorakhpur',
    'amazon_in',
    'https://www.amazon.in/Shrimad-Bhagwat-Shankar-Bhashya-Gorakhpur/dp/B0BGX5ZGWX?crid=14EW003W4QLE2&dib=eyJ2IjoiMSJ9._WbkOj-wP1K3WwfrC55n33-A_DNXkb7k-5sXiTkqHMV4bSkKifq1VcYtPz9GRwW-wg4jdd5cr5muoUUK__OwJXSAg2_2rqxbpVadoVovtPSpkM2sgKol7-NweG5piVZaechDYtjNnURwZfWKrYFdnnVf92yIdMGygtfKEb1oVkT97Cap7F90EEEC04YcmRXCwObu4hYCgjWcbWwoo9arEPs_qhFTsZX8Sek2xbk7Kvc.RYQTXL7ad3LI6O08Uj156erBe4y_R93mW5_7Ag26jUo&dib_tag=se&keywords=bhagavad+gita+gita+press&qid=1790140882&sprefix=Bhagavad+Gita+Gita+Press%2Caps%2C246&sr=8-3&linkCode=ll2&tag=bhaktimania79-21&linkId=38260a322638654728fee4a96c2e6571&ref_=as_li_ss_tl',
    NULL,
    'श्रीमद्भागवत के आध्यात्मिक अध्ययन और गहन समझ के लिए।',
    'धार्मिक पुस्तकें',
    true,
    10
WHERE NOT EXISTS (
    SELECT 1 FROM public.affiliate_products 
    WHERE name = 'Shrimad Bhagwat – Shankar Bhashya, Gita Press Gorakhpur'
       OR affiliate_url LIKE '%B0BGX5ZGWX%'
);
