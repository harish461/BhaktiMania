import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Next.js 16 Request Proxy (formerly Middleware)
 * 
 * Responsible for:
 * 1. Request-level session cookie refreshing.
 * 2. Early redirect protection for all /admin/* routes.
 * 3. Keeping /admin/login publicly accessible while redirecting already-authenticated users.
 * 
 * Note: Authoritative role authorization is enforced server-side inside app/admin/layout.tsx.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept only /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Create an initial response object that Supabase can attach refreshed cookies to
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase environment is not configured, prevent access to protected admin routes
  if (!rawUrl || !supabaseAnonKey) {
    if (pathname !== "/admin/login") {
      return NextResponse.redirect(
        new URL("/admin/login?error=config_missing", request.url)
      );
    }
    return response;
  }

  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Optimistically retrieve authenticated user from session cookies
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = pathname === "/admin/login";

  // 1. Unauthenticated user attempting to access protected /admin routes
  if (!user && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin" && pathname !== "/admin/dashboard") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Already-authenticated user attempting to access /admin/login
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
