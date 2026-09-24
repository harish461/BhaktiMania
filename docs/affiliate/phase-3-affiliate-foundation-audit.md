# BhaktiMania — Phase 3 Affiliate Marketing
## Batch A: Affiliate Foundation Audit & Implementation Blueprint

**Document Version:** 1.0.0  
**Date:** 22 September 2026  
**Auditor:** BhaktiMania Affiliate & Monetization Agent  
**Status:** Approved Audit & Technical Specification (Zero code/data modifications in this batch)

---

## 1. Executive Summary & Objective

The BhaktiMania visual redesign (Sacred Folio system) is complete, responsive, and verified live on production (`https://bhaktimania.com`). The platform currently features 18 high-quality, long-form Hindi devotional articles across 8 core categories.

The objective of **Phase 3** is to introduce ethical, editorial-first affiliate monetization without compromising BhaktiMania’s sacred reading experience, user trust, Google AdSense eligibility, or SEO equity.

### Core Tenet: The Devotional Sanctuary Principle
BhaktiMania is an editorial devotional sanctuary (`भक्ति • ज्ञान • शांति`), not a commercial coupon site or transactional store. Affiliate recommendations must function as **curated spiritual study guides** (e.g., authentic Gita Press scriptures, classical commentaries, pure tulsi/rudraksha japa beads, brass puja essentials), never as disruptive advertising.

### Primary Affiliate Network
* **Initial Program:** **Amazon Associates India** (`amazon.in`).
* **Future Extensibility:** Structured to accommodate direct publisher partnerships (e.g., Gita Press direct, ISKCON publications) and ethical devotional craft artisans via the same unified architecture.

---

## 2. Current Project Inspection

A comprehensive codebase audit was conducted across static data, database schemas, Admin CMS, frontend components, and SEO configuration.

| Component / Layer | Current State | Audit Finding / Relevance for Affiliate System |
|:---|:---|:---|
| **Article Type** | `lib/data/articles.ts` (`Article`, `ArticleSection`) & `lib/data/supabase/types.ts` (`SupabaseArticle`) | Articles use structured JSON sections (`heading`, `highlight`, `paragraphs`, `bullets`). There is currently **zero** affiliate or product schema in the article data model. |
| **Article Data** | 18 published articles in `articlesData` and Supabase `articles` table | All 18 articles are long-form (1,500–2,500 words), highly contextual, and divided into topical clusters (Gita, Hanuman, Shiva, Krishna, Ekadashi, Vrindavan, Bhakti Vichar). |
| **Admin Editor** | `components/admin/ArticleEditor.tsx` | Modular card architecture (`ArticleDetailsCard`, `ArticleContentCard`, `ArticleSeoCard`, `ArticlePublishingCard`). Currently has no product association or affiliate management tab. |
| **Supabase Schema** | PostgreSQL tables: `articles`, `categories`, `authors`, `article_curated_relations` | Articles contain JSONB `sections`. Currently no dedicated affiliate tables or foreign keys exist in the database. |
| **Existing Disclosure** | `components/affiliate/AffiliateDisclosure.tsx` | Clean, pre-built bilingual disclosure component rendered on all article detail pages. |
| **Policy Page** | `app/affiliate-disclosure/page.tsx` | Dedicated, full-length legal policy page titled *"एफिलिएट प्रकटीकरण (Affiliate Disclosure)"*, verified in `sitemap.xml`. |
| **Footer** | `components/layout/Footer.tsx` | The deep saffron 4-column footer includes an explicit link to `/affiliate-disclosure` under the **Legal & Transparency** column. |
| **Header** | `components/layout/Header.tsx` | Pure editorial navigation (होम, भक्ति ज्ञान, भक्ति विचार, etc.). Zero commercial clutter. |
| **Homepage** | `app/page.tsx` | 7-stage sacred sequence. Contains **zero** affiliate links, zero product cards, and zero commercial banners. |
| **Article Pages** | `app/bhakti-gyaan/[slug]/page.tsx` | Renders `<AffiliateDisclosure className="mt-8" />` at the bottom of the article body, immediately after in-article ad slots and before the ornamental divider and related articles. |
| **SEO & Schema** | `components/seo/ArticleStructuredData.tsx` | Valid Schema.org `Article` / `BlogPosting` JSON-LD. Contains **zero** `Product` schema. All canonical, robots, OpenGraph, and Twitter tags are intact. |
| **Google AdSense** | `app/layout.tsx`, `components/ads/InArticleAd.tsx`, `public/ads.txt` | Publisher ID `ca-pub-3380573668907472` is active and deployed. In-article slots are placed after section 2 and near article completion. |
| **External Links** | Codebase-wide search | **Zero** external commercial or Amazon affiliate links currently exist. Internal links use `DevotionalLink.tsx` or `next/link`. Social media links in Footer use standard `target="_blank" rel="noopener noreferrer"`. |

---

## 3. Current Disclosure Audit

### Existing Implementation
The platform already possesses a foundation component located at `components/affiliate/AffiliateDisclosure.tsx`:

```tsx
// Current Hindi phrase in AffiliateDisclosure.tsx
"इस पेज पर कुछ लिंक affiliate links हो सकते हैं। यदि आप इनके माध्यम से खरीदारी करते हैं, तो BhaktiMania को बिना आपके अतिरिक्त खर्च के कमीशन मिल सकता है।"
```

### Audit Findings
1. **Rendered Placement:** Rendered automatically at the bottom of every individual article page at `app/bhakti-gyaan/[slug]/page.tsx` (Line 420), preceding the article footer divider and related articles list.
2. **Global Visibility:** It is **not** rendered globally on the Homepage, Category index pages, or Static pages. This is compliant and desirable, as non-article pages do not contain affiliate recommendations.
3. **Legal Compliance (General):** The existing text satisfies general FTC (US) and basic consumer transparency norms: it states that links may be affiliate links, commissions may be earned, and there is zero additional cost to the consumer.
4. **Amazon Associates Specific Deficiencies:**
   * **Missing Statutory Statement:** Amazon Associates Operating Agreement specifically mandates the inclusion of the exact statutory sentence:  
     > *"As an Amazon Associate I earn from qualifying purchases."*  
     (or in Hindi: *"अमेज़न एसोसिएट के रूप में, मैं योग्य खरीदारियों से कमीशन अर्जित करता हूँ।"* alongside the exact English wording).
   * **Micro-Level Disclosure:** In addition to the end-of-article disclaimer box, link-level / card-level indicators (e.g. `Affiliate Link`, `Amazon पर देखें`, `[प्रायोजित / एफिलिएट]`) must be visible in immediate proximity to the product CTA to satisfy ASCI guidelines.

