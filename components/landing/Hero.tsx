"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield, BarChart3 } from "lucide-react";
import Link from "next/link";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

// Word-by-word reveal for the headline
const headlineContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const headlineWord: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const cards = [
  {
    label: "AI Agent",
    title: "Smart",
    desc: "Product intelligence powered by AI.",
    icon: Sparkles,
    gradient: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    glow: "group-hover:shadow-violet-500/10",
  },
  {
    label: "Speed",
    title: "Fast",
    desc: "Generate PRDs in seconds.",
    icon: Zap,
    gradient: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/20",
    glow: "group-hover:shadow-amber-500/10",
  },
  {
    label: "Architecture",
    title: "Reliable",
    desc: "Production-ready system design.",
    icon: Shield,
    gradient: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/20",
    glow: "group-hover:shadow-cyan-500/10",
  },
  {
    label: "Planning",
    title: "Organized",
    desc: "Tasks, sprints and roadmaps.",
    icon: BarChart3,
    gradient: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
    glow: "group-hover:shadow-emerald-500/10",
  },
];

function Headline({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const words = text.split(" ");
  return (
    <motion.span
      variants={headlineContainer}
      initial="hidden"
      animate="visible"
      className={className}
      style={style}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={headlineWord} className="inline-block">
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: background orbs drift at different speeds as user scrolls
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbY3 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  // Content fades and lifts slightly as the section scrolls out of view
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden pt-40">
      {/* Background orbs — floating + parallax on scroll */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={{ y: orbY1 }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.02, 0.035, 0.02] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-white/[0.02] blur-3xl"
        />
        <motion.div
          style={{ y: orbY2 }}
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-3xl"
        />
        <motion.div
          style={{ y: orbY3 }}
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-3xl"
        />
      </div>

      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left: Text */}
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              whileHover={{ scale: 1.03, borderColor: "rgba(139,92,246,0.4)" }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-zinc-400 backdrop-blur-sm transition-colors"
            >
              <motion.span
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              </motion.span>
              AI-Powered Product Builder
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              className="max-w-2xl text-6xl font-bold leading-[1.08] tracking-tight text-white md:text-7xl"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              <Headline text="Build products" />
              <br />
              <motion.span
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-gradient-to-r from-zinc-400 to-zinc-600 bg-clip-text text-transparent bg-[length:200%_auto]"
                style={{ animation: "heroShimmer 6s ease-in-out infinite" }}
              >
                without wasting time.
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="mt-7 max-w-lg text-lg leading-relaxed text-zinc-400"
            >
              Research. Plan. Build. Ship.
              <br />
              <br />
              Everything you need to transform an idea into a successful
              product — in one intelligent workspace.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    className="group relative overflow-hidden rounded-xl bg-white text-black hover:bg-zinc-100 transition-all duration-300"
                  >
                    {/* shimmer sweep on hover */}
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative z-10 flex items-center gap-2">
                      Start Building
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </motion.div>
              </Link>

              <Link href="#features">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl border-white/10 bg-white/[0.03] text-white backdrop-blur-xl hover:bg-white/[0.06] transition-all duration-300"
                  >
                    Explore Features
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-12 flex items-center gap-8 text-sm text-zinc-500"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["A", "B", "C", "D"].map((l, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.6, x: -8 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.08, duration: 0.4, ease: "easeOut" }}
                      whileHover={{ y: -3, zIndex: 10 }}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-xs font-semibold text-white"
                    >
                      {l}
                    </motion.div>
                  ))}
                </div>
                <span>1,000+ builders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.svg
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -30 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 1.1 + i * 0.06, duration: 0.4, ease: "easeOut" }}
                      className="h-3.5 w-3.5 fill-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>
                <span>4.9/5 rating</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Cards */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="grid grid-cols-2 gap-4"
          >
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className={`group relative overflow-hidden rounded-3xl border ${card.border} bg-gradient-to-br ${card.gradient} p-7 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl ${card.glow}`}
                >
                  {/* gentle ambient float */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <motion.div
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4 inline-flex rounded-xl bg-white/5 p-2.5"
                    >
                      <Icon className="h-5 w-5 text-white/70" />
                    </motion.div>
                    <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">
                      {card.label}
                    </p>
                    <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                    <p className="mt-2 text-sm text-zinc-500">{card.desc}</p>
                  </motion.div>

                  {/* Subtle shine on hover */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-white/5 to-transparent" />
                  </div>

                  {/* Sweep shine on hover */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </motion.div>

      {/* Keyframes for headline shimmer */}
      <style>{`
        @keyframes heroShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
