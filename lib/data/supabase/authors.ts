import { createClient } from "@/lib/supabase/server";
import type { DatabaseAuthor } from "./types";

/**
 * Fetches all active authors from Supabase public.authors table.
 * Used for author selection in admin article management.
 */
export async function getAuthors(): Promise<DatabaseAuthor[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("authors")
    .select("id, slug, name, role, bio, avatar_url, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("[supabase/authors] Error fetching authors:", error);
    throw new Error(`Failed to fetch authors from Supabase: ${error.message}`);
  }

  return (data as DatabaseAuthor[]) || [];
}
