"use client";

import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

interface PageShellProps {
  badge?: string;
  title: string;
  highlightTitle?: string;
  description: string;
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PageShell({
  badge,
  title,
  highlightTitle,
  description,
  children,
  breadcrumbs = [],
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-orange-500/20 selection:text-orange-300 font-sans relative overflow-x-hidden">
      {/* Background Gradients & Grid */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hairline-x absolute inset-x-0 top-0" />
        <div className="glow-violet absolute -right-40 -top-40 h-[700px] w-[700px] opacity-40 blur-3xl" />
        <div className="glow-teal absolute -left-40 top-1/3 h-[600px] w-[600px] opacity-30 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      </div>

      {/* Navigation Navbar */}
      <Navbar />

      {/* Hero Header Section */}
      <div className="relative pt-36 pb-16 sm:pt-44 sm:pb-20 border-b border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <motion.nav
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-[#8a8a93]"
            >
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              {breadcrumbs.map((b, i) => (
                <React.Fragment key={i}>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  {b.href ? (
                    <Link href={b.href} className="hover:text-white transition-colors">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-white font-medium">{b.label}</span>
                  )}
                </React.Fragment>
              ))}
            </motion.nav>
          )}

          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-400 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {badge}
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight leading-[1.1]"
            style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.03em" }}
          >
            {title}{" "}
            {highlightTitle && (
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
                {highlightTitle}
              </span>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 max-w-3xl text-base sm:text-xl text-[#9a9a9f] leading-relaxed"
          >
            {description}
          </motion.p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {children}
      </main>

      {/* Global Landing Footer */}
      <Footer />
    </div>
  );
}
