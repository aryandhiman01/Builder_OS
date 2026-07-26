"use client";

import { motion, type Variants } from "framer-motion";
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

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-40">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-white/[0.02] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left: Text */}
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-zinc-400 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              AI-Powered Product Builder
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="max-w-2xl text-6xl font-bold leading-[1.08] tracking-tight text-white md:text-7xl"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Build products{" "}
              <span className="bg-gradient-to-r from-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                without wasting time.
              </span>
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
                <Button
                  size="lg"
                  className="group relative overflow-hidden rounded-xl bg-white text-black hover:bg-zinc-100 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Building
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>

              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-white/10 bg-white/[0.03] text-white backdrop-blur-xl hover:bg-white/[0.06] transition-all duration-300"
                >
                  Explore Features
                </Button>
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
                    <div
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-xs font-semibold text-white"
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <span>1,000+ builders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="h-3.5 w-3.5 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
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
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`group relative overflow-hidden rounded-3xl border ${card.border} bg-gradient-to-br ${card.gradient} p-7 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl ${card.glow}`}
                >
                  <div className="mb-4 inline-flex rounded-xl bg-white/5 p-2.5">
                    <Icon className="h-5 w-5 text-white/70" />
                  </div>
                  <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">
                    {card.label}
                  </p>
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-zinc-500">{card.desc}</p>

                  {/* Subtle shine on hover */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-white/5 to-transparent" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}