import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import {
  getAdminArticles,
  getAdminAuthors,
  isAuthorSlugUnique,
} from "../lib/data/supabase/admin";
import {
  createAuthorAction,
  updateAuthorAction,
  activateAuthorAction,
  deactivateAuthorAction,
} from "../app/admin/actions/authors";
import { validateAvatarUrl } from "../lib/validation/author";

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

async function testLivePhaseI5() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Phase I5 Live Verification (Security & Relational Integrity)");
  console.log("==============================================================================\n");

  let allPassed = true;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // 1. Anonymous User Mutation Rejection via Supabase API (Direct PostgREST)
  console.log("1. Testing Anonymous User Direct Mutation Rejection (RLS & Grants)...");
  const anonClient = createClient(supabaseUrl, supabaseAnonKey);

  // Attempt INSERT as anonymous
  const { data: insertData, error: anonInsertError } = await anonClient
    .from("authors")
    .insert({
      name: "Malicious Anon Author",
      slug: "malicious-anon-author",
      role: "Hacker",
      is_active: true,
    })
    .select();

  if (anonInsertError) {
    console.log(`   [PASSED] Anonymous INSERT strictly blocked by Supabase: ${anonInsertError.message}`);
  } else {
    console.error("   [FAILED] Anonymous user was able to insert an author!", insertData);
    allPassed = false;
  }

  // Attempt UPDATE as anonymous
  const { error: anonUpdateError } = await anonClient
    .from("authors")
    .update({ name: "Hacked Author Name" })
    .eq("slug", "editorial-team");

  if (anonUpdateError) {
    console.log(`   [PASSED] Anonymous UPDATE strictly blocked by Supabase: ${anonUpdateError.message}`);
  } else {
    // Check if row was actually updated
    const { data: checkData } = await anonClient
      .from("authors")
      .select("name")
      .eq("slug", "editorial-team")
      .single();

    if (checkData?.name === "BhaktiMania Editorial Team") {
      console.log(`   [PASSED] Anonymous UPDATE had 0 effect (RLS filtered rows).`);
    } else {
      console.error("   [FAILED] Anonymous user was able to mutate author name!", checkData);
      allPassed = false;
    }
  }

  // Attempt DELETE as anonymous
  const { error: anonDeleteError } = await anonClient
    .from("authors")
    .delete()
    .eq("slug", "editorial-team");

  if (anonDeleteError) {
    console.log(`   [PASSED] Anonymous DELETE strictly blocked by Supabase: ${anonDeleteError.message}`);
  } else {
    // Check if row was deleted
    const { data: checkData } = await anonClient
      .from("authors")
      .select("slug")
      .eq("slug", "editorial-team")
      .single();

    if (checkData) {
      console.log(`   [PASSED] Anonymous DELETE had 0 effect (RLS/Grant filtered rows).`);
    } else {
      console.error("   [FAILED] Anonymous user was able to delete author!", checkData);
      allPassed = false;
    }
  }

  // 2. Server Actions Security Guardrails (Unauthenticated / Non-Admin)
  console.log("\n2. Testing Server Actions Security Guardrails (Unauthenticated)...");
  const unauthCreate = await createAuthorAction({
    name: "Test Hacker",
    slug: "test-hacker",
    role: "Hacker",
    is_active: true,
  });
  if (!unauthCreate.success && unauthCreate.error?.includes("administrator")) {
    console.log("   [PASSED] createAuthorAction strictly blocked without admin session.");
  } else {
    console.error("   [FAILED] createAuthorAction did not block unauthenticated execution:", unauthCreate);
    allPassed = false;
  }

  const unauthUpdate = await updateAuthorAction("dummy-id", {
    name: "Test Hacker",
    slug: "test-hacker",
    role: "Hacker",
    is_active: true,
  });
  if (!unauthUpdate.success && unauthUpdate.error?.includes("administrator")) {
    console.log("   [PASSED] updateAuthorAction strictly blocked without admin session.");
  } else {
    console.error("   [FAILED] updateAuthorAction did not block unauthenticated execution:", unauthUpdate);
    allPassed = false;
  }

  const unauthActivate = await activateAuthorAction("dummy-id");
  if (!unauthActivate.success && unauthActivate.error?.includes("administrator")) {
    console.log("   [PASSED] activateAuthorAction strictly blocked without admin session.");
  } else {
    console.error("   [FAILED] activateAuthorAction did not block unauthenticated execution:", unauthActivate);
    allPassed = false;
  }

  const unauthDeactivate = await deactivateAuthorAction("dummy-id");
  if (!unauthDeactivate.success && unauthDeactivate.error?.includes("administrator")) {
    console.log("   [PASSED] deactivateAuthorAction strictly blocked without admin session.");
  } else {
    console.error("   [FAILED] deactivateAuthorAction did not block unauthenticated execution:", unauthDeactivate);
    allPassed = false;
  }

  // 3. Avatar URL Scheme Validation (Security Requirement 1)
  console.log("\n3. Testing Avatar URL Scheme Validation...");
  const validHttps = validateAvatarUrl("https://images.unsplash.com/photo-123.jpg");
  const validHttp = validateAvatarUrl("http://example.com/author.png");
  const emptyAvatar = validateAvatarUrl("");
  const nullAvatar = validateAvatarUrl(null);
  const rejectJavascript = validateAvatarUrl("javascript:alert(document.cookie)");
  const rejectData = validateAvatarUrl("data:text/html,<script>alert(1)</script>");
  const rejectFile = validateAvatarUrl("file:///etc/passwd");
  const rejectRelative = validateAvatarUrl("/images/author.png");

  if (
    validHttps.valid &&
    validHttp.valid &&
    emptyAvatar.valid &&
    nullAvatar.valid &&
    !rejectJavascript.valid &&
    !rejectData.valid &&
    !rejectFile.valid &&
    !rejectRelative.valid
  ) {
    console.log("   [PASSED] Avatar URL validator strictly enforces http/https only and rejects unsafe protocols.");
  } else {
    console.error("   [FAILED] Avatar URL validation failed security requirements:", {
      validHttps,
      validHttp,
      rejectJavascript,
      rejectData,
      rejectFile,
      rejectRelative,
    });
    allPassed = false;
  }

  // 4. Duplicate & Invalid Slug Handling
  console.log("\n4. Testing Duplicate and Invalid Slug Handling...");
  const isTaken = await isAuthorSlugUnique("editorial-team");
  if (!isTaken) {
    console.log("   [PASSED] Existing slug 'editorial-team' rejected as taken.");
  } else {
    console.error("   [FAILED] Slug uniqueness check failed for 'editorial-team'.");
    allPassed = false;
  }

  const isAvailable = await isAuthorSlugUnique("completely-unique-scholar-slug-9999");
  if (isAvailable) {
    console.log("   [PASSED] Unused slug correctly identified as available.");
  } else {
    console.error("   [FAILED] Available slug marked as taken.");
    allPassed = false;
  }

  // 5. Existing Article Relationships Intact (Requirement 2)
  console.log("\n5. Verifying Existing Article Relationships Intact...");
  const articles = await getAdminArticles();
  const authors = await getAdminAuthors();
  const editorial = authors.find((a) => a.slug === "editorial-team");

  if (editorial && editorial.articleCount === 18 && articles.length === 18) {
    console.log(`   [PASSED] All 18 articles remain linked to '${editorial.name}' via articles.author_id.`);
  } else {
    console.error("   [FAILED] Relational link check failed:", {
      editorialArticleCount: editorial?.articleCount,
      totalArticles: articles.length,
    });
    allPassed = false;
  }

  // 6. Zero Delete Capability Check
  console.log("\n6. Verifying Absence of Author Deletion Capability...");
  const actionExports = await import("../app/admin/actions/authors");
  if (!("deleteAuthorAction" in actionExports)) {
    console.log("   [PASSED] Zero author deletion action exported.");
  } else {
    console.error("   [FAILED] Author deletion action detected!");
    allPassed = false;
  }

  console.log("\n==============================================================================");
  if (allPassed) {
    console.log("ALL PHASE I5 LIVE VERIFICATION CHECKS PASSED!");
  } else {
    console.error("SOME PHASE I5 CHECKS FAILED!");
  }
  console.log("==============================================================================\n");

  if (!allPassed) {
    process.exit(1);
  }
}

testLivePhaseI5().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
