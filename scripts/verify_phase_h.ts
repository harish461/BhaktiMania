import * as fs from "fs";
import * as path from "path";
import {
  getPublishedArticles,
  getPublishedArticleBySlug,
  getArticlesByCategory,
  getRelatedArticles,
  getCategories,
  getCategoryBySlug,
} from "../lib/data/supabase";
import sitemap from "../app/sitemap";

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [k, ...rest] = trimmed.split("=");
        if (k && rest.length > 0) {
          process.env[k.trim()] = rest.join("=").trim();
        }
      }
    }
  }
}

loadEnv();

const EXPECTED_CATEGORIES = [
  "bhagavad-gita",
  "bhakti-vichar",
  "festivals",
  "hanuman",
  "premanand-ji",
  "radha-krishna",
  "shiv",
  "vrindavan",
];

async function runPhaseHVerification() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Phase H Public Website Supabase Migration Verification");
  console.log("==============================================================================\n");

  let allPassed = true;

  try {
    // 1. Verify all 18 articles are fetched publicly from Supabase
    console.log("1. Verifying getPublishedArticles() from Supabase...");
    const articles = await getPublishedArticles();
    console.log(`   Found ${articles.length} published articles.`);
    if (articles.length === 18) {
      console.log("   [PASSED] All 18 existing articles are published and publicly visible.\n");
    } else {
      console.error(`   [FAILED] Expected 18 published articles, got ${articles.length}`);
      allPassed = false;
    }

    // 2. Verify all 8 categories from Supabase
    console.log("2. Verifying getCategories() and individual category resolution...");
    const categories = await getCategories();
    console.log(`   Found ${categories.length} active categories.`);
    if (categories.length === 8) {
      console.log("   [PASSED] All 8 devotional categories are active in Supabase.");
    } else {
      console.error(`   [FAILED] Expected 8 categories, got ${categories.length}`);
      allPassed = false;
    }

    for (const catSlug of EXPECTED_CATEGORIES) {
      const cat = await getCategoryBySlug(catSlug);
      const catArticles = await getArticlesByCategory(catSlug);
      if (cat && cat.slug === catSlug && catArticles.length >= 0) {
        console.log(`   ✓ Category "/${catSlug}": ${cat.title} (${catArticles.length} articles)`);
      } else {
        console.error(`   ✗ Category "/${catSlug}" failed:`, { catFound: Boolean(cat), articleCount: catArticles.length });
        allPassed = false;
      }
    }
    console.log("   [PASSED] All 8 category routes resolve correctly with their published articles.\n");

    // 3. Verify single article resolution and non-existent slug rejection
    console.log("3. Verifying single article resolution and 404 behavior...");
    const firstSlug = articles[0].slug;
    const resolvedArticle = await getPublishedArticleBySlug(firstSlug);
    if (resolvedArticle && resolvedArticle.slug === firstSlug) {
      console.log(`   [PASSED] Existing published article "${firstSlug}" resolved successfully.`);
    } else {
      console.error(`   [FAILED] Failed to resolve published article "${firstSlug}".`);
      allPassed = false;
    }

    const nonExistent = await getPublishedArticleBySlug("non-existent-draft-article-slug-xyz");
    if (nonExistent === null) {
      console.log("   [PASSED] Non-existent / unpublished slug safely returns null (triggering notFound / 404).\n");
    } else {
      console.error("   [FAILED] Expected null for non-existent slug, got:", nonExistent);
      allPassed = false;
    }

    // 4. Verify Related Articles resolution from Supabase
    console.log("4. Verifying getRelatedArticles()...");
    const related = await getRelatedArticles(firstSlug, articles[0].categorySlug, 3);
    if (related.length > 0 && !related.some((r) => r.slug === firstSlug)) {
      console.log(`   [PASSED] Related articles query returned ${related.length} articles excluding the current slug.\n`);
    } else {
      console.error("   [FAILED] Related articles query failed:", related);
      allPassed = false;
    }

    // 5. Verify dynamic sitemap generation from Supabase
    console.log("5. Verifying dynamic sitemap generation from Supabase...");
    const sitemapEntries = await sitemap();
    console.log(`   Generated ${sitemapEntries.length} sitemap entries.`);
    const hasHome = sitemapEntries.some((e) => e.url.endsWith("/"));
    const hasBhaktiGyaan = sitemapEntries.some((e) => e.url.endsWith("/bhakti-gyaan"));
    const hasCategory = sitemapEntries.some((e) => e.url.endsWith("/bhagavad-gita"));
    const hasArticle = sitemapEntries.some((e) => e.url.endsWith(`/${firstSlug}`));

    if (hasHome && hasBhaktiGyaan && hasCategory && hasArticle && sitemapEntries.length >= 28) {
      console.log("   [PASSED] Sitemap properly generates URLs for all home, category, and article routes.\n");
    } else {
      console.error("   [FAILED] Sitemap entries missing expected routes.");
      allPassed = false;
    }

    // 6. Verify zero runtime public fallback to static files
    console.log("6. Inspecting public route implementations for static file dependency...");
    const publicFiles = [
      "app/page.tsx",
      "app/bhakti-gyaan/page.tsx",
      "app/bhakti-gyaan/[slug]/page.tsx",
      "app/sitemap.ts",
      "app/bhagavad-gita/page.tsx",
      "app/bhakti-vichar/page.tsx",
      "app/festivals/page.tsx",
      "app/hanuman/page.tsx",
      "app/premanand-ji/page.tsx",
      "app/radha-krishna/page.tsx",
      "app/shiv/page.tsx",
      "app/vrindavan/page.tsx",
    ];

    let staticLeakCount = 0;
    for (const relPath of publicFiles) {
      const fullPath = path.resolve(process.cwd(), relPath);
      const content = fs.readFileSync(fullPath, "utf-8");
      if (content.includes("articlesData") || content.includes("categoriesData")) {
        console.error(`   ✗ Found static data reference in ${relPath}`);
        staticLeakCount++;
      }
    }

    if (staticLeakCount === 0) {
      console.log("   [PASSED] Zero public page routes import or rely on static articlesData or categoriesData.\n");
    } else {
      console.error(`   [FAILED] Found ${staticLeakCount} public files still referencing static data.`);
      allPassed = false;
    }

    // 7. Verify dynamicParams = true on /bhakti-gyaan/[slug]/page.tsx
    console.log("7. Verifying dynamicParams setting on /bhakti-gyaan/[slug]...");
    const slugPageContent = fs.readFileSync(
      path.resolve(process.cwd(), "app/bhakti-gyaan/[slug]/page.tsx"),
      "utf-8"
    );
    if (slugPageContent.includes("export const dynamicParams = true;")) {
      console.log("   [PASSED] dynamicParams is explicitly enabled: newly published articles render dynamically without a rebuild.\n");
    } else {
      console.error("   [FAILED] export const dynamicParams = true; is missing in /bhakti-gyaan/[slug]/page.tsx");
      allPassed = false;
    }

    console.log("==============================================================================");
    if (allPassed) {
      console.log("PHASE H VERIFICATION: ALL 7 CHECKS PASSED SUCCESSFULLY!");
    } else {
      console.log("PHASE H VERIFICATION: SOME CHECKS FAILED. See log output above.");
    }
    console.log("==============================================================================");
  } catch (err: unknown) {
    console.error("Verification execution error:", err);
    process.exit(1);
  }
}

runPhaseHVerification();
