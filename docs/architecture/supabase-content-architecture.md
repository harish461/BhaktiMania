# BhaktiMania — Supabase Content Architecture Specification

**Project:** BhaktiMania — Modern Hindi Devotional Content Platform  
**Agent:** `bhaktimania-backend`  
**Status:** Architectural Design (Pre-Implementation)  
**Date:** March 2026  
**Target Stack:** Next.js 16.3.5 (App Router), React 19, TypeScript, Supabase (PostgreSQL 15+, Auth, Storage, RLS)

---

## 1. Executive Summary & Current Architecture

### Current State
BhaktiMania currently operates as a static, pre-rendered content platform with:
* **18 Production Articles** covering 8 devotional categories.
* **8 Devotional Categories** (`हनुमान`, `राधा कृष्ण`, `भगवान शिव`, `श्रीमद्भगवद्गीता`, `त्योहार एवं व्रत`, `वृंदावन एवं धाम`, `भक्ति विचार`, `प्रेमानंद जी`).
* **Hardcoded In-Memory Data:** 
  * `lib/data/articles.ts` holds all 18 article objects with typed `sections` (headings, paragraphs, bullets, highlights, quotes).
  * `lib/data/categories.ts` holds metadata, symbols, and routes for all 8 categories.
* **Build & SEO Performance:** 33/33 static pages generate via `generateStaticParams()`, 0 lint errors, 100% verified internal links (35 links), and structured JSON-LD schemas.

### Problem Statement
While static TypeScript data served as a high-velocity foundation for initial editorial QA and visual tuning, scaling past 18 articles presents operational bottlenecks:
1. Publishing or editing articles requires a developer Git commit and full Next.js rebuild.
2. Non-technical Hindi editors cannot draft, preview, or schedule articles independently.
3. No draft/review lifecycle exists; an article is either in code or not.
4. Future interactive reader features (bookmarks, notifications, likes) cannot attach to a static file.

