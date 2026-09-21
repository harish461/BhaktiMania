# Phase 2B — Technical SEO Implementation Audit & Plan
**Project:** BhaktiMania (`https://bhaktimania.com`)  
**Audit Scope:** Codebase Audit & Precise Implementation Plan for Phase 2B Technical SEO  
**Latest Production Commit:** `c90ac07`  
**Date of Audit:** September 21, 2026  
**Status:** Audit & Plan Complete (Read-Only; No Application Files Modified)

---

## 1. Executive Summary

Following the successful completion, validation, and deployment of **Phase 2A** (content optimization of 7 legacy articles and final editorial corrections in commit `c90ac07`), this audit evaluates the technical SEO architecture of BhaktiMania.

The objective of Phase 2B is to assess and plan technical enhancements across:
1. **Article Structured Data (`Article` JSON-LD)**: Schema.org compliance, Google Rich Result eligibility, and date/image handling.
2. **Category Page H1 Architecture**: Complete audit of all public category and hub pages to verify single-H1 compliance.
3. **Featured Image Strategy & Open Graph Integration**: Data model readiness, image asset storage, fallback mechanisms, and Open Graph / Twitter Card integration.
4. **FAQ / Structured Data**: Assessment of existing reader-facing Q&A sections, Schema.org `FAQPage` infrastructure, and legitimate user-intent opportunities without search engine manipulation.
5. **General Technical SEO Health**: Metadata generation, canonical URLs, trailing slash consistency, sitemap `<lastmod>` reliability, robots.txt, and indexability.

### Key Audit Highlights:
* **Category H1s are Already 100% Compliant**: Live DOM and codebase AST analysis confirmed that every single category and hub page currently contains **exactly one `<h1>`** (`<h1>{category.title}</h1>`). The suspected duplicate H1 from historical audit notes does not exist in the current production codebase.
* **Article JSON-LD has Critical Omissions**: The current `Article` schema in `app/bhakti-gyaan/[slug]/page.tsx` lacks `datePublished`, `dateModified`, `image`, and `publisher.logo`. Furthermore, dates in the static article repository (`lib/data/articles.ts`) are stored as localized Hindi strings (`"18 मार्च 2026"`), which throw `Invalid Date` when parsed naively into ISO 8601.
* **Zero Usable Images & Missing OG Fallback**: Currently, `featuredImageUrl` is `null` across all 18 articles, the `public/images/` directory does not exist, and no root-level Open Graph fallback image is specified in `app/layout.tsx`. As a result, social media crawlers (WhatsApp, Twitter, Facebook) and Google Discover show no visual previews.
* **Homepage WebSite JSON-LD Missing `url`**: In `app/page.tsx`, the `WebSite` schema defines `name`, `description`, and `inLanguage`, but omits the mandatory `url: siteConfig.url` field.
* **Sitemap `<lastmod>` Volatility**: `app/sitemap.ts` generates `lastModified: new Date()` on every crawl for static routes, category routes, and articles lacking `rawPublishedAt`, violating Google Search Central's guidance on trustworthy lastmod dates.

---

## 2. Article JSON-LD Findings

### 2.1 Current Implementation Location
The Article structured data is generated on-the-fly in:
`app/bhakti-gyaan/[slug]/page.tsx` (Lines 206–224):

```typescript
const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  inLanguage: "hi",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": pageUrl,
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
  },
  author: {
    "@type": "Organization",
    name: article.author || siteConfig.name,
  },
};
```

### 2.2 Property-by-Property Audit Against Google Search Central Specifications

