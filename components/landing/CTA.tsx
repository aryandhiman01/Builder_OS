"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const testimonials = [
  {
    quote:
      "BuilderOS cut our product planning time by 70%. We went from idea to documented PRD in under an hour.",
    name: "Sarah Chen",
    role: "Product Manager @ TechFlow",
    avatar: "SC",
  },
  {
    quote:
      "The architecture diagrams alone are worth it. What used to take my team a whole day now takes 10 minutes.",
    name: "Marcus Rivera",
    role: "CTO @ Launchpad",
    avatar: "MR",
  },
  {
    quote:
      "Finally, a tool that understands the full product development cycle. It's like having an extra senior PM.",
    name: "Priya Sharma",
    role: "Founder @ BuildScale",
    avatar: "PS",
  },
];

export default function CTA() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* Testimonials */}
      <section
        id="testimonials"
        className="relative py-24 scroll-mt-32 lg:scroll-mt-40"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div ref={testimonialsRef} className="mb-14 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-white md:text-5xl"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Loved by builders
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-zinc-400"
            >
              Join thousands of product teams moving faster with BuilderOS.
            </motion.p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-white/8 bg-white/[0.03] p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05]"
              >
                {/* Stars */}
                <div className="mb-5 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="h-4 w-4 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="mb-6 text-sm leading-relaxed text-zinc-300">"{t.quote}"</p>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-600/10 to-blue-600/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-6 text-center" ref={sectionRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Start building today
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-bold text-white md:text-7xl"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Your next product{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              starts here.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-8 max-w-lg text-lg text-zinc-400"
          >
            Join thousands of builders who use BuilderOS to go from idea to shipped
            product — faster than ever before.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="group rounded-xl bg-white px-8 text-black hover:bg-zinc-100 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-white/10 bg-white/[0.03] px-8 text-white backdrop-blur-xl hover:bg-white/[0.06]"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-sm text-zinc-600"
          >
            Free to start · No credit card required · Cancel anytime
          </motion.p>
        </div>
      </section>
    </>
  );
}
