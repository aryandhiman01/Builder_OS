"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Search,
  FileText,
  Map,
  GitBranch,
  ClipboardList,
  Rocket,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Research Your Market",
    desc: "Describe your idea and let AI do the deep work. Competitor analysis, user personas, and market sizing — all generated in seconds.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    line: "from-violet-500/50",
  },
  {
    icon: FileText,
    number: "02",
    title: "Create Your PRD",
    desc: "Turn your research into a crystal-clear product requirements document. Define scope, goals, and user stories with AI assistance.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    line: "from-blue-500/50",
  },
  {
    icon: Map,
    number: "03",
    title: "Plan Your Roadmap",
    desc: "Visualize your product journey with AI-generated milestones, timelines, and sprint breakdowns tailored to your team size.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    line: "from-emerald-500/50",
  },
  {
    icon: GitBranch,
    number: "04",
    title: "Design Architecture",
    desc: "Get production-ready system architecture diagrams with component breakdowns, data flows, and technology recommendations.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    line: "from-amber-500/50",
  },
  {
    icon: ClipboardList,
    number: "05",
    title: "Track Your Tasks",
    desc: "Manage development tasks with prioritization, assignments, and sprint tracking — all linked to your product goals.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    line: "from-rose-500/50",
  },
  {
    icon: Rocket,
    number: "06",
    title: "Ship It",
    desc: "With everything documented, planned, and tracked — your team can focus on what matters: building and shipping.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    line: "from-indigo-500/50",
  },
];

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex gap-6 md:gap-10"
    >
      {/* Connector line + number */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${step.border} ${step.bg}`}
        >
          <Icon className={`h-6 w-6 ${step.color}`} />
        </div>
        {index < steps.length - 1 && (
          <div className={`mt-3 h-full w-px bg-gradient-to-b ${step.line} to-transparent`} />
        )}
      </div>

      {/* Content */}
      <div className="pb-12">
        <div className={`mb-1 text-xs font-semibold uppercase tracking-widest ${step.color}`}>
          Step {step.number}
        </div>
        <h3 className="mb-3 text-2xl font-semibold text-white" style={{ fontFamily: "var(--font-sora)" }}>
          {step.title}
        </h3>
        <p className="max-w-md text-base leading-relaxed text-zinc-400">{step.desc}</p>
      </div>
    </motion.div>
  );
}

export default function Workflow() {
  const sectionRef = useRef(null);
  const titleInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="workflow" className="relative py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-3xl" />
        <div className="absolute left-0 bottom-1/4 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-20 lg:grid-cols-2 lg:gap-24">
          {/* Left: Header */}
          <div ref={sectionRef} className="lg:sticky lg:top-32 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-zinc-400"
            >
              How it works
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl font-bold text-white md:text-6xl"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              From idea to{" "}
              <span className="bg-gradient-to-r from-zinc-300 to-zinc-600 bg-clip-text text-transparent">
                launch in 6 steps
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-zinc-400"
            >
              BuilderOS guides you through every stage of the product development
              lifecycle — from raw idea to shipped feature.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 grid grid-cols-2 gap-6"
            >
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <div className="text-3xl font-bold text-white">10x</div>
                <div className="mt-1 text-sm text-zinc-500">Faster planning</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="mt-1 text-sm text-zinc-500">AI-powered</div>
              </div>
            </motion.div>
          </div>

          {/* Right: Steps */}
          <div>
            {steps.map((step, i) => (
              <StepCard key={step.title} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