---

## 4. Amazon Associates India Requirements (Official Source Analysis)

All findings below are derived directly from the official **Amazon Associates India Operating Agreement**, **Associates Program Participation Requirements**, and **Amazon Trademark Guidelines**.

| Requirement Area | Official Amazon Associates Requirement | BhaktiMania Implementation Mandate |
|:---|:---|:---|
| **Site Identification & Statement** | Must clearly state on the site: *"As an Amazon Associate I earn from qualifying purchases."* This statement must be displayed on any page that contains affiliate links. | Update `AffiliateDisclosure.tsx` and `app/affiliate-disclosure/page.tsx` to prominently include this exact statutory declaration. |
| **Affiliate Disclosure Visibility** | Disclosure must be clear, conspicuous, and presented **before** the consumer clicks the affiliate link. It cannot be hidden in obscure footers or behind multiple clicks. | Product cards will include an immediate micro-tag (`#Affiliate` / `Amazon Affiliate Link`), while the bottom of the article maintains the prominent disclosure card. |
| **Product Pricing & Stale Data** | **Strict Prohibition:** You must not display static, manually typed product prices unless retrieved via the Amazon Product Advertising API (PA-API) with real-time timestamp and standard disclaimers (*"Price as of [date/time] and subject to change"*). | **Do NOT display static prices.** Instead, use transparent CTA text: *"Amazon पर मूल्य देखें"* (Check Price on Amazon). This eliminates compliance risk and prevents misleading readers when Amazon prices change. |
| **Product Images** | Product images must be obtained directly from Amazon (via official SiteStripe or PA-API), or legitimate publisher press kits. You must not download, host, alter, crop, or distort Amazon product images. | Product cards will utilize direct Amazon-hosted image URLs or authorized publisher cover assets. Never store scraped Amazon images on local/Supabase storage. |
| **Product Descriptions & Reviews** | You must not copy proprietary Amazon customer reviews, star ratings, or verbatim promotional descriptions from Amazon product listings. | Write original, respectful, 1–2 sentence editorial notes explaining the spiritual significance or edition details (e.g. *"गीताप्रेस गोरखपुर द्वारा प्रकाशित यह प्रामाणिक संस्करण साधकों के लिए अत्यंत उपयोगी है।"*). |
| **Trademarks & Branding** | You must not use the Amazon logo or Amazon trademarks unless explicitly authorized by the Amazon Brand Guidelines. You must not use "Amazon" in your domain name or social handles. | Use clean system icons (e.g. a book icon `📖`, sacred star `✦`, or external link arrow `↗`) with clear text: *"Amazon पर देखें"*. Do not download or distort third-party Amazon logos. |
| **Affiliate URLs & Cloaking** | **Strict Prohibition on Cloaking:** You must not cloak, hide, mask, or disguise affiliate links using redirect scripts (e.g., `/go/amazon`, `/out/book`) or arbitrary shorteners. You may only use direct Amazon links with your approved Associate Tag (`tag=bhaktimania-21`) or official Amazon shortlinks (`amzn.to`). | Store direct, transparent Amazon URLs in the database. Outbound links will point directly to `https://www.amazon.in/dp/.../?tag=...`. |
| **Social Media Sharing** | Permitted **only** on public, verified channels owned by the Associate. **Strictly prohibited** in private communications (WhatsApp, Telegram personal chats, direct email newsletters, SMS). All social posts must include `#Ad` or `#Affiliate`. | Never embed affiliate links in mass emails or private chat channels. If shared on the public Facebook page or YouTube channel, mandate `#Affiliate #Ad`. |
| **Application & Qualifying Sales** | New accounts require at least **3 qualifying sales** within **180 days** of registration to undergo manual compliance review and final account approval. | Strategically integrate high-intent, low-barrier, authentic books (Gita, Sundarkand, Hanuman Chalisa) where reader intent is highest. |
| **Prohibited Practices** | Self-purchases (buying through your own affiliate links) and incentivized clicks ("Click here to support us") are strictly grounds for immediate account termination. | Zero incentivized language. Links are framed purely as study recommendations. |

---

## 5. Affiliate Content Strategy: 18 Published Articles Mapping

To maintain high editorial value, every recommended item must have a 1:1 thematic alignment with the article topic. Irrelevant products (e.g., electronic gadgets, generic household goods) are strictly forbidden.

### Strategic Mapping Table (All 18 Published Articles)