### Target Architecture
A clean, minimal, serverless architecture combining **Next.js Server Components** and **Supabase**:
```text
┌─────────────────────────────────────────────────────────────┐
│                 Editorial Admin Dashboard                   │
│         (Create, Draft, Edit, Preview, Publish)             │
└──────────────────────────────┬──────────────────────────────┘
                               │ Authenticated Supabase Client
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Supabase Backend                        │
│   • PostgreSQL 15+ (Relational Schema & JSONB Content)      │
│   • Row Level Security (RLS) - Public Read, Admin Write     │
│   • Storage Bucket (Articles, Categories, Devotional Media) │
└──────────────────────────────▲──────────────────────────────┘
                               │ Read-Only Server Queries
┌──────────────────────────────┴──────────────────────────────┐
│             Next.js Public Website (App Router)             │
│   • Server Components (Zero Client JS for Database)         │
│   • ISR (Incremental Static Regeneration) / On-Demand Reval │
│   • High-Performance Hindi Reading & SEO Optimization       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Entity Relationship & Data Model Design

The schema is intentionally kept **clean, modular, and beginner-friendly**, avoiding convoluted microservices or unnecessary joins.

### Core Tables
1. **`categories`**: Master record for the 8 devotional categories.
2. **`authors`**: Editorial teams and future individual writers/contributors.
3. **`articles`**: Core publication entity with relational metadata and structured `sections` stored as JSONB.
4. **`article_curated_relations`** *(Optional/Lightweight)*: Editorial overrides for manual related article pairings.

---

## 3. Table Definitions & Schemas

### 3.1 Table: `categories`
Stores devotional category configuration. Replaces static `categoriesData`.

```sql
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,                  -- e.g. 'हनुमान जी', 'भगवान शिव'
    meta_title TEXT NOT NULL,             -- e.g. 'हनुमान जी | भक्ति, प्रेरणा और ज्ञान'
    description TEXT NOT NULL,            -- Short category description
    symbol TEXT NOT NULL,                 -- Sacred motif, e.g. 'श्री राम', 'ॐ नमः शिवाय'
    intro TEXT,                           -- Detailed devotional introduction
    sort_order INT DEFAULT 0,             -- Order of appearance in filters/menus
    is_active BOOLEAN DEFAULT true,       -- Allows hiding categories without deletion
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_categories_slug ON public.categories (slug);
CREATE INDEX idx_categories_active_sort ON public.categories (is_active, sort_order);
```

### 3.2 Table: `authors`
Supports the current editorial team credit and allows seamless expansion to individual authors or scholars later.

```sql
CREATE TABLE public.authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,                   -- e.g. 'BhaktiMania Editorial Team'
    slug TEXT UNIQUE NOT NULL,            -- e.g. 'editorial-team'
    role TEXT DEFAULT 'संपादकीय मंडल',   -- Editorial role in Hindi
    bio TEXT,                             -- Short author biography
    avatar_url TEXT,                      -- Supabase storage URL
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_authors_slug ON public.authors (slug);
```

### 3.3 Table: `articles`
The central content entity. Integrates SEO, publishing lifecycle, relations, and structured content.

```sql
CREATE TYPE public.article_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,            -- Canonical URL slug, e.g. 'karma-yoga-kya-hai'
    title TEXT NOT NULL,                  -- Article title (H1)
    description TEXT NOT NULL,            -- Article excerpt / intro summary
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
    status public.article_status DEFAULT 'draft' NOT NULL,
    
    -- Content Storage (Structured JSONB)
    sections JSONB NOT NULL DEFAULT '[]'::JSONB,
    
    -- Devotional & Presentation Metadata
    symbol TEXT NOT NULL,                 -- Sacred motif label (e.g. 'दीप', 'मोरपंख', 'गीता')
    read_time TEXT NOT NULL,              -- Display reading time (e.g. '6 मिनट')
    featured BOOLEAN DEFAULT false,       -- Highlight on homepage or category header
    featured_image_url TEXT,              -- Main banner/hero illustration
    featured_image_alt TEXT,              -- Accessible image description
    
    -- Custom SEO Overrides (Nullable; falls back to title/description if null)
    seo_title TEXT,                       -- Custom browser tab title
    seo_description TEXT,                 -- Custom search snippet
    
    -- Timestamps
    published_at TIMESTAMPTZ,             -- Set when status becomes 'published'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high-frequency queries
CREATE INDEX idx_articles_slug ON public.articles (slug);
CREATE INDEX idx_articles_status_published ON public.articles (status, published_at DESC);
CREATE INDEX idx_articles_category ON public.articles (category_id, status);
CREATE INDEX idx_articles_featured ON public.articles (featured, status);
```

### 3.4 Table: `article_curated_relations` *(Optional Editorial Control)*
Allows editors to explicitly pin related articles. If empty, the system automatically falls back to category-based recommendation.

```sql
CREATE TABLE public.article_curated_relations (
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    related_article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (article_id, related_article_id),
    CONSTRAINT chk_no_self_relation CHECK (article_id <> related_article_id)
);

