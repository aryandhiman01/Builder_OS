"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  FileText,
  Map,
  GitBranch,
  CheckSquare,
  Brain,
  Cpu,
  Activity,
  TerminalSquare,
  Layers,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Target,
  Network,
  Database,
  Server,
  Code2,
  ListChecks,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/* Animation Variants                                                   */
/* ------------------------------------------------------------------ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const wordContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const wordVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ------------------------------------------------------------------ */
/* Typewriter badge text                                                */
/* ------------------------------------------------------------------ */
const BADGE_TEXTS = [
  "BuilderOS is Live",
  "Autonomous PRD Drafting",
  "Ship 10x Faster with AI",
];

function TypewriterBadge() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = BADGE_TEXTS[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 55);
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 28);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setTextIndex((i) => (i + 1) % BADGE_TEXTS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, textIndex]);

  return (
    <span className="inline-block font-mono text-[11px] sm:text-xs text-white/90">
      {displayed}
      <span
        className="ml-0.5 inline-block h-3 w-px bg-orange-400 align-middle"
        style={{ animation: "blink 1s step-end infinite" }}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Mock UI — shows inside the floating card                             */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Mock UI — shows inside the floating card                             */
/* ------------------------------------------------------------------ */
const mockItems = [
  {
    icon: Brain,
    label: "AI Research Engine",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    status: "Complete",
    progress: 100,
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    preview: {
      title: "Market Analysis & Competitor Insight",
      tag: "AI Generated • 1.2s",
      content: [
        { label: "TAM / SAM", val: "$14.2B Global Market", icon: BarChart3 },
        { label: "Top Competitors", val: "Linear, Jira, Notion AI", icon: Target },
        { label: "Target Audience", val: "Tech Founders & Product Leads", icon: Users },
      ],
    },
  },
  {
    icon: FileText,
    label: "PRD Generator",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    status: "Generating...",
    progress: 67,
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    preview: {
      title: "Product Requirements Document (v1.0)",
      tag: "Generating PRD...",
      content: [
        { label: "Core Scope", val: "AI-assisted sprint planning & PRD drafting", icon: Target },
        { label: "Tech Stack", val: "Next.js 15, TypeScript, Tailwind, Prisma", icon: Code2 },
        { label: "API Endpoints", val: "POST /api/prd/generate, GET /api/roadmap", icon: TerminalSquare },
      ],
    },
  },
  {
    icon: Map,
    label: "Roadmap Builder",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    status: "Pending",
    progress: 0,
    badgeColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    preview: {
      title: "Q3 – Q4 Release Timeline & Milestones",
      tag: "Planned Sprint",
      content: [
        { label: "Phase 1 (Week 1–2)", val: "MVP Core Engine & Auth Integration", icon: Layers },
        { label: "Phase 2 (Week 3–4)", val: "Real-time AI Chat & Diagrams", icon: Network },
        { label: "Phase 3 (Week 5–6)", val: "Public Beta & Analytics Launch", icon: Rocket },
      ],
    },
  },
  {
    icon: GitBranch,
    label: "Architecture Diagrams",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    status: "Pending",
    progress: 0,
    badgeColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    preview: {
      title: "System Topology & Microservice Schema",
      tag: "Automated Diagram",
      content: [
        { label: "Frontend Layer", val: "React 19 / Next.js App Router", icon: Layers },
        { label: "AI Gateway", val: "GPT-4o Stream Pipeline via Edge Router", icon: Cpu },
        { label: "Database Layer", val: "PostgreSQL DB + Redis Cache Node", icon: Database },
      ],
    },
  },
  {
    icon: CheckSquare,
    label: "Task Board",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    status: "Pending",
    progress: 0,
    badgeColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    preview: {
      title: "Sprint Kanban & Prioritized Backlog",
      tag: "18 Auto Tasks Created",
      content: [
        { label: "High Priority", val: "Configure OAuth & Session Handler", icon: Target },
        { label: "In Progress", val: "Build Dynamic Interactive Node Graph", icon: Activity },
        { label: "Backlog", val: "Setup Stripe Webhooks & Billing", icon: Server },
      ],
    },
  },
];

function MockUI() {
  const [activeIdx, setActiveIdx] = useState(1); // "PRD Generator" active by default

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % mockItems.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const activeItem = mockItems[activeIdx];
  const progressVal = activeItem.progress;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* ── Main Workspace Card (Wide, responsive, zero wasted side margin) ── */}
      <div className="mockup-card w-full overflow-hidden rounded-2xl border border-white/10 bg-[#09090c]/90 backdrop-blur-2xl shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1 shadow-inner">
            <Layers className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-xs font-semibold text-white/90">
              BuilderOS — Workspace
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#8a8a93]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Workspace</span>
          </div>
        </div>

        {/* Workspace Body: 2 Columns on Desktop, Single Column on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 lg:p-6">
          {/* Left Column: Interactive Module Selector List */}
          <div className="lg:col-span-5 space-y-2.5">
            {mockItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = i === activeIdx;
              return (
                <motion.div
                  key={item.label}
                  onClick={() => setActiveIdx(i)}
                  animate={{
                    backgroundColor: isActive
                      ? "rgba(255, 107, 53, 0.08)"
                      : "rgba(255, 255, 255, 0.02)",
                    borderColor: isActive
                      ? "rgba(255, 107, 53, 0.3)"
                      : "rgba(255, 255, 255, 0.05)",
                  }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 rounded-xl border px-3.5 py-3 cursor-pointer select-none transition-all"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/90 truncate">
                      {item.label}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${item.status === "Complete"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : isActive
                          ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        }`}
                    >
                      {isActive && item.status === "Pending"
                        ? "Generating..."
                        : item.status}
                    </span>
                    {item.status === "Complete" && (
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    )}
                    {isActive && item.status !== "Complete" && (
                      <motion.div
                        className="h-2 w-2 rounded-full bg-orange-400"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Rich Live Output Preview */}
          <div className="lg:col-span-7 flex flex-col rounded-xl border border-white/10 bg-black/40 p-4 lg:p-5 relative min-h-[260px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 flex-1"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <activeItem.icon className={`h-5 w-5 ${activeItem.color}`} />
                    <h4 className="text-sm font-bold text-white">
                      {activeItem.preview.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-orange-400">
                    {activeItem.preview.tag}
                  </span>
                </div>

                {/* Content Cards — each row has its own icon */}
                <div className="space-y-2.5">
                  {activeItem.preview.content.map((row, idx) => {
                    const RowIcon = (row as { label: string; val: string; icon: React.ElementType }).icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.07, duration: 0.3 }}
                        className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <RowIcon className="h-3.5 w-3.5 text-[#8a8a93] shrink-0" />
                          <span className="text-xs text-[#8a8a93] font-medium">{row.label}</span>
                        </div>
                        <span className="text-xs text-white font-mono font-medium sm:text-right">{row.val}</span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Module Progress</span>
                    <span className="text-[10px] text-orange-400 font-mono">{progressVal}%</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/[0.06]">
                    <motion.div
                      className="h-1 rounded-full bg-gradient-to-r from-orange-500 to-rose-400"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progressVal}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom status badge inside preview */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#8a8a93]">
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3 w-3 text-orange-400" />
                AI Copilot Active
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
                <Clock className="h-3 w-3" />
                Ready to Export
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.07] bg-white/[0.02] px-4 py-3 flex items-center justify-between text-xs text-[#8a8a93]">
          <span className="flex items-center gap-2 font-medium text-white/80">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            Generating with gemini-3.6-flash
          </span>

          <div className="flex gap-1.5 items-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="h-1.5 w-4 rounded-full bg-orange-400/80"
                animate={{ scaleX: [1, 0.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Headline with per-word reveal                                        */
/* ------------------------------------------------------------------ */
function AnimatedHeadline({ line, delay = 0 }: { line: string; delay?: number }) {
  const words = line.split(" ");
  return (
    <motion.span
      variants={wordContainer}
      initial="hidden"
      animate="visible"
      style={{ transition: `all 0s ${delay}s` }}
      className="block"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariant}
          className="inline-block"
          style={{ transitionDelay: `${delay + i * 0.07}s` }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Main Hero Component                                                  */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center pt-24 pb-16"
    >
      {/* ── Radial background glows (Raycast signature) ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Central warm glow — the hero orange/red like Raycast */}
        <motion.div
          style={{ y: orbY1 }}
          className="glow-orange absolute left-1/2 top-1/3 h-[280px] w-[280px] sm:h-[600px] sm:w-[600px] -translate-x-1/2 -translate-y-1/2 transform-gpu"
        />
        {/* Violet side glow */}
        <motion.div
          style={{ y: orbY2 }}
          className="glow-violet absolute right-[5%] top-1/4 h-[220px] w-[220px] sm:h-[450px] sm:w-[450px] transform-gpu hidden sm:block"
        />
        {/* Teal bottom glow */}
        <div className="glow-teal absolute left-[5%] bottom-0 h-[200px] w-[200px] sm:h-[350px] sm:w-[350px] transform-gpu hidden sm:block" />

        {/* Grid noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#060606] to-transparent" />
      </div>

      {/* ── Main content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-6xl px-4 sm:px-6 text-center relative z-10 transform-gpu"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-xs sm:text-sm text-[#8a8a93] backdrop-blur-sm shadow-inner"
        >
          <motion.span
            animate={{ rotate: [0, 15, 0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap className="h-3.5 w-3.5 text-orange-400 shrink-0" />
          </motion.span>
          <TypewriterBadge />
          <span className="ml-1 flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors cursor-pointer font-medium shrink-0">
            Learn more
            <ArrowRight className="h-3 w-3" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl text-[30px] min-[380px]:text-[38px] sm:text-[64px] md:text-[76px] lg:text-[88px] font-bold leading-[1.08] tracking-[-0.04em] text-white break-words"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          <AnimatedHeadline line="Everything you need" delay={0.1} />
          <span className="block">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="inline-block bg-gradient-to-r from-orange-400 via-red-400 to-rose-400 bg-clip-text text-transparent"
            >
              to build
            </motion.span>
          </span>
        </motion.h1>

        {/* Upgraded Subtext (Version 2) */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mx-auto mt-6 max-w-2xl text-[15px] sm:text-[18px] leading-relaxed text-[#9a9a9f]"
        >
          Stop context-switching between 5 disconnected tools. BuilderOS unifies deep market research,
          automated PRDs, visual roadmaps, and system architecture into one intelligent workspace.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md sm:max-w-none mx-auto"
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="btn-shimmer group relative w-full sm:w-auto rounded-xl bg-white px-7 text-[15px] font-semibold text-black hover:bg-zinc-100 transition-all duration-300 shadow-lg shadow-white/10"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Building Free
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Button>
            </motion.div>
          </Link>

          <Link href="#features" className="w-full sm:w-auto">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-xl border-white/[0.1] bg-white/[0.04] px-7 text-[15px] text-white backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
              >
                Explore Features
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Below CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-[#8a8a93]"
        >
          <span>Free tier forever</span>
          <span className="h-1 w-1 rounded-full bg-[#8a8a93]/40" />
          <span>No credit card required</span>
          <span className="h-1 w-1 rounded-full bg-[#8a8a93]/40" />
          <span>Instant export</span>
        </motion.div>

        {/* ── Wide Workspace Section Showcase ── */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-12 w-full"
        >
          <MockUI />
        </motion.div>
      </motion.div>

      {/* Keyframes */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