| Schema Property | Current Status in Codebase | Source in Data Layer | Google / Schema.org Compliance | Issue / Assessment |
| :--- | :--- | :--- | :--- | :--- |
| **`@context`** | `"https://schema.org"` | Hardcoded | Compliant | Correct namespace. |
| **`@type`** | `"Article"` | Hardcoded | Compliant | Valid type. |
| **`headline`** | `article.title` | `article.title` | Compliant | Max 110 chars recommended by Google; currently concise and descriptive. |
| **`description`** | `article.description` | `article.description` | Compliant | High quality Hindi summary. |
| **`inLanguage`** | `"hi"` | Hardcoded | Compliant | Accurately declares Hindi language. |
| **`mainEntityOfPage`** | `{"@type": "WebPage", "@id": pageUrl}` | `pageUrl` via `getCanonicalUrl()` | Partially Compliant | If `NEXT_PUBLIC_SITE_URL` is empty, `pageUrl` falls back to relative `/bhakti-gyaan/[slug]`, which is invalid in Schema.org (requires absolute URI). |
| **`author`** | `{"@type": "Organization", name: article.author \|\| siteConfig.name}` | `article.author` / `siteConfig.name` | Compliant with Warnings | Valid organization attribution, but Google prefers `Person` when an individual author is known, or an `url` pointing to the author profile. |
| **`publisher`** | `{"@type": "Organization", name: siteConfig.name}` | `siteConfig.name` | **Deficient** | Missing `logo: { "@type": "ImageObject", "url": ... }`, which Google Rich Results requires for articles. |
| **`datePublished`** | **Missing** | Not mapped | **Non-Compliant** | Required for Google News, Google Discover, and full Article Rich Results eligibility. |
| **`dateModified`** | **Missing** | Not mapped | **Non-Compliant** | Recommended by Google; critical to show when articles are updated or expanded. |
| **`image`** | **Missing** | Not mapped | **Non-Compliant** | Schema does not output `image` at all, even if `article.featuredImageUrl` was present. Causes warnings in Google Rich Results Test. |

### 2.3 Date Ingestion & Modeling Analysis
* **Static Model (`lib/data/articles.ts`)**: Stores `publishedAt` as a human-readable Hindi string: `"18 मार्च 2026"`, `"17 मार्च 2026"`, etc.
  * Running `new Date("18 मार्च 2026")` in Node.js returns `Invalid Date`.
  * Naively injecting `datePublished: article.publishedAt` into JSON-LD will inject invalid schema strings, triggering Google Search Console syntax validation errors.
* **Database Model (`lib/data/supabase/types.ts`)**:
  * `DatabaseArticle` includes: `published_at: string | null;` (Postgres ISO timestamp with timezone), `created_at: string;`, `updated_at: string;`.
  * `SupabaseArticle` (line 72) includes: `rawPublishedAt?: string | null;`.
  * **Gap**: `updated_at` is fetched in `ARTICLE_SELECT_FIELDS` (`lib/data/supabase/articles.ts:27`) but is **dropped** in `mapDatabaseArticleToArticle` (`adapters.ts:102-124`). It is never passed to `SupabaseArticle` as `rawUpdatedAt` or `dateModified`.
* **Canonical Consistency**:
  * In `generateMetadata`: `alternates.canonical` = `getCanonicalUrl("/bhakti-gyaan/" + article.slug)`
  * In `articleJsonLd`: `mainEntityOfPage["@id"]` = `pageUrl`
  * In `breadcrumbJsonLd`: Position 3 item = `pageUrl`
  * **Result**: Canonical URLs and JSON-LD URLs are perfectly aligned when `NEXT_PUBLIC_SITE_URL` is set.

---

## 3. Category Page H1 Findings

### 3.1 Live DOM and Codebase Audit
Every public category and hub page was audited across both the template source code and live rendering:

1. `/hanuman` (`app/hanuman/page.tsx`)
2. `/radha-krishna` (`app/radha-krishna/page.tsx`)
3. `/shiv` (`app/shiv/page.tsx`)
4. `/bhagavad-gita` (`app/bhagavad-gita/page.tsx`)
5. `/bhakti-vichar` (`app/bhakti-vichar/page.tsx`)
6. `/festivals` (`app/festivals/page.tsx`)
7. `/vrindavan` (`app/vrindavan/page.tsx`)
8. `/premanand-ji` (`app/premanand-ji/page.tsx`)
9. `/bhakti-gyaan` (`app/bhakti-gyaan/page.tsx`) — Hub Page
10. `/` (`app/page.tsx`) — Homepage

### 3.2 Findings Detail
* **Category Pages (1–8)**: All 8 category routes import and render `components/content/CategoryPage.tsx`.
  * In `CategoryPage.tsx` (line 98):
    ```tsx
    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#6B1724] tracking-tight leading-tight">
      {category.title}
    </h1>
    ```
  * Sub-components rendered inside `CategoryPage`:
    * `Header` (`components/layout/Header.tsx`): The brand logo is rendered as a `<Link>` containing a `<span>BhaktiMania</span>`. **No `<h1>` present.**
    * `ArticleGrid` (`components/content/ArticleGrid.tsx`): Each article card title is rendered as an `<h2>` (line 92). **No `<h1>` present.**
    * `RelatedCategories` (`components/content/RelatedCategories.tsx`): Section title is `<h2>` (line 33); category card titles are `<h3>` (line 68). **No `<h1>` present.**
    * `Footer` (`components/layout/Footer.tsx`): Brand wordmark is a `<span>`. **No `<h1>` present.**
