import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import {
  getPublishedArticles,
  getPublishedArticleBySlug,
} from "../lib/data/supabase";

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client with service role for admin operations (creating test draft, updating, deleting)
const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);

const BASE_URL = "http://localhost:3001";

const TEST_SLUG = "test-phase-h-lifecycle";

const CATEGORIES = [
  "bhagavad-gita",
  "bhakti-vichar",
  "festivals",
  "hanuman",
  "premanand-ji",
  "radha-krishna",
  "shiv",
  "vrindavan",
];

async function runE2E() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Full Phase H End-to-End Test Suite");
  console.log("==============================================================================\n");

  let passCount = 0;
  let failCount = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  [PASSED] ${msg}`);
      passCount++;
    } else {
      console.error(`  [FAILED] ${msg}`);
      failCount++;
    }
  }

  try {
    // 1. Existing 18 articles visible publicly
    console.log("Test 1: Existing 18 articles visible publicly");
    const initialArticles = await getPublishedArticles();
    assert(initialArticles.length === 18, `getPublishedArticles() returned exactly 18 articles (found: ${initialArticles.length})`);
    
    const resListing = await fetch(`${BASE_URL}/bhakti-gyaan`);
    assert(resListing.status === 200, `HTTP GET /bhakti-gyaan returned 200 OK`);
    const listingHtml = await resListing.text();
    assert(listingHtml.includes("कर्म योग क्या है?"), `Listing HTML contains known article title 'कर्म योग क्या है?'`);

    // Get an author and a category for the test article
    const { data: categoriesData } = await adminClient.from("categories").select("id, slug").eq("slug", "bhakti-vichar").single();
    const { data: authorsData } = await adminClient.from("authors").select("id").limit(1).single();
    const categoryId = categoriesData!.id;
    const authorId = authorsData?.id || null;

    // Clean up any leftovers first
    await adminClient.from("articles").delete().eq("slug", TEST_SLUG);

    // 2. Create a new draft in Admin
    console.log("\nTest 2: Create a new draft in Admin");
    const draftPayload = {
      title: "परीक्षण ड्राफ्ट लेख: भक्ति का मर्म",
      slug: TEST_SLUG,
      description: "यह केवल एंड-टू-एंड परीक्षण के लिए एक ड्राफ्ट लेख है।",
      category_id: categoryId,
      author_id: authorId,
      status: "draft",
      symbol: "दीप",
      read_time: "3 मिनट",
      featured: false,
      sections: [
        {
          heading: "भक्ति की शुरुआत",
          content: "भक्ति मन को शांति और आत्मा को दिव्यता प्रदान करती है।"
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: createdDraft, error: insertError } = await adminClient
      .from("articles")
      .insert([draftPayload])
      .select()
      .single();

    assert(!insertError && !!createdDraft, `Draft article inserted into Supabase (id: ${createdDraft?.id})`);

    // 3. Confirm draft is NOT publicly visible
    console.log("\nTest 3: Confirm draft is NOT publicly visible");
    const articlesAfterDraft = await getPublishedArticles();
    assert(
      !articlesAfterDraft.some((a) => a.slug === TEST_SLUG),
      `Draft article '${TEST_SLUG}' is NOT included in getPublishedArticles()`
    );

    const publicDraftQuery = await getPublishedArticleBySlug(TEST_SLUG);
    assert(publicDraftQuery === null, `getPublishedArticleBySlug('${TEST_SLUG}') returned null`);

    const resDraftPage = await fetch(`${BASE_URL}/bhakti-gyaan/${TEST_SLUG}`);
    assert(resDraftPage.status === 404, `HTTP GET /bhakti-gyaan/${TEST_SLUG} returned 404 Not Found (status: ${resDraftPage.status})`);

    // 4. Publish it
    console.log("\nTest 4: Publish the article");
    const nowIso = new Date().toISOString();
    const { error: publishError } = await adminClient
      .from("articles")
      .update({
        status: "published",
        published_at: nowIso,
        updated_at: nowIso,
      })
      .eq("slug", TEST_SLUG);

    assert(!publishError, `Article '${TEST_SLUG}' status updated to 'published' in Supabase`);

    // 5. Confirm it appears in /bhakti-gyaan
    console.log("\nTest 5: Confirm it appears in /bhakti-gyaan");
    const articlesAfterPublish = await getPublishedArticles();
    assert(
      articlesAfterPublish.some((a) => a.slug === TEST_SLUG),
      `Published article '${TEST_SLUG}' is now included in getPublishedArticles() (total: ${articlesAfterPublish.length})`
    );

    const resListingAfterPublish = await fetch(`${BASE_URL}/bhakti-gyaan`);
    const listingAfterPublishHtml = await resListingAfterPublish.text();
    assert(
      listingAfterPublishHtml.includes(TEST_SLUG),
      `Public /bhakti-gyaan HTML contains link to '${TEST_SLUG}'`
    );

    // 6. Confirm its new slug works directly
    console.log("\nTest 6: Confirm its new slug works directly");
    const resDetailPage = await fetch(`${BASE_URL}/bhakti-gyaan/${TEST_SLUG}`);
    assert(resDetailPage.status === 200, `HTTP GET /bhakti-gyaan/${TEST_SLUG} returned 200 OK`);
    const detailHtml = await resDetailPage.text();
    assert(
      detailHtml.includes("परीक्षण ड्राफ्ट लेख: भक्ति का मर्म"),
      `Article detail page HTML contains title 'परीक्षण ड्राफ्ट लेख: भक्ति का मर्म'`
    );

    // 7. Edit its title in Admin
    console.log("\nTest 7: Edit its title in Admin");
    const updatedTitle = "अद्यतित शीर्षक: जीवन में भक्ति का महत्व";
    const { error: updateTitleError } = await adminClient
      .from("articles")
      .update({
        title: updatedTitle,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", TEST_SLUG);

    assert(!updateTitleError, `Title updated in Supabase to '${updatedTitle}'`);

    // 8. Confirm public title changes
    console.log("\nTest 8: Confirm public title changes");
    const resUpdatedTitlePage = await fetch(`${BASE_URL}/bhakti-gyaan/${TEST_SLUG}`);
    const updatedTitleHtml = await resUpdatedTitlePage.text();
    assert(
      updatedTitleHtml.includes(updatedTitle),
      `Public article page reflects new title '${updatedTitle}'`
    );

    // 9. Edit its description
    console.log("\nTest 9: Edit its description in Admin");
    const updatedDesc = "अद्यतित विवरण: भक्ति ही जीवन का परम आश्रय और कल्याणकारी मार्ग है।";
    const { error: updateDescError } = await adminClient
      .from("articles")
      .update({
        description: updatedDesc,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", TEST_SLUG);

    assert(!updateDescError, `Description updated in Supabase to '${updatedDesc}'`);

    // 10. Confirm public description changes
    console.log("\nTest 10: Confirm public description changes");
    const resUpdatedDescPage = await fetch(`${BASE_URL}/bhakti-gyaan/${TEST_SLUG}`);
    const updatedDescHtml = await resUpdatedDescPage.text();
    assert(
      updatedDescHtml.includes(updatedDesc),
      `Public article page reflects new description`
    );

    // 11. Unpublish it
    console.log("\nTest 11: Unpublish it");
    const { error: unpublishError } = await adminClient
      .from("articles")
      .update({
        status: "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("slug", TEST_SLUG);

    assert(!unpublishError, `Article '${TEST_SLUG}' moved back to 'draft' in Supabase`);

    // 12. Confirm it disappears from public listing
    console.log("\nTest 12: Confirm it disappears from public listing");
    const articlesAfterUnpublish = await getPublishedArticles();
    assert(
      !articlesAfterUnpublish.some((a) => a.slug === TEST_SLUG),
      `Unpublished article is NO LONGER in getPublishedArticles() (count: ${articlesAfterUnpublish.length})`
    );

    const resListingAfterUnpublish = await fetch(`${BASE_URL}/bhakti-gyaan`);
    const listingAfterUnpublishHtml = await resListingAfterUnpublish.text();
    assert(
      !listingAfterUnpublishHtml.includes(TEST_SLUG),
      `Public /bhakti-gyaan HTML no longer contains '${TEST_SLUG}'`
    );

    // 13. Confirm its direct URL returns 404
    console.log("\nTest 13: Confirm its direct URL returns 404");
    const resUnpublishedDetailPage = await fetch(`${BASE_URL}/bhakti-gyaan/${TEST_SLUG}`);
    assert(
      resUnpublishedDetailPage.status === 404,
      `HTTP GET /bhakti-gyaan/${TEST_SLUG} returns 404 Not Found (status: ${resUnpublishedDetailPage.status})`
    );

    // 14. Delete the test draft
    console.log("\nTest 14: Delete the test draft");
    const { error: deleteError } = await adminClient
      .from("articles")
      .delete()
      .eq("slug", TEST_SLUG);

    assert(!deleteError, `Test article '${TEST_SLUG}' deleted from Supabase`);
    const remainingArticles = await getPublishedArticles();
    assert(remainingArticles.length === 18, `Database restored to exactly 18 published articles`);

    // 15. Verify all 8 categories
    console.log("\nTest 15: Verify all 8 categories");
    for (const catSlug of CATEGORIES) {
      const resCat = await fetch(`${BASE_URL}/${catSlug}`);
      assert(
        resCat.status === 200,
        `Category route '/${catSlug}' returns 200 OK`
      );
    }

    // 16. Verify sitemap
    console.log("\nTest 16: Verify sitemap");
    const resSitemap = await fetch(`${BASE_URL}/sitemap.xml`);
    assert(resSitemap.status === 200, `HTTP GET /sitemap.xml returns 200 OK`);
    const sitemapXml = await resSitemap.text();
    assert(sitemapXml.includes("<loc>https://bhaktimania.com</loc>"), `Sitemap contains homepage URL`);
    assert(sitemapXml.includes("<loc>https://bhaktimania.com/bhakti-gyaan</loc>"), `Sitemap contains /bhakti-gyaan`);
    assert(sitemapXml.includes("karma-yoga-kya-hai"), `Sitemap contains published article 'karma-yoga-kya-hai'`);
    assert(!sitemapXml.includes(TEST_SLUG), `Sitemap does NOT contain deleted/test slug`);

    // 17. Verify metadata and JSON-LD
    console.log("\nTest 17: Verify metadata and JSON-LD");
    const resArticleForSeo = await fetch(`${BASE_URL}/bhakti-gyaan/karma-yoga-kya-hai`);
    assert(resArticleForSeo.status === 200, `Fetched /bhakti-gyaan/karma-yoga-kya-hai for SEO audit`);
    const seoHtml = await resArticleForSeo.text();
    assert(seoHtml.includes("<title>कर्म योग क्या है? श्रीमद्भगवद्गीता की दृष्टि से सरल समझ | BhaktiMania</title>"), `HTML contains correct dynamic <title>`);
    assert(seoHtml.includes('name="description"'), `HTML contains <meta name="description">`);
    assert(seoHtml.includes('"@type":"Article"'), `HTML contains Article JSON-LD schema`);
    assert(seoHtml.includes('"@type":"BreadcrumbList"'), `HTML contains BreadcrumbList JSON-LD schema`);

    console.log("\n==============================================================================");
    console.log(`E2E Test Results: ${passCount} passed, ${failCount} failed.`);
    console.log("==============================================================================");
  } catch (err) {
    console.error("Fatal error during E2E testing:", err);
    process.exit(1);
  }
}

runE2E();
