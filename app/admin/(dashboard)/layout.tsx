import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative Server-Side Authorization Check
  const auth = await getCurrentAdmin();

  // 1. Unauthenticated -> Redirect to login
  if (!auth.isAuthenticated || !auth.user) {
    redirect("/admin/login");
  }

  // 2. Authenticated but NOT an admin -> Render Access Denied screen
  // Guardrail 8: Do NOT automatically sign them out.
  if (!auth.isAdmin) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-lg bg-white border border-red-200 rounded-2xl shadow-sm p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 text-red-700 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>

          <h1 className="text-2xl font-bold font-heading text-[#6B1724] mb-2">
            Access Denied
          </h1>

          <p className="text-sm text-[#5A6065] mb-4">
            You do not have permission to access the admin dashboard.
          </p>

          <div className="bg-[#FDFBF7] border border-[#6B1724]/10 rounded-xl p-3.5 mb-6 text-left">
            <p className="text-xs text-[#5A6065] mb-1">Verified Account:</p>
            <p className="text-sm font-mono font-medium text-[#1F2326]">
              {auth.user.email}
            </p>
            <p className="text-xs text-[#5A6065] mt-2">Assigned Role:</p>
            <span className="inline-block px-2 py-0.5 mt-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
              {auth.role || "None"}
            </span>
          </div>

          <p className="text-xs text-[#5A6065] mb-6">
            If you believe this is an error, please contact the primary administrator to assign the <code>admin</code> role to your account in <code>public.user_roles</code>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/admin/dashboard"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#6B1724] hover:bg-[#52111C] text-white text-sm font-medium rounded-xl transition-colors"
            >
              Return to Dashboard
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#6B1724]/20 text-[#6B1724] text-sm font-medium rounded-xl hover:bg-[#FDFBF7] transition-colors"
            >
              Return to Public Site
            </Link>

            <form action="/admin/auth/logout" method="POST" className="w-full sm:w-auto">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is confirmed Admin -> Render Admin Shell
  const navLinks = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Articles", href: "/admin/articles" },
    { label: "Create Article", href: "/admin/articles/new" },
    { label: "Categories", href: "/admin/categories" },
    { label: "Authors", href: "/admin/authors" },
    { label: "Settings", href: "/admin/dashboard#settings" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* Top Administrative Navigation Header */}
      <header className="bg-white border-b border-[#6B1724]/15 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3 shrink-0">
              <span
                className="w-9 h-9 rounded-full bg-[#FDFBF7] border border-[#D97706]/50 text-[#6B1724] font-bold flex items-center justify-center text-lg select-none"
                aria-hidden="true"
              >
                ॐ
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/dashboard"
                  className="font-heading font-bold text-lg text-[#6B1724] hover:text-[#52111C] transition-colors"
                >
                  BhaktiMania Admin
                </Link>
                <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  Administrator
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-1.5 text-xs font-medium text-[#1F2326] hover:text-[#6B1724] hover:bg-[#FDFBF7] rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Controls & Logout */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden lg:inline-block text-xs font-mono text-[#5A6065]">
                {auth.user.email}
              </span>

              <form action="/admin/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-xs px-3.5 py-1.5 rounded-lg border border-[#6B1724]/25 text-[#6B1724] hover:bg-[#6B1724] hover:text-white transition-colors font-medium cursor-pointer"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>

          {/* Mobile Navigation Row */}
          <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-gray-100 text-xs">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-2.5 py-1 text-xs whitespace-nowrap font-medium text-[#1F2326] hover:text-[#6B1724] rounded-md"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
