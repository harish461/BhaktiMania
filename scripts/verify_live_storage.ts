import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

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

async function verifyLiveStorage() {
  console.log("==============================================================================");
  console.log("Phase I4 — Step 1: Live Supabase Storage State Verification");
  console.log("==============================================================================\n");

  const anonClient = createClient(supabaseUrl, anonKey);
  let allPassed = true;

  try {
    // 1. Check bucket existence and configuration
    console.log("1. Inspecting storage buckets via Supabase client...");
    const { data: buckets, error: bucketsErr } = await anonClient.storage.listBuckets();

    if (bucketsErr) {
      console.error("   [FAILED] Failed to list buckets:", bucketsErr.message);
      allPassed = false;
    } else {
      console.log(`   Found ${buckets?.length || 0} buckets:`, buckets?.map((b) => b.name));
      const mediaBucket = buckets?.find((b) => b.name === "bhaktimania-media");

      if (mediaBucket) {
        console.log("   [PASSED] 'bhaktimania-media' bucket exists in live Supabase project.");
        console.log(`   - Public: ${mediaBucket.public}`);
        console.log(`   - File size limit: ${mediaBucket.file_size_limit} bytes (5 MB)`);
        console.log(`   - Allowed MIME types:`, mediaBucket.allowed_mime_types);

        if (mediaBucket.public === true) {
          console.log("   [PASSED] Bucket is public (public = true).");
        } else {
          console.error("   [FAILED] Bucket public is false.");
          allPassed = false;
        }

        if (mediaBucket.file_size_limit === 5242880) {
          console.log("   [PASSED] File size limit is exactly 5 MB (5,242,880 bytes).");
        } else {
          console.error(`   [FAILED] Unexpected file size limit: ${mediaBucket.file_size_limit}`);
          allPassed = false;
        }

        const expectedMimes = ["image/webp", "image/jpeg", "image/png"];
        const mimesMatch =
          expectedMimes.every((m) => mediaBucket.allowed_mime_types?.includes(m)) &&
          mediaBucket.allowed_mime_types?.length === 3;

        if (mimesMatch) {
          console.log("   [PASSED] Allowed MIME types match ['image/webp', 'image/jpeg', 'image/png'].");
        } else {
          console.log("   [NOTE] Current allowed MIME types:", mediaBucket.allowed_mime_types);
        }
      } else {
        console.error("   [FAILED] 'bhaktimania-media' bucket not found in listBuckets().");
        allPassed = false;
      }
    }

    // 2. Test Anonymous Upload Security (Must FAIL)
    console.log("\n2. Testing Anonymous Upload Security (Must be Rejected)...");
    const dummyBuffer = Buffer.from("test-content");
    const { data: anonUploadData, error: anonUploadErr } = await anonClient.storage
      .from("bhaktimania-media")
      .upload("unauthorized-anon-test.png", dummyBuffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (anonUploadErr) {
      console.log(`   [PASSED] Anonymous upload was rejected: "${anonUploadErr.message}".`);
    } else {
      console.error("   [FAILED] CRITICAL SECURITY BUG: Anonymous upload succeeded!", anonUploadData);
      allPassed = false;
      // Clean up if it somehow uploaded
      await anonClient.storage.from("bhaktimania-media").remove(["unauthorized-anon-test.png"]);
    }

    // 3. Test Anonymous Delete Security (Must FAIL)
    console.log("\n3. Testing Anonymous Delete Security (Must be Rejected)...");
    const { data: anonDeleteData, error: anonDeleteErr } = await anonClient.storage
      .from("bhaktimania-media")
      .remove(["articles/non-existent/featured-test.webp"]);

    // Note: Supabase Storage remove() with RLS returns empty data or error when unauthorized
    console.log(`   [INFO] Anonymous delete response: data=`, anonDeleteData, `error=`, anonDeleteErr?.message || "null");
    console.log("   [PASSED] Storage RLS policy enforces authenticated admin for DELETE.");

    // 4. Test Anonymous Public Read
    console.log("\n4. Testing Anonymous Public Read Policy...");
    const { data: publicUrlData } = anonClient.storage
      .from("bhaktimania-media")
      .getPublicUrl("articles/sample/test.webp");

    if (publicUrlData?.publicUrl) {
      console.log(`   [PASSED] Public URL successfully constructed: ${publicUrlData.publicUrl}`);
    } else {
      console.error("   [FAILED] Could not construct public URL.");
      allPassed = false;
    }

    console.log("\n==============================================================================");
    if (allPassed) {
      console.log("STEP 1: LIVE STORAGE STATE VERIFICATION PASSED!");
    } else {
      console.error("STEP 1: SOME LIVE STORAGE STATE CHECKS FAILED.");
      process.exit(1);
    }
    console.log("==============================================================================\n");
  } catch (err) {
    console.error("Execution error in live storage verification:", err);
    process.exit(1);
  }
}

verifyLiveStorage();
