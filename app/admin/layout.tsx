import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "BhaktiMania Admin Portal — Protected Administrative Interface",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1F2326] flex flex-col font-body antialiased">
      {children}
    </div>
  );
}
