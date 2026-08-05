"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useCallback } from "react";
import {
  FileText,
  Map,
  GitBranch,
  ClipboardList,
  BrainCircuit,
  Layers,
  ChevronRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  Target,
  Code2,
  TerminalSquare,
  Network,
  Database,
  Cpu,
  Activity,
  GitCommit,
  Calendar,
  Flag,
  CheckSquare,
  Circle,
  Server,
  Link2,
  History,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Feature data                                                          */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Per-feature rich preview renderers                                    */
/* ------------------------------------------------------------------ */
function ResearchPreview({ accent }: { accent: string }) {
  const rows = [
    { icon: TrendingUp, label: "TAM / SAM", val: "$14.2B · 38% YoY" },
    { icon: Target, label: "Top Competitors", val: "Linear, Jira, Notion AI" },
    { icon: Users, label: "Target ICP", val: "Tech Founders & PMs" },
    { icon: BarChart3, label: "Market Position", val: "Early mover advantage" },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
        <span className="text-[11px] text-[#8a8a93] font-medium uppercase tracking-wider">AI Market Report</span>
        <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">1.2s</span>
      </div>
      {rows.map((r, i) => {
        const Icon = r.icon;
        return (
          <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
            <span className="text-xs text-[#8a8a93] w-28 shrink-0">{r.label}</span>
            <span className="text-xs text-white font-mono truncate">{r.val}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function PRDPreview({ accent }: { accent: string }) {
  const sections = [
    { icon: Target, label: "Core Scope", val: "AI-assisted sprint planning & PRD drafting" },
    { icon: Code2, label: "Tech Stack", val: "Next.js 15, TypeScript, Prisma, Postgres" },
    { icon: TerminalSquare, label: "Endpoints", val: "POST /api/prd/generate" },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
        <span className="text-[11px] text-[#8a8a93] font-medium uppercase tracking-wider">PRD v1.0 — Draft</span>
        <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">Generating…</span>
      </div>
      {sections.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className="h-3 w-3" style={{ color: accent }} />
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: accent }}>{s.label}</span>
            </div>
            <p className="text-xs text-white/80 font-mono leading-relaxed">{s.val}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

function RoadmapPreview({ accent }: { accent: string }) {
  const phases = [
    { label: "Phase 1", desc: "MVP Core Engine & Auth", weeks: "Wk 1–2", pct: 100, icon: Flag },
    { label: "Phase 2", desc: "AI Chat & Diagrams", weeks: "Wk 3–4", pct: 60, icon: Activity },
    { label: "Phase 3", desc: "Public Beta Launch", weeks: "Wk 5–6", pct: 0, icon: Calendar },
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
        <span className="text-[11px] text-[#8a8a93] font-medium uppercase tracking-wider">Q3 – Q4 Roadmap</span>
        <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">6 weeks</span>
      </div>
      {phases.map((p, i) => {
        const Icon = p.icon;
        return (
          <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
                <span className="text-xs font-semibold text-white">{p.label}</span>
                <span className="text-xs text-[#8a8a93]">{p.desc}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">{p.weeks}</span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/[0.06]">
              <motion.div className="h-1 rounded-full" style={{ background: accent }}
                initial={{ width: 0 }} animate={{ width: `${p.pct}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ArchPreview({ accent }: { accent: string }) {
  const nodes = [
    { icon: Layers, label: "Frontend", val: "Next.js 15 / React 19", color: "text-sky-400" },
    { icon: Cpu, label: "AI Gateway", val: "Edge + GPT-4o Stream", color: "text-amber-400" },
    { icon: Database, label: "Database", val: "PostgreSQL + Redis", color: "text-violet-400" },
    { icon: Network, label: "Services", val: "REST API + WebSockets", color: "text-emerald-400" },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
        <span className="text-[11px] text-[#8a8a93] font-medium uppercase tracking-wider">System Topology</span>
        <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Auto-generated</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {nodes.map((n, i) => {
          const Icon = n.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`h-3.5 w-3.5 ${n.color}`} />
                <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: accent }}>{n.label}</span>
              </div>
              <p className="text-xs text-white/70 font-mono leading-tight">{n.val}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TaskPreview({ accent }: { accent: string }) {
  const tasks = [
    { label: "Configure OAuth & Session Handler", priority: "High", icon: Flag, dot: "bg-rose-400" },
    { label: "Build Dynamic Interactive Node Graph", priority: "Active", icon: Activity, dot: "bg-amber-400 animate-pulse" },
    { label: "Setup Stripe Webhooks & Billing", priority: "Backlog", icon: Server, dot: "bg-zinc-500" },
    { label: "Write Unit Tests for PRD Module", priority: "Backlog", icon: CheckSquare, dot: "bg-zinc-500" },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
        <span className="text-[11px] text-[#8a8a93] font-medium uppercase tracking-wider">Sprint Kanban</span>
        <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">18 tasks</span>
      </div>
      {tasks.map((t, i) => {
        const Icon = t.icon;
        return (
          <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <div className={`h-2 w-2 rounded-full shrink-0 ${t.dot}`} />
            <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
            <span className="text-xs text-white/80 flex-1 truncate">{t.label}</span>
            <span className="text-[10px] text-zinc-500 shrink-0">{t.priority}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function WorkspacePreview({ accent }: { accent: string }) {
  const tools = [
    { icon: BrainCircuit, label: "AI Research", status: "Linked", color: "text-violet-400" },
    { icon: FileText, label: "PRD v1.0", status: "Linked", color: "text-blue-400" },
    { icon: Map, label: "Q3 Roadmap", status: "Linked", color: "text-emerald-400" },
    { icon: GitBranch, label: "Arch Diagram", status: "Linked", color: "text-amber-400" },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
        <span className="text-[11px] text-[#8a8a93] font-medium uppercase tracking-wider">Unified View</span>
        <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">All synced</span>
      </div>
      {tools.map((t, i) => {
        const Icon = t.icon;
        return (
          <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <Icon className={`h-3.5 w-3.5 shrink-0 ${t.color}`} />
            <span className="text-xs text-white/80 flex-1">{t.label}</span>
            <div className="flex items-center gap-1.5">
              <Link2 className="h-3 w-3 text-zinc-600" />
              <span className="text-[10px] text-zinc-500">{t.status}</span>
            </div>
          </motion.div>
        );
      })}
      <div className="flex items-center gap-2 pt-1 px-1">
        <History className="h-3 w-3 text-zinc-600" />
        <span className="text-[10px] text-zinc-600">Last synced 2 min ago — v14 snapshot saved</span>
      </div>
    </div>
  );
}

const PREVIEW_MAP: Record<string, (props: { accent: string }) => React.JSX.Element> = {
  "AI Research Engine": ResearchPreview,
  "PRD Generator": PRDPreview,
  "Roadmap Builder": RoadmapPreview,
  "Architecture Diagrams": ArchPreview,
  "Task Management": TaskPreview,
  "Unified Workspace": WorkspacePreview,
};

const features = [
  {
    icon: BrainCircuit,
    title: "AI Research Engine",
    shortDesc: "Instant market & competitive intelligence.",
    desc: "Transform simple prompts into deep market research reports. Get competitive landscape mapping, user personas, TAM/SAM sizing, and SWOT analyses in under 2 seconds.",
    tag: "Market Intelligence",
    accent: "#8B5CF6",
    accentBg: "rgba(139,92,246,0.08)",
    accentBorder: "rgba(139,92,246,0.25)",
    bullets: [
      "Real-time competitor positioning",
      "Automated target ICP personas",
      "TAM / SAM market estimates",
      "One-click SWOT analysis export",
    ],
  },
  {
    icon: FileText,
    title: "PRD Generator",
    shortDesc: "Developer-ready specs in seconds.",
    desc: "Turn rough feature ideas into complete, structured Product Requirements Documents with clear scope, user stories, acceptance criteria, and edge cases.",
    tag: "Documentation",
    accent: "#3B82F6",
    accentBg: "rgba(59,130,246,0.08)",
    accentBorder: "rgba(59,130,246,0.25)",
    bullets: [
      "Structured user stories & criteria",
      "Edge-case auto-identification",
      "API & tech stack specifications",
      "Stakeholder-ready export",
    ],
  },
  {
    icon: Map,
    title: "Roadmap Builder",
    shortDesc: "Visual milestones & sprint velocity.",
    desc: "Map your product journey with AI-generated milestone timelines, release phases, and sprint estimates tailored to your team size and velocity.",
    tag: "Planning",
    accent: "#10B981",
    accentBg: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.25)",
    bullets: [
      "AI milestone sequence engine",
      "Interactive phase breakdown",
      "Sprint dependency tracking",
      "Live release timeline view",
    ],
  },
  {
    icon: GitBranch,
    title: "Architecture Diagrams",
    shortDesc: "Production-ready system topologies.",
    desc: "Generate production-ready system architecture diagrams in Mermaid.js with detailed component schemas, microservice nodes, and data flow visuals.",
    tag: "Engineering",
    accent: "#F59E0B",
    accentBg: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.25)",
    bullets: [
      "Auto Mermaid.js diagram output",
      "Microservice & API topology",
      "Data pipeline flow mapping",
      "Tech stack recommendation engine",
    ],
  },
  {
    icon: ClipboardList,
    title: "Task Management",
    shortDesc: "Prioritized actionable ticket queues.",
    desc: "Automatically decompose PRD specifications into prioritized developer tasks, complete with story points, assignees, and sprint links.",
    tag: "Execution",
    accent: "#F43F5E",
    accentBg: "rgba(244,63,94,0.08)",
    accentBorder: "rgba(244,63,94,0.25)",
    bullets: [
      "Auto PRD-to-task decomposition",
      "Priority matrix & backlog queue",
      "Sprint velocity tracking",
      "GitHub & Jira sync support",
    ],
  },
  {
    icon: Layers,
    title: "Unified Workspace",
    shortDesc: "Single source of truth with zero silo.",
    desc: "One central hub for your entire product lifecycle. From first concept to production release — no context-switching, no lost documents, no silos.",
    tag: "Workspace",
    accent: "#6366F1",
    accentBg: "rgba(99,102,241,0.08)",
    accentBorder: "rgba(99,102,241,0.25)",
    bullets: [
      "Seamless cross-tool linking",
      "Real-time team collaboration",
      "Automated version snapshots",
      "Instant PDF & Markdown export",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Feature Preview Card                                                  */
/* ------------------------------------------------------------------ */
function FeaturePreview({ feature }: { feature: (typeof features)[0] }) {
  const Icon = feature.icon;
  const PreviewContent = PREVIEW_MAP[feature.title];
  return (
    <motion.div
      key={feature.title}
      initial={{ opacity: 0, x: 20, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full rounded-2xl border p-6 lg:p-8 backdrop-blur-2xl flex flex-col relative overflow-hidden shadow-2xl"
      style={{
        background: `linear-gradient(135deg, ${feature.accentBg}, rgba(10,10,12,0.95))`,
        borderColor: feature.accentBorder,
        boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${feature.accent}12`,
      }}
    >
      {/* Top right ambient glow orb */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl opacity-30"
        style={{ background: feature.accent }}
      />

      {/* Icon + tag */}
      <div className="mb-5 flex items-center gap-3 relative z-10">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 shadow-lg"
          style={{ background: `${feature.accent}18`, border: `1px solid ${feature.accent}35` }}
        >
          <Icon className="h-6 w-6" style={{ color: feature.accent }} />
        </div>
        <div>
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: feature.accent }}
          >
            {feature.tag}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
            {feature.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="mb-5 text-sm leading-relaxed text-[#9a9a9f] relative z-10">{feature.desc}</p>

      {/* Bullets */}
      <ul className="mb-6 space-y-2.5 relative z-10">
        {feature.bullets.map((bullet, i) => (
          <motion.li
            key={bullet}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-white/85"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: feature.accent }} />
            {bullet}
          </motion.li>
        ))}
      </ul>

      {/* Rich unique preview panel */}
      <div className="mt-auto rounded-xl bg-black/50 border border-white/[0.08] p-4 relative z-10 backdrop-blur-md shadow-inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {PreviewContent && <PreviewContent accent={feature.accent} />}
          </motion.div>
        </AnimatePresence>
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={sectionRef} className="mb-14 sm:mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-xs sm:text-sm text-[#8a8a93] backdrop-blur-sm"
          >
            <Zap className="h-3.5 w-3.5 text-orange-400" />
            The Product OS Suite
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-3xl text-3xl font-extrabold text-white sm:text-5xl md:text-6xl leading-[1.1]"
            style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.03em" }}
          >
            Architect, plan, and ship —{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
              all in one workspace
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg text-[#8a8a93]"
          >
            Replace 5 single-purpose tools with an end-to-end AI product suite engineered to eliminate busywork and maximize build velocity.
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
                  className={`group w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-300 ${isActive
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
                          className={`text-sm font-medium transition-colors duration-200 ${isActive ? "text-white" : "text-white/70 group-hover:text-white/90"
                            }`}
                        >
                          {feature.title}
                        </span>
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 transition-all duration-300 ${isActive ? "translate-x-0.5 opacity-100" : "opacity-0 group-hover:opacity-50"
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
