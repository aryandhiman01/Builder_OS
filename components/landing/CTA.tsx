"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Rocket, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const testimonials = [
  {
    quote: "BuilderOS cut our product planning time by 70%. We went from idea to documented PRD in under an hour.",
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow",
    avatar: "SC",
    accent: "#8B5CF6",
  },
  {
    quote: "The architecture diagrams alone are worth it. What used to take my team a whole day now takes 10 minutes.",
    name: "Marcus Rivera",
    role: "CTO",
    company: "Launchpad",
    avatar: "MR",
    accent: "#3B82F6",
  },
  {
    quote: "Finally, a tool that understands the full product development cycle. It's like having an extra senior PM.",
    name: "Priya Sharma",
    role: "Founder",
    company: "BuildScale",
    avatar: "PS",
    accent: "#10B981",
  },
  {
    quote: "From the first prompt to a full tech spec — BuilderOS makes me look like a 10x PM every single day.",
    name: "Jordan Kim",
    role: "Head of Product",
    company: "Nexus AI",
    avatar: "JK",
    accent: "#F59E0B",
  },
  {
    quote: "I used to dread sprint planning. Now I just use BuilderOS. The AI suggestions are genuinely brilliant.",
    name: "Alex Turner",
    role: "Engineering Manager",
    company: "Shipfast",
    avatar: "AT",
    accent: "#F43F5E",
  },
  {
    quote: "Incredible ROI. One month of BuilderOS Pro saved us at least 40 hours of senior PM work.",
    name: "Nadia Osei",
    role: "VP of Product",
    company: "Stackflow",
    avatar: "NO",
    accent: "#6366F1",
  },
];

/* ------------------------------------------------------------------ */
/* Auto-scrolling testimonial ticker                                     */
/* ------------------------------------------------------------------ */
function TestimonialTicker() {
  const doubled = [...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#060606] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#060606] to-transparent" />

      <motion.div
        animate={{ x: [0, -(testimonials.length * 376)] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex gap-4"
        style={{ width: "max-content" }}
      >
        {doubled.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="w-[360px] shrink-0 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-sm"
          >
            <div className="mb-4 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className="h-3.5 w-3.5 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="mb-5 text-sm leading-relaxed text-white/80">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: `${t.accent}30`, border: `1px solid ${t.accent}40` }}
              >
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-[#8a8a93]">{t.role} @ {t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main CTA Component                                                    */
/* ------------------------------------------------------------------ */
export default function CTA() {
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-80px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* ── Testimonials ── */}
      <section id="testimonials" className="relative py-24 overflow-hidden scroll-mt-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="hairline-x absolute inset-x-0 top-0" />
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div ref={testimonialsRef} className="mb-14 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-sm text-[#8a8a93]"
            >
              <Quote className="h-3.5 w-3.5 text-orange-400" />
              Real builders, real results
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold text-white md:text-5xl"
              style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.03em" }}
            >
              Loved by{" "}
              <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                builders
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-[#8a8a93]"
            >
              Join thousands of product teams moving faster with BuilderOS.
            </motion.p>
          </div>

          {/* Auto-scroll ticker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <TestimonialTicker />
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-36 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="hairline-x absolute inset-x-0 top-0" />
          {/* Central warm glow like Raycast CTA */}
          <div className="glow-orange absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-50" />
          <div className="glow-violet absolute right-0 top-0 h-[500px] w-[500px] opacity-40" />
          <div className="glow-teal absolute left-0 bottom-0 h-[400px] w-[400px] opacity-30" />
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center" ref={ctaRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs sm:text-sm text-orange-300 backdrop-blur-sm"
          >
            <Rocket className="h-3.5 w-3.5 text-orange-400 shrink-0" />
            Start building today — it's free
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-2xl min-[380px]:text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.08] tracking-[-0.035em] break-words"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Your next product{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-500 bg-clip-text text-transparent">
              starts here.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 sm:mt-8 max-w-lg text-base sm:text-lg text-[#8a8a93]"
          >
            Join thousands of builders who use BuilderOS to go from raw idea to shipped product — 10x faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-sm sm:max-w-none mx-auto"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="btn-shimmer group w-full sm:w-auto rounded-xl bg-white px-9 py-6 text-[16px] font-bold text-black hover:bg-zinc-100 transition-all duration-300 shadow-xl shadow-white/10"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl border-white/[0.12] bg-white/[0.04] px-9 py-6 text-[16px] text-white backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/25 transition-all duration-300 font-semibold"
                >
                  Sign In
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-[#8a8a93]"
          >
            <span>Free tier forever</span>
            <span className="h-1 w-1 rounded-full bg-current opacity-60" />
            <span>No credit card required</span>
            <span className="h-1 w-1 rounded-full bg-current opacity-60" />
            <span>Instant access</span>
          </motion.p>
        </div>
      </section>
    </>
  );
}
