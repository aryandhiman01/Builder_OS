"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../shared/Logo";
import AuthButtons from "./AuthButtons";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#workflow" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-2 sm:top-3 inset-x-0 z-50 px-3 sm:px-6 w-full max-w-full box-border"
      >
        <div
          className={`mx-auto max-w-6xl rounded-full transition-all duration-300 border border-white/[0.1] bg-[#0a0a0c]/90 backdrop-blur-xl px-2.5 sm:px-6 py-1.5 sm:py-2.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-1 sm:gap-3 ${
            scrolled ? "border-white/20 bg-[#09090b]/95 shadow-black" : ""
          }`}
        >
          {/* Left: Logo */}
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <Logo />

            {/* Center links */}
            <div className="hidden items-center gap-6 md:flex pl-4 border-l border-white/10">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                  className="relative text-xs md:text-sm text-[#9a9a9f] transition-colors duration-200 hover:text-white group font-medium"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-orange-400 transition-all duration-300 group-hover:w-full rounded-full" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right: Auth Profile Card + Mobile menu toggle */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="flex items-center gap-2 sm:gap-3 shrink-0"
          >
            <div>
              <AuthButtons />
            </div>

            {/* Mobile toggle button */}
            <button
              className="flex flex-col justify-center items-center h-8 w-8 rounded-lg border border-white/10 bg-white/[0.04] md:hidden p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-4 bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-1" : ""}`} />
              <span className={`block h-0.5 w-4 bg-current transition-all duration-300 my-0.5 ${mobileOpen ? "opacity-0 my-0" : ""}`} />
              <span className={`block h-0.5 w-4 bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-1" : ""}`} />
            </button>
          </motion.div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mx-auto mt-2 max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e]/95 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex flex-col gap-1 px-5 py-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 text-sm text-[#9a9a9f] hover:text-white transition-colors border-b border-white/[0.04] last:border-0 font-medium flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <span className="text-xs text-zinc-600">→</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}