| # | Article Title & Slug | Content Cluster | Potential Product Category | Affiliate Relevance | Recommended? | Editorial Justification |
|:---:|:---|:---|:---|:---:|:---:|:---|
| 1 | **सच्ची भक्ति क्या है?**<br>`sacchi-bhakti-kya-hai` | भक्ति विचार | Tulsi Japa Mala, Japa Bag (Goumukhi), Devotional Literature | High | **Yes (Pilot Phase)** | Complements daily personal sadhana, prayer discipline, and the internal shift from ritual to heartfelt remembrance. |
| 2 | **राधा कृष्ण की भक्ति हमें क्या सिखाती है?**<br>`radha-krishna-bhakti` | राधा कृष्ण | Radha-Krishna Devotional Books, Bhajan Sangrah | High | **Yes** | Devotees seek authentic literature exploring divine love (*Prem Marg*) and devotional hymns. |
| 3 | **हनुमान जी से सीखें विश्वास और समर्पण**<br>`hanuman-ji-vishwas-samarpan` | हनुमान | Gita Press Sundarkand, Ramcharitmanas, Brass Hanuman Idol | High | **Yes (Pilot Phase)** | Devotees studying Hanuman's devotion naturally seek authentic Sundarkand editions for personal recitation. |
| 4 | **श्रीमद्भगवद्गीता के 5 संदेश**<br>`bhagavad-gita-5-sandesh` | भगवद्गीता | Shrimad Bhagavad Gita (Gita Press / Sadhak Sanjeevani / As It Is) | Highest | **Yes (Pilot Phase)** | Highest conversion and search intent. Readers exploring Gita messages actively seek complete, readable translations. |
| 5 | **महादेव की भक्ति और शिव नाम का आध्यात्मिक महत्व**<br>`mahadev-bhakti-shiv-naam-mahatva` | शिव | Shiva Purana (Gita Press), Authentic Rudraksha Mala (Panchmukhi) | High | **Yes** | Direct thematic fit for readers learning about *Om Namah Shivaya* chanting and sacred bead meditation. |
| 6 | **एकादशी व्रत का आध्यात्मिक महत्व**<br>`ekadashi-vrat-adhyatmik-mahatva` | त्योहार / व्रत | Ekadashi Mahatmya Book (Gita Press), Tulsi Beads | Moderate-High | **Yes** | Dedicated Ekadashi observers consistently purchase Vrat Katha booklets and Tulsi malas for Ekadashi fasting rules. |
| 7 | **वृंदावन जाने से पहले जानने योग्य बातें**<br>`vrindavan-jane-se-pehle-baatein` | वृंदावन / धाम | Braj Yatra Guidebook, Vrindavan Heritage Map, Travel Diary | High | **Yes** | Practical travel guide intent. Pilgrims benefit greatly from curated Braj Mandal parikrama literature and travel journals. |
| 8 | **मन की शांति के लिए भक्ति को जीवन में कैसे अपनाएं?**<br>`mann-ki-shanti-ke-liye-bhakti` | भक्ति विचार | Meditation Asana/Mat, Tulsi Chanting Mala, Spiritual Self-Help | Moderate | **Yes** | Connects spiritual philosophy with physical meditation props and mindfulness accessories. |
| 9 | **श्री कृष्ण के जीवन से मिलने वाली 5 प्रेरणाएं**<br>`shri-krishna-jeevan-prernayein` | राधा कृष्ण | Shrimad Bhagavatam (Canto 10 / Dasham Skandha), Krishna Art Book | High | **Yes** | Encourages deeper study of Krishna's life and Bhagavat teachings through authentic canonical literature. |
| 10 | **हनुमान चालीसा का पाठ क्यों किया जाता है?**<br>`hanuman-chalisa-paath-kyun-karein` | हनुमान | Hanuman Chalisa Hardbound (Gita Press), Brass Pooja Bell | Highest | **Yes** | Readers researching Chalisa recitation benefits are the exact target audience for portable or commentary editions. |
| 11 | **हनुमान चालीसा का सरल अर्थ: चौपाइयों को समझने का प्रयास**<br>`hanuman-chalisa-saral-arth` | हनुमान | Detailed Hanuman Chalisa Commentary (Gita Press Teeka) | Highest | **Yes** | High scholarly intent. Readers reading line-by-line meanings desire an authoritative printed commentary. |
| 12 | **हनुमान जी से मिलने वाली जीवन की प्रेरणाएं**<br>`hanuman-ji-se-jeevan-ki-prerna` | हनुमान | Ramcharitmanas (Gita Press Gutka/Large Edition) | High | **Yes** | Ideal for seekers wanting the complete Goswami Tulsidas text illustrating Hanuman's exemplary service. |
| 13 | **शिव भक्ति का सरल अर्थ और दैनिक जीवन में उसका महत्व**<br>`shiv-bhakti-ka-saral-arth` | शिव | Shiv Stotra Sangrah (Gita Press), Brass Dhoop Dani | Moderate-High | **Yes** | Pairs daily household worship with authentic stotram collections and natural incense/puja tools. |
| 14 | **कर्म योग क्या है? श्रीमद्भगवद्गीता की दृष्टि से सरल समझ**<br>`karma-yoga-kya-hai` | भगवद्गीता | Bhagavad Gita with Commentary, Swami Vivekananda Karma Yoga | High | **Yes** | Perfect philosophical companion for seekers and professionals seeking karma yoga literature. |
| 15 | **एकादशी क्या है? व्रत की परंपरा और आध्यात्मिक दृष्टिकोण**<br>`ekadashi-kya-hai` | त्योहार एवं व्रत | Ekadashi Vrat Katha Sangrah, Tulsi Japa Mala | Moderate-High | **Yes** | Directly addresses religious fasting seekers seeking reference material for calendar dates and rituals. |
| 16 | **वृंदावन की यात्रा की योजना कैसे बनाएं?**<br>`vrindavan-yatra-planning-guide` | वृंदावन एवं धाम | Mathura-Vrindavan Pilgrimage Guidebook, Spiritual Notebook | High | **Yes** | High commercial utility: travel planning readers value detailed temple maps and packing essentials. |
| 17 | **सुबह की 10 मिनट की सरल भक्ति दिनचर्या**<br>`subah-ki-10-minute-bhakti-dincharya` | भक्ति विचार | Pure Brass/Copper Diya, Goumukhi Japa Bag, Sandalwood Paste | High | **Yes** | High practical utility: directly connects the 10-minute morning routine to pure, authentic puja accessories. |
| 18 | **राधा-कृष्ण भक्ति में प्रेम और समर्पण का भाव**<br>`radha-krishna-prem-samarpan` | राधा कृष्ण | Gita Govinda, Radha Ras Sudha Nidhi, Premanand Ji Maharaj discourses | High | **Yes** | For advanced seekers wishing to read classical Vaishnava poetry and Rasik saint discourses. |

---

## 6. Product Placement Strategy

BhaktiMania must avoid aggressive commercial banners, interstitial popups, or jarring mid-sentence links that disrupt meditative contemplation.

