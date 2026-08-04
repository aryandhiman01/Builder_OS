"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#060606] text-white">
      {/* Background Grid & Separators */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Hairline top separator */}
        <div className="hairline-x absolute inset-x-0 top-0 opacity-50" />

        {/* Grid noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Fixed Sidebar Component (Self-contained State) */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Right Content Column (Independent Scroll Area) */}
      <div className="flex h-screen flex-1 flex-col overflow-hidden min-w-0">
        {/* Header */}
        <DashboardHeader onOpenMobileSidebar={() => setIsMobileOpen(true)} />

        {/* Main Independently Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}