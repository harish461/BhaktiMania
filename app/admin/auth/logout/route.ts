import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("[admin/auth/logout] Error during sign out:", err);
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl, { status: 303 });
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("[admin/auth/logout] Error during sign out:", err);
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl, { status: 303 });
}