```
┌─────────────────────────────────────────────────────────────┐
│                       ARTICLE PAGE LAYOUT                   │
├─────────────────────────────────────────────────────────────┤
│ 1. Header (Logo, Tagline, Editorial Nav)                    │
│ 2. Breadcrumbs & Metadata (Category Badge, Read Time)       │
│ 3. Article Title (H1) & Sacred Folio Intro                  │
│ 4. Featured Image & Ornamental Divider                      │
│ 5. Editorial Sections 1 & 2                                 │
│    ── [InArticleAd: Placement B] ──                         │
│ 6. Editorial Sections 3, 4, 5...                            │
│    ── [InArticleAd: Placement C] ──                         │
│                                                             │
│ 7. RECOMMENDED DEVOTIONAL RESOURCES (NEW AFFILIATE SECTION) │
│    ┌──────────────────────────────────────────────────┐     │
│    │ Section Heading: "आध्यात्मिक अध्ययन हेतु सुझाव" │     │
│    │ Subtitle: Curated authentic editions for seekers │     │
│    │ ┌──────────────────────┐ ┌─────────────────────┐ │     │
│    │ │ Product Card 1       │ │ Product Card 2      │ │     │
│    │ │ (Image, Title, Note, │ │ (Image, Title, Note,│ │     │
│    │ │  Amazon CTA button)  │ │  Amazon CTA button) │ │     │
│    │ └──────────────────────┘ └─────────────────────┘ │     │
│    └──────────────────────────────────────────────────┘     │
│                                                             │
│ 8. Enhanced Affiliate Disclosure Box (Mandatory Statement)   │
│ 9. Ornamental Divider                                       │
│ 10. Related Articles Grid                                   │
│ 11. Redesigned Deep Saffron Footer                          │
└─────────────────────────────────────────────────────────────┘
```

### Placement Guidelines
1. **Never Inside Text Paragraphs:** Do not inject affiliate links into the middle of devotional sentences or shlokas. This degrades editorial authority and triggers reader distrust.
2. **Dedicated End-of-Article Section:** The primary home for recommendations is a dedicated section titled **"आध्यात्मिक अध्ययन एवं साधना हेतु सुझाव"** (Curated Study & Sadhana Recommendations).
3. **Quantity Ceiling:** Exactly **1 to 3 products per article**. Never show overwhelming product carousels or infinite grids.
4. **Homepage & Category Pages:** The Homepage and Category landing pages will remain **100% affiliate-free**. This preserves a pristine brand impression and ensures AdSense reviewers see an authentic, content-first destination.

---

## 7. Affiliate Technical Architecture

### Architectural Decision: Storage Model Evaluation

We evaluated three potential architectural models for storing and serving affiliate recommendations:

| Criterion | Option A: In-Article JSONB (`sections`) | Option B: Relational Master Tables in Supabase (Recommended) | Option C: Hardcoded TypeScript Configs |
|:---|:---:|:---:|:---:|
| **Central URL Updates** | ❌ Hard: Must update JSONB in dozens of records if a link changes | ✅ Instant: Update URL in `affiliate_products` once; reflects everywhere | ❌ Requires code re-compile & deploy |
| **Out-of-Stock Handling** | ❌ Manual search & replace across articles | ✅ Single toggle: `is_active = false` hides product across site | ❌ Manual code edit |
| **Reusability Across Clusters** | ❌ Duplication: Same book stored in 4 different articles | ✅ Full reuse: Multiple articles link to single product master record | ⚠️ Duplication in code |
| **Admin CMS Friendly** | ⚠️ Messy: Requires complex nested JSON form handling | ✅ Clean: Simple dropdown / multi-select selector in Admin UI | ❌ No Admin UI possible |
| **Performance / Caching** | ✅ Fast (embedded in article) | ✅ Fast (single indexed join or parallel cached fetch in Server Component) | ✅ Fast |

### Selected Architecture: Option B (Normalized Supabase Master & Join Tables)

A normalized relational design provides the ideal balance of centralized governance, zero link redundancy, and Admin CMS manageability.

#### Proposed PostgreSQL Schema (For Future Phase 3B)

```sql
-- Master table for all curated devotional products
CREATE TABLE IF NOT EXISTS public.affiliate_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,                                  -- e.g., 'श्रीमद्भगवद्गीता (साधक-संजीवनी)'
    brand_or_publisher TEXT NOT NULL,                     -- e.g., 'गीताप्रेस गोरखपुर'
    category TEXT NOT NULL,                               -- e.g., 'books', 'japa_mala', 'puja_essentials'
    description TEXT,                                     -- General product summary
    image_url TEXT NOT NULL,                              -- Direct Amazon CDN or approved asset URL
    product_url TEXT NOT NULL,                            -- Canonical product page on Amazon.in
    affiliate_url TEXT NOT NULL,                          -- Formatted Amazon affiliate link with tracking tag
    merchant TEXT DEFAULT 'amazon_in' NOT NULL,           -- 'amazon_in' (extensible for future partners)
    is_active BOOLEAN DEFAULT true NOT NULL,              -- Master active toggle (hides if out of stock)
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Relational join table mapping products to specific articles with per-article editorial notes
CREATE TABLE IF NOT EXISTS public.article_affiliate_products (
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.affiliate_products(id) ON DELETE CASCADE,
    editorial_note TEXT,                                  -- Contextual note: "इस लेख में वर्णित श्लोकों के गूढ़ अध्ययन के लिए"
    sort_order INT DEFAULT 0 NOT NULL,                   -- Display order (1, 2, 3)
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (article_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_affiliate_products_active ON public.affiliate_products (is_active);
CREATE INDEX IF NOT EXISTS idx_article_affiliate_order ON public.article_affiliate_products (article_id, sort_order);
```

### Proposed Conceptual Component Hierarchy
* `components/affiliate/AffiliateDisclosure.tsx` (Enhanced statutory disclosure)
* `components/affiliate/AffiliateProductCard.tsx` (Devotional card with image, title, publisher, note, CTA button)
* `components/affiliate/AffiliateProductGrid.tsx` (Responsive 1–3 item grid)
* `components/affiliate/RecommendedProducts.tsx` (Full section wrapper with sacred heading and styling)

