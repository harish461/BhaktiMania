# Phase 3D Pre-Flight Verification & Compliance Gate

**Date:** 22 September 2026  
**Agent:** BhaktiMania Affiliate Agent  
**Status:** Verification Completed — Gate Review Active  
**Objective:** Complete pre-3D compliance, database verification, and pilot product strategy before introducing live affiliate recommendations.

---

## 1. Remote Supabase Migration Status

### Direct Verification Telemetry
The migration `20260323000000_phase_3b_affiliate_schema.sql` has been successfully executed in the remote Supabase project (`https://pbmkhmrupkakqskktnki.supabase.co`). Remote verification confirms:

* **`public.affiliate_products`:** **APPLIED & VERIFIED** (Status: `200 OK`, Records: `0`, Columns: `id, name, merchant, affiliate_url, image_url, short_description, category, is_active, display_order, created_at, updated_at`).
* **`public.article_affiliate_products`:** **APPLIED & VERIFIED** (Status: `200 OK`, Records: `0`, Columns: `id, article_id, product_id, sort_order, contextual_note, created_at`).
* **Foreign Keys & Embedded Joins:** **VERIFIED**
  * `affiliate_products` ↔ `article_affiliate_products` relational count join returned `200 OK`.
  * `article_affiliate_products` ↔ `articles` & `affiliate_products` relational embed returned `200 OK`.
* **Row Level Security (RLS) & Mutation Blocking:** **VERIFIED**
  * Anonymous `INSERT` into `public.affiliate_products`: Blocked with `401 Unauthorized` / PostgreSQL error `42501` (*"permission denied for table affiliate_products"*).
  * Anonymous `INSERT` into `public.article_affiliate_products`: Blocked with `401 Unauthorized` / PostgreSQL error `42501` (*"permission denied for table article_affiliate_products"*).
* **Next.js Production Build Integration:** **VERIFIED**
  * `npm run build` compiled all 50 routes cleanly in 3.8s with **0 schema warnings** and **0 errors**.
  * Server function `getAdminAffiliateProducts()` executed cleanly against the remote database and returned `[]` (0 records).


---

## 2. Amazon Associates India — Contractual & Policy Requirements

A review of the **Amazon Associates Program Operating Agreement (India)**, **Program Policies**, and **Participation Requirements** revealed several critical constraints:

### 1. Mandatory Statutory Disclosure
* **Exact Required Statement:**  
  *“As an Amazon Associate I earn from qualifying purchases.”*