CREATE INDEX idx_curated_relations ON public.article_curated_relations (article_id, sort_order);
```

---

## 4. Article Content Storage Decision

### Evaluation of Options

| Criterion | Option A: Single JSONB `sections` | Option B: Normalized Tables (`article_sections`, `article_blocks`) | Option C: Raw Markdown String |
| :--- | :--- | :--- | :--- |
| **Fidelity with Frontend** | **100% Match** (`ArticleSection[]`) | Requires relational aggregation to reconstruct | High, but loses structured highlight/verse semantics |
| **Query Performance** | **1 single-row fetch**; 0 joins | Requires multi-table joins and `ORDER BY sort_order` | 1 single-row fetch |
| **Admin Editor Complexity**| Clean JSON payload from form/block editor | High: Complex transaction with deletions/re-inserts | Needs raw markdown textarea (error-prone for editors) |
| **Reordering Sections** | Trivially reorders array in memory | Tedious `sort_order` atomic swapping | Plain text reordering |
| **Migration Risk** | **Zero loss**, 1:1 automated mapping | High risk of relational sync errors | Must deconstruct formatted objects into text |
| **Relational Querying** | Querying a single paragraph across 1000 articles is rare | Can query paragraphs individually | Cannot query sub-elements |

### Final Decision: Hybrid Model (Option A for Content + Relational Foreign Keys)
We recommend **Option A (JSONB for `sections`)**:
1. **Direct TypeScript Mirror:** The database schema exactly mirrors the existing TypeScript interface:
   ```typescript
   interface ArticleSection {
     heading?: string;
     paragraphs?: string[];
     bullets?: string[];
     highlight?: string; // Sanskrit verses, quotes, or editorial notes
   }
   ```
2. **Atomic Editorial Saves:** When an editor in the future admin dashboard creates an article with 8 sections, updating the article is a single clean `UPDATE articles SET sections = $1 WHERE id = $2`.
3. **No Over-Engineering:** Normalizing paragraphs and bullets into separate SQL tables introduces immense relational overhead, multi-table joins, and brittle cascade logic with zero practical benefit for a devotional publishing site.
4. **Relational Where It Matters:** Category, Author, Publication Status, and Curated Links remain strictly relational with foreign key constraints.

---

## 5. Category Architecture

The category system remains grounded in the 8 canonical categories:
1. **हनुमान जी** (`hanuman`) — Symbol: `श्री राम`
2. **राधा कृष्ण** (`radha-krishna`) — Symbol: `राधे`
3. **भगवान शिव** (`shiv`) — Symbol: `ॐ नमः शिवाय`
4. **श्रीमद्भगवद्गीता** (`bhagavad-gita`) — Symbol: `गीता`
5. **त्योहार एवं व्रत** (`festivals`) — Symbol: `दीप`
6. **वृंदावन एवं धाम** (`vrindavan`) — Symbol: `राधे राधे`
7. **प्रेमानंद जी** (`premanand-ji`) — Symbol: `ॐ`
8. **भक्ति विचार** (`bhakti-vichar`) — Symbol: `शांति`

### Synchronization & Consistency
* `categories` table in Supabase becomes the single source of truth.
* No duplicate hard-coded arrays in frontend code.
* The Next.js category page (`/[category]`) queries `categories` by `slug`.
* If a category is marked `is_active = false`, it is automatically hidden from public navigation while preserving database integrity.

---

## 6. Author Architecture

### Current Editorial Strategy
All current 18 articles are authored under the canonical title:
**`BhaktiMania Editorial Team`** (`संपादकीय मंडल`).

### Future-Proof Design
Instead of free-form text strings in the article record:
1. Seed the `authors` table with a default record:
   * `name`: `'BhaktiMania Editorial Team'`
   * `slug`: `'editorial-team'`
   * `role`: `'संपादकीय मंडल'`
   * `bio`: `'सनातन धर्म, दर्शन, भक्ति और साधना से जुड़े प्रामाणिक एवं प्रेरक विचारों का संकलन।'`
2. All 18 articles link to this author via `author_id`.
3. When individual scholars, guest writers, or verified contributors join later, they are simply added to the `authors` table without altering the article schema.

---

## 7. Article Publishing Workflow & Lifecycle

The lifecycle uses a three-state machine:

```text
[ Draft ] ──────────► [ Published ] ──────────► [ Archived ]
    ▲                      │                         │
    │                      ▼                         │
    └──────────────── (Unpublish) ◄──────────────────┘