---

## 8. Admin CMS Management Requirements

In future Phase 3C, the Admin CMS will empower editors to manage products without touching code.

### Desired Editorial Workflow
```
Admin Dashboard
  │
  ├── 1. Products Master Catalog (/admin/affiliate-products)
  │     ├── View all products (Status, Merchant, Click counts, Associated articles)
  │     ├── Add New Product:
  │     │     ├── Title (e.g. श्रीमद्भगवद्गीता साधक-संजीवनी)
  │     │     ├── Publisher / Brand (गीताप्रेस गोरखपुर)
  │     │     ├── Category (Books, Mala, Puja)
  │     │     ├── Direct Image URL
  │     │     ├── Affiliate Tracking Link (e.g. https://www.amazon.in/dp/...?tag=bhaktimania-21)
  │     │     └── Active Status Toggle
  │     └── Edit / Update Affiliate URL centrally (updates all live articles instantly)
  │
  └── 2. Article Editor Integration (/admin/articles/[id]/edit)
        ├── Tab / Card: "सुझाए गए उत्पाद (Affiliate Products)"
        ├── Multi-select from existing Master Products
        ├── Custom contextual editorial note per article
        ├── Drag / number sort order (1, 2, 3)
        └── Real-time preview inside ArticlePreviewModal
```

---

## 9. Link Management & Amazon Compliance

### 1. No Cloaking Policy
Amazon Associates Operating Agreement Section 6 explicitly states:
> *"You will not cloak, hide, spoof, or otherwise obscure the URL of your site containing Special Links or the user agent of the application in which Content is displayed."*

* **Architecture Rule:** BhaktiMania will **never** use intermediate redirect paths like `/redirect/amazon/123` or generic redirect plugins that mask the destination URL.
* Links will point directly to approved Amazon URLs with the verified tracking tag (`tag=bhaktimania-21`) or official Amazon shortlinks (`amzn.to`).
* Anchor text and UI buttons will explicitly read *"Amazon पर देखें"* (View on Amazon) so the user has full clarity before leaving BhaktiMania.

### 2. Centralized Link Governance
Because affiliate URLs are stored solely in the `affiliate_products` Supabase table, if a tracking tag or ASIN changes:
* One single row is updated in the database.
* No raw markdown or article paragraphs need to be parsed or rewritten.

---

## 10. Amazon Product Data & Pricing Governance

### 1. Zero Price Scraping
* Scraping Amazon website HTML using headless browsers or HTTP scrapers is a direct violation of Amazon's Conditions of Use and can lead to IP blacklisting and immediate Associates account ban.
* BhaktiMania will **never** scrape Amazon pages.

### 2. The Static Price Prohibition
* Under Amazon policy, prices may not be written into static code or stored in the database without dynamic timestamps, because Amazon prices fluctuate dynamically.
* **BhaktiMania Policy:** We will **never display fixed rupee figures** (e.g. `₹299`) on product cards.
* Instead, the card will display:
  * Book / Product Name
  * Author / Publisher (e.g. गीताप्रेस)
  * Format (e.g. हार्डबाउंड / पेपरबैक)
  * Button CTA: *"Amazon पर वर्तमान मूल्य देखें"* (Check current price on Amazon)

### 3. Image Assets
* Utilize approved Amazon SiteStripe CDN URLs or verified publisher press-kit cover images.
* Do not store cropped, distorted, or watermarked Amazon imagery in Supabase storage.

---

## 11. SEO & Search Engine Compatibility

Affiliate monetization must never penalize BhaktiMania’s hard-won organic rankings or crawl efficiency.

### 1. Mandatory Link Attributes (`rel` tags)
Google Search Central documentation on paid and affiliate links strictly requires:
> *"Links with commercial intent or qualifying purchases should use `rel=\"sponsored\"` or `rel=\"nofollow\"`."*

All outbound affiliate links on BhaktiMania must include:
```html
<a 
  href="https://www.amazon.in/dp/...?tag=bhaktimania-21" 
  target="_blank" 
  rel="nofollow sponsored noopener noreferrer"
>
```
* `sponsored`: Signals paid/commercial relationship to Googlebot (Google recommendation).
* `nofollow`: Prevents PageRank dilution and crawler loops.
* `noopener noreferrer`: Prevents security vulnerabilities (`window.opener` exploitation) and protects referrer confidentiality.

### 2. Schema.org / Structured Data Governance
* **Rule:** Do **NOT** add Schema.org `Product` or `AggregateOffer` structured data to article pages.
* **Reason:** Google Search Console enforces strict requirements for `Product` rich snippets: `offers`, `price`, `priceCurrency`, and real-time `availability`. Because BhaktiMania does not sell products directly or maintain dynamic price feeds, incomplete `Product` schema generates critical GSC structured data errors.
* **Preserve:** Keep the existing, clean Schema.org `Article` / `BlogPosting` JSON-LD untouched.

### 3. Crawl Budget & Indexing
* Because all affiliate links have `rel="nofollow"`, Googlebot will not waste site crawl budget traversing external commercial catalogs.
* Editorial content remains 100% crawlable and indexable.

---

## 12. Google AdSense Compatibility

BhaktiMania is fully prepped for Google AdSense (`ca-pub-3380573668907472`).

### AdSense Policy Guidelines for Affiliate Content
Google AdSense explicitly allows affiliate links on publishers' websites provided that:
1. The site provides substantial, high-quality, original content.
2. The site is not an "affiliate doorway" (a site created solely to aggregate affiliate links with thin or scraped text).
3. Ads and affiliate products are clearly distinct from each other.

### BhaktiMania Coexistence Rules
1. **Clear Visual Separation:** AdSense slots use the `<InArticleAd />` container (labeled "विज्ञापन"). Affiliate product cards use the Sacred Folio border (`border-[#C89A3C]/35`) and distinct devotional card styling.
2. **Buffer Distance:** Never position an AdSense display slot directly touching an affiliate product card. Maintain at least 300px of editorial text or a structural `<Divider />` between them to prevent accidental click misattributions.
3. **Hierarchy of Priorities:** Editorial Content (75%) > AdSense (15%) > Curated Affiliate (10%).

