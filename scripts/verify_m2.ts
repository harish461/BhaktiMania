import * as fs from "fs";
import * as path from "path";
import { adsenseConfig, getAdSenseClient } from "../lib/config/adsense";

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

async function runM2Verification() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Phase M2 Google AdSense Integration & Production QA");
  console.log("==============================================================================\n");

  let allPassed = true;

  try {
    // 1. Audit AdSense Configuration Module
    console.log("1. Checking lib/config/adsense.ts...");
    const configPath = path.resolve(process.cwd(), "lib/config/adsense.ts");
    if (fs.existsSync(configPath)) {
      console.log("   [PASSED] lib/config/adsense.ts exists.");
    } else {
      console.error("   [FAILED] lib/config/adsense.ts is missing!");
      allPassed = false;
    }

    // Test environment behavior
    console.log("\n2. Testing environment variable logic...");
    console.log(`   Current NEXT_PUBLIC_ADSENSE_ENABLED: "${process.env.NEXT_PUBLIC_ADSENSE_ENABLED ?? ""}"`);
    console.log(`   Current NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: "${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? ""}"`);
    console.log(`   Evaluated adsenseConfig.enabled: ${adsenseConfig.enabled}`);

    // In current pre-approval state, it must be disabled and publisher ID must be empty or unconfigured
    if (!adsenseConfig.enabled) {
      console.log("   [PASSED] AdSense is safely dormant by default when disabled or unconfigured.");
    } else {
      console.error("   [FAILED] AdSense is unexpectedly enabled without official approval!");
      allPassed = false;
    }

    // Helper client test
    const formatted = getAdSenseClient("1234567890123456");
    if (formatted === "ca-pub-1234567890123456") {
      console.log("   [PASSED] getAdSenseClient correctly formats ca-pub prefix.");
    } else {
      console.error(`   [FAILED] Unexpected getAdSenseClient output: ${formatted}`);
      allPassed = false;
    }

    // 2. Audit Source Code for Fake Publisher IDs or Slot IDs
    console.log("\n3. Auditing application source code for fake credentials...");
    const scanDirs = ["app", "components", "lib"];
    let fakeCredentialsFound = false;

    // Regex checking for hardcoded ca-pub with numbers or hardcoded ad slot digits
    const fakePubRegex = /ca-pub-\d{8,}/;
    const fakeSlotRegex = /data-ad-slot=["']\d{8,}["']/;

    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(full);
        } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
          const content = fs.readFileSync(full, "utf-8");
          if (fakePubRegex.test(content)) {
            console.error(`   [FAILED] Hardcoded publisher ID found in ${full}`);
            fakeCredentialsFound = true;
          }
          if (fakeSlotRegex.test(content)) {
            console.error(`   [FAILED] Hardcoded ad-slot ID found in ${full}`);
            fakeCredentialsFound = true;
          }
        }
      }
    }

    for (const d of scanDirs) {
      scanDir(path.resolve(process.cwd(), d));
    }

    if (!fakeCredentialsFound) {
      console.log("   [PASSED] Zero hardcoded fake publisher IDs or fake ad-slot IDs found in source code.");
    } else {
      allPassed = false;
    }

    // 4. Audit AdSenseScript Component & Admin Route Isolation
    console.log("\n4. Auditing AdSenseScript component & Admin route isolation...");
    const scriptPath = path.resolve(process.cwd(), "components/ads/AdSenseScript.tsx");
    if (fs.existsSync(scriptPath)) {
      const scriptContent = fs.readFileSync(scriptPath, "utf-8");
      if (scriptContent.includes('pathname.startsWith("/admin")')) {
        console.log("   [PASSED] AdSenseScript strictly bars execution on /admin routes.");
      } else {
        console.error("   [FAILED] AdSenseScript does not guard against /admin routes!");
        allPassed = false;
      }
      if (scriptContent.includes("strategy=\"afterInteractive\"")) {
        console.log("   [PASSED] AdSenseScript uses Next.js afterInteractive loading strategy.");
      } else {
        console.error("   [FAILED] AdSenseScript missing afterInteractive strategy!");
        allPassed = false;
      }
    } else {
      console.error("   [FAILED] components/ads/AdSenseScript.tsx is missing!");
      allPassed = false;
    }

    // 5. Audit AdSlot React Safety and Dormant State
    console.log("\n5. Auditing AdSlot component...");
    const adSlotPath = path.resolve(process.cwd(), "components/ads/AdSlot.tsx");
    if (fs.existsSync(adSlotPath)) {
      const adSlotContent = fs.readFileSync(adSlotPath, "utf-8");
      if (adSlotContent.includes("data-adsbygoogle-status") && adSlotContent.includes("isPushedRef")) {
        console.log("   [PASSED] AdSlot contains ref-guarded duplicate-push prevention.");
      } else {
        console.error("   [FAILED] AdSlot missing duplicate-push prevention guards!");
        allPassed = false;
      }
      if (adSlotContent.includes("if (!adsenseConfig.enabled || !adsenseConfig.publisherId)") &&
          adSlotContent.includes("if (!slotId)")) {
        console.log("   [PASSED] AdSlot safely returns null when disabled, missing publisher, or missing slotId.");
      } else {
        console.error("   [FAILED] AdSlot missing dormant null return guards!");
        allPassed = false;
      }
    } else {
      console.error("   [FAILED] components/ads/AdSlot.tsx is missing!");
      allPassed = false;
    }

    // 6. Audit Article Placements A, B, C
    console.log("\n6. Auditing Article Ad Placements (A, B, C)...");
    const articlePagePath = path.resolve(process.cwd(), "app/bhakti-gyaan/[slug]/page.tsx");
    const articleContent = fs.readFileSync(articlePagePath, "utf-8");
    const hasPlacementA = articleContent.includes("Placement A");
    const hasPlacementB = articleContent.includes("Placement B");
    const hasPlacementC = articleContent.includes("Placement C");

    if (hasPlacementA && hasPlacementB && hasPlacementC) {
      console.log("   [PASSED] All three article ad placements (A: top, B: middle, C: end) are structured cleanly.");
    } else {
      console.error(`   [FAILED] Missing article placements: A=${hasPlacementA}, B=${hasPlacementB}, C=${hasPlacementC}`);
      allPassed = false;
    }

    // 7. Verify Zero Service Role Keys Across Project
    console.log("\n7. Checking zero service-role keys in public/admin components...");
    let serviceRoleFound = false;
    for (const d of scanDirs) {
      const entries = fs.readdirSync(path.resolve(process.cwd(), d), { withFileTypes: true, recursive: true });
      for (const entry of entries) {
        if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
          const fileP = path.join(entry.parentPath || entry.path, entry.name);
          const c = fs.readFileSync(fileP, "utf-8");
          if (c.includes("SUPABASE_SERVICE_ROLE_KEY") || c.includes("service_role")) {
            console.error(`   [FAILED] Service-role keyword found in ${fileP}`);
            serviceRoleFound = true;
          }
        }
      }
    }
    if (!serviceRoleFound) {
      console.log("   [PASSED] Zero service-role credentials leaked across application code.");
    } else {
      allPassed = false;
    }

  } catch (err) {
    console.error("   [ERROR] Unexpected error during M2 audit:", err);
    allPassed = false;
  }

  console.log("\n------------------------------------------------------------------------------");
  if (allPassed) {
    console.log("PHASE M2 VERIFICATION RESULT: PASSED (100% of checks passed)");
    console.log("------------------------------------------------------------------------------");
    process.exit(0);
  } else {
    console.error("PHASE M2 VERIFICATION RESULT: FAILED");
    console.log("------------------------------------------------------------------------------");
    process.exit(1);
  }
}

runM2Verification();
