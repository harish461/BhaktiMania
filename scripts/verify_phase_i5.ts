import * as fs from "fs";
import * as path from "path";
import {
  getAdminArticles,
  getAdminAuthors,
  getAllAuthorsForEditor,
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

async function verifyPhaseI5() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Phase I5 Admin Author Management Verification");
  console.log("==============================================================================\n");

  let allPassed = true;

  try {
    // 1. Verify Expected Production Author Catalog
    console.log("1. Verifying Production Author Catalog in Supabase...");
    const authors = await getAdminAuthors();
    console.log(`   Found ${authors.length} author(s) in database.`);

    const editorialTeam = authors.find((a) => a.slug === "editorial-team");
    if (editorialTeam) {
      console.log(`   [PASSED] Production author 'editorial-team' exists.`);
      console.log(`   - Name: ${editorialTeam.name}`);
      console.log(`   - Role: ${editorialTeam.role}`);
      console.log(`   - Active: ${editorialTeam.is_active}`);
      console.log(`   - Article Count: ${editorialTeam.articleCount}`);

      if (editorialTeam.articleCount === 18) {
        console.log(`   [PASSED] 'editorial-team' is linked to exactly 18 articles.`);
      } else {
        console.warn(`   [NOTE] 'editorial-team' linked to ${editorialTeam.articleCount} articles.`);
      }
    } else {
      console.error(`   [FAILED] Expected production author 'editorial-team' not found!`);
      allPassed = false;
    }

    // 2. Verify 18 Production Articles and Relationships Intact
    console.log("\n2. Verifying 18 Production Articles and Relational Integrity...");
    const articles = await getAdminArticles();
    if (articles.length === 18) {
      console.log(`   [PASSED] Exactly 18 production articles exist in database.`);
    } else {
      console.error(`   [FAILED] Expected 18 articles, found ${articles.length}`);
      allPassed = false;
    }

    // Verify zero test articles
    const testArticles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes("test") ||
        a.slug.toLowerCase().includes("test")
    );
    if (testArticles.length === 0) {
      console.log(`   [PASSED] Zero test articles found in the database.`);
    } else {
      console.error(`   [FAILED] Test articles detected:`, testArticles.map((a) => a.slug));
      allPassed = false;
    }

    // 3. Test Author Slug Validation & Uniqueness
    console.log("\n3. Testing Author Slug Validation & Uniqueness Rules...");
    const isEditorialTaken = await isAuthorSlugUnique("editorial-team");
    if (!isEditorialTaken) {
      console.log(`   [PASSED] Existing slug 'editorial-team' correctly identified as taken.`);
    } else {
      console.error(`   [FAILED] Existing slug was reported as available!`);
      allPassed = false;
    }

    const isAvailableUnique = await isAuthorSlugUnique("non-existent-scholar-slug-999");
    if (isAvailableUnique) {
      console.log(`   [PASSED] Unused slug correctly identified as available.`);
    } else {
      console.error(`   [FAILED] Unused slug was reported as taken!`);
      allPassed = false;
    }

    if (editorialTeam) {
      const selfCheck = await isAuthorSlugUnique("editorial-team", editorialTeam.id);
      if (selfCheck) {
        console.log(`   [PASSED] Author's own slug correctly permitted during edit (self-exclusion).`);
      } else {
        console.error(`   [FAILED] Self-exclusion failed during slug check!`);
        allPassed = false;
      }
    }

    // 4. Test Avatar URL Validation (Security Check)
    console.log("\n4. Testing Avatar URL Scheme Validation (Security)...");
    const validHttps = validateAvatarUrl("https://example.com/avatar.jpg");
    const validHttp = validateAvatarUrl("http://example.com/avatar.png");
    const emptyAvatar = validateAvatarUrl("");
    const nullAvatar = validateAvatarUrl(null);
    const badJs = validateAvatarUrl("javascript:alert(1)");
    const badData = validateAvatarUrl("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==");
    const badFile = validateAvatarUrl("file:///etc/passwd");
    const malformed = validateAvatarUrl("not-a-valid-url");

    if (
      validHttps.valid &&
      validHttp.valid &&
      emptyAvatar.valid &&
      nullAvatar.valid &&
      !badJs.valid &&
      !badData.valid &&
      !badFile.valid &&
      !malformed.valid
    ) {
      console.log(`   [PASSED] Avatar URL validator strictly accepts http/https and rejects unsafe schemes (javascript:, data:, file:).`);
    } else {
      console.error(`   [FAILED] Avatar URL validation failed security check!`, {
        validHttps,
        validHttp,
        badJs,
        badData,
        badFile,
        malformed,
      });
      allPassed = false;
    }

    // 5. Test Editor Authors Query: getAllAuthorsForEditor()
    console.log("\n5. Testing getAllAuthorsForEditor() for Editor Inactive Support...");
    const editorAuthors = await getAllAuthorsForEditor();
    if (editorAuthors.length >= 1) {
      console.log(`   [PASSED] getAllAuthorsForEditor() returned ${editorAuthors.length} authors.`);
    } else {
      console.error(`   [FAILED] getAllAuthorsForEditor() returned empty array.`);
      allPassed = false;
    }

    // 6. Verify Server Actions Authorization (Unauthenticated / Non-Admin Rejection)
    console.log("\n6. Testing Server Actions Security Guardrails...");
    const unauthCreate = await createAuthorAction({
      name: "Unauthenticated Test",
      slug: "unauth-test",
      role: "Test",
      is_active: true,
    });

    if (!unauthCreate.success && unauthCreate.error?.includes("administrator")) {
      console.log(`   [PASSED] createAuthorAction strictly rejected unauthenticated execution.`);
    } else {
      console.error(`   [FAILED] createAuthorAction did not reject unauthorized caller:`, unauthCreate);
      allPassed = false;
    }

    const unauthUpdate = await updateAuthorAction("dummy-id", {
      name: "Unauthenticated Test",
      slug: "unauth-test",
      role: "Test",
      is_active: true,
    });

    if (!unauthUpdate.success && unauthUpdate.error?.includes("administrator")) {
      console.log(`   [PASSED] updateAuthorAction strictly rejected unauthenticated execution.`);
    } else {
      console.error(`   [FAILED] updateAuthorAction did not reject unauthorized caller:`, unauthUpdate);
      allPassed = false;
    }

    const unauthActivate = await activateAuthorAction("dummy-id");
    const unauthDeactivate = await deactivateAuthorAction("dummy-id");

    if (
      !unauthActivate.success && unauthActivate.error?.includes("administrator") &&
      !unauthDeactivate.success && unauthDeactivate.error?.includes("administrator")
    ) {
      console.log(`   [PASSED] activateAuthorAction & deactivateAuthorAction strictly rejected unauthenticated execution.`);
    } else {
      console.error(`   [FAILED] Activate/Deactivate actions did not reject unauthorized caller!`);
      allPassed = false;
    }

    // 7. Verify Author Deletion is Strictly Unavailable
    console.log("\n7. Verifying Absence of Author Deletion (Relational Safety)...");
    const authorActionsModule = await import("../app/admin/actions/authors");
    if (!("deleteAuthorAction" in authorActionsModule)) {
      console.log(`   [PASSED] No deleteAuthorAction exported from actions/authors.ts.`);
    } else {
      console.error(`   [FAILED] Dangerous deleteAuthorAction found in actions/authors.ts!`);
      allPassed = false;
    }

    // 8. Verify Migration File Exists and Contains Minimum Required Privileges
    console.log("\n8. Verifying Migration File & Least-Privilege Grants...");
    const migrationPath = path.resolve(
      process.cwd(),
      "supabase/migrations/20260320000008_phase_i5_authors_grant.sql"
    );

    if (fs.existsSync(migrationPath)) {
      const sqlContent = fs.readFileSync(migrationPath, "utf-8");
      const hasInsertUpdate = /GRANT\s+INSERT\s*,\s*UPDATE\s+ON\s+public\.authors\s+TO\s+authenticated/i.test(sqlContent);

      if (hasInsertUpdate) {
        console.log(`   [PASSED] Migration 20260320000008_phase_i5_authors_grant.sql contains GRANT INSERT, UPDATE.`);
      } else {
        console.error(`   [FAILED] Migration missing expected GRANT INSERT, UPDATE.`);
        allPassed = false;
      }

      // Check that DELETE is not granted
      const hasGrantDelete = /GRANT.*DELETE.*ON.*authors/i.test(sqlContent);
      if (!hasGrantDelete) {
        console.log(`   [PASSED] Migration strictly omits DELETE privilege on public.authors.`);
      } else {
        console.error(`   [FAILED] Migration grants DELETE privilege on public.authors!`);
        allPassed = false;
      }
    } else {
      console.error(`   [FAILED] Migration file not found: ${migrationPath}`);
      allPassed = false;
    }

    // 9. Verify Phase I5 Components on Disk
    console.log("\n9. Verifying Phase I5 Components on Disk...");
    const expectedFiles = [
      "components/admin/authors/AuthorListHeader.tsx",
      "components/admin/authors/AuthorStats.tsx",
      "components/admin/authors/AuthorFilters.tsx",
      "components/admin/authors/AuthorStatusBadge.tsx",
      "components/admin/authors/AuthorActionMenu.tsx",
      "components/admin/authors/AuthorTable.tsx",
      "components/admin/authors/AuthorTableRow.tsx",
      "components/admin/authors/AuthorMobileCard.tsx",
      "components/admin/authors/AuthorEmptyState.tsx",
      "components/admin/authors/AuthorDeactivateModal.tsx",
      "components/admin/authors/AuthorForm.tsx",
      "components/admin/authors/AuthorListClient.tsx",
      "app/admin/(dashboard)/authors/page.tsx",
      "app/admin/(dashboard)/authors/new/page.tsx",
      "app/admin/(dashboard)/authors/[id]/edit/page.tsx",
      "app/admin/actions/authors.ts",
      "supabase/migrations/20260320000008_phase_i5_authors_grant.sql",
    ];

    let allFilesFound = true;
    for (const f of expectedFiles) {
      const p = path.resolve(process.cwd(), f);
      if (!fs.existsSync(p)) {
        console.error(`   [FAILED] Missing file: ${f}`);
        allFilesFound = false;
        allPassed = false;
      }
    }

    if (allFilesFound) {
      console.log(`   [PASSED] All ${expectedFiles.length} Phase I5 components and files exist on disk.`);
    }

    console.log("\n==============================================================================");
    if (allPassed) {
      console.log("ALL PHASE I5 AUTHOR MANAGEMENT VERIFICATION CHECKS PASSED!");
    } else {
      console.error("SOME PHASE I5 VERIFICATION CHECKS FAILED.");
      process.exit(1);
    }
    console.log("==============================================================================\n");
  } catch (err) {
    console.error("Execution error in Phase I5 verification:", err);
    process.exit(1);
  }
}

verifyPhaseI5();