* **Hub Page (`/bhakti-gyaan`)**:
  * In `app/bhakti-gyaan/page.tsx` (line 46):
    ```tsx
    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#6B1724] tracking-tight leading-tight mb-4">
      भक्ति ज्ञान
    </h1>
    ```
  * Child component `BhaktiGyaanListing` contains only filter buttons and `ArticleGrid` (`<h2>`). **Exactly one `<h1>`.**
* **Homepage (`/`)**:
  * In `components/home/Hero.tsx` (line 33):
    ```tsx
    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#6B1724] tracking-tight leading-tight mb-6">
      सनातन धर्म, भक्ति और आध्यात्मिक ज्ञान का पावन संगम
    </h1>
    ```
  * Subsequent sections use `<h2>` (`LatestArticles`, `DevotionalCategories`, `DailyBhaktiThought`). **Exactly one `<h1>`.**

### 3.3 Conclusion on Category H1s
**No duplicate H1 exists anywhere in the production category or hub templates.** Every public category page currently satisfies the SEO requirement of having exactly one primary `<h1>`.

---

## 4. Featured Image Strategy

### 4.1 Current Codebase State
* **Article Data Model**:
  * `lib/data/articles.ts`: `featuredImageUrl?: string | null;` and `featuredImageAlt?: string | null;`.
  * `lib/data/supabase/types.ts`: `featured_image_url: string | null;` and `featured_image_alt: string | null;`.
