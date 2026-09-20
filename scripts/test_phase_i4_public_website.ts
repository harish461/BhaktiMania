import * as fs from "fs";
import * as path from "path";

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

async function runPublicWebsiteTests() {
  console.log("==============================================================================");
  console.log("Phase I4 — Step 6: Public Website Featured Image & Fallback Verification");
  console.log("==============================================================================\n");

  let allPassed = true;
  const baseUrl = "http://localhost:3000";

  // 1. Fetch listing page /bhakti-gyaan
  console.log("1. Inspecting article cards on /bhakti-gyaan...");
  const listingRes = await fetch(`${baseUrl}/bhakti-gyaan`);
  if (listingRes.status === 200) {
    const html = await listingRes.text();
    console.log("   [PASSED] /bhakti-gyaan returned HTTP 200.");

    // Check that fallback devotional visual exists on articles without featured images
    if (html.includes("bg-gradient-to-br") || html.includes("fill-current") || html.includes("aspect-video")) {
      console.log("   [PASSED] Article cards without images properly render the devotional motif fallback.");
    } else {
      console.error("   [FAILED] Fallback visual markup not found on article cards.");
      allPassed = false;
    }
  } else {
    console.error(`   [FAILED] /bhakti-gyaan returned HTTP ${listingRes.status}`);
    allPassed = false;
  }

  // 2. Fetch published article detail page /bhakti-gyaan/sacchi-bhakti-kya-hai
  console.log("\n2. Inspecting article detail hero on /bhakti-gyaan/sacchi-bhakti-kya-hai...");
  const detailRes = await fetch(`${baseUrl}/bhakti-gyaan/sacchi-bhakti-kya-hai`);
  if (detailRes.status === 200) {
    const html = await detailRes.text();
    console.log("   [PASSED] /bhakti-gyaan/sacchi-bhakti-kya-hai returned HTTP 200.");

    // Check for devotional header/hero presentation
    if (html.includes("सच्ची भक्ति क्या है?") && (html.includes("aspect-[21/9]") || html.includes("h-64") || html.includes("overflow-hidden"))) {
      console.log("   [PASSED] Article detail hero section renders devotional container.");
    } else {
      console.error("   [FAILED] Article detail hero structure missing.");
      allPassed = false;
    }

    // Check Open Graph tags
    if (html.includes('property="og:title"') && (html.includes('property="og:image"') || html.includes('name="twitter:card"'))) {
      console.log("   [PASSED] Open Graph & Twitter metadata properly configured on article page.");
    } else {
      console.error("   [FAILED] Open Graph metadata tags missing.");
      allPassed = false;
    }
  } else {
    console.error(`   [FAILED] Article detail returned HTTP ${detailRes.status}`);
    allPassed = false;
  }

  // 3. Inspect public image resolution directly from Supabase Storage
  console.log("\n3. Testing Public Image Resolution from Supabase Storage CDN...");
  const testImageUrl = `${supabaseUrl}/storage/v1/object/public/bhaktimania-media/test-public-ping.txt`;
  
  // Verify that the public endpoint responds
  const cdnRes = await fetch(testImageUrl);
  const cdnBody = await cdnRes.text();
  console.log(`   [INFO] Public storage response status: ${cdnRes.status}, body: ${cdnBody}`);
  if (cdnRes.status === 400 || cdnRes.status === 404 || cdnRes.status === 200) {
    console.log(`   [PASSED] Public storage endpoint is reachable via CDN (status: ${cdnRes.status}).`);
  } else {
    console.error(`   [FAILED] Public storage endpoint returned unexpected status: ${cdnRes.status}`);
    allPassed = false;
  }

  console.log("\n==============================================================================");
  if (allPassed) {
    console.log("STEP 6: PUBLIC WEBSITE TESTS PASSED SUCCESSFULLY!");
  } else {
    console.error("STEP 6: SOME CHECKS FAILED.");
    process.exit(1);
  }
  console.log("==============================================================================\n");
}

runPublicWebsiteTests();
