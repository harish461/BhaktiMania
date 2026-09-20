import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * PublicLayout — Standard layout wrapper for all public pages on BhaktiMania.
 * Provides sticky header, expandable main content container, and global footer.
 * Admin pages are completely isolated from this layout.
 */
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