---

## 13. Social Media Affiliate Protocol (YouTube & Facebook)

BhaktiMania maintains active community channels:
* **YouTube:** `https://www.youtube.com/@BhaktiMania1630/shorts`
* **Facebook:** `https://www.facebook.com/share/16FqSftNCDM/?mibextid=wwXIfr`

If affiliate recommendations are featured in video descriptions or community posts in future phases, the following rules apply:

### Channel Compliance Protocol
| Platform | Permitted Placement | Mandatory Disclosure Format | Prohibited Practice |
|:---|:---|:---|:---|
| **YouTube Shorts** | Video Description or Pinned Comment | Must include:  <br>`*Amazon Affiliate Link: [amzn.to URL] #Ad #Affiliate` | Do not put unclickable links in video overlay graphics. Must disclose commercial nature upfront. |
| **Facebook** | Public Post Caption | Must include:  <br>`[अनुशंसित पुस्तक लिंक - #Affiliate #Ad]: [URL]` | Do not post affiliate links in private messenger groups or direct DMs. |
| **Amazon Registration** | Channel Profile | Both the YouTube channel URL and Facebook page URL must be registered in the **Amazon Associates Application Profile** under "Websites and Mobile App List". | Never share links on unapproved social accounts. |

---

## 14. Compliance & Legal Matrix

This matrix clearly separates statutory legal obligations from voluntary editorial guidelines.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPLIANCE BOUNDARY LEVELS                      │
├────────────────────────────────────────────────────────────────────────┤
│ Level 1: Amazon Operating Agreement (Legally Binding Contract)         │
│   • Exact statutory statement: "As an Amazon Associate I earn..."     │
│   • Zero cloaking / masking of URLs                                   │
│   • Zero un-timestamped static pricing                                │
│   • 3 qualifying sales in 180 days                                    │
├────────────────────────────────────────────────────────────────────────┤
│ Level 2: ASCI Digital Advertising Code (Indian Consumer Law / CCPA)    │
│   • Clear and prominent label: #Affiliate, #Ad, or प्रायोजित          │
│   • Prominent placement before the consumer takes purchase action     │
│   • Transparent non-misleading claims                                 │
├────────────────────────────────────────────────────────────────────────┤
│ Level 3: BhaktiMania Devotional Ethos (Internal Editorial Standard)    │
│   • Max 1–3 authentic products per article                            │
│   • Purely scriptures, authentic commentaries, sadhana items          │
│   • Zero affiliate commerce on Homepage or Category headers           │
│   • Sacred Folio harmonious aesthetics                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 15. Phase 3 Implementation Roadmap

The affiliate rollout is organized into six structured batches to ensure zero regression of existing features.

```
┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│ Phase 3A  │ ──► │ Phase 3B  │ ──► │ Phase 3C  │ ──► │ Phase 3D  │ ──► │ Phase 3E  │ ──► │ Phase 3F  │
│Foundations│     │ Data Arch │     │ Admin CMS │     │Pilot (3)  │     │ Analytics │     │Full (18)  │
└───────────┘     └───────────┘     └───────────┘     └───────────┘     └───────────┘     └───────────┘
```

### Phase 3A — Affiliate Foundation & Enhanced Disclosure
* **Objective:** Update `AffiliateDisclosure.tsx` and `/affiliate-disclosure/page.tsx` with Amazon's mandatory statutory statement. Define agent guidelines.
* **Files Likely Affected:** `components/affiliate/AffiliateDisclosure.tsx`, `app/affiliate-disclosure/page.tsx`.
* **Database Impact:** None.
* **Risk:** Very Low. Purely text/disclosure refinement.
* **Validation:** Full build check; verify statutory English phrase and Hindi explanation render correctly.

### Phase 3B — Product Data Architecture
* **Objective:** Create Supabase migration for `affiliate_products` and `article_affiliate_products`. Build TypeScript types and server-side data fetching functions.
* **Files Likely Affected:** `supabase/migrations/20260323_affiliate_schema.sql`, `lib/data/supabase/types.ts`, `lib/data/supabase/affiliate.ts`.
* **Database Impact:** 2 new tables with RLS policies (`SELECT` for public, full CRUD for `is_admin()`). Zero change to `articles` table.
* **Risk:** Low. Additive database tables only.
* **Validation:** Migration execution, Supabase RLS test scripts.

### Phase 3C — Admin Product Management
* **Objective:** Build `/admin/affiliate-products` catalog management and add the `ArticleAffiliateCard` to `ArticleEditor.tsx`.
* **Files Likely Affected:** `components/admin/ArticleEditor.tsx`, `components/admin/editor/ArticleAffiliateCard.tsx`, `app/admin/actions/affiliate.ts`.
* **Database Impact:** None (uses schema from 3B).
* **Risk:** Medium-Low. Admin form state management.
* **Validation:** Create/edit/toggle products in Admin; preview in `ArticlePreviewModal`.

### Phase 3D — Initial Article Integration (3-Article Pilot)
* **Objective:** Integrate curated products into 3 pilot articles representing high search intent:
  1. `bhagavad-gita-5-sandesh` (Bhagavad Gita Sadhak Sanjeevani)
  2. `hanuman-ji-vishwas-samarpan` (Gita Press Sundarkand)
  3. `sacchi-bhakti-kya-hai` (Tulsi Japa Mala & Goumukhi Bag)
* **Files Likely Affected:** `app/bhakti-gyaan/[slug]/page.tsx`, `components/affiliate/RecommendedProducts.tsx`, `components/affiliate/AffiliateProductCard.tsx`.
* **Database Impact:** Seed rows in `article_affiliate_products`.
* **Risk:** Low. Rendered conditionally only if products exist.
* **Validation:** Mobile, tablet, and desktop visual QA; verify `rel="nofollow sponsored"` on all links.

