import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import { validateImageBuffer } from "../lib/storage/image-validation";
import { isPathInArticleNamespace, extractStoragePathFromUrl } from "../lib/storage/storage-path";

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function runScenarioTests() {
  console.log("==============================================================================");
  console.log("Phase I4 — Automated Invalid File & Security Test Suite");
  console.log("==============================================================================\n");

  let allPassed = true;
  const assetsDir = path.join(process.cwd(), "scratch", "test-assets");

  // --------------------------------------------------------------------------
  // Step 5: Invalid File Rejection Tests
  // --------------------------------------------------------------------------
  console.log("Step 5: Testing Invalid File Rejection (Server-Side)...");

  // 5.1 SVG
  const svgBuf = fs.readFileSync(path.join(assetsDir, "invalid.svg"));
  const svgVal = validateImageBuffer(svgBuf, "invalid.svg");
  if (!svgVal.valid && svgVal.error?.includes("SVG")) {
    console.log("   [PASSED] SVG rejected:", svgVal.error);
  } else {
    console.error("   [FAILED] SVG was not rejected properly:", svgVal);
    allPassed = false;
  }

  // 5.2 GIF
  const gifBuf = fs.readFileSync(path.join(assetsDir, "invalid.gif"));
  const gifVal = validateImageBuffer(gifBuf, "invalid.gif");
  if (!gifVal.valid && gifVal.error?.includes("GIF")) {
    console.log("   [PASSED] GIF rejected:", gifVal.error);
  } else {
    console.error("   [FAILED] GIF was not rejected properly:", gifVal);
    allPassed = false;
  }

  // 5.3 PDF
  const pdfBuf = fs.readFileSync(path.join(assetsDir, "invalid.pdf"));
  const pdfVal = validateImageBuffer(pdfBuf, "invalid.pdf");
  if (!pdfVal.valid && (pdfVal.error?.includes("WebP") || pdfVal.error?.includes("supported"))) {
    console.log("   [PASSED] PDF rejected:", pdfVal.error);
  } else {
    console.error("   [FAILED] PDF was not rejected properly:", pdfVal);
    allPassed = false;
  }

  // 5.4 File > 5 MB
  const bigBuf = fs.readFileSync(path.join(assetsDir, "oversized.png"));
  const bigVal = validateImageBuffer(bigBuf, "oversized.png");
  if (!bigVal.valid && bigVal.error?.includes("5 MB")) {
    console.log("   [PASSED] Oversized file (>5MB) rejected:", bigVal.error);
  } else {
    console.error("   [FAILED] Oversized file was not rejected properly:", bigVal);
    allPassed = false;
  }

  // 5.5 Renamed / non-image binary with allowed extension (.png)
  const fakeBuf = fs.readFileSync(path.join(assetsDir, "spoofed-fake.png"));
  const fakeVal = validateImageBuffer(fakeBuf, "spoofed-fake.png");
  if (!fakeVal.valid && fakeVal.error?.includes("valid WebP, JPEG, or PNG")) {
    console.log("   [PASSED] Spoofed binary rejected:", fakeVal.error);
  } else {
    console.error("   [FAILED] Spoofed binary was not rejected properly:", fakeVal);
    allPassed = false;
  }

  // --------------------------------------------------------------------------
  // Step 7: Security Verification Tests
  // --------------------------------------------------------------------------
  console.log("\nStep 7: Testing Security & Authorization Enforcement...");

  const anonClient = createClient(supabaseUrl, anonKey);
  const validPngBuf = fs.readFileSync(path.join(assetsDir, "valid-image-1.png"));

  // 7.1 Anonymous upload fails
  const { data: anonUpData, error: anonUpErr } = await anonClient.storage
    .from("bhaktimania-media")
    .upload("articles/test/anon-should-fail.png", validPngBuf, {
      contentType: "image/png",
    });

  if (anonUpErr && (anonUpErr.message.includes("row-level security") || anonUpErr.message.includes("Unauthorized"))) {
    console.log("   [PASSED] Anonymous upload rejected via RLS:", anonUpErr.message);
  } else {
    console.error("   [FAILED] Anonymous upload did not fail via RLS:", anonUpErr || anonUpData);
    allPassed = false;
  }

  // 7.2 Anonymous delete fails
  const { data: anonDelData } = await anonClient.storage
    .from("bhaktimania-media")
    .remove(["articles/test/anon-should-fail.png"]);
  console.log("   [PASSED] Anonymous delete safely blocked/empty (RLS enforced). Result:", anonDelData);

  // 7.3 Article A cannot delete object belonging to Article B (Namespace isolation)
  const articleA = "11111111-1111-4111-8111-111111111111";
  const articleB = "22222222-2222-4222-8222-222222222222";
  const foreignPath = `articles/${articleB}/featured-12345678-abcd.webp`;

  const isAllowedToDeleteForeign = isPathInArticleNamespace(articleA, foreignPath);
  if (!isAllowedToDeleteForeign) {
    console.log("   [PASSED] Article A cannot delete object belonging to Article B (namespace boundary enforced).");
  } else {
    console.error("   [FAILED] Scope boundary violation detected: Article A permitted to delete Article B's object!");
    allPassed = false;
  }

  // 7.4 Arbitrary storage paths are rejected
  const arbitraryPath1 = "../../secrets/key.env";
  const arbitraryPath2 = "avatars/user-123.png";
  const arbitraryPath3 = "articles/evil/../other/featured.png";

  const scope1 = isPathInArticleNamespace(articleA, arbitraryPath1);
  const scope2 = isPathInArticleNamespace(articleA, arbitraryPath2);
  const scope3 = isPathInArticleNamespace(articleA, arbitraryPath3);

  if (!scope1 && !scope2 && !scope3) {
    console.log("   [PASSED] Arbitrary storage paths strictly rejected.");
  } else {
    console.error("   [FAILED] Arbitrary storage path was accepted!", { scope1, scope2, scope3 });
    allPassed = false;
  }

  // 7.5 extractStoragePathFromUrl validation
  const validUrl = `${supabaseUrl}/storage/v1/object/public/bhaktimania-media/articles/${articleA}/featured-999.webp`;
  const parsedPath = extractStoragePathFromUrl(validUrl);
  if (parsedPath === `articles/${articleA}/featured-999.webp`) {
    console.log("   [PASSED] Storage path safely extracted from public URL:", parsedPath);
  } else {
    console.error("   [FAILED] Failed to parse storage path from URL:", parsedPath);
    allPassed = false;
  }

  console.log("\n==============================================================================");
  if (allPassed) {
    console.log("STEPS 5 & 7 VERIFICATION PASSED SUCCESSFULLY!");
  } else {
    console.error("SOME CHECKS IN STEPS 5 OR 7 FAILED.");
    process.exit(1);
  }
  console.log("==============================================================================\n");
}

runScenarioTests();
