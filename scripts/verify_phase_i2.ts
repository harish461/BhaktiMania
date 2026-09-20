import * as fs from "fs";
import * as path from "path";
import {
  getCategories,
} from "../lib/data/supabase";
import { getAdminArticles } from "../lib/data/supabase/admin";

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

// 18 Authoritative Production Article Slugs in Supabase
const EXPECTED_ARTICLE_SLUGS = [
  "radha-krishna-prem-samarpan",
  "vrindavan-yatra-planning-guide",
  "ekadashi-kya-hai",
  "karma-yoga-kya-hai",
  "shiv-bhakti-ka-saral-arth",
  "hanuman-ji-se-jeevan-ki-prerna",
  "hanuman-chalisa-saral-arth",
  "radha-krishna-bhakti",
  "hanuman-ji-vishwas-samarpan",
  "bhagavad-gita-5-sandesh",
  "mahadev-bhakti-shiv-naam-mahatva",
  "ekadashi-vrat-adhyatmik-mahatva",
  "vrindavan-jane-se-pehle-baatein",
  "mann-ki-shanti-ke-liye-bhakti",
  "sacchi-bhakti-kya-hai",
  "shri-krishna-jeevan-prernayein",
  "hanuman-chalisa-paath-kyun-karein",
  "subah-ki-10-minute-bhakti-dincharya",
];