### Phase 3E — Analytics & Compliance Monitoring
* **Objective:** Instrument non-intrusive outbound click events in Google Analytics 4 (event: `affiliate_click`, parameters: `product_id`, `merchant`, `article_slug`) without collecting PII.
* **Files Likely Affected:** `components/affiliate/AffiliateProductCard.tsx`.
* **Database Impact:** None.
* **Risk:** Very Low.
* **Validation:** Verify GA4 debug events fire accurately on outbound click.

### Phase 3F — Full Rollout & Ongoing Optimization
* **Objective:** Extend curated recommendations across the remaining 15 articles. Establish periodic link health check to catch broken Amazon URLs or out-of-stock items.
* **Files Likely Affected:** Data associations in Supabase.
* **Database Impact:** Association records in `article_affiliate_products`.
* **Risk:** Very Low.
* **Validation:** Complete audit report; verify all 18 articles render seamlessly.

---

## 16. Audit Conclusion & Recommendations

1. **Current Codebase Readiness:** High. BhaktiMania already possesses an established `AffiliateDisclosure.tsx` component, a comprehensive `/affiliate-disclosure` legal page, and modular Next.js 16 architecture.
2. **Zero Code Changes in this Batch:** In strict compliance with instructions, no application code, database records, or article contents were altered.
3. **Next Recommended Step:** Review and approve this blueprint, then proceed with **Phase 3A (Affiliate Foundation & Disclosure Enhancement)**.

---

## 17. Phase 3A Implementation Record

**Date:** 22 September 2026  
**Status:** Completed & Validated

### Summary of Changes Implemented

1. **`components/affiliate/AffiliateDisclosure.tsx`:**
   * Preserved the original verified Hindi disclosure text:  
     *“इस पेज पर कुछ लिंक affiliate links हो सकते हैं। यदि आप इनके माध्यम से खरीदारी करते हैं, तो BhaktiMania को बिना आपके अतिरिक्त खर्च के कमीशन मिल सकता है।”*
   * Added the mandatory Amazon Associates statutory statement in both `card` and `inline` variants:  
     *“As an Amazon Associate I earn from qualifying purchases.”*
   * Aligned border and accents with the Sacred Folio design palette (`border-[rgba(200,154,60,0.28)]`, `#C85A17`, `#F8F4EC`).
   * Maintained responsive layout and accessible hierarchy.

2. **`app/affiliate-disclosure/page.tsx`:**
   * Updated the dedicated legal transparency page.
   * Added Section 3 dedicated to the **Amazon Associates India Program** with the exact statutory clause:  
     *“As an Amazon Associate I earn from qualifying purchases.”*
   * Enhanced Section 4 with rigorous editorial independence guidelines (authentic literature only, zero bias for commissions, explicit disclosures).
   * Aligned styling to Sacred Folio tokens (`#FBF8F0`, `#C85A17`, `#C89A3C`).

3. **`components/affiliate/AffiliateLabel.tsx` (Card-Level Primitive):**
   * Created a minimal, reusable pill component for future product cards and affiliate links.
   * Supports `lang="bilingual"`, `lang="hi"`, and `lang="en"`.
   * Styled in Sacred Folio gold/terracotta badge styling (`bg-[rgba(200,154,60,0.12)] text-[#A8440B] border-[rgba(200,154,60,0.3)]`).

### Validation Results
* **`npm run lint`:** Exited with code `0` (clean, zero lint warnings or errors).
* **`npm run build`:** Exited with code `0` (all 49 routes successfully compiled and statically generated).
* **Local Verification:**
  * `http://localhost:3000/affiliate-disclosure`: Renders Amazon statutory declaration and complete Hindi explanation.
  * `http://localhost:3000/bhakti-gyaan/bhagavad-gita-5-sandesh`: Renders `<AffiliateDisclosure />` with both Hindi transparency and Amazon declaration.
* **Scope Guard:** Zero product cards, zero database changes, zero affiliate links, zero tracking scripts, and zero commits/pushes.

---

## 18. Phase 3B Implementation Record

**Date:** 22 September 2026  
**Status:** Completed & Validated

### Summary of Changes Implemented

1. **Database Migration (`supabase/migrations/20260323000000_phase_3b_affiliate_schema.sql`):**
   * **`affiliate_products` Table:** Master catalog storing `id`, `name`, `merchant` (default `'amazon_in'`), `affiliate_url`, `image_url`, `short_description`, `category`, `is_active`, `display_order`, `created_at`, `updated_at`. Attached automatic trigger `trg_affiliate_products_updated_at` calling `public.set_updated_at()`.
   * **`article_affiliate_products` Table:** Relational junction table mapping articles to curated products with `id`, `article_id` (FK `articles.id` ON DELETE CASCADE), `product_id` (FK `affiliate_products.id` ON DELETE CASCADE), `sort_order`, `contextual_note`, and unique constraint `uq_article_affiliate_product` to prevent duplicate assignments.
   * **Indexes:** Performance indexes created on `(is_active, display_order)`, `(category, is_active)`, `(article_id, sort_order)`, and `(product_id)`.
   * **Row Level Security (RLS):**
     - Public users (`anon` and `authenticated`) can ONLY read active affiliate products linked to published articles whose publication date has passed.
     - Authenticated administrators (`public.is_admin() = true`) have full CRUD access (`ALL`).
   * **API Grants:** `SELECT` granted to `anon` and `authenticated`; `INSERT`, `UPDATE`, `DELETE` granted to `authenticated` (strictly guarded by `is_admin()` RLS).

2. **TypeScript Domain & Database Types (`lib/data/supabase/types.ts`):**
   * Added `DatabaseAffiliateProduct` representing the raw relational table record.
   * Added `DatabaseArticleAffiliateProduct` representing the relationship record.
   * Added `DatabaseArticleAffiliateWithProduct` for joined query results.
   * Added `AffiliateProductItem` as the clean frontend domain model with `contextualNote` and `sortOrder`.

