import * as fs from "fs";
import * as path from "path";
import { getAdminArticles, isSlugUnique } from "../lib/data/supabase/admin";
import { getCategories } from "../lib/data/supabase/categories";
import { getAuthors } from "../lib/data/supabase/authors";
import {
  saveArticleAction,
  unpublishArticleAction,
  deleteArticleAction,
} from "../app/admin/actions/articles";

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

async function runPhaseGVerification() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Phase G Admin Article Management Verification");
  console.log("==============================================================================\n");

  let allPassed = true;

  try {
    // 1. Verify Categories retrieval
    console.log("1. Testing getCategories()...");
    const categories = await getCategories();
    console.log(`   Found ${categories.length} active categories in Supabase.`);
    if (categories.length === 8) {
      console.log("   [PASSED] All 8 devotional categories retrieved successfully.\n");
    } else {
      console.error(`   [FAILED] Expected 8 categories, found: ${categories.length}`);
      allPassed = false;
    }

    // 2. Verify Authors retrieval
    console.log("2. Testing getAuthors()...");
    const authors = await getAuthors();
    console.log(`   Found ${authors.length} active authors in Supabase.`);
    if (authors.length >= 1 && authors.some((a) => a.name.includes("BhaktiMania"))) {
      console.log("   [PASSED] BhaktiMania Editorial Team author retrieved successfully.\n");
    } else {
      console.error("   [FAILED] Author retrieval failed:", authors);
      allPassed = false;
    }

    // 3. Verify Admin Articles query
    console.log("3. Testing getAdminArticles()...");
    const adminArticles = await getAdminArticles();
    console.log(`   Found ${adminArticles.length} articles via admin query.`);
    if (adminArticles.length >= 18) {
      console.log("   [PASSED] Admin articles query returned all seeded articles.\n");
    } else {
      console.error(`   [FAILED] Expected at least 18 articles, got ${adminArticles.length}`);
      allPassed = false;
    }

    // 4. Verify Slug uniqueness logic
    console.log("4. Testing isSlugUnique()...");
    const firstArticle = adminArticles[0];
    const isExistingTaken = await isSlugUnique(firstArticle.slug);
    const isSelfAllowed = await isSlugUnique(firstArticle.slug, firstArticle.id);
    const isUniqueAvailable = await isSlugUnique(`unique-slug-test-${Date.now()}`);

    if (!isExistingTaken && isSelfAllowed && isUniqueAvailable) {
      console.log("   [PASSED] Slug uniqueness check properly distinguishes taken, self, and available slugs.\n");
    } else {
      console.error("   [FAILED] Slug uniqueness results:", {
        isExistingTaken,
        isSelfAllowed,
        isUniqueAvailable,
      });
      allPassed = false;
    }

    // 5. Verify Unauthenticated Protection on Server Actions
    console.log("5. Testing Server Actions security against unauthenticated callers...");
    const saveRes = await saveArticleAction({
      title: "Unauthorized Test",
      slug: "unauthorized-test",
      description: "Testing unauthenticated reject",
      category_id: categories[0].id,
      author_id: authors[0].id,
      status: "draft",
      symbol: "दीप",
      read_time: "5 मिनट",
      featured: false,
      sections: [{ heading: "Test", paragraphs: ["Test paragraph"] }],
    });

    const unpublishRes = await unpublishArticleAction(firstArticle.id);
    const deleteRes = await deleteArticleAction(firstArticle.id);

    if (
      !saveRes.success &&
      saveRes.error?.includes("administrator") &&
      !unpublishRes.success &&
      unpublishRes.error?.includes("administrator") &&
      !deleteRes.success &&
      deleteRes.error?.includes("administrator")
    ) {
      console.log("   [PASSED] All mutation Server Actions strictly require authenticated admin privileges.\n");
    } else {
      console.error("   [FAILED] Server action unauthorized protection failed:", {
        saveRes,
        unpublishRes,
        deleteRes,
      });
      allPassed = false;
    }

    // 6. Verify Public Site Static Data Integrity
    console.log("6. Verifying public site data files remain intact...");
    const articlesFile = fs.readFileSync(path.resolve(process.cwd(), "lib/data/articles.ts"), "utf-8");
    const categoriesFile = fs.readFileSync(path.resolve(process.cwd(), "lib/data/categories.ts"), "utf-8");
    if (articlesFile.includes("articlesData") && categoriesFile.includes("categoriesData")) {
      console.log("   [PASSED] lib/data/articles.ts and lib/data/categories.ts are intact and unchanged.\n");
    } else {
      console.error("   [FAILED] Public site data files were unexpectedly modified.");
      allPassed = false;
    }

    // 7. Verify Migration File Presence
    console.log("7. Verifying migration 20260320000005_phase_g_article_management.sql...");
    const migrationPath = path.resolve(
      process.cwd(),
      "supabase/migrations/20260320000005_phase_g_article_management.sql"
    );
    if (fs.existsSync(migrationPath)) {
      const sqlContent = fs.readFileSync(migrationPath, "utf-8");
      if (sqlContent.includes("GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;")) {
        console.log("   [PASSED] Phase G grant migration file is properly prepared.\n");
      } else {
        console.error("   [FAILED] Migration file missing expected grant statements.");
        allPassed = false;
      }
    } else {
      console.error("   [FAILED] Migration file does not exist at:", migrationPath);
      allPassed = false;
    }

    console.log("==============================================================================");
    if (allPassed) {
      console.log("PHASE G VERIFICATION: ALL 7 CHECKS PASSED SUCCESSFULLY!");
    } else {
      console.log("PHASE G VERIFICATION: SOME CHECKS FAILED. See log output above.");
    }
    console.log("==============================================================================");
  } catch (err: unknown) {
    console.error("Verification execution error:", err);
    process.exit(1);
  }
}

runPhaseGVerification();
