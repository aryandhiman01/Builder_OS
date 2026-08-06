"use client";

import PageShell from "@/components/shared/PageShell";
import { motion } from "framer-motion";
import { BrainCircuit, Cpu, ShieldCheck, Target, Users2, Zap, Rocket, Award } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Products Accelerated", val: "10,000+" },
    { label: "PRDs Generated", val: "150,000+" },
    { label: "Build Velocity Boost", val: "4.8x" },
    { label: "Global Builders", val: "45,000+" },
  ];

  const values = [
    {
      icon: Zap,
      title: "Velocity First",
      desc: "We eliminate non-essential administrative overhead so founders and product teams can ship at warp speed.",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: BrainCircuit,
      title: "AI as a Co-Pilot",
      desc: "Our AI model suite doesn't replace builders — it equips them with instant market research, spec drafting, and architecture diagrams.",
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Grade",
      desc: "Zero data compromises. Strict tenant isolation, SOC2 readiness, and short-lived secure JWT session management.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: Target,
      title: "Unified Source of Truth",
      desc: "No context switching between 5 disconnected tools. Research, specs, roadmaps, and execution live under one roof.",
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <PageShell
      badge="Company Philosophy"
      title="Empowering builders to ship"
      highlightTitle="10x faster."
      description="BuilderOS was created to eliminate the friction between product vision and execution. We build the operating system for modern software teams."
      breadcrumbs={[{ label: "Company" }, { label: "About" }]}
    >
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-center backdrop-blur-xl"
          >
            <div className="text-2xl sm:text-4xl font-extrabold text-white font-mono mb-1" style={{ fontFamily: "var(--font-sora)" }}>
              {s.val}
            </div>
            <div className="text-xs sm:text-sm text-[#8a8a93]">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Mission Section */}
      <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-black/60 p-8 sm:p-12 mb-16 backdrop-blur-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2 block">Our Mission</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-sora)" }}>
            Building software should feel like magic, not paperwork.
          </h2>
          <p className="text-sm sm:text-base text-[#9a9a9f] leading-relaxed mb-4">
            Traditional product development is bogged down by fragmented docs, outdated Jira tickets, manual competitor analysis, and static diagram drawing. 
          </p>
          <p className="text-sm sm:text-base text-[#9a9a9f] leading-relaxed">
            BuilderOS automates the busywork using domain-tailored AI models so engineering and product leads can focus strictly on strategic vision and shipping high-impact code.
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <div className="mb-16">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-sora)" }}>
          Our Core Principles
        </h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.15] transition-all"
              >
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${v.bg} mb-4`}>
                  <Icon className={`h-5 w-5 ${v.color}`} />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{v.title}</h4>
                <p className="text-xs sm:text-sm text-[#8a8a93] leading-relaxed">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
