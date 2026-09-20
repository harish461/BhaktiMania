# BhaktiMania — Supabase Database Schema & Relationship Diagram

**Architecture Version:** 1.0 (Relational Core + JSONB Structured Content)  
**Database Engine:** PostgreSQL 15+ (Supabase)  
**Agent:** `bhaktimania-backend`

---

## 1. Entity-Relationship Diagram (ASCII)

```text
┌────────────────────────────────────────┐
│               categories               │
├────────────────────────────────────────┤
│ id: uuid [PK]                          │
│ slug: text [UNIQUE]                    │
│ title: text                            │◄────────────────┐
│ meta_title: text                       │                 │
│ description: text                      │                 │
│ symbol: text                           │                 │ (1 : N)
│ intro: text [NULLABLE]                 │                 │ One category has
│ sort_order: integer                    │                 │ many articles
│ is_active: boolean                     │                 │
│ created_at: timestamptz                │                 │
│ updated_at: timestamptz                │                 │
└────────────────────────────────────────┘                 │
                                                           │
┌────────────────────────────────────────┐                 │
│                authors                 │                 │
├────────────────────────────────────────┤                 │
│ id: uuid [PK]                          │                 │
│ slug: text [UNIQUE]                    │◄────────┐       │
│ name: text                             │         │       │
│ role: text                             │         │       │
│ bio: text [NULLABLE]                   │         │ (1 : N)
│ avatar_url: text [NULLABLE]            │         │ One author has
│ is_active: boolean                     │         │ many articles
│ created_at: timestamptz                │         │       │
│ updated_at: timestamptz                │         │       │
└────────────────────────────────────────┘         │       │
                                                   │       │
                                                   │       │
┌──────────────────────────────────────────────────┴───────┴───────────────┐
│                                articles                                  │
├──────────────────────────────────────────────────────────────────────────┤
│ id: uuid [PK]                                                            │
│ slug: text [UNIQUE, INDEXED]                                             │
│ title: text                                                              │
│ description: text                                                        │
│ category_id: uuid [FK -> categories.id]                                  │
│ author_id: uuid [FK -> authors.id, NULLABLE]                             │
│ status: article_status ('draft', 'published', 'archived')                │
│                                                                          │
│ -- Structured Content Document                                           │
│ sections: jsonb [Array of ArticleSection objects]                        │
│                                                                          │
│ -- Devotional Presentation                                               │
│ symbol: text                                                             │
│ read_time: text                                                          │
│ featured: boolean [DEFAULT false]                                        │
│ featured_image_url: text [NULLABLE]                                      │
│ featured_image_alt: text [NULLABLE]                                      │
│                                                                          │
│ -- SEO Custom Overrides                                                  │
│ seo_title: text [NULLABLE]                                               │
│ seo_description: text [NULLABLE]                                         │
│                                                                          │
│ -- Timestamps                                                            │
│ published_at: timestamptz [NULLABLE, INDEXED]                            │
│ created_at: timestamptz                                                  │
│ updated_at: timestamptz                                                  │
└───────────────────────┬──────────────────────────────────────────────────┘
                        │
                        │ (1 : N)
                        │ One article can have multiple curated links
                        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      article_curated_relations                           │
├──────────────────────────────────────────────────────────────────────────┤
│ article_id: uuid [PK, FK -> articles.id ON DELETE CASCADE]               │
│ related_article_id: uuid [PK, FK -> articles.id ON DELETE CASCADE]       │
│ sort_order: integer [DEFAULT 0]                                          │
│ created_at: timestamptz                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Structured `sections` JSONB Document Schema

Each row in `articles` stores its content body within the `sections` column, preserving exact compatibility with the Next.js frontend:

```json
[
  {
    "heading": "string (H2 Section Heading, Optional)",
    "highlight": "string (Devotional Quote / Sanskrit Verse / Editorial Note, Optional)",
    "paragraphs": [
      "string (Devotional body paragraph with markdown links & bolding)"
    ],
    "bullets": [
      "string (Key takeaway item rendered with ✦ bullet symbol)"
    ]
  }
]
```

---

## 3. Data Flow Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                       Editorial Administration                          │
│               (/admin/articles - Authenticated Route)                   │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼ Supabase Client (Service / Admin Role)
┌─────────────────────────────────────────────────────────────────────────┐
│                        PostgreSQL Engine (Supabase)                     │
│                                                                         │
│  [categories]              [authors]                [articles]          │
│  • 8 Master records        • Editorial Team         • 18 Production Rows│
│  • Slugs & metadata        • Future Writers         • JSONB Content     │
│                                                     • Status = Published│
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼ Server Queries via @supabase/ssr (Anon Key)
                                    ▼ Enforced by Row Level Security (RLS)
┌─────────────────────────────────────────────────────────────────────────┐
│                     Next.js 16 Server Components                        │
│                                                                         │
│  • app/bhakti-gyaan/page.tsx             (Fetches all published)        │
│  • app/bhakti-gyaan/[slug]/page.tsx      (Fetches single article)       │
│  • app/[category]/page.tsx               (Fetches category articles)    │
│  • app/sitemap.ts                        (Fetches slugs for sitemap)    │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼ Pre-rendered HTML + SSR
┌─────────────────────────────────────────────────────────────────────────┐
│                           Public Visitors                               │
│  • Ultra-fast, zero client-database overhead                            │
│  • Pristine Hindi Devanagari typography & SEO                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Supabase Storage Hierarchy

```text
Bucket: 'bhaktimania-media' (Public: true)
│
├── articles/
│   ├── [slug]-hero.webp          (1200x675 Hero banner illustration)
│   └── [slug]-section-[n].webp   (Optional mid-article diagrams/art)
│
├── categories/
│   ├── hanuman.webp              (Category card header motif)
│   ├── radha-krishna.webp
│   └── shiv.webp
│
├── authors/
│   └── editorial-team.webp       (800x800 Author avatar)
│
└── site/
    ├── og-default.webp           (1200x630 Global social preview)
    └── favicon-devotional.png
```

---

## 5. Summary of Database Constraints & Indexes

| Table | Constraint / Index | Type | Purpose |
| :--- | :--- | :--- | :--- |
| `categories` | `categories_slug_key` | UNIQUE | Canonical route lookup (`/[category]`) |
| `categories` | `idx_categories_active_sort` | B-TREE | Fast filter tab listing |
| `authors` | `authors_slug_key` | UNIQUE | Author bio identification |
| `articles` | `articles_slug_key` | UNIQUE | Canonical article URL (`/bhakti-gyaan/[slug]`) |
| `articles` | `idx_articles_status_published` | B-TREE | High-speed public listing & sitemap queries |
| `articles` | `idx_articles_category` | B-TREE | Category filtering on `/bhakti-gyaan` and category pages |
| `articles` | `fk_articles_category` | FOREIGN KEY | Prevents accidental deletion of categories in use |
| `articles` | `fk_articles_author` | FOREIGN KEY | Links article to author record |
| `article_curated_relations` | `pk_curated_relations` | COMPOSITE PK | Prevents duplicate relation pairs |
| `article_curated_relations` | `chk_no_self_relation` | CHECK | Prevents an article from linking to itself |

---
*Diagram verified and certified by `bhaktimania-backend` agent.*