```

### State Behaviors
1. **`draft`**:
   * Article is being drafted or edited.
   * `published_at` is `NULL` (or future scheduled time).
   * **RLS Policy:** Invisible to public site. Visible only to authenticated admins.
2. **`published`**:
   * Article is live.
   * `published_at` is stamped with timestamp.
   * **RLS Policy:** Readable by public site (`status = 'published' AND published_at <= NOW()`).
3. **`archived`**:
   * Article is retired from public listings.
   * Preserved in database for editorial records.
   * Returns 404 on public route; redirects can be configured if needed.

### Admin Operations Supported
* **Create Article:** Inserts row with `status = 'draft'`.
* **Save Draft:** Updates content and metadata; status remains `draft`.
* **Publish:** Sets `status = 'published'`, sets `published_at = COALESCE(published_at, NOW())`.
* **Unpublish:** Sets `status = 'draft'`.
* **Archive:** Sets `status = 'archived'`.
* **Soft Delete:** Status set to `archived`. Hard deletion restricted to super-admin.

---

## 8. Related Articles Recommendation Strategy

### The Hybrid Recommendation Model
To ensure zero editorial burden while retaining editorial precision when desired:

```text
┌────────────────────────────────────────────────────────┐
│             Request Related Articles for [ID]          │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
      Check `article_curated_relations` for article_id
                            │
            ┌───────────────┴───────────────┐
            │                               │
    Has Curated Links?              No Curated Links?
            │                               │
            ▼                               ▼
Fetch curated articles (up to 3)    Fetch recent published articles
            │                       in same category (LIMIT 3)
            │                               │
            ▼                               │
   Fewer than 3 links?                      │
            │                               │
            ├───────► Fill remainder ◄──────┘
            │         from same category
            ▼
   Return 3 Articles
```

### Why this is optimal for BhaktiMania
* **Day 1 Automation:** 100% of the 18 articles automatically display 3 related articles from their own category without requiring manual curation.
* **Editorial Flexibility:** If an editor specifically wants to link `hanuman-chalisa-saral-arth` to `hanuman-chalisa-paath-kyun-karein`, they can pin it via the curated relations table.

---

## 9. Tag Architecture Evaluation

### Decision: Defer Dedicated Tag System to Phase 2 (50+ Articles)

**Evaluation:**
* BhaktiMania currently has **18 articles** across **8 well-defined categories**.
* Categories already provide high-precision topical clustering (Hanuman, Shiva, Gita, Radha Krishna, etc.).
* Introducing `tags` and `article_tags` now introduces:
  * 2 additional database tables.
  * Tag listing pages (`/tag/[slug]`).
  * Tag routing, metadata, breadcrumbs, and sitemaps.
  * Thin content risk (many tags would only contain 1 article, which harms SEO).

### Future Tag Schema (Ready for Phase 2)
When the library exceeds 50 articles, the following schema can be added without modifying existing tables:
```sql
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,                   -- e.g. 'हनुमान चालीसा', 'कर्म योग'
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.article_tags (
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);
```

---

## 10. Media & Supabase Storage Strategy

### Bucket Design
A single public bucket: **`bhaktimania-media`**

### Folder Structure
```text
bhaktimania-media/
├── articles/
│   ├── hanuman-chalisa-saral-arth-hero.webp
│   └── karma-yoga-kya-hai-hero.webp
├── categories/
│   ├── hanuman-banner.webp
│   └── radha-krishna-banner.webp
├── authors/
│   └── editorial-team-avatar.webp
└── site/
    ├── og-default.webp
    └── favicon-devotional.webp
