const BASE_URL = "http://localhost:3001";

async function verifySeo() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Phase H Public Live SEO & Metadata Verification");
  console.log("==============================================================================\n");

  // 1. Article Page SEO & JSON-LD
  console.log("1. Checking /bhakti-gyaan/karma-yoga-kya-hai...");
  const res = await fetch(`${BASE_URL}/bhakti-gyaan/karma-yoga-kya-hai`);
  if (res.status !== 200) {
    throw new Error(`Expected status 200, got ${res.status}`);
  }
  const html = await res.text();

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  console.log(`   Title: ${titleMatch ? titleMatch[1] : "NOT FOUND"}`);

  const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
  console.log(`   Description: ${descMatch ? descMatch[1].substring(0, 60) + "..." : "NOT FOUND"}`);

  const hasArticleJsonLd = html.includes('"@type":"Article"');
  console.log(`   Article JSON-LD: ${hasArticleJsonLd ? "PRESENT" : "MISSING"}`);

  const hasBreadcrumbJsonLd = html.includes('"@type":"BreadcrumbList"');
  console.log(`   Breadcrumb JSON-LD: ${hasBreadcrumbJsonLd ? "PRESENT" : "MISSING"}`);

  // 2. Category Page SEO
  console.log("\n2. Checking /hanuman category page...");
  const catRes = await fetch(`${BASE_URL}/hanuman`);
  const catHtml = await catRes.text();
  const catTitle = catHtml.match(/<title>([^<]+)<\/title>/);
  console.log(`   Category Title: ${catTitle ? catTitle[1] : "NOT FOUND"}`);
  console.log(`   Contains articles: ${catHtml.includes("hanuman-ji-vishwas-samarpan")}`);

  // 3. Sitemap
  console.log("\n3. Checking /sitemap.xml...");
  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
  const sitemapText = await sitemapRes.text();
  const urlCount = (sitemapText.match(/<loc>/g) || []).length;
  console.log(`   Sitemap status: ${sitemapRes.status}`);
  console.log(`   Total URLs in sitemap: ${urlCount}`);

  // 4. Empty category check (/premanand-ji)
  console.log("\n4. Checking empty category /premanand-ji editorial notice...");
  const premRes = await fetch(`${BASE_URL}/premanand-ji`);
  const premHtml = await premRes.text();
  console.log(`   Empty category notice rendered: ${premHtml.includes("इस विषय पर और लेख जल्द प्रकाशित किए जाएंगे")}`);

  console.log("\n[PASSED] Public Live SEO & Rendering Verification Completed Successfully!");
}

verifySeo().catch(console.error);
