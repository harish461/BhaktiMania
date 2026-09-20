import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "editor";

export interface AdminAuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  role: AppRole | null;
  error?: string;
}

/**
 * Authoritative server-side admin identity and authorization verifier.
 * 
 * Verifies:
 * 1. Supabase Auth session identity (via supabase.auth.getUser()).
 * 2. Role assignment against public.user_roles and the public.is_admin() SQL function.
 * 
 * Never trusts client headers or unverified metadata alone.
 */
export async function getCurrentAdmin(): Promise<AdminAuthResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        role: null,
        error: userError?.message,
      };
    }

    // 1. Check JWT app_metadata (if custom claims were injected)
    const jwtRole = user.app_metadata?.role as AppRole | undefined;
    if (jwtRole === "admin") {
      return {
        isAuthenticated: true,
        isAdmin: true,
        user,
        role: "admin",
      };
    }

    // 2. Query public.is_admin() PostgreSQL function (Phase C SECURITY DEFINER)
    const { data: rpcIsAdmin, error: rpcError } = await supabase.rpc("is_admin");
    if (!rpcError && rpcIsAdmin === true) {
      return {
        isAuthenticated: true,
        isAdmin: true,
        user,
        role: "admin",
      };
    }

    // 3. Directly query public.user_roles for this user under RLS
    const { data: roleRecords, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (roleError) {
      console.error("[lib/auth/admin] Error querying user_roles:", roleError);
    }

    const assignedRole = roleRecords?.find((r) => r.role === "admin")?.role as
      | AppRole
      | undefined;

    const fallbackRole = (roleRecords?.[0]?.role as AppRole | undefined) || null;

    if (assignedRole === "admin") {
      return {
        isAuthenticated: true,
        isAdmin: true,
        user,
        role: "admin",
      };
    }

    // User is authenticated, but does NOT hold the admin role
    return {
      isAuthenticated: true,
      isAdmin: false,
      user,
      role: fallbackRole,
    };
  } catch (err: unknown) {
    console.error("[lib/auth/admin] Unexpected error in getCurrentAdmin:", err);
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      role: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