```

### Storage Security & Governance
* **Public Access:** Bucket set to `public = true`. Read-only access for all images via fast CDN URLs.
* **Upload Restrictions:** Only authenticated admins with role `admin` can upload, update, or delete objects.
* **File Guidelines:**
  * Formats: Modern WebP (recommended) or JPEG/PNG.
  * Dimension targets: 1200×675 (16:9 aspect ratio) for article heroes; 800×800 for author avatars.
  * File size cap: Maximum 1.5MB per image.
* **Storage Path in Database:** Store the relative path or full public URL in `articles.featured_image_url`.

---

## 11. SEO & Metadata Architecture

### Database Fields vs. Derived Runtime Values

| Value | Storage Location | Generation Method / Rule |
| :--- | :--- | :--- |
| **Page Title** | Database (`seo_title` or fallback `title`) | `seo_title ? `${seo_title} \| BhaktiMania` : `${title} \| BhaktiMania`` |
| **Meta Description** | Database (`seo_description` or fallback `description`) | Editorial snippet, max 160 characters |
| **Canonical URL** | **Derived Runtime** | Formatted via `getCanonicalUrl('/bhakti-gyaan/' + article.slug)` using `siteConfig.url` |
| **OpenGraph Title** | **Derived Runtime** | Matches Page Title |
| **OpenGraph Description** | **Derived Runtime** | Matches Meta Description |
| **OpenGraph Image** | Database / Fallback | `featured_image_url` or default site devotional banner |
| **Article Schema (JSON-LD)** | **Derived Runtime** | Generated dynamically in Server Component using article attributes |
| **BreadcrumbList (JSON-LD)** | **Derived Runtime** | Generated dynamically: `होम` → `भक्ति ज्ञान` → `[Article Title]` |
| **Sitemap Entries** | **Derived Runtime** | `app/sitemap.ts` queries all published article slugs dynamically |

*Key Principle:* Avoid polluting database tables with computed URLs or boilerplate templates (`| BhaktiMania`) that are better managed centrally in code.

---

## 12. Row Level Security (RLS) & Security Policies

Supabase Row Level Security ensures strict data isolation at the database engine level.

### Concept Overview
* **Public Visitors (Anon):** Can only read live, published content.
* **Admin Users (Authenticated):** Can perform all CRUD operations.

```sql
-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_curated_relations ENABLE ROW LEVEL SECURITY;

-- 1. Categories Policies
-- Public can view active categories
CREATE POLICY "Public categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (is_active = true);

-- Admins have full access
CREATE POLICY "Admins have full access to categories" 
ON public.categories FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' IN ('admin@bhaktimania.com'))
WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' IN ('admin@bhaktimania.com'));

-- 2. Authors Policies
-- Public can view active authors
CREATE POLICY "Public authors are viewable by everyone" 
ON public.authors FOR SELECT 
USING (is_active = true);

-- Admins have full access
CREATE POLICY "Admins have full access to authors" 
ON public.authors FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' IN ('admin@bhaktimania.com'))
WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' IN ('admin@bhaktimania.com'));

-- 3. Articles Policies
-- Public can only view published articles
CREATE POLICY "Published articles are viewable by everyone" 
ON public.articles FOR SELECT 
USING (status = 'published' AND published_at <= NOW());

-- Admins have full access (draft, edit, publish, delete)
CREATE POLICY "Admins have full access to articles" 
ON public.articles FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' IN ('admin@bhaktimania.com'))
WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' IN ('admin@bhaktimania.com'));

-- 4. Storage Policies
CREATE POLICY "Public Access to Devotional Media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'bhaktimania-media');

