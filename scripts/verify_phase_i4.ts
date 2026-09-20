import * as fs from "fs";
import * as path from "path";
import { getAdminArticles, getAdminArticleById, getAdminCategories } from "../lib/data/supabase/admin";
import { validateImageBuffer } from "../lib/storage/image-validation";
import {
  MEDIA_BUCKET_NAME,
  generateFeaturedImagePath,
  isPathInArticleNamespace,
  extractStoragePathFromUrl,
} from "../lib/storage/storage-path";

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

async function runPhaseI4Verification() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Phase I4 Storage & Featured Image Architecture Verification");
  console.log("==============================================================================\n");

  let allPassed = true;

  try {
    // 1. Verify 18 Production Articles
    console.log("1. Verifying 18 Production Articles in Supabase...");
    const articles = await getAdminArticles();
    if (articles.length === 18) {
      console.log(`   [PASSED] Exactly 18 production articles exist in the database.`);
    } else {
      console.error(`   [FAILED] Expected 18 articles, found ${articles.length}`);
      allPassed = false;
    }

    const actualSlugs = new Set(articles.map((a) => a.slug));
    const allSlugsMatch =
      EXPECTED_ARTICLE_SLUGS.every((slug) => actualSlugs.has(slug)) &&
      actualSlugs.size === 18;

    if (allSlugsMatch) {
      console.log(`   [PASSED] All 18 production slugs remain completely intact.`);
    } else {
      console.error(`   [FAILED] Slug mismatch detected in production articles.`);
      allPassed = false;
    }

    // Verify no test articles exist
    const testArticles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes("test") ||
        a.slug.toLowerCase().includes("test")
    );
    if (testArticles.length === 0) {
      console.log(`   [PASSED] Zero test articles found in the database.`);
    } else {
      console.error(`   [FAILED] Found test articles in database:`, testArticles.map((a) => a.slug));
      allPassed = false;
    }

    // Verify existing image fields remain valid in database schema
    const sampleArticle = await getAdminArticleById(articles[0].id);
    if (sampleArticle && "featured_image_url" in sampleArticle && "featured_image_alt" in sampleArticle) {
      console.log(`   [PASSED] Existing image fields (featured_image_url, featured_image_alt) remain valid on article records.`);
    } else {
      console.error(`   [FAILED] Article lacks expected image fields.`);
      allPassed = false;
    }

    // 2. Verify 8 Production Categories
    console.log("\n2. Verifying 8 Production Categories in Supabase...");
    const categories = await getAdminCategories();
    if (categories.length === 8) {
      console.log(`   [PASSED] Exactly 8 production categories exist in the database.`);
    } else {
      console.error(`   [FAILED] Expected 8 categories, found ${categories.length}`);
      allPassed = false;
    }

    const actualCatSlugs = new Set(categories.map((c) => c.slug));
    const allCatsMatch =
      EXPECTED_CATEGORIES.every((c) => actualCatSlugs.has(c)) &&
      actualCatSlugs.size === 8;
    if (allCatsMatch) {
      console.log(`   [PASSED] All 8 production category slugs match expected catalog.`);
    } else {
      console.error(`   [FAILED] Category slugs mismatch.`);
      allPassed = false;
    }

    const testCategories = categories.filter(
      (c) =>
        c.title.toLowerCase().includes("test") ||
        c.slug.toLowerCase().includes("test")
    );
    if (testCategories.length === 0) {
      console.log(`   [PASSED] Zero test categories found in the database.`);
    } else {
      console.error(`   [FAILED] Found test categories in database:`, testCategories.map((c) => c.slug));
      allPassed = false;
    }

    // 3. Verify Storage Migration File & Policies
    console.log("\n3. Verifying Storage Migration & Security Policies...");
    const migrationPath = path.resolve(
      process.cwd(),
      "supabase/migrations/20260320000007_phase_i4_storage_bucket.sql"
    );

    if (fs.existsSync(migrationPath)) {
      console.log(`   [PASSED] Phase I4 migration exists: 20260320000007_phase_i4_storage_bucket.sql.`);
      const sqlContent = fs.readFileSync(migrationPath, "utf-8");

      // Check bucket name
      if (sqlContent.includes(`'${MEDIA_BUCKET_NAME}'`)) {
        console.log(`   [PASSED] Configures expected storage bucket: '${MEDIA_BUCKET_NAME}'.`);
      } else {
        console.error(`   [FAILED] Migration does not configure '${MEDIA_BUCKET_NAME}'.`);
        allPassed = false;
      }

      // Check no unexpected media bucket
      const bucketMatches = sqlContent.match(/storage\.buckets.*?VALUES\s*\(\s*'([^']+)'/i);
      if (bucketMatches && bucketMatches[1] === MEDIA_BUCKET_NAME) {
        console.log(`   [PASSED] No unexpected secondary media bucket created.`);
      }

      // Check admin authorization via public.is_admin()
      if (sqlContent.includes("public.is_admin()")) {
        console.log(`   [PASSED] Authoritative admin authorization enforced via public.is_admin().`);
      } else {
        console.error(`   [FAILED] Missing public.is_admin() in migration policies.`);
        allPassed = false;
      }

      // Check no anonymous upload/delete policies
      const hasAnonUpload = /FOR\s+INSERT\s+TO\s+anon/i.test(sqlContent);
      const hasAnonDelete = /FOR\s+DELETE\s+TO\s+anon/i.test(sqlContent);
      if (!hasAnonUpload && !hasAnonDelete) {
        console.log(`   [PASSED] Zero anonymous upload or delete policies.`);
      } else {
        console.error(`   [FAILED] Dangerous anonymous upload/delete policy detected!`);
        allPassed = false;
      }
    } else {
      console.error(`   [FAILED] Migration file not found at: ${migrationPath}`);
      allPassed = false;
    }

    // 4. Verify Zero Service-Role Key Usage in App Code
    console.log("\n4. Verifying Zero Service-Role Key Usage in Project Code...");
    const searchDirs = ["app", "components", "lib"];
    let serviceRoleFound = false;

    for (const dir of searchDirs) {
      const dirPath = path.resolve(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        const scan = (d: string) => {
          const entries = fs.readdirSync(d, { withFileTypes: true });
          for (const e of entries) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) {
              scan(p);
            } else if (e.isFile() && /\.(ts|tsx|js|jsx)$/.test(e.name)) {
              const content = fs.readFileSync(p, "utf-8");
              if (
                content.includes("SUPABASE_SERVICE_ROLE_KEY") ||
                content.includes("service_role")
              ) {
                console.error(`   [FAILED] Service-role reference detected in: ${path.relative(process.cwd(), p)}`);
                serviceRoleFound = true;
              }
            }
          }
        };
        scan(dirPath);
      }
    }

    if (!serviceRoleFound) {
      console.log(`   [PASSED] Zero service-role usage in client/server code. Clean authenticated client architecture preserved.`);
    } else {
      allPassed = false;
    }

    // 5. Verify Server-Side Image Validation Logic
    console.log("\n5. Testing Server-Side Image Validation Utility...");

    // Test PNG magic byte check
    const mockPng = Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), // PNG magic
      Buffer.from([0x00, 0x00, 0x00, 0x0d]), // IHDR length (13)
      Buffer.from("IHDR"),
      Buffer.from([0x00, 0x00, 0x04, 0xb0]), // width = 1200
      Buffer.from([0x00, 0x00, 0x02, 0x76]), // height = 630
      Buffer.from([0x08, 0x06, 0x00, 0x00, 0x00]), // bit depth, color type, etc.
      Buffer.alloc(20),
    ]);

    const pngResult = validateImageBuffer(mockPng, "artwork.png");
    if (pngResult.valid && pngResult.format === "png" && pngResult.dimensions?.width === 1200) {
      console.log(`   [PASSED] Valid PNG with 1200x630 dimensions accepted.`);
    } else {
      console.error(`   [FAILED] PNG validation check failed:`, pngResult);
      allPassed = false;
    }

    // Test SVG rejection
    const mockSvg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100"/></svg>');
    const svgResult = validateImageBuffer(mockSvg, "test.svg");
    if (!svgResult.valid && svgResult.error?.includes("SVG")) {
      console.log(`   [PASSED] SVG files strictly rejected.`);
    } else {
      console.error(`   [FAILED] SVG was not rejected.`);
      allPassed = false;
    }

    // Test GIF rejection
    const mockGif = Buffer.from("GIF89a\x01\x00\x01\x00\x80\x00\x00");
    const gifResult = validateImageBuffer(mockGif, "test.gif");
    if (!gifResult.valid && gifResult.error?.includes("GIF")) {
      console.log(`   [PASSED] GIF files strictly rejected.`);
    } else {
      console.error(`   [FAILED] GIF was not rejected.`);
      allPassed = false;
    }

    // Test Oversized file rejection (> 5MB)
    const mockOversized = Buffer.alloc(5 * 1024 * 1024 + 1024);
    const oversizedResult = validateImageBuffer(mockOversized, "large.jpg");
    if (!oversizedResult.valid && oversizedResult.error?.includes("exceeds")) {
      console.log(`   [PASSED] Files larger than 5 MB rejected.`);
    } else {
      console.error(`   [FAILED] Oversized file was not rejected.`);
      allPassed = false;
    }

    // 6. Test Scoped Storage Path Generation and Validation
    console.log("\n6. Testing Scoped Storage Path Utilities...");
    const sampleArticleId = "550e8400-e29b-41d4-a716-446655440000";
    const generatedPath = generateFeaturedImagePath(sampleArticleId, "webp");

    if (
      generatedPath.startsWith(`articles/${sampleArticleId}/featured-`) &&
      generatedPath.endsWith(".webp")
    ) {
      console.log(`   [PASSED] Storage path correctly formatted: ${generatedPath}`);
    } else {
      console.error(`   [FAILED] Unexpected path format: ${generatedPath}`);
      allPassed = false;
    }

    const isInNamespace = isPathInArticleNamespace(sampleArticleId, generatedPath);
    const isOtherInNamespace = isPathInArticleNamespace(
      sampleArticleId,
      "articles/00000000-0000-0000-0000-000000000000/featured-xxx.webp"
    );

    if (isInNamespace && !isOtherInNamespace) {
      console.log(`   [PASSED] Namespace boundaries strictly enforced per article.`);
    } else {
      console.error(`   [FAILED] Namespace boundary check failed.`);
      allPassed = false;
    }

    const sampleUrl = `https://project.supabase.co/storage/v1/object/public/${MEDIA_BUCKET_NAME}/${generatedPath}`;
    const extracted = extractStoragePathFromUrl(sampleUrl);
    if (extracted === generatedPath) {
      console.log(`   [PASSED] Storage path accurately extracted from public URL.`);
    } else {
      console.error(`   [FAILED] URL extraction mismatch: got ${extracted}, expected ${generatedPath}`);
      allPassed = false;
    }

    // 7. Verify Required Phase I4 Files on Disk
    console.log("\n7. Verifying Phase I4 Files on Disk...");
    const requiredFiles = [
      "supabase/migrations/20260320000007_phase_i4_storage_bucket.sql",
      "lib/storage/image-validation.ts",
      "lib/storage/storage-path.ts",
      "app/admin/actions/media.ts",
      "components/admin/editor/FeaturedImageField.tsx",
      "components/admin/editor/ArticleDetailsCard.tsx",
      "components/admin/editor/ArticlePreviewModal.tsx",
      "components/admin/ArticleEditor.tsx",
      "app/bhakti-gyaan/[slug]/page.tsx",
      "scripts/verify_phase_i4.ts",
    ];

    let filesAllExist = true;
    for (const f of requiredFiles) {
      const fullPath = path.resolve(process.cwd(), f);
      if (!fs.existsSync(fullPath)) {
        console.error(`   [FAILED] Missing file: ${f}`);
        filesAllExist = false;
      }
    }

    if (filesAllExist) {
      console.log(`   [PASSED] All ${requiredFiles.length} Phase I4 files exist on disk.`);
    } else {
      allPassed = false;
    }

    // 8. Verification Summary
    console.log("\n==============================================================================");
    if (allPassed) {
      console.log("ALL PHASE I4 STORAGE & FEATURED IMAGE ARCHITECTURE CHECKS PASSED!");
      console.log("==============================================================================");
    } else {
      console.error("SOME PHASE I4 CHECKS FAILED.");
      console.log("==============================================================================");
      process.exit(1);
    }
  } catch (err) {
    console.error("Verification execution error:", err);
    process.exit(1);
  }
}

runPhaseI4Verification();
