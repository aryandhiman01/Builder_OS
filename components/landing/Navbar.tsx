"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "../shared/Logo";
import AuthButtons from "./AuthButtons";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#workflow" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-6 left-1/2 z-50 w-[92%] max-w-7xl -translate-x-1/2"
    >
      <div
        className={`flex items-center justify-between rounded-full border px-8 py-4 backdrop-blur-xl transition-all duration-500 ${
          scrolled
            ? "border-white/10 bg-black/60 shadow-2xl shadow-black/40"
            : "border-white/[0.06] bg-white/[0.03]"
        }`}
      >
        <Logo />

        <div className="hidden items-center gap-10 text-sm text-zinc-400 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative transition-colors duration-200 hover:text-white group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <AuthButtons />
      </div>
    </motion.nav>
  );
}