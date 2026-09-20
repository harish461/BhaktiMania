/**
 * Site-wide configuration and metadata helpers.
 * Centralizes domain resolution and canonical URL handling without hardcoding localhost or fake domains.
 */

export const siteConfig = {
  name: "BhaktiMania",
  tagline: "भक्ति • ज्ञान • शांति",
  defaultTitle: "BhaktiMania — भक्ति • ज्ञान • शांति",
  titleTemplate: "%s | BhaktiMania",
  description:
    "BhaktiMania पर पढ़ें भक्ति, आध्यात्मिक ज्ञान, राधा कृष्ण, हनुमान, शिव, भगवद्गीता, धार्मिक पर्व और वृंदावन से जुड़ी उपयोगी हिंदी सामग्री।",
  // Configure via NEXT_PUBLIC_SITE_URL environment variable in production
  url: process.env.NEXT_PUBLIC_SITE_URL || "",
  locale: "hi_IN",
};

/**
 * Safely generates canonical URL only if a site origin is configured.
 * Returns undefined if no base URL is present, preventing broken/localhost canonical tags.
 */
export function getCanonicalUrl(path: string = ""): string | undefined {
  if (!siteConfig.url) return undefined;
  const cleanBase = siteConfig.url.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