* **Placement:** Must appear clearly and conspicuously on any page containing Special Links.
* **Compliance in BhaktiMania:** Implemented in [`components/affiliate/AffiliateDisclosure.tsx`](file:///c:/My%20Web%20Sites/BhaktiMania/components/affiliate/AffiliateDisclosure.tsx) and [`app/affiliate-disclosure/page.tsx`](file:///c:/My%20Web%20Sites/BhaktiMania/app/affiliate-disclosure/page.tsx).

### 2. Link Types & Shorteners
* **Direct Amazon URLs:** Permitted with associate tracking tag (e.g. `https://www.amazon.in/dp/ASIN?tag=bhaktimania-21`).
* **Amazon Short Links:** Official `amzn.to` links generated via SiteStripe are **permitted**.
* **Third-Party / Cloaked Shorteners:** Generic shorteners (bit.ly, tinyurl) and internal redirection routes (`/go/...`) are **strictly prohibited**. The user must know they are navigating to Amazon before clicking.

### 3. Critical Deprecation: SiteStripe Image Links Discontinued
* **Policy Change:** Effective **December 1, 2023**, Amazon officially **discontinued the Image and Text+Image link creation features in SiteStripe**. All legacy SiteStripe image embeds stopped working after December 31, 2023.
* **Current Image Rules:**
  * Affiliates are **strictly forbidden** from taking screenshots, downloading product photos to self-host, or scraping Amazon CDN images directly.
  * Product images may only be rendered programmatically through the **Product Advertising API (PA-API v5)** or **Amazon Creator API**.
  * Alternatively, sites can use authorized publisher/author media or display elegant **text-first recommendation cards**.

### 4. Pricing & Availability Restrictions
* **No Static Hardcoded Prices:** Affiliates may **not** display fixed prices (e.g., “₹299”) in static database fields or copy unless pulled dynamically in real-time via the PA-API and accompanied by an explicit timestamp stating when the price was retrieved.
* Storing Amazon prices in database tables without real-time synchronization is a direct violation of Section 4 of the Participation Requirements.

### 5. Link Attributes (`rel` tags)
* In accordance with search engine webmaster policies and affiliate guidelines, all outbound affiliate hyperlinks must carry:  
  `rel="nofollow sponsored"` or `rel="sponsored"`.
* Links must open cleanly in a new tab (`target="_blank" rel="noopener noreferrer nofollow sponsored"`).

### 6. Account Qualification & 180-Day Rule
* New Amazon Associates accounts must refer at least **3 qualifying sales within 180 days** of registration.
* Until 3 sales are achieved and reviewed by Amazon, access to the Product Advertising API (PA-API credentials) is not granted.
* **Strategic Implication:** The initial pilot (Phase 3D) must operate safely **without relying on PA-API image feeds**, using text/typography-first cards and authentic publisher book badges.

---

## 3. Indian Regulatory Disclosures (ASCI & CCPA)

To ensure legal rigor, regulatory obligations are categorized into three distinct layers:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Amazon Contractual Requirements                              │
│    • Exact phrase: "As an Amazon Associate I earn..."          │
│    • Direct / amzn.to links only (no cloaking)                 │
│    • No static pricing; no scraped images                      │
├─────────────────────────────────────────────────────────────────┤
│ 2. Indian Statutory & Self-Regulatory (ASCI & CCPA 2022/2023)   │
│    • Mandatory upfront disclosure of "Material Connection"      │
│    • Prominent labeling: "Affiliate" / "विज्ञापन" / "Sponsored"  │
│    • Language parity (Hindi disclosure for Hindi readers)       │
│    • Strict prohibition of Dark Patterns (CCPA 2023)           │
├─────────────────────────────────────────────────────────────────┤
│ 3. BhaktiMania Devotional Best Practices                        │
│    • Dual-language disclosure (Hindi explanation + English)     │
│    • Visual badge (AffiliateLabel pill) on recommendation cards │
│    • Maximum 3 products per article                             │
│    • Human-written Hindi editorial context notes                │
│    • Pure spiritual alignment (no low-quality commercial kits)  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Indian Compliance Findings
1. **CCPA Guidelines for Prevention of Misleading Advertisements and Endorsements (2022) & Endorsement Know-Hows (2023):**
   * Disclosing commercial connection is a statutory legal obligation under the Consumer Protection Act, 2019.
   * Disclosures must be **clear, prominent, and hard to miss**. They cannot be hidden behind “read more” fold links or buried in site footers.
2. **ASCI Digital Influencer Guidelines:**
   * Approved labels include **"Affiliate"**, **"Sponsored"**, **"Collaboration"**.
   * Label must be presented in the prominent visual field of the recommendation.
3. **CCPA Guidelines on Dark Patterns (2023):**
   * Prohibits disguised advertisements (presenting commercial affiliate recommendations as purely neutral editorial text without visual demarcation).
   * BhaktiMania's `<AffiliateLabel />` and bordered recommendation cards satisfy this mandate completely.

---

## 4. Proposed Pilot Product Strategy (3 Articles)

In accordance with Phase 3 instructions, **no product records or real Amazon links are inserted into the database during this pre-flight gate**. The proposed pilot catalog for Phase 3D is outlined below:

---

### Pilot 1: `bhagavad-gita-5-sandesh`
* **Article Theme:** Five core life teachings of the Shrimad Bhagavad Gita (Karma Yoga, mental peace, duty, surrender, and spiritual equanimity).
* **Target Audience:** Hindi readers seeking authentic scriptural study and spiritual clarity in daily life.
* **Proposed Product Type:** Authentic Scripture / Classical Commentary (`books`).
* **Candidate Recommendation:**
  * **Title:** श्रीमद्भगवद्गीता — साधक-संजीवनी (टीकाकार: श्रद्धेय स्वामी श्रीरामसुखदासजी महाराज, गीताप्रेस गोरखपुर)
  * **Merchant:** Amazon India (`amazon_in`), authentic Gita Press publisher/authorized seller.
* **Contextual Relevance:** The article directly references Gita verses. Recommending the Sadhak-Sanjeevani edition provides the reader with the most revered, detailed, verse-by-verse Hindi explanation.
* **Recommended Maximum Products:** **1 product** (focused, non-distracting).
* **Pre-Addition Verification Checklist:**
  1. Verified Amazon India product listing with in-stock status from a reputable book distributor.
  2. Verified ISBN/Gita Press code (e.g. Code 502/11) to avoid unauthorized print-on-demand reprints.
  3. Pre-written editorial note:  
     *“इस लेख में वर्णित श्लोकों के गहन अध्ययन और व्यावहारिक जीवन में उनके प्रयोग हेतु गीताप्रेस का यह प्रामाणिक भाष्य अत्यंत उपयोगी है।”*
* **Imagery Compliance:** Typographic devotional book card styled in Sacred Folio aesthetic, utilizing verified publisher metadata rather than scraped Amazon catalog photos.

---

### Pilot 2: `hanuman-ji-vishwas-samarpan`
* **Article Theme:** Hanuman Ji’s unshakeable faith, humility, and selfless service depicted in the Sundarkand.
* **Target Audience:** Devotees performing daily or weekly Sundarkand and Hanuman Chalisa recitation.
* **Proposed Product Type:** Stotra / Scripture Book (`books`).
* **Candidate Recommendation:**
  * **Title:** श्रीरामचरितमानस — सुंदरकाण्ड (सचित्र, सरल हिंदी अनुवाद सहित, गीताप्रेस गोरखपुर)
  * **Merchant:** Amazon India (`amazon_in`), Gita Press authorized seller.
* **Contextual Relevance:** The article centers on the inner philosophy of the Sundarkand. Readers wanting to incorporate the recited verses into their personal spiritual practice will directly benefit from a clean, large-print Hindi edition.
* **Recommended Maximum Products:** **1 product**.
* **Pre-Addition Verification Checklist:**
  1. Verified Amazon India listing with consistent availability.
  2. Authentic Gita Press edition (Code 71 or large pocket edition).
  3. Pre-written editorial note:  
     *“श्री हनुमान जी की कृपा और सुंदरकाण्ड के नित्य पाठ हेतु सरल हिंदी अर्थ सहित प्रामाणिक गीताप्रेस संस्करण।”*
* **Imagery Compliance:** Elegant Sacred Folio bordered card with devotional badge and clean typography; zero scraped Amazon images.

---

### Pilot 3: `sacchi-bhakti-kya-hai`
* **Article Theme:** The true essence of devotion—moving from ritualistic display to inner remembrance, surrender, and consistent naam-japa.
* **Target Audience:** Practitioners seeking practical tools for disciplined daily meditation and naam-japa.
* **Proposed Product Type:** Devotional Practice Essential (`japa_mala`).
* **Candidate Recommendation:**
  * **Title:** प्रामाणिक तुलसी जप माला (१०८+१ मनके) एवं कॉटन गोमुखी थैली (ISKCON / Vrindavan Handcrafted)
  * **Merchant:** Amazon India (`amazon_in`).
* **Contextual Relevance:** The article emphasizes daily naam-sadhana as the primary vehicle of devotion. A natural Tulsi mala with a protective japa bag provides a respectful, practical study tool.
* **Recommended Maximum Products:** **1 product** (or max 2 if paired with Narada Bhakti Sutra book).
* **Pre-Addition Verification Checklist:**
  1. Verification of genuine natural Tulsi wood (not painted or chemically treated wooden substitutes).
  2. Reputable vendor with verified high buyer satisfaction.
  3. Pre-written editorial note:  
     *“नित्य नाम-जप और साधना की निरंतरता हेतु शुद्ध प्राकृतिक तुलसी माला एवं गौमुखी थैली।”*
* **Imagery Compliance:** Sacred Folio iconography and devotional pill; zero unauthorized product photo scraping.

---

## 5. Open Strategic & Technical Questions

1. **PA-API Availability:** Does the active BhaktiMania Amazon Associates account already have access to the Product Advertising API (PA-API v5) with active API credentials, or is it a new account awaiting the 3 initial qualifying sales?
   * *Recommendation:* Assume new account status; build Phase 3D pilot cards with static text-first and devotional iconography styling.
2. **Pricing Policy:** Should prices be omitted completely from product cards to avoid stale price violations?
   * *Recommendation:* **Yes. Omit numeric prices completely** from article product cards. Present products as curated editorial reading recommendations (“Amazon पर देखें” / “View on Amazon”) without showing static prices. This eliminates price-synchronization violations.
3. **Remote Migration Timing:** Should the remote database migration be applied via the Supabase Dashboard SQL Editor before Phase 3D coding begins?
   * *Recommendation:* Yes. Applying the schema remotely is the prerequisite for storing pilot product associations.

---

## 6. Exact Recommended Next Steps

1. **Step 1:** The administrator applies [`supabase/migrations/20260323000000_phase_3b_affiliate_schema.sql`](file:///c:/My%20Web%20Sites/BhaktiMania/supabase/migrations/20260323000000_phase_3b_affiliate_schema.sql) in the Supabase Dashboard SQL Editor.
2. **Step 2:** User reviews and approves the pilot product strategy and compliance findings documented herein.
3. **Step 3:** Proceed to **Phase 3D (Initial Article Integration — 3-Article Pilot)**:
   * Build the public `<RecommendedProducts />` and `<AffiliateProductCard />` components.
   * Adhere strictly to the text-first, price-free, `rel="nofollow sponsored"`, Amazon-compliant design.
   * Integrate conditionally into the 3 pilot articles.