CREATE POLICY "Admin Upload to Devotional Media" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'bhaktimania-media' AND (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' IN ('admin@bhaktimania.com')));
```

---

## 13. Data Migration Strategy (18 Production Articles)

A deterministic, 100% loss-free migration path from `lib/data/articles.ts` to Supabase:

### Migration Flow
```text
lib/data/categories.ts  ───────►  Insert 8 Rows into `categories`
                                        │
                                        ▼
Create default author   ───────►  Insert 'BhaktiMania Editorial Team' into `authors`
                                        │
                                        ▼
lib/data/articles.ts    ───────►  Map & Insert 18 Rows into `articles`
                                  - Match categorySlug -> category_id
                                  - Set author_id -> editorial team id
                                  - Set status = 'published'
                                  - Set published_at from parsed date string
                                  - JSON.stringify(sections) -> sections JSONB
                                        │
                                        ▼
Automated QA Script     ───────►  Verify 18 rows, slugs, symbols, internal links
```

### Guarantees
1. **Slugs Unchanged:** Exact match for all 18 canonical slugs (e.g., `karma-yoga-kya-hai`).
2. **Zero Link Rot:** All 35 internal markdown links remain functional.
3. **Structured Content Preserved:** All 40+ Sanskrit verse highlights, paragraphs, and star bullet lists remain intact.
4. **Historical Continuity:** Publication dates preserved accurately.

---

## 14. Next.js 16 App Router Integration Approach

### Proposed Directory Layout
```text
lib/
├── config/
│   └── site.ts             # Site metadata & canonical helper
├── supabase/
│   ├── client.ts           # Browser client for future interactive client components
│   └── server.ts           # Server client for Server Components & Route Handlers
└── data/
    ├── articles.ts         # Unified Data Access Layer (queries Supabase)
    └── categories.ts       # Unified Category Data Access Layer (queries Supabase)
```

### Abstraction Pattern (Data Access Layer)
The UI components (`ArticleGrid`, `BhaktiGyaanListing`, `[slug]/page.tsx`) do NOT import Supabase directly. They continue calling functions from `lib/data/articles.ts`:

```typescript
// lib/data/articles.ts (Future implementation pattern)
import { createServerClient } from '@/lib/supabase/server';
import { Article } from '@/lib/types/article';

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('articles')
    .select('*, categories(*), authors(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return mapDatabaseToArticle(data);
}
```

**Benefit:** During migration, we can toggle the data source inside `lib/data/articles.ts` with zero changes required in any Next.js page or component!

---

## 15. Future Admin Dashboard Requirements

The future editorial dashboard (`/admin`) will require:
1. **Authentication:** Simple, secure admin login (email magic link or password).
2. **Article List View:** Filter by status (`All`, `Draft`, `Published`, `Archived`) and category.
3. **Structured Editor Form:**
   * Metadata: Title, Slug (auto-generated from title with edit capability), Category dropdown, Read Time, Symbol.
   * SEO inputs: Custom SEO Title, Custom SEO Description.
   * Section Builder: Add/remove/reorder sections with inputs for Heading, Highlight (Verses/Quotes), Paragraphs, and Bullets.
4. **Live Editorial Preview:** View how the article renders in the BhaktiMania layout before publishing.
5. **Publish Controls:** Action buttons for `Save Draft`, `Publish Live`, `Unpublish`, and `Archive`.

---

## 16. What Should NOT Be Implemented Yet

To maintain discipline and avoid project derailment, the following are strictly deferred:
* ❌ Do NOT install `@supabase/supabase-js` or `@supabase/ssr` in this task.
* ❌ Do NOT create live database instances or apply SQL migrations yet.
* ❌ Do NOT create `/admin` or dashboard routes yet.
* ❌ Do NOT create user authentication or login forms yet.
* ❌ Do NOT build comment sections, bookmarking, or user accounts yet.
* ❌ Do NOT modify any public frontend components or styles.

---

## 17. Recommended Implementation Phases

Following structured engineering best practices, the rollout should occur across 8 sequential phases:

```text
Phase A: Architectural Specification & Sign-off  ◄── [CURRENT PHASE]
    │
    ▼
Phase B: Supabase Project Setup & Environment Configuration
    │   • Provision Supabase project
    │   • Configure NEXT_PUBLIC_SUPABASE_URL and anon keys in .env.local
    │
    ▼
Phase C: Database Schema & RLS Execution
    │   • Run SQL migrations (categories, authors, articles, relations)
    │   • Apply RLS policies & indexes
    │   • Create 'bhaktimania-media' storage bucket
    │
    ▼
Phase D: Migration of 18 Production Articles
    │   • Execute automated seed script from lib/data/articles.ts
    │   • Run database QA script verifying 18 records and relations
    │
    ▼
Phase E: Next.js Supabase Data Layer
    │   • Install @supabase/ssr and @supabase/supabase-js
    │   • Implement lib/supabase/server.ts and client.ts
    │   • Adapt lib/data/articles.ts to query Supabase with fallback
    │
    ▼
Phase F: Admin Authentication & Route Protection
    │   • Implement admin login route (`/login` or `/admin/login`)
    │   • Add Next.js middleware protecting `/admin/*`
    │
    ▼
Phase G: Admin Editorial Dashboard
    │   • Build `/admin/articles` list and CRUD editor form
    │   • Add section builder for headings, paragraphs, highlights, and bullets
    │
    ▼
Phase H: Public Cutover & Full Validation
    │   • Switch public routes from static arrays to live Supabase queries
    │   • Verify 33/33 routes, sitemap, SEO, lint, and build
```

---

*Specification authored and certified by `bhaktimania-backend` agent.*
