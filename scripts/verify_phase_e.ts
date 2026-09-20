import {
  getCategories,
  getCategoryBySlug,
  getPublishedArticles,
  getPublishedArticleBySlug,
  getArticlesByCategory,
  getRelatedArticles,
} from "../lib/data/supabase/index";

// Load environment variables from .env.local if not already present
import * as fs from "fs";
import * as path from "path";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...rest] = trimmed.split("=");
        if (key && rest.length > 0) {
          process.env[key.trim()] = rest.join("=").trim();
        }
      }
    }
  }
}

loadEnvLocal();

async function runVerification() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Phase E Data Access Layer Verification");
  console.log("==============================================================================\n");

  let allPassed = true;

  try {
    // 1. Verify getCategories() -> exactly 8 active categories
    console.log("1. Testing getCategories()...");
    const categories = await getCategories();
    console.log(`   Found ${categories.length} categories.`);
    const expectedCatSlugs = [
      "hanuman",
      "radha-krishna",
      "shiv",
      "bhagavad-gita",
      "festivals",
      "vrindavan",
      "bhakti-vichar",
      "premanand-ji",
    ];
    const catSlugs = categories.map((c) => c.slug);
    const catCheck =
      categories.length === 8 &&
      expectedCatSlugs.every((s) => catSlugs.includes(s));
    if (catCheck) {
      console.log("   [PASSED] Exactly 8 canonical categories returned with proper sorting.\n");
    } else {
      console.error("   [FAILED] Categories mismatch:", catSlugs);
      allPassed = false;
    }

    // 2. Verify getCategoryBySlug() with valid and invalid slugs
    console.log("2. Testing getCategoryBySlug()...");
    const hanumanCat = await getCategoryBySlug("hanuman");
    const nonExistentCat = await getCategoryBySlug("non-existent-category");
    const emptyCat = await getCategoryBySlug("");
    if (
      hanumanCat &&
      hanumanCat.slug === "hanuman" &&
      hanumanCat.title === "हनुमान जी" &&
      nonExistentCat === null &&
      emptyCat === null
    ) {
      console.log(`   [PASSED] Valid slug returned "${hanumanCat.title}", invalid/empty slugs returned null.\n`);
    } else {
      console.error("   [FAILED] Category lookup by slug failed.\n");
      allPassed = false;
    }

    // 3. Verify getPublishedArticles() -> exactly 18 published articles
    console.log("3. Testing getPublishedArticles()...");
    const articles = await getPublishedArticles();
    console.log(`   Found ${articles.length} published articles.`);
    if (articles.length === 18) {
      console.log("   [PASSED] Exactly 18 published articles returned.\n");
    } else {
      console.error(`   [FAILED] Expected 18 published articles, received ${articles.length}.\n`);
      allPassed = false;
    }

    // 4. Verify getPublishedArticleBySlug() with valid and invalid slugs
    console.log("4. Testing getPublishedArticleBySlug()...");
    const sampleArticle = await getPublishedArticleBySlug("sacchi-bhakti-kya-hai");
    const nonExistentArticle = await getPublishedArticleBySlug("invalid-slug-12345");
    const emptyArticle = await getPublishedArticleBySlug("");
    if (
      sampleArticle &&
      sampleArticle.slug === "sacchi-bhakti-kya-hai" &&
      sampleArticle.title &&
      sampleArticle.readTime === "6 मिनट" &&
      nonExistentArticle === null &&
      emptyArticle === null
    ) {
      console.log(`   [PASSED] Valid slug returned "${sampleArticle.title}".`);
      console.log("   [PASSED] Invalid and empty slugs returned null.\n");
    } else {
      console.error("   [FAILED] Article lookup by slug failed.\n");
      allPassed = false;
    }

    // 5. Verify section structure and mappings
    console.log("5. Testing sections JSONB to ArticleSection[] mapping...");
    if (sampleArticle && sampleArticle.sections && sampleArticle.sections.length > 0) {
      const firstSection = sampleArticle.sections[0];
      const hasHeading = typeof firstSection.heading === "string";
      const hasParagraphs = Array.isArray(firstSection.paragraphs) && firstSection.paragraphs.length > 0;
      const hasHighlight = typeof firstSection.highlight === "string";
      if (hasHeading && hasParagraphs && hasHighlight) {
        console.log(`   [PASSED] Sections mapped correctly (${sampleArticle.sections.length} sections found).`);
        console.log(`   Sample section heading: "${firstSection.heading}"\n`);
      } else {
        console.error("   [FAILED] Section structure missing expected fields.\n");
        allPassed = false;
      }
    } else {
      console.error("   [FAILED] No sections found on article.\n");
      allPassed = false;
    }

    // 6. Verify category filtering and category relationship mapping
    console.log("6. Testing getArticlesByCategory()...");
    const shivArticles = await getArticlesByCategory("shiv");
    const premanandArticles = await getArticlesByCategory("premanand-ji");
    console.log(`   Found ${shivArticles.length} articles for "shiv" category.`);
    console.log(`   Found ${premanandArticles.length} articles for "premanand-ji" category.`);
    const shivValid =
      shivArticles.length > 0 &&
      shivArticles.every((a) => a.categorySlug === "shiv" && a.category === "भगवान शिव");
    const premanandValid = premanandArticles.length === 0;
    if (shivValid && premanandValid) {
      console.log("   [PASSED] Category filtering and relations mapped correctly.\n");
    } else {
      console.error("   [FAILED] Category filtering check failed.\n");
      allPassed = false;
    }

    // 7. Verify getRelatedArticles()
    console.log("7. Testing getRelatedArticles()...");
    const related = await getRelatedArticles("sacchi-bhakti-kya-hai", "bhakti-vichar", 3);
    console.log(`   Found ${related.length} related articles.`);
    const relatedValid =
      related.length === 3 &&
      related.every((r) => r.slug !== "sacchi-bhakti-kya-hai");
    if (relatedValid) {
      console.log("   [PASSED] Related articles query returned 3 valid distinct items.\n");
    } else {
      console.error("   [FAILED] Related articles check failed.\n");
      allPassed = false;
    }

    if (allPassed) {
      console.log("==============================================================================");
      console.log("ALL 7 DATA ACCESS LAYER CHECKS PASSED!");
      console.log("==============================================================================");
    } else {
      console.log("==============================================================================");
      console.log("SOME CHECKS FAILED. See log details above.");
      console.log("==============================================================================");
    }
  } catch (err: unknown) {
    console.error("Verification execution error:", err);
  }
}

runVerification();
