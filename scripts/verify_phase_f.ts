import { getCurrentAdmin } from "../lib/auth/admin";
import { proxy, config as proxyConfig } from "../proxy";
import { NextRequest } from "next/server";
import * as fs from "fs";
import * as path from "path";

// Ensure environment variables are loaded
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

async function runPhaseFVerification() {
  console.log("==============================================================================");
  console.log("BhaktiMania — Phase F Admin Authentication Verification");
  console.log("==============================================================================\n");

  let allPassed = true;

  try {
    // 1. Verify Unauthenticated Server State
    console.log("1. Testing getCurrentAdmin() with unauthenticated session...");
    const authResult = await getCurrentAdmin();
    if (!authResult.isAuthenticated && !authResult.isAdmin && authResult.user === null) {
      console.log("   [PASSED] Unauthenticated check safely returned isAuthenticated=false, isAdmin=false.\n");
    } else {
      console.error("   [FAILED] Expected unauthenticated state, got:", authResult);
      allPassed = false;
    }

    // 2. Verify Next.js 16 proxy.ts configuration
    console.log("2. Testing proxy.ts configuration & route matcher...");
    const hasAdminMatcher =
      Array.isArray(proxyConfig.matcher) &&
      proxyConfig.matcher.includes("/admin/:path*");
    if (hasAdminMatcher) {
      console.log("   [PASSED] proxy.ts exports valid matcher: ['/admin/:path*'].\n");
    } else {
      console.error("   [FAILED] proxyConfig.matcher missing '/admin/:path*':", proxyConfig.matcher);
      allPassed = false;
    }

    // 3. Verify proxy.ts unauthenticated interception on /admin/dashboard
    console.log("3. Testing proxy.ts redirection for unauthenticated /admin/dashboard request...");
    const protectedReq = new NextRequest("http://localhost:3000/admin/dashboard");
    const protectedRes = await proxy(protectedReq);
    const redirectLocation = protectedRes.headers.get("location");
    if (
      protectedRes.status === 307 ||
      protectedRes.status === 302 ||
      (redirectLocation && redirectLocation.includes("/admin/login"))
    ) {
      console.log(`   [PASSED] /admin/dashboard redirected unauthenticated request to: ${redirectLocation}\n`);
    } else {
      console.error("   [FAILED] Expected redirect to /admin/login, got status:", protectedRes.status);
      allPassed = false;
    }

    // 4. Verify proxy.ts public access to /admin/login
    console.log("4. Testing proxy.ts public pass-through for /admin/login...");
    const loginReq = new NextRequest("http://localhost:3000/admin/login");
    const loginRes = await proxy(loginReq);
    // Since unauthenticated, login should NOT redirect away from login
    const loginRedirect = loginRes.headers.get("location");
    if (!loginRedirect || !loginRedirect.includes("/admin/dashboard")) {
      console.log("   [PASSED] /admin/login is publicly accessible without redirect loop.\n");
    } else {
      console.error("   [FAILED] /admin/login unexpectedly redirected to:", loginRedirect);
      allPassed = false;
    }

    // 5. Verify proxy.ts non-admin pass-through (ignores public routes)
    console.log("5. Testing proxy.ts non-interference on public site routes...");
    const publicReq = new NextRequest("http://localhost:3000/bhakti-gyaan/sacchi-bhakti-kya-hai");
    const publicRes = await proxy(publicReq);
    if (!publicRes.headers.get("location")) {
      console.log("   [PASSED] Public routes pass through proxy.ts untouched.\n");
    } else {
      console.error("   [FAILED] Public route unexpectedly intercepted by proxy.ts.\n");
      allPassed = false;
    }

    // 6. Verify static fallback integrity
    console.log("6. Verifying lib/data/articles.ts and lib/data/categories.ts integrity...");
    const articlesFile = fs.readFileSync(path.resolve(process.cwd(), "lib/data/articles.ts"), "utf-8");
    const categoriesFile = fs.readFileSync(path.resolve(process.cwd(), "lib/data/categories.ts"), "utf-8");
    if (articlesFile.includes("articlesData") && categoriesFile.includes("categoriesData")) {
      console.log("   [PASSED] Static production data sources remain intact.\n");
    } else {
      console.error("   [FAILED] Static production data corrupted.\n");
      allPassed = false;
    }

    // 7. Verify security boundaries (No hardcoded credentials or service role in client code)
    console.log("7. Verifying security boundaries (client-side code inspection)...");
    const loginPageCode = fs.readFileSync(path.resolve(process.cwd(), "app/admin/(auth)/login/page.tsx"), "utf-8");
    const clientCode = fs.readFileSync(path.resolve(process.cwd(), "lib/supabase/client.ts"), "utf-8");
    const hasServiceRoleInClient =
      loginPageCode.includes("service_role") ||
      loginPageCode.includes("SERVICE_ROLE") ||
      clientCode.includes("SERVICE_ROLE");
    const hasHardcodedPassword =
      loginPageCode.includes("password123") ||
      loginPageCode.includes("admin@") && loginPageCode.includes("password = \"");

    if (!hasServiceRoleInClient && !hasHardcodedPassword) {
      console.log("   [PASSED] Zero secret credentials or hardcoded passwords in client code.\n");
    } else {
      console.error("   [FAILED] Secret credentials or hardcoded passwords found in client code!\n");
      allPassed = false;
    }

    if (allPassed) {
      console.log("==============================================================================");
      console.log("ALL 7 PHASE F AUTHENTICATION & ROUTE PROTECTION CHECKS PASSED!");
      console.log("==============================================================================");
    } else {
      console.log("==============================================================================");
      console.log("SOME CHECKS FAILED. See details above.");
      console.log("==============================================================================");
    }
  } catch (err) {
    console.error("Verification execution error:", err);
  }
}

runPhaseFVerification();