3. **Server-Side Data Access Layer (`lib/data/supabase/affiliate.ts`):**
   * Implemented `isValidAffiliateUrl(url)`: Enforces secure, direct HTTPS/HTTP URLs and blocks URL cloaking or internal redirects.
   * Implemented `mapDatabaseAffiliateProduct()`: Converts raw database rows into typed domain objects.
   * Implemented `getAffiliateProductsForArticle(articleId)`: Fetches active products mapped to an article ordered by `sort_order`.
   * Implemented `getAffiliateProductsForArticleSlug(slug)`: Resolves article by slug and returns its curated active products.
   * Implemented `getAllActiveAffiliateProducts()`: Fetches all active products from the master catalog for admin selectors.
   * Exported through `lib/data/supabase/index.ts`.

### Validation Results
* **`npm run lint`:** Exited with code `0` (clean, zero lint warnings or errors).
* **`npm run build`:** Exited with code `0` (TypeScript passed in 14.3s, all 49 routes statically generated).
* **Scope Guard:** Zero product cards rendered, zero UI redesign, zero Amazon links added, zero admin UI modified, and zero commits/pushes.

---

## 19. Phase 3C — Admin Product Management

**Date:** 22 September 2026  
**Status:** Completed & Validated

### 1. Admin Route
* **Dedicated Route:** `/admin/affiliate-products` (within `(dashboard)` route group).
* **Navigation Integration:** Added to `app/admin/(dashboard)/layout.tsx` top navbar alongside Dashboard, Articles, Categories, and Authors.
* **Access Control:** Server-side auth guard via `getCurrentAdmin()`. Unauthenticated requests immediately receive `307 Temporary Redirect` to `/admin/login?redirect=%2Fadmin%2Faffiliate-products`.

### 2. Components Created
* **`app/admin/(dashboard)/affiliate-products/page.tsx`:** Server component page that loads products using `getAdminAffiliateProducts()`.
* **`components/admin/affiliate/AffiliateProductListClient.tsx`:** Interactive admin management list featuring:
  * Category filter chips (`All`, `Books`, `Japa Malas`, `Puja Essentials`, `Artwork`, `Travel Guides`).
  * Live search by product name and merchant.
  * Status filter (`All`, `Active Only`, `Inactive Only`).
  * Responsive view (full table on desktop; card layout for 360px–768px mobile screens).
  * Direct active/inactive toggle switch without full page reloads.
  * Meaningful devotional empty state in Hindi: *“अभी कोई affiliate product जोड़ा नहीं गया है।”*
* **`components/admin/affiliate/AffiliateProductModal.tsx`:** Accessible modal dialog for creating and editing products. Uses an inner `<AffiliateProductForm key={...} />` pattern with automatic clean state initialization without cascading renders.
* **`components/admin/affiliate/AffiliateProductDeleteModal.tsx`:** Explicit confirmation dialog explaining that deletion cascades to remove article-product relationships.
* **`components/admin/editor/ArticleAffiliateCard.tsx`:** Integrated article editor card allowing editors to search catalog products, attach them to articles, write Hindi contextual editorial notes, define display sequence, and remove attachments.
* **`lib/utils/affiliate-validation.ts`:** Dedicated shared validation utility for direct affiliate and image URLs, consumable safely by both Client Components and Server Actions.

### 3. Server Actions Created (`app/admin/actions/affiliate.ts`)
* **`createAffiliateProductAction`:** Creates a new product in the master catalog.
* **`updateAffiliateProductAction`:** Updates existing product attributes.
* **`toggleAffiliateProductActiveAction`:** Toggles product active/inactive state while preserving all article mappings.
* **`deleteAffiliateProductAction`:** Deletes a master product using PostgreSQL foreign key cascade.
* **`attachProductToArticleAction`:** Maps a product to an article; enforces the strict 3-product maximum limit.
* **`updateArticleAffiliateRelationAction`:** Updates contextual notes and display order.
* **`removeProductFromArticleAction`:** Unlinks a product from an article.
* **`getArticleAttachedProductsAction`:** Retrieves attached products for an article in the editor.

### 4. Validation Rules
* **Required Fields:** Product name (non-empty string), Merchant name (defaults to `'amazon_in'`), Affiliate URL.
* **URL Safety & Compliance:**
  * Must be a valid absolute URL with `http://` or `https://`.
  * Rejects `javascript:` and `data:` schemes.
  * Rejects internal redirect cloaking patterns (`/go/...`).
  * Preserves direct outbound partner links without URL manipulation.
* **Image URL:** Optional; if provided, must use valid `http://` or `https://` protocol.

### 5. Authorization & RLS Behavior
* Every server action independently verifies `getCurrentAdmin()`:
  * Verifies active Supabase session.
  * Queries `public.is_admin()` database function.
  * Rejects non-admin or unauthenticated requests with `{ success: false, error: "You must be an administrator to perform this action." }`.
* Never exposes service-role keys to the browser or client bundle.

### 6. Article Editor Integration & Max Attachment Rule
* Integrated cleanly into `components/admin/ArticleEditor.tsx` as Section D (between SEO Settings and Publishing/Status).
* **Maximum Rule:** Enforced at both the UI layer and server action layer: maximum **3 products per article**.
* **Contextual Note:** Optional, human-written editorial annotation in Hindi explaining the devotional relevance to the reader.

### 7. Testing & Quality Gate Results
* **Linting (`npm run lint`):** Exited with code `0` (clean, zero errors, zero warnings).
* **Build (`npm run build`):** Exited with code `0` (all 50 static and dynamic routes compiled successfully).
* **URL Validation Unit Tests:** 15/15 tests passed (`scripts/test-phase-3c-validation.ts`).
* **Server Action Security Authorization Tests:** 8/8 actions verified to strictly reject unauthorized calls (`scripts/test-phase-3c-security.ts`).
* **Route Protection:** Unauthenticated HTTP request to `/admin/affiliate-products` returned `307 Temporary Redirect` to `/admin/login`.

### 8. Final Database State
* `affiliate_products`: **0 records**
* `article_affiliate_products`: **0 records**
* All test scripts and scratch artifacts deleted; database remains completely clean.



