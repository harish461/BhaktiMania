"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminShellProps {
  userEmail?: string | null;
  userRole?: string | null;
  children: React.ReactNode;
}

export function AdminShell({ userEmail, userRole, children }: AdminShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex bg-[#F7F7F6] text-[#1F2937] antialiased"
      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
    >
      {/* ── 1. Desktop Fixed/Sticky Left Sidebar ── */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar userEmail={userEmail} userRole={userRole} />
      </div>

      {/* ── 2. Mobile Drawer Sidebar & Backdrop Overlay ── */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative z-50 flex flex-col h-full bg-white shadow-xl animate-in slide-in-from-left duration-200">
            <AdminSidebar
              userEmail={userEmail}
              userRole={userRole}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── 3. Main Content Column ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          userEmail={userEmail}
          userRole={userRole}
          onOpenMobile={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
