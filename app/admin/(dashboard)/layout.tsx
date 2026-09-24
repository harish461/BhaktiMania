import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/admin";

import { AdminShell } from "@/components/admin/layout/AdminShell";

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
      <div
        className="min-h-screen bg-[#F7F7F6] flex flex-col justify-center items-center px-4 py-12"
        style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
      >
        <div className="w-full max-w-lg bg-white border border-red-200 rounded-2xl shadow-sm p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 text-red-700 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>

          <h1 className="text-2xl font-bold text-[#111827] mb-2">
            Access Denied
          </h1>

          <p className="text-sm text-[#6B7280] mb-4">
            You do not have permission to access the admin dashboard.
          </p>

          <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-3.5 mb-6 text-left">
            <p className="text-xs text-[#6B7280] mb-1">Verified Account:</p>
            <p className="text-sm font-mono font-medium text-[#111827]">
              {auth.user.email}
            </p>
            <p className="text-xs text-[#6B7280] mt-2">Assigned Role:</p>
            <span className="inline-block px-2 py-0.5 mt-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
              {auth.role || "None"}
            </span>
          </div>

          <p className="text-xs text-[#6B7280] mb-6">
            If you believe this is an error, please contact the primary administrator to assign the <code>admin</code> role to your account in <code>public.user_roles</code>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/admin/dashboard"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#C85A17] hover:bg-[#A8440B] text-white text-sm font-medium rounded-xl transition-colors"
            >
              Return to Dashboard
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-200 text-[#4B5563] hover:text-[#111827] text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
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

  // 3. User is confirmed Admin -> Render Modern SaaS Admin Shell
  return (
    <AdminShell userEmail={auth.user.email} userRole={auth.role}>
      {children}
    </AdminShell>
  );
}
