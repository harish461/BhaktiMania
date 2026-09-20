"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [unauthorizedUser, setUnauthorizedUser] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setUnauthorizedUser(null);

    // Client-side Validation
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address (e.g. admin@bhaktimania.com).");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // 1. Authenticate with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (signInError) {
        setIsLoading(false);
        if (
          signInError.message.toLowerCase().includes("invalid login credentials") ||
          signInError.message.toLowerCase().includes("invalid_grant")
        ) {
          setErrorMessage("Invalid email or password");
        } else {
          setErrorMessage(`Sign in failed: ${signInError.message}`);
        }
        return;
      }

      if (!data.user) {
        setIsLoading(false);
        setErrorMessage("Unable to retrieve user information.");
        return;
      }

      // 2. Authoritative Role Verification using existing Phase C authorization model
      // Check JWT metadata first
      let isAdmin = data.user.app_metadata?.role === "admin";

      // Query public.is_admin() RPC function
      if (!isAdmin) {
        const { data: isRpcAdmin, error: rpcError } = await supabase.rpc("is_admin");
        if (!rpcError && isRpcAdmin === true) {
          isAdmin = true;
        }
      }

      // Query public.user_roles table directly under RLS
      if (!isAdmin) {
        const { data: roleRecords } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);

        if (roleRecords && roleRecords.some((r: { role: string }) => r.role === "admin")) {
          isAdmin = true;
        }
      }

      // 3. Authorization Decision
      if (isAdmin) {
        setSuccessMessage("Authentication successful! Redirecting to dashboard...");
        // Read redirect parameter if present
        const searchParams = new URLSearchParams(window.location.search);
        const destination = searchParams.get("redirect") || "/admin/dashboard";

        setTimeout(() => {
          router.push(destination);
          router.refresh();
        }, 600);
      } else {
        // Authenticated, but does NOT have admin role (Guardrail 8: Do not automatically sign out)
        setIsLoading(false);
        setUnauthorizedUser(data.user.email || cleanEmail);
        setErrorMessage("You must be an administrator to access this area");
      }
    } catch (err: unknown) {
      setIsLoading(false);
      console.error("[admin/login] Unexpected login error:", err);
      setErrorMessage(
        "An unexpected error occurred while connecting to the server. Please check your Supabase credentials."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#FDFBF7] relative overflow-hidden">
      {/* Devotional Background Decoration */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#6B1724_0.75px,transparent_0.75px)] [background-size:24px_24px]"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6B1724] hover:text-[#52111C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] rounded-md px-1.5 py-0.5"
          >
            <span>←</span>
            <span>Back to BhaktiMania Public Site</span>
          </Link>
        </div>

        {/* Card Container */}
        <div className="bg-white border border-[#6B1724]/15 shadow-md rounded-2xl p-7 sm:p-9">
          {/* Header & Emblem */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FDFBF7] border-2 border-[#D97706]/40 shadow-inner mb-3.5">
              <span className="text-2xl select-none text-[#6B1724]" aria-hidden="true">
                ॐ
              </span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-[#6B1724] tracking-tight">
              Admin Login
            </h1>
            <p className="text-sm text-[#5A6065] mt-1.5">
              BhaktiMania Secure Administrative Access
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3"
            >
              <svg
                className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <p className="font-medium">{errorMessage}</p>
                {unauthorizedUser && (
                  <p className="text-xs text-red-700 mt-1.5">
                    Verified Account: <span className="font-mono">{unauthorizedUser}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-3"
            >
              <svg
                className="w-5 h-5 text-green-600 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="font-medium">{successMessage}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold text-[#1F2326] mb-1.5"
              >
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bhaktimania.com"
                aria-describedby="email-hint"
                className="w-full px-3.5 py-2.5 bg-white border border-[#6B1724]/25 rounded-xl text-[#1F2326] placeholder-[#5A6065]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] transition-colors disabled:opacity-50 disabled:bg-gray-50"
              />
              <p id="email-hint" className="sr-only">
                Enter your authorized administrator email address
              </p>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-semibold text-[#1F2326]"
                >
                  Password <span className="text-red-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#6B1724] hover:text-[#52111C] font-medium focus:outline-none focus:ring-1 focus:ring-[#D97706] rounded px-1 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#6B1724]/25 rounded-xl text-[#1F2326] placeholder-[#5A6065]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] transition-colors disabled:opacity-50 disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#6B1724] hover:bg-[#52111C] text-white font-medium text-sm rounded-xl shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D97706] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-5 border-t border-[#6B1724]/10 text-center">
            <p className="text-xs text-[#5A6065]">
              This area is restricted to authorized editors and administrators. Unauthorized access attempts are monitored and logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
