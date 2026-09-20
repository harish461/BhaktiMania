import * as fs from "fs";
import * as path from "path";
import { getCurrentAdmin } from "../lib/auth/admin";
import { proxy, config as proxyConfig } from "../proxy";
import { NextRequest } from "next/server";
import { validateAvatarUrl } from "../lib/validation/author";
import { validateImageBuffer } from "../lib/storage/image-validation";
import { isPathInArticleNamespace } from "../lib/storage/storage-path";
import {
  getAdminArticles,
  getAdminCategories,
  getAdminAuthors,
  getAdminDashboardData,
  isSlugUnique,
} from "../lib/data/supabase/admin";

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

async function runPhaseI7Audit() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Phase I7 Final Admin Security & Production QA Audit");
  console.log("==============================================================================\n");

  let allPassed = true;

  try {
    // 1. Audit Authentication & Admin Route Protection
    console.log("1. Auditing Middleware Proxy & Route Protection...");
    const hasAdminMatcher =
      Array.isArray(proxyConfig.matcher) &&
      proxyConfig.matcher.includes("/admin/:path*");
    if (hasAdminMatcher) {
      console.log("   [PASSED] proxy.ts correctly protects all /admin/:path* routes.");
    } else {
      console.error("   [FAILED] proxy.ts missing /admin/:path* matcher!");
      allPassed = false;
    }

    // Test proxy unauthenticated redirect on protected admin endpoints
    const protectedEndpoints = [
      "/admin",
      "/admin/dashboard",
      "/admin/articles",
      "/admin/articles/new",
      "/admin/categories",
      "/admin/authors",
    ];

    for (const endpoint of protectedEndpoints) {
      const req = new NextRequest(`http://localhost:3000${endpoint}`);
      const res = await proxy(req);
      const location = res.headers.get("location");
      if (location && location.includes("/admin/login")) {
        console.log(`   [PASSED] Unauthenticated ${endpoint} redirects to /admin/login.`);
      } else {
        console.error(`   [FAILED] Unauthenticated ${endpoint} did NOT redirect to /admin/login:`, location);
        allPassed = false;
      }
    }

    // 2. Audit Server-Side getCurrentAdmin() Authorization
    console.log("\n2. Auditing Server-Side Authorization Guardrails...");
    const unauthAuth = await getCurrentAdmin();
    if (!unauthAuth.isAuthenticated && !unauthAuth.isAdmin && unauthAuth.user === null) {
      console.log("   [PASSED] getCurrentAdmin() safely rejects unauthenticated execution.");
    } else {
      console.error("   [FAILED] getCurrentAdmin() leaked authorization in unauthenticated state!", unauthAuth);
      allPassed = false;
    }

    // 3. Scan Application Codebase for Forbidden Service-Role Keys or Leaks
    console.log("\n3. Scanning Application Source Code for Forbidden Service-Role Keys or Leaks...");
    const srcDirs = ["app", "components", "lib", "proxy.ts"];
    let leakedSecrets = false;

    function scanDir(dir: string) {
      const fullDir = path.resolve(process.cwd(), dir);
      if (!fs.existsSync(fullDir)) return;
      const stat = fs.statSync(fullDir);
      if (stat.isFile()) {
        checkFile(fullDir);
        return;
      }
      const files = fs.readdirSync(fullDir);
      for (const file of files) {
        const p = path.join(fullDir, file);
        const s = fs.statSync(p);
        if (s.isDirectory()) {
          scanDir(p);
        } else if (/\.(ts|tsx|js|mjs)$/.test(file)) {
          checkFile(p);
        }
      }
    }

    function checkFile(filePath: string) {
      const content = fs.readFileSync(filePath, "utf-8");
      if (
        /SUPABASE_SERVICE_ROLE_KEY/i.test(content) ||
        /service_role/i.test(content) ||
        /supabase\.auth\.admin/i.test(content)
      ) {
        console.error(`   [SECURITY ALERT] Suspicious service-role reference in: ${filePath}`);
        leakedSecrets = true;
      }
    }

    for (const d of srcDirs) {
      scanDir(d);
    }

    if (!leakedSecrets) {
      console.log("   [PASSED] Zero service-role credentials or admin client leaks found in codebase.");
    } else {
      allPassed = false;
    }

    // 4. Audit Absence of DELETE Privileges on Authors and Categories
    console.log("\n4. Auditing Absence of Author & Category Deletion Actions...");
    const authorActions = await import("../app/admin/actions/authors");
    const categoryActions = await import("../app/admin/actions/categories");

    if (!("deleteAuthorAction" in authorActions)) {
      console.log("   [PASSED] Zero author deletion action exported.");
    } else {
      console.error("   [FAILED] Dangerous deleteAuthorAction detected!");
      allPassed = false;
    }

    if (!("deleteCategoryAction" in categoryActions)) {
      console.log("   [PASSED] Zero category deletion action exported.");
    } else {
      console.error("   [FAILED] Dangerous deleteCategoryAction detected!");
      allPassed = false;
    }

    // 5. Audit Storage Security, Magic Bytes, & Path Namespace Isolation
    console.log("\n5. Auditing Storage Validation & Path Namespace Isolation...");
    // Test magic bytes: valid PNG
    const dummyPng = Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      Buffer.from([0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52]),
      Buffer.from([0x00, 0x00, 0x04, 0xb0, 0x00, 0x00, 0x02, 0x76, 0x08, 0x06, 0x00, 0x00, 0x00]),
    ]);
    const validResult = validateImageBuffer(dummyPng, "valid.png");
    if (validResult.valid && validResult.extension === "png") {
      console.log("   [PASSED] Valid image header accepted by buffer validator.");
    } else {
      console.error("   [FAILED] Valid image buffer rejected:", validResult);
      allPassed = false;
    }

    // Test rejection of SVG / script / executable spoofing
    const dummySvg = Buffer.from("<svg onload='alert(1)'></svg>");
    const svgResult = validateImageBuffer(dummySvg, "test.svg");
    if (!svgResult.valid) {
      console.log("   [PASSED] SVG files strictly rejected by magic byte inspection.");
    } else {
      console.error("   [FAILED] SVG was not rejected!");
      allPassed = false;
    }

    // Test Path Isolation
    const articleA = "550e8400-e29b-41d4-a716-446655440000";
    const articleB = "660e8400-e29b-41d4-a716-446655440001";
    const pathA = `articles/${articleA}/featured-1234.webp`;
    const pathB = `articles/${articleB}/featured-5678.webp`;

    if (isPathInArticleNamespace(articleA, pathA) && !isPathInArticleNamespace(articleA, pathB)) {
      console.log("   [PASSED] Storage namespace boundaries strictly enforced per article UUID.");
    } else {
      console.error("   [FAILED] Storage namespace check failed!");
      allPassed = false;
    }

    // 6. Audit Input Validation Guards (Avatar URLs, Slugs)
    console.log("\n6. Auditing Avatar URL and Slug Input Validation...");
    const httpsUrl = validateAvatarUrl("https://images.unsplash.com/photo.jpg");
    const httpUrl = validateAvatarUrl("http://example.com/photo.jpg");
    const jsUrl = validateAvatarUrl("javascript:alert(1)");
    const dataUrl = validateAvatarUrl("data:text/html,script");
    const fileUrl = validateAvatarUrl("file:///etc/passwd");

    if (httpsUrl.valid && httpUrl.valid && !jsUrl.valid && !dataUrl.valid && !fileUrl.valid) {
      console.log("   [PASSED] Avatar URL scheme validator permits only http/https and blocks dangerous schemes.");
    } else {
      console.error("   [FAILED] Avatar URL validation vulnerability detected!");
      allPassed = false;
    }

    // Slug uniqueness checks
    const slugAvailable = await isSlugUnique("completely-unique-article-slug-9999");
    const slugTaken = await isSlugUnique("radha-krishna-prem-samarpan");
    if (slugAvailable && !slugTaken) {
      console.log("   [PASSED] Article slug uniqueness correctly differentiates taken vs available.");
    } else {
      console.error("   [FAILED] Slug uniqueness check failed!");
      allPassed = false;
    }

    // 7. Audit Ground-Truth Data Integrity (18 Articles, 8 Categories)
    console.log("\n7. Auditing Production Data Integrity...");
    const articles = await getAdminArticles();
    const categories = await getAdminCategories();
    const authors = await getAdminAuthors();

    if (articles.length === 18) {
      console.log(`   [PASSED] Exactly 18 production articles exist in database.`);
    } else {
      console.error(`   [FAILED] Expected 18 articles, found: ${articles.length}`);
      allPassed = false;
    }

    if (categories.length === 8) {
      console.log(`   [PASSED] Exactly 8 devotional categories exist in database.`);
    } else {
      console.error(`   [FAILED] Expected 8 categories, found: ${categories.length}`);
      allPassed = false;
    }

    const editorialTeam = authors.find((a) => a.slug === "editorial-team");
    if (editorialTeam && editorialTeam.articleCount === 18) {
      console.log(`   [PASSED] BhaktiMania Editorial Team remains author for all 18 production articles.`);
    } else {
      console.error(`   [FAILED] Editorial team attribution missing or count mismatch: ${editorialTeam?.articleCount}`);
      allPassed = false;
    }

    // 8. Audit Dashboard Data Integrity (Phase I6 Integration)
    console.log("\n8. Auditing Dashboard Aggregate Data Integration...");
    const dashboardData = await getAdminDashboardData();
    if (dashboardData.stats && dashboardData.stats.totalArticles === 18 && dashboardData.stats.totalCategories === 8) {
      console.log("   [PASSED] Dashboard aggregate metrics match database ground truth.");
    } else {
      console.error("   [FAILED] Dashboard data mismatch:", dashboardData.stats);
      allPassed = false;
    }

  } catch (err) {
    console.error("Unexpected error during Phase I7 audit:", err);
    allPassed = false;
  }

  console.log("\n==============================================================================");
  if (allPassed) {
    console.log("ALL PHASE I7 SECURITY & PRODUCTION QA AUDIT CHECKS PASSED!");
  } else {
    console.error("SOME PHASE I7 AUDIT CHECKS FAILED!");
  }
  console.log("==============================================================================\n");

  if (!allPassed) {
    process.exit(1);
  }
}

runPhaseI7Audit().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
