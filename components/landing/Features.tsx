"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import {
  FileText,
  Map,
  GitBranch,
  Cpu,
  ClipboardList,
  BrainCircuit,
  Layers,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Feature data                                                          */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: BrainCircuit,
    title: "AI Research Engine",
    shortDesc: "Deep-dive market research in seconds.",
    desc: "Describe your idea and let AI do the deep work. Competitive analysis, user personas, market sizing, and SWOT — generated in seconds from a single prompt.",
    tag: "Research",
    accent: "#8B5CF6",
    accentBg: "rgba(139,92,246,0.08)",
    accentBorder: "rgba(139,92,246,0.25)",
    bullets: [
      "Competitor landscape mapping",
      "User persona generation",
      "Market sizing estimates",
      "SWOT analysis in one click",
    ],
    previewLines: [
      { w: "70%", c: "bg-violet-400/40" },
      { w: "55%", c: "bg-violet-400/25" },
      { w: "80%", c: "bg-white/10" },
      { w: "40%", c: "bg-white/10" },
    ],
  },
  {
    icon: FileText,
    title: "PRD Generator",
    shortDesc: "Complete PRDs from rough ideas.",
    desc: "Transform rough ideas into complete, structured Product Requirements Documents. Define scope, goals, user stories, and acceptance criteria with AI precision.",
    tag: "Documents",
    accent: "#3B82F6",
    accentBg: "rgba(59,130,246,0.08)",
    accentBorder: "rgba(59,130,246,0.25)",
    bullets: [
      "Structured user story generation",
      "Acceptance criteria auto-fill",
      "Edge case identification",
      "Stakeholder-ready export",
    ],
    previewLines: [
      { w: "85%", c: "bg-blue-400/40" },
      { w: "60%", c: "bg-blue-400/25" },
      { w: "75%", c: "bg-white/10" },
      { w: "50%", c: "bg-white/10" },
    ],
  },
  {
    icon: Map,
    title: "Roadmap Builder",
    shortDesc: "Visual roadmap with AI milestones.",
    desc: "Visualize your product roadmap with AI-suggested milestones, timelines, and sprint breakdowns — tailored to your team size and velocity.",
    tag: "Planning",
    accent: "#10B981",
    accentBg: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.25)",
    bullets: [
      "AI-generated milestone suggestions",
      "Drag-and-drop timeline",
      "Sprint breakdown automation",
      "Dependency visualization",
    ],
    previewLines: [
      { w: "65%", c: "bg-emerald-400/40" },
      { w: "90%", c: "bg-emerald-400/25" },
      { w: "45%", c: "bg-white/10" },
      { w: "70%", c: "bg-white/10" },
    ],
  },
  {
    icon: GitBranch,
    title: "Architecture Diagrams",
    shortDesc: "Production-ready system designs.",
    desc: "Generate production-ready system architecture diagrams in Mermaid.js with detailed component breakdowns, data flows, and technology recommendations.",
    tag: "Architecture",
    accent: "#F59E0B",
    accentBg: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.25)",
    bullets: [
      "Mermaid.js diagram output",
      "Component breakdown",
      "Data flow visualization",
      "Tech stack recommendations",
    ],
    previewLines: [
      { w: "75%", c: "bg-amber-400/40" },
      { w: "50%", c: "bg-amber-400/25" },
      { w: "80%", c: "bg-white/10" },
      { w: "35%", c: "bg-white/10" },
    ],
  },
  {
    icon: ClipboardList,
    title: "Task Management",
    shortDesc: "Actionable tasks with priorities.",
    desc: "Break down your product into actionable tasks with priorities, owners, and status tracking — all linked to your product goals and sprint cycles.",
    tag: "Execution",
    accent: "#F43F5E",
    accentBg: "rgba(244,63,94,0.08)",
    accentBorder: "rgba(244,63,94,0.25)",
    bullets: [
      "Priority-based task queues",
      "Assignee & deadline tracking",
      "Goal linkage per task",
      "Sprint board view",
    ],
    previewLines: [
      { w: "60%", c: "bg-rose-400/40" },
      { w: "80%", c: "bg-rose-400/25" },
      { w: "55%", c: "bg-white/10" },
      { w: "70%", c: "bg-white/10" },
    ],
  },
  {
    icon: Layers,
    title: "Unified Workspace",
    shortDesc: "Everything in one place.",
    desc: "One place for your entire product lifecycle. From first idea to shipped feature — no context switching, no lost artifacts, no silos.",
    tag: "Workspace",
    accent: "#6366F1",
    accentBg: "rgba(99,102,241,0.08)",
    accentBorder: "rgba(99,102,241,0.25)",
    bullets: [
      "Single source of truth",
      "Cross-tool linking",
      "Team collaboration built-in",
      "Version history everywhere",
    ],
    previewLines: [
      { w: "80%", c: "bg-indigo-400/40" },
      { w: "55%", c: "bg-indigo-400/25" },
      { w: "70%", c: "bg-white/10" },
      { w: "45%", c: "bg-white/10" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Feature Preview Card                                                  */
/* ------------------------------------------------------------------ */
function FeaturePreview({ feature }: { feature: (typeof features)[0] }) {
  const Icon = feature.icon;
  return (
    <motion.div
      key={feature.title}
      initial={{ opacity: 0, x: 20, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full rounded-2xl border p-8 backdrop-blur-sm"
      style={{
        background: feature.accentBg,
        borderColor: feature.accentBorder,
      }}
    >
      {/* Icon + tag */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ background: `${feature.accent}18`, border: `1px solid ${feature.accent}30` }}
        >
          <Icon className="h-6 w-6" style={{ color: feature.accent }} />
        </div>
        <div>
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: feature.accent }}
          >
            {feature.tag}
          </span>
          <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
            {feature.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="mb-6 text-sm leading-relaxed text-[#8a8a93]">{feature.desc}</p>

      {/* Bullets */}
      <ul className="mb-8 space-y-3">
        {feature.bullets.map((bullet, i) => (
          <motion.li
            key={bullet}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            className="flex items-center gap-2.5 text-sm text-white/80"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: feature.accent }} />
            {bullet}
          </motion.li>
        ))}
      </ul>

      {/* Mock preview lines */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-2.5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: feature.accent }} />
          <span className="text-xs text-[#8a8a93]">Live preview</span>
        </div>
        {feature.previewLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.1 + 0.2, duration: 0.5, ease: "easeOut" }}
            className={`h-2 rounded-full ${line.c}`}
            style={{ width: line.w, transformOrigin: "left" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                        */
/* ------------------------------------------------------------------ */
export default function Features() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const titleInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  }, []);

  return (
    <section id="features" className="relative py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="hairline-x absolute inset-x-0 top-0" />
        <div className="hairline-x absolute inset-x-0 bottom-0" />
        <div className="glow-violet absolute right-0 top-1/4 h-[600px] w-[600px] opacity-60" />
        <div className="glow-teal absolute left-0 bottom-1/4 h-[400px] w-[400px] opacity-50" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div ref={sectionRef} className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-sm text-[#8a8a93]"
          >
            <Zap className="h-3.5 w-3.5 text-orange-400" />
            Everything you need
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-2xl text-5xl font-bold text-white md:text-6xl"
            style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.03em" }}
          >
            The full stack for{" "}
            <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
              product builders
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-lg text-[#8a8a93]"
          >
            From ideation to deployment — every tool your team needs to ship faster and smarter, all in one place.
          </motion.p>
        </div>

        {/* Interactive Feature Wall */}
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Left: feature list */}
          <div className="space-y-2">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isActive = i === active;
              return (
                <motion.button
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={titleInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
                  onClick={() => setActive(i)}
                  className={`group w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-300 ${
                    isActive
                      ? "feature-item-active"
                      : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04]"
                  }`}
                  style={
                    isActive
                      ? { borderColor: `${feature.accent}40`, background: `${feature.accent}08` }
                      : {}
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
                      style={{
                        background: isActive ? `${feature.accent}18` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isActive ? `${feature.accent}30` : "rgba(255,255,255,0.06)"}`,
                      }}
                    >
                      <Icon
                        className="h-4 w-4 transition-colors duration-300"
                        style={{ color: isActive ? feature.accent : "#8a8a93" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium transition-colors duration-200 ${
                            isActive ? "text-white" : "text-white/70 group-hover:text-white/90"
                          }`}
                        >
                          {feature.title}
                        </span>
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                            isActive ? "translate-x-0.5 opacity-100" : "opacity-0 group-hover:opacity-50"
                          }`}
                          style={{ color: isActive ? feature.accent : "#8a8a93" }}
                        />
                      </div>
                      <p className={`mt-0.5 text-xs transition-colors ${isActive ? "text-[#8a8a93]" : "text-[#8a8a93]/60"}`}>
                        {feature.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Active progress bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="mt-3 h-px rounded-full"
                      style={{ background: `linear-gradient(90deg, ${feature.accent}80, transparent)` }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right: preview panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="min-h-[520px]"
            onMouseMove={handleMouseMove}
          >
            <AnimatePresence mode="wait">
              <FeaturePreview key={active} feature={features[active]} />
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