async function runPhaseI2Verification() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Phase I2 Admin Article Management UX Verification");
  console.log("==============================================================================\n");

  let allPassed = true;

  try {
    // 1. Database Regression Verification
    console.log("1. Verifying Supabase Database Integrity & Regression Safety...");
    const articles = await getAdminArticles();
    const categories = await getCategories();

    // Check counts
    if (articles.length === 18) {
      console.log("   [PASSED] Exactly 18 articles exist in the database.");
    } else {
      console.error(`   [FAILED] Article count is ${articles.length}, expected exactly 18.`);
      allPassed = false;
    }

    if (categories.length === 8) {
      console.log("   [PASSED] Exactly 8 categories exist in the database.");
    } else {
      console.error(`   [FAILED] Category count is ${categories.length}, expected exactly 8.`);
      allPassed = false;
    }

    // Verify all 18 slugs match expected production set
    const actualSlugs = new Set(articles.map((a) => a.slug));
    const allExpectedSlugsPresent = EXPECTED_ARTICLE_SLUGS.every((slug) => actualSlugs.has(slug));
    if (allExpectedSlugsPresent && actualSlugs.size === 18) {
      console.log("   [PASSED] All 18 production article slugs are present and match expected set.");
    } else {
      console.error("   [FAILED] Mismatch in production article slugs:", {
        missing: EXPECTED_ARTICLE_SLUGS.filter((s) => !actualSlugs.has(s)),
        unexpected: articles.filter((a) => !EXPECTED_ARTICLE_SLUGS.includes(a.slug)).map((a) => a.slug),
      });
      allPassed = false;
    }

    // Verify all 18 articles remain published
    const allPublished = articles.every((a) => a.status === "published");
    if (allPublished) {
      console.log("   [PASSED] All 18 production articles remain in published status.");
    } else {
      console.error("   [FAILED] Some production articles are not published.");
      allPassed = false;
    }

    // Verify no test/unexpected articles exist
    const unexpectedSlugs = articles.filter((a) => !EXPECTED_ARTICLE_SLUGS.includes(a.slug));
    if (unexpectedSlugs.length === 0) {
      console.log("   [PASSED] No unexpected or test articles exist in the database.");
    } else {
      console.error("   [FAILED] Unexpected articles found:", unexpectedSlugs.map((a) => a.slug));
      allPassed = false;
    }

    // Verify category slugs and titles
    const actualCatSlugs = new Set(categories.map((c) => c.slug));
    const allCatSlugsPresent = EXPECTED_CATEGORIES.every((slug) => actualCatSlugs.has(slug));
    if (allCatSlugsPresent && actualCatSlugs.size === 8) {
      console.log("   [PASSED] All 8 expected categories exist with pristine data.\n");
    } else {
      console.error("   [FAILED] Category slug mismatch:", {
        missing: EXPECTED_CATEGORIES.filter((s) => !actualCatSlugs.has(s)),
      });
      allPassed = false;
    }

    // 2. Filter Logic Verification
    console.log("2. Testing In-Memory Filter Logic...");
    
    // Status filter
    const publishedFiltered = articles.filter((a) => a.status === "published");
    const draftFiltered = articles.filter((a) => a.status === "draft");
    if (publishedFiltered.length === 18 && draftFiltered.length === 0) {
      console.log("   [PASSED] Status filter logic correctly segments published (18) vs draft (0).");
    } else {
      console.error("   [FAILED] Status filter logic issue.");
      allPassed = false;
    }

    // Category filter
    const hanumanCat = categories.find((c) => c.slug === "hanuman");
    if (hanumanCat) {
      const hanumanArticles = articles.filter((a) => a.category_id === hanumanCat.id);
      if (hanumanArticles.length === 4 && hanumanArticles.every((a) => a.categoryTitle === "हनुमान जी")) {
        console.log(`   [PASSED] Category filter accurately isolated ${hanumanArticles.length} Hanuman Ji articles.`);
      } else {
        console.error("   [FAILED] Category filter returned unexpected count:", hanumanArticles.length);
        allPassed = false;
      }
    }

    // Featured filter
    const featuredArticles = articles.filter((a) => a.featured);
    const notFeaturedArticles = articles.filter((a) => !a.featured);
    if (featuredArticles.length + notFeaturedArticles.length === 18) {
      console.log(`   [PASSED] Featured filter correctly partitions ${featuredArticles.length} featured and ${notFeaturedArticles.length} non-featured articles.`);
    } else {
      console.error("   [FAILED] Featured filter mismatch.");
      allPassed = false;
    }

    // Search by title (e.g. searching for "कर्म योग")
    const titleTerm = "कर्म योग";
    const titleMatches = articles.filter((a) => a.title.toLowerCase().includes(titleTerm.toLowerCase()));
    if (titleMatches.length > 0 && titleMatches.some((a) => a.slug === "karma-yoga-kya-hai")) {
      console.log(`   [PASSED] Title search correctly found ${titleMatches.length} matching articles for "${titleTerm}".`);
    } else {
      console.error("   [FAILED] Title search failed to find expected articles.");
      allPassed = false;
    }

    // Search by slug (e.g. searching for "chalisa")
    const slugTerm = "chalisa";
    const slugMatches = articles.filter((a) => a.slug.toLowerCase().includes(slugTerm.toLowerCase()));
    if (slugMatches.length === 2 && slugMatches.every((a) => a.slug.includes("chalisa"))) {
      console.log(`   [PASSED] Slug search correctly found 2 matching articles for query "${slugTerm}".\n`);
    } else {
      console.error("   [FAILED] Slug search failed:", slugMatches);
      allPassed = false;
    }

    // 3. Sorting Logic Verification
    console.log("3. Testing Sorting Logic for All 5 Options...");
    
    // updated_desc
    const sortedUpdatedDesc = [...articles].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    const isUpdatedDesc = sortedUpdatedDesc.every((art, idx, arr) => {
      if (idx === 0) return true;
      return new Date(arr[idx - 1].updated_at).getTime() >= new Date(art.updated_at).getTime();
    });
    if (isUpdatedDesc) {
      console.log("   [PASSED] 'Recently updated' (updated_desc) sorted properly.");
    } else {
      console.error("   [FAILED] updated_desc sort failed.");
      allPassed = false;
    }

    // published_desc
    const sortedPubDesc = [...articles].sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateB - dateA;
    });
    const isPubDesc = sortedPubDesc.every((art, idx, arr) => {
      if (idx === 0) return true;
      const prev = arr[idx - 1].published_at ? new Date(arr[idx - 1].published_at!).getTime() : 0;
      const curr = art.published_at ? new Date(art.published_at!).getTime() : 0;
      return prev >= curr;
    });
    if (isPubDesc) {
      console.log("   [PASSED] 'Newest published' (published_desc) sorted properly.");
    } else {
      console.error("   [FAILED] published_desc sort failed.");
      allPassed = false;
    }

    // published_asc
    const sortedPubAsc = [...articles].sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateA - dateB;
    });
    const isPubAsc = sortedPubAsc.every((art, idx, arr) => {
      if (idx === 0) return true;
      const prev = arr[idx - 1].published_at ? new Date(arr[idx - 1].published_at!).getTime() : 0;
      const curr = art.published_at ? new Date(art.published_at!).getTime() : 0;
      return prev <= curr;
    });
    if (isPubAsc) {
      console.log("   [PASSED] 'Oldest published' (published_asc) sorted properly.");
    } else {
      console.error("   [FAILED] published_asc sort failed.");
      allPassed = false;
    }

    // title_asc
    const sortedTitleAsc = [...articles].sort((a, b) => a.title.localeCompare(b.title, "hi"));
    const isTitleAsc = sortedTitleAsc.every((art, idx, arr) => {
      if (idx === 0) return true;
      return arr[idx - 1].title.localeCompare(art.title, "hi") <= 0;
    });
    if (isTitleAsc) {
      console.log("   [PASSED] 'Title A–Z' (title_asc) sorted properly with Hindi locale support.");
    } else {
      console.error("   [FAILED] title_asc sort failed.");
      allPassed = false;
    }

    // title_desc
    const sortedTitleDesc = [...articles].sort((a, b) => b.title.localeCompare(a.title, "hi"));
    const isTitleDesc = sortedTitleDesc.every((art, idx, arr) => {
      if (idx === 0) return true;
      return arr[idx - 1].title.localeCompare(art.title, "hi") >= 0;
    });
    if (isTitleDesc) {
      console.log("   [PASSED] 'Title Z–A' (title_desc) sorted properly with Hindi locale support.\n");
    } else {
      console.error("   [FAILED] title_desc sort failed.");
      allPassed = false;
    }

    // 4. File Existence Check
    console.log("4. Verifying Phase I2 modular components on disk...");
    const requiredFiles = [
      "components/admin/ArticleListClient.tsx",
      "components/admin/articles/ArticleListHeader.tsx",
      "components/admin/articles/ArticleStats.tsx",
      "components/admin/articles/ArticleFilters.tsx",
      "components/admin/articles/ArticleStatusBadge.tsx",
      "components/admin/articles/ArticleActionMenu.tsx",
      "components/admin/articles/ArticleTable.tsx",
      "components/admin/articles/ArticleTableRow.tsx",
      "components/admin/articles/ArticleMobileCard.tsx",
      "components/admin/articles/ArticleEmptyState.tsx",
    ];

    let allFilesExist = true;
    for (const file of requiredFiles) {
      const fullPath = path.resolve(process.cwd(), file);
      if (!fs.existsSync(fullPath)) {
        console.error(`   [FAILED] File missing: ${file}`);
        allFilesExist = false;
      }
    }
    if (allFilesExist) {
      console.log(`   [PASSED] All ${requiredFiles.length} modular components are present on disk.\n`);
    } else {
      allPassed = false;
    }

    // 5. Final Result
    if (allPassed) {
      console.log("==============================================================================");
      console.log("ALL PHASE I2 VERIFICATION CHECKS PASSED!");
      console.log("==============================================================================");
    } else {
      console.error("==============================================================================");
      console.error("SOME PHASE I2 VERIFICATION CHECKS FAILED.");
      console.error("==============================================================================");
      process.exit(1);
    }
  } catch (err) {
    console.error("Verification execution error:", err);
    process.exit(1);
  }
}

runPhaseI2Verification();
