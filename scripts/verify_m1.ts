import * as fs from "fs";
import * as path from "path";
import robots from "../app/robots";
import sitemap from "../app/sitemap";

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

async function runM1Verification() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Phase M1 Launch & Monetization Foundation Verification");
  console.log("==============================================================================\n");

  let allPassed = true;

  try {
    // 1. Verify Public Legal and Information Routes Exist
    console.log("1. Checking required public legal and information pages...");
    const requiredPages = [
      "app/about/page.tsx",
      "app/contact/page.tsx",
      "app/privacy-policy/page.tsx",
      "app/terms/page.tsx",
      "app/disclaimer/page.tsx",
      "app/affiliate-disclosure/page.tsx",
    ];

    for (const pagePath of requiredPages) {
      const fullPath = path.resolve(process.cwd(), pagePath);
      if (fs.existsSync(fullPath)) {
        console.log(`   [PASSED] ${pagePath} exists.`);
      } else {
        console.error(`   [FAILED] Missing required page: ${pagePath}`);
        allPassed = false;
      }
    }

    // 2. Verify Footer Component and Required Navigation Links
    console.log("\n2. Auditing Footer component and required navigation links...");
    const footerPath = path.resolve(process.cwd(), "components/layout/Footer.tsx");
    if (fs.existsSync(footerPath)) {
      const footerContent = fs.readFileSync(footerPath, "utf-8");
      const requiredFooterLinks = [
        "/about",
        "/contact",
        "/privacy-policy",
        "/terms",
        "/disclaimer",
        "/affiliate-disclosure",
        "/radha-krishna",
        "/hanuman",
        "/shiv",
        "/bhagavad-gita",
        "/festivals",
      ];

      let footerLinksOk = true;
      for (const link of requiredFooterLinks) {
        if (!footerContent.includes(`href: "${link}"`) && !footerContent.includes(`href="${link}"`)) {
          console.error(`   [FAILED] Footer missing link: ${link}`);
          footerLinksOk = false;
          allPassed = false;
        }
      }
      if (footerLinksOk) {
        console.log("   [PASSED] Footer contains all required devotional and legal links.");
      }
    } else {
      console.error("   [FAILED] components/layout/Footer.tsx not found!");
      allPassed = false;
    }

    // 3. Verify Ad Infrastructure (Zero AdSense scripts, zero publisher IDs)
    console.log("\n3. Auditing Ad Infrastructure components (Strict Scope Control)...");
    const adFiles = [
      "components/ads/AdSlot.tsx",
      "components/ads/InArticleAd.tsx",
      "components/ads/SidebarAd.tsx",
    ];

    for (const adFile of adFiles) {
      const fullPath = path.resolve(process.cwd(), adFile);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        // Ensure no hardcoded publisher IDs or external script tags exist
        const hasHardcodedPub = /ca-pub-\d{8,}/.test(content);
        const hasExternalScript = content.includes("<script") || content.includes("pagead2.googlesyndication.com");
        if (hasHardcodedPub || hasExternalScript) {
          console.error(`   [FAILED] ${adFile} contains hardcoded publisher ID or direct script tag!`);
          allPassed = false;
        } else {
          console.log(`   [PASSED] ${adFile} is pure infrastructure with zero hardcoded publisher IDs or external script tags.`);
        }
      } else {
        console.error(`   [FAILED] Missing ad infrastructure file: ${adFile}`);
        allPassed = false;
      }
    }

    // 4. Verify Affiliate Infrastructure (Disclosure present, zero affiliate product links)
    console.log("\n4. Auditing Affiliate Infrastructure...");
    const affiliateFilePath = path.resolve(process.cwd(), "components/affiliate/AffiliateDisclosure.tsx");
    if (fs.existsSync(affiliateFilePath)) {
      const content = fs.readFileSync(affiliateFilePath, "utf-8");
      const requiredHindiPhrase = "इस पेज पर कुछ लिंक affiliate links हो सकते हैं";
      if (content.includes(requiredHindiPhrase)) {
        console.log("   [PASSED] AffiliateDisclosure.tsx contains standard disclosure text.");
      } else {
        console.error("   [FAILED] AffiliateDisclosure.tsx missing required Hindi disclosure text!");
        allPassed = false;
      }

      if (content.includes("amazon.com") || content.includes("amzn.to") || content.includes("tag=")) {
        console.error("   [FAILED] AffiliateDisclosure contains live affiliate/Amazon tracking tags!");
        allPassed = false;
      } else {
        console.log("   [PASSED] Affiliate component contains zero live affiliate/Amazon product links.");
      }
    } else {
      console.error("   [FAILED] components/affiliate/AffiliateDisclosure.tsx not found!");
      allPassed = false;
    }

    // 5. Verify Robots & Sitemap
    console.log("\n5. Auditing Robots & Sitemap configuration...");
    const robotsConfig = robots();
    const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
    if (rules && rules.disallow && (rules.disallow === "/admin/" || (Array.isArray(rules.disallow) && rules.disallow.includes("/admin/")))) {
      console.log("   [PASSED] robots.ts correctly disallows /admin/.");
    } else {
      console.error("   [FAILED] robots.ts does not disallow /admin/!");
      allPassed = false;
    }

    const sitemapEntries = await sitemap();
    const sitemapUrls = sitemapEntries.map((e) => e.url);
    const requiredSitemapPaths = [
      "/about",
      "/contact",
      "/privacy-policy",
      "/terms",
      "/disclaimer",
      "/affiliate-disclosure",
    ];

    let sitemapOk = true;
    for (const p of requiredSitemapPaths) {
      const match = sitemapUrls.some((u) => u.endsWith(p));
      if (!match) {
        console.error(`   [FAILED] sitemap.ts missing legal/info route: ${p}`);
        sitemapOk = false;
        allPassed = false;
      }
    }
    // Check no /admin paths in sitemap
    const adminInSitemap = sitemapUrls.some((u) => u.includes("/admin"));
    if (adminInSitemap) {
      console.error("   [FAILED] sitemap.ts erroneously contains /admin routes!");
      allPassed = false;
    } else if (sitemapOk) {
      console.log("   [PASSED] sitemap.ts includes all legal pages and excludes all /admin routes.");
    }

    // 6. Verify Absence of Service-Role Usage & Secret Leaks
    console.log("\n6. Checking zero service-role keys across public components...");
    const scanDirs = ["app", "components", "lib"];
    let secretLeakFound = false;

    function scanFiles(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanFiles(full);
        } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
          const content = fs.readFileSync(full, "utf-8");
          if (content.includes("SUPABASE_SERVICE_ROLE_KEY") || content.includes("service_role")) {
            console.error(`   [FAILED] Found service-role reference in ${full}`);
            secretLeakFound = true;
          }
        }
      }
    }

    for (const d of scanDirs) {
      scanFiles(path.resolve(process.cwd(), d));
    }

    if (!secretLeakFound) {
      console.log("   [PASSED] Zero service-role keys or credentials leaked across codebase.");
    } else {
      allPassed = false;
    }

    // 7. Verify Admin Architecture and Route Guard Integrity
    console.log("\n7. Verifying Admin route isolation...");
    const adminLayoutPath = path.resolve(process.cwd(), "app/admin/layout.tsx");
    const adminLayoutContent = fs.readFileSync(adminLayoutPath, "utf-8");
    if (adminLayoutContent.includes("Footer")) {
      console.error("   [FAILED] Footer is erroneously imported in app/admin/layout.tsx!");
      allPassed = false;
    } else {
      console.log("   [PASSED] Admin layout remains cleanly isolated from public Footer.");
    }

  } catch (err) {
    console.error("   [ERROR] Unexpected error during M1 audit:", err);
    allPassed = false;
  }

  console.log("\n------------------------------------------------------------------------------");
  if (allPassed) {
    console.log("PHASE M1 VERIFICATION RESULT: PASSED (100% of checks passed)");
    console.log("------------------------------------------------------------------------------");
    process.exit(0);
  } else {
    console.error("PHASE M1 VERIFICATION RESULT: FAILED");
    console.log("------------------------------------------------------------------------------");
    process.exit(1);
  }
}

runM1Verification();