* **Asset Availability**:
  * `public/images/` directory **does not exist**.
  * `public/` contains only static SVGs (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`) and `ads.txt`.
* **Current Population**:
  * **0 out of 18 articles** have a populated `featuredImageUrl` (`featuredImageUrl: null` or omitted).
* **Component Rendering**:
  * `app/bhakti-gyaan/[slug]/page.tsx` (lines 319–346):
    * When `featuredImageUrl` is present, it renders an `<img>` tag with `loading="eager"`.
    * When `featuredImageUrl` is null, it renders an aesthetic spiritual motif block displaying `article.symbol` and a decorative `✦`.
  * `components/content/ArticleGrid.tsx` (lines 48–73):
    * Similar fallback: renders image if present, else renders a subtle gradient box with devotional symbol.
* **Open Graph & Twitter Card Status**:
  * `app/bhakti-gyaan/[slug]/page.tsx` (lines 73–91):
    * `openGraph.images` and `twitter.images` are only populated if `article.featuredImageUrl` is truthy.
    * Because all articles have `null`, **no image tags are emitted in OpenGraph or Twitter meta for articles**.
  * `app/layout.tsx` (lines 35–46):
    * The root layout defines `openGraph.title`, `openGraph.description`, and `openGraph.siteName`, but **omits `images` completely**.
    * **Impact**: All social links shared across WhatsApp, Facebook, LinkedIn, Telegram, and Twitter render without an image thumbnail preview.

### 4.2 Technical Requirements Before Adding Images
Before creating or attaching article artwork:
1. **Asset Storage & Serving Strategy**:
   * *Option A (Static Next.js public directory)*: Place images in `public/images/articles/[slug].webp`.
     * Advantages: Zero external latency, immutable local deployment, works seamlessly in SSG/ISR, no external bucket dependency.
     * Recommendation: Best for the core 18 static fallback articles.
   * *Option B (Supabase Storage Bucket)*: Place user-uploaded images in a public Supabase Storage bucket (`article-images`).
     * Advantages: Allows dynamic upload through the existing Admin Article Editor (`components/admin/ArticleEditor.tsx`).
     * Needs: Storage bucket creation, RLS public read policy, and domain configuration in `next.config.ts` (`images.remotePatterns`).
2. **Default Site Open Graph Image (Immediate Priority)**:
   * A high-resolution fallback image (1200x630px WebP/PNG) at `public/images/og-default.webp` branded with "BhaktiMania — भक्ति • ज्ञान • शांति".
   * Wired into `app/layout.tsx` so all pages have an instant, professional visual preview when shared.
3. **Image Optimization Migration**:
   * Replace raw `<img>` tags in `app/bhakti-gyaan/[slug]/page.tsx` and `components/content/ArticleGrid.tsx` with Next.js `<Image>` component for automatic WebP/AVIF delivery, responsive srcset, and Cumulative Layout Shift (CLS) prevention.

---

## 5. FAQ / Structured Data

### 5.1 Current State
* **FAQ Content**: None exists in the codebase as formal Q&A units.
* **FAQ Infrastructure**: No `FAQPage` schema builder, no FAQ accordion/UI component, and no FAQ database/model fields exist.

### 5.2 Google Search Central Policy & Risk Analysis
In August 2023, Google updated its structured data guidelines:
> *FAQ rich results are now primarily shown for well-known, authoritative health and government websites.*

More importantly:
> **Critical Policy**: Schema.org `FAQPage` markup MUST correspond directly to visible, readable content on the page. Injecting FAQ schema in `<script type="application/ld+json">` without an accompanying visible on-page FAQ section is classified by Google as **"Spammy structured markup"** and can lead to algorithmic devaluation or manual penalties.

Therefore, **we must not inject FAQ JSON-LD without first introducing visible, high-utility editorial Q&A sections**.

### 5.3 Candidates for Editorial FAQ Expansion
The following 6 articles naturally answer high-frequency reader queries and would provide genuine user value if expanded with a visible FAQ section:

1. **`vrindavan-yatra-planning-guide` (वृंदावन यात्रा गाइड)**:
   * *Legitimate Questions*:
     * वृंदावन की यात्रा के लिए सबसे उत्तम समय कौन सा है? (Best season/months to visit)
     * बांके बिहारी मंदिर के दर्शन का समय क्या रहता है? (Darshan schedule and afternoon closure)
     * परिक्रमा मार्ग पर ई-रिक्शा या पैदल चलने के क्या नियम हैं? (Parikrama etiquette and transit)
2. **`vrindavan-jane-se-pehle-baatein` (वृंदावन जाने से पहले ध्यान रखने योग्य बातें)**:
   * *Legitimate Questions*:
     * क्या वृंदावन में बंदरों से सावधानी बरतने की आवश्यकता है? (Practical caution for spectacles/mobiles)
     * क्या मंदिर दर्शन के लिए कोई विशिष्ट वेशभूषा (ड्रेस कोड) है? (Appropriate traditional attire)
3. **`ekadashi-vrat-adhyatmik-mahatva` (एकादशी व्रत का आध्यात्मिक महत्व)**:
   * *Legitimate Questions*:
     * एकादशी व्रत में क्या खाना चाहिए और क्या वर्जित है? (Dietary guidance: grains prohibition, fruit intake)
     * एकादशी व्रत का पारण कब और कैसे करना चाहिए? (Parana timing on Dwadashi)
4. **`hanuman-chalisa-paath-kyun-karein` (हनुमान चालीसा का पाठ क्यों करें?)**:
   * *Legitimate Questions*:
     * क्या हनुमान चालीसा का पाठ किसी भी समय किया जा सकता है? (Chanting rules, morning vs evening)
     * क्या महिलाएं हनुमान चालीसा का पाठ कर सकती हैं? (Clarification on scriptural reverence)
5. **`hanuman-chalisa-saral-arth` (हनुमान चालीसा का सरल और संपूर्ण अर्थ)**:
   * *Legitimate Questions*:
     * हनुमान चालीसा का पाठ कितनी बार करना फलदायी माना गया है? ("जो सत बार पाठ कर कोई" संदर्भ)
     * पाठ करते समय दीपक जलाना क्यों आवश्यक है? (Spiritual discipline)
6. **`mahadev-bhakti-shiv-naam-mahatva` (भगवान शिव की भक्ति और शिव नाम का महत्व)**:
   * *Legitimate Questions*:
     * पंचाक्षर मंत्र (ॐ नमः शिवाय) के जप का सही नियम क्या है? (Japa rules and mental chanting)
     * क्या शिवलिंग पर जल चढ़ाने के लिए कोई निश्चित दिशा होती है? (Traditional North-facing ritual orientation)

---

## 6. General Technical SEO Findings

### 6.1 Metadata Generation & Title Formats
* **Root Configuration (`app/layout.tsx`)**:
  * `title.template`: `"%s | BhaktiMania"`
  * `title.default`: `"BhaktiMania — भक्ति • ज्ञान • शांति"`
* **Article Pages (`app/bhakti-gyaan/[slug]/page.tsx`)**:
  * Emits `title: article.seoTitle || article.title`.
  * Because `layout.tsx` applies `%s | BhaktiMania`, the emitted HTML `<title>` is:
    `[Article SEO Title] | BhaktiMania`
  * This matches Google's recommended format.
* **Category Pages**:
  * Emits `title: category.metaTitle || category.title`.
  * Emitted HTML `<title>`: `हनुमान जी | भक्ति, प्रेरणा और ज्ञान | BhaktiMania`.
  * Descriptive, localized, and under 65 characters.

### 6.2 Canonical URLs & Trailing Slash Consistency
* **Canonical Helper (`lib/config/site.ts`)**:
  ```typescript
  export function getCanonicalUrl(path: string = ""): string | undefined {
    if (!siteConfig.url) return undefined;
    const cleanBase = siteConfig.url.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  }
  ```
* **Trailing Slashes**:
  * Next.js default is `trailingSlash: false`.
  * All internal links (`/hanuman`, `/bhakti-gyaan`, `/bhakti-gyaan/[slug]`) omit trailing slashes.
  * Canonical tags everywhere strip trailing slashes (except root `/`).
  * **Result**: Complete consistency across links, redirects, and canonical tags.

### 6.3 Homepage WebSite Structured Data Deficiency
In `app/page.tsx` (lines 11–17):
```typescript
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  description: siteConfig.tagline,
  inLanguage: "hi",
};
```
* **Issue**: The `url` property is omitted.
* **Google Requirement**: `WebSite` structured data must specify `url` pointing to the homepage (`url: siteConfig.url || "https://bhaktimania.com"`). Additionally, an `inLanguage: "hi"` and `publisher` or `potentialAction` (SearchAction) can be attached.

### 6.4 Sitemap.xml Issues (`app/sitemap.ts`)
* **Current Logic**:
  ```typescript
  categoryRoutes = categories.map((category) => ({
    url: `${base}/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));
  ```
  And static pages:
  ```typescript
  { url: `${base}/`, lastModified: new Date(), ... }
  ```
* **Technical Issue**: `lastModified: new Date()` outputs the current server request timestamp every time the sitemap is fetched. Search engine crawlers detect that `<lastmod>` changes on every crawl without actual content updates, which causes search engines to mistrust and ignore all `<lastmod>` directives across the domain.
* **Solution**: Use static dates for static legal pages, or compute `lastModified` from actual content/release dates.

### 6.5 Robots.txt (`app/robots.ts`)
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    ...(siteConfig.url
      ? { sitemap: `${siteConfig.url.replace(/\/$/, "")}/sitemap.xml` }
      : {}),
  };
}
```
* **Audit**:
  * Correctly allows all public pages.
  * Correctly disallows administrative endpoints (`/admin/`).
  * Links to authoritative sitemap `https://bhaktimania.com/sitemap.xml`.
  * Combined with `app/admin/layout.tsx` (`robots: { index: false, follow: false }`), the admin interface has dual-layer crawl protection.

---

## 7. Exact Files & Components Requiring Changes

The table below outlines the exact files requiring changes in Phase 2B execution:

| Target File | Component / Role | Exact Nature of Modification |
| :--- | :--- | :--- |
| `app/bhakti-gyaan/[slug]/page.tsx` | Article Detail Route | 1. Add `datePublished` (ISO 8601) to `articleJsonLd`.<br>2. Add `dateModified` (ISO 8601) to `articleJsonLd`.<br>3. Add `image` (URL string or ImageObject array) to `articleJsonLd`.<br>4. Add `logo` to `publisher` in `articleJsonLd`.<br>5. Provide absolute fallback for `pageUrl` when `getCanonicalUrl()` is undefined.<br>6. Support optional `FAQPage` JSON-LD if article has structured Q&A sections. |
| `app/page.tsx` | Homepage Route | Add `url: siteConfig.url` to `websiteJsonLd` to ensure valid Schema.org `WebSite` representation. |
| `app/layout.tsx` | Root Layout | 1. Add fallback `openGraph.images: [{ url: "/images/og-default.webp", width: 1200, height: 630, alt: siteConfig.name }]`.<br>2. Add fallback `twitter.images: ["/images/og-default.webp"]`. |
| `app/sitemap.ts` | Dynamic Sitemap | 1. Replace volatile `new Date()` with stable date for static and category routes.<br>2. For articles, fall back to stable publication date rather than `new Date()`. |
| `lib/data/articles.ts` | Article Type & Data | Add optional `publishedAtIso?: string;` and `updatedAtIso?: string;` to `Article` interface and populate for all 18 articles so ISO timestamps are available without brittle string parsing. |
| `lib/data/supabase/types.ts` | Database Article Types | Add `rawUpdatedAt?: string | null;` to `SupabaseArticle` interface. |
| `lib/data/supabase/adapters.ts` | Adapter Layer | Map `rawUpdatedAt: row.updated_at || row.published_at || undefined` in `mapDatabaseArticleToArticle`. |
| `public/images/` | Public Assets Directory | **[NEW]** Create directory and place `og-default.webp` (1200x630px default site branding). |

---

## 8. Recommended Implementation Order

To maintain stability, avoid regressions, and ensure clean deployment verification, Phase 2B should be executed in three distinct stages:

```
┌─────────────────────────────────────────────────────────────┐
│ STAGE 1: Data Model & Foundation (Non-breaking)             │
│ • Extend SupabaseArticle & Article types with ISO dates      │
│ • Update adapters.ts to map updated_at                      │
│ • Add publishedAtIso & updatedAtIso to lib/data/articles.ts │
│ • Fix WebSite schema in app/page.tsx (add url)             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 2: Structured Data & Schema Perfection                │
│ • Update Article JSON-LD in app/bhakti-gyaan/[slug]/page.tsx│
│   - datePublished (ISO)                                     │
│   - dateModified (ISO)                                      │
│   - publisher.logo                                          │
│   - image (featuredImageUrl with site OG fallback)          │
│ • Stabilize sitemap.xml <lastmod> timestamps                │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 3: Visual Assets & Open Graph Fallback                │
│ • Create public/images/og-default.webp (1200x630)           │
│ • Add default images array in app/layout.tsx                │
│ • Test social crawler previews (Twitter, WhatsApp)          │
│ • Validate with Google Rich Results Test                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Risks & Edge Cases

1. **Date Parsing / Timezone Shifts**:
   * *Risk*: Generating dates on serverless instances without explicit timezone can shift dates by ±1 day (e.g. UTC vs IST).
   * *Mitigation*: Explicitly define ISO dates in UTC format (e.g. `2026-03-18T00:00:00.000Z`) or use `Asia/Kolkata` offset.
2. **Relative URLs in Structured Data**:
   * *Risk*: If `NEXT_PUBLIC_SITE_URL` is omitted in any environment, `getCanonicalUrl()` returns `undefined`. Falling back to `/bhakti-gyaan/...` produces relative URLs in JSON-LD, triggering Schema validation errors.
   * *Mitigation*: Implement a hard fallback to `"https://bhaktimania.com"` within structured data builders whenever `siteConfig.url` is falsy.
3. **Empty Image Fields in Article Schema**:
   * *Risk*: If `featuredImageUrl` is null and `image` is omitted from `Article` JSON-LD, Google Search Console flags an informational warning: *"Missing field 'image' (optional)"*.
   * *Mitigation*: Supply the canonical site Open Graph banner (`https://bhaktimania.com/images/og-default.webp`) as the fallback image in `Article` schema whenever an article lacks dedicated artwork.
4. **Google Structured Data Spam Penalties (FAQ)**:
   * *Risk*: Injecting `FAQPage` JSON-LD without reader-visible text causes search engine penalties.
   * *Mitigation*: Strictly enforce that FAQ schema is only generated when reader-facing FAQ components are rendered on the page.

---

## 10. Explicit List of Things That Must NOT Be Changed

During the upcoming Phase 2B implementation, the following elements are strictly frozen:

* **DO NOT** modify article body text, Hindi content, or editorial rewrites completed in Phase 2A.
* **DO NOT** modify article slugs (e.g. `/sacchi-bhakti-kya-hai`, `/radha-krishna-bhakti`, etc.).
* **DO NOT** modify category slugs or URL routes (`/hanuman`, `/radha-krishna`, `/shiv`, etc.).
* **DO NOT** alter Supabase database tables, migrations, or production RLS policies.
* **DO NOT** modify authentication logic (`lib/auth/admin.ts`, login forms, middleware).
* **DO NOT** modify Google AdSense configuration, publisher IDs, or ad script components (`components/ads/*`).
* **DO NOT** modify legal pages (`privacy-policy`, `terms`, `disclaimer`, `affiliate-disclosure`).
* **DO NOT** add placeholder, AI-hallucinated, or copyrighted third-party images.
* **DO NOT** alter category page H1 structures (they are already confirmed single-H1 compliant).
