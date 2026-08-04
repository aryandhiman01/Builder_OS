"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  FolderKanban,
  CalendarDays,
  Clock3,
  Sparkles,
  Target,
  CheckCircle2,
  ArrowRight,
  FileText,
  LayoutTemplate,
  Brain,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
  CheckSquare,
  Layers,
  Activity,
  Boxes,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";

/* ─────────────────────────────────────────── Types ── */
interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  remaining: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

interface AIAssetItemStatus {
  generated: boolean;
  count: number;
  latestId?: string;
}

interface AIStatus {
  research: AIAssetItemStatus;
  prd: AIAssetItemStatus;
  roadmap: AIAssetItemStatus;
  architecture: AIAssetItemStatus;
  documentsCount: number;
  milestonesCompleted: number;
  totalTokens: number;
  totalGenTime: number;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  timestamp: number;
  type: "project" | "research" | "prd" | "roadmap" | "architecture" | "task";
}

interface ProjectOverviewData {
  project: {
    id: string;
    title: string;
    description: string | null;
    status: "Planning" | "Building" | "Completed";
    category: string;
    color: string;
    createdAt: string;
    updatedAt: string;
  };
  progress: number;
  taskStats: TaskStats;
  aiStatus: AIStatus;
  analytics: {
    milestoneAnalytics: { name: string; completion: number }[];
    taskStatusChart: { name: string; value: number; color: string }[];
    aiDistributionChart: { name: string; count: number; tokens: number }[];
  };
  recentActivity: ActivityItem[];
}

interface ProjectOverviewClientProps {
  projectId: string;
  initialData?: ProjectOverviewData | null;
}

/* ─────────────────────────────────── Scroll Animation Variants ── */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const sectionHeaderVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ─────────────────────────────────── Milestone Colors ── */
const MILESTONE_COLORS: Record<string, { color: string; fill: string }> = {
  Research: { color: "#8B5CF6", fill: "url(#gradResearch)" },
  PRD: { color: "#FF6B35", fill: "url(#gradPRD)" },
  Roadmap: { color: "#F59E0B", fill: "url(#gradRoadmap)" },
  Architecture: { color: "#34D399", fill: "url(#gradArchitecture)" },
  "Tasks Execution": { color: "#38BDF8", fill: "url(#gradTasks)" },
  "Task Execution": { color: "#38BDF8", fill: "url(#gradTasks)" },
};
const FALLBACK_PALETTE = ["#8B5CF6", "#FF6B35", "#F59E0B", "#34D399", "#38BDF8", "#F43F5E"];

/* ─────────────────────────────── Custom Tooltip ── */
const DarkTooltip = ({
  active, payload, label,
}: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/15 bg-[#09090c]/98 p-3 shadow-2xl backdrop-blur-2xl z-50 pointer-events-none">
      {label && <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">{label}</p>}
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2 text-xs py-0.5">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: e.color || "#38BDF8" }} />
          <span className="text-[#8a8a93]">{e.name || "Value"}:</span>
          <span className="font-bold text-white font-mono">
            {typeof e.value === "number" && label?.includes("Milestone") ? `${e.value}%` : e.value?.toLocaleString() ?? 0}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ───────────────────────────────────── Chart Card ── */
function ChartCard({
  title, sub, icon: Icon, children, className = "",
}: { title: string; sub?: string; icon: React.ElementType; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={cardVariants}
      className={`rounded-2xl border border-white/10 bg-[#09090c]/90 p-4 sm:p-6 backdrop-blur-2xl shadow-xl w-full min-w-0 overflow-hidden ${className}`}
    >
      <div className="mb-4 sm:mb-5 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
              <Icon size={15} className="text-orange-400" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white truncate" style={{ fontFamily: "var(--font-sora)" }}>
              {title}
            </h3>
          </div>
          {sub && <p className="mt-1 pl-9 sm:pl-10 text-[10px] sm:text-[11px] text-[#8a8a93] truncate">{sub}</p>}
        </div>
      </div>
      <div className="w-full overflow-hidden">{children}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════ Main Component ══ */
export default function ProjectOverviewClient({
  projectId,
  initialData = null,
}: ProjectOverviewClientProps) {
  const [data, setData] = useState<ProjectOverviewData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [isMounted, setIsMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchOverview = useCallback(
    async (isSilent = false) => {
      try {
        if (!isSilent) setLoading(true);
        if (isSilent) setIsSyncing(true);

        const res = await fetch(`/api/projects/${projectId}/overview`);
        if (!res.ok) return;
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching real-time project overview:", err);
      } finally {
        if (!isSilent) setLoading(false);
        if (isSilent) {
          setTimeout(() => setIsSyncing(false), 500);
        }
      }
    },
    [projectId]
  );

  useEffect(() => {
    fetchOverview(false);
  }, [fetchOverview]);

  if (loading && !data) {
    return (
      <div className="space-y-6 max-w-full pb-10 p-3 sm:p-6 animate-pulse">
        <div className="h-40 rounded-3xl border border-white/10 bg-white/[0.04]" />
        <div className="grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl border border-white/10 bg-white/[0.04]" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-2xl border border-white/10 bg-white/[0.04]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-12 text-center text-[#8a8a93]">
        Failed to load real-time project overview. Please refresh.
      </div>
    );
  }

  const { project, progress, taskStats, aiStatus, analytics, recentActivity } = data;

  const createdDateFormatted = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(project.createdAt));
  const updatedDateFormatted = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(project.updatedAt));
  const healthScore = Math.min(
    100,
    Math.round(
      (aiStatus.milestonesCompleted / 4) * 50 +
        (taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 50 : 0)
    )
  );

  return (
    <div className="space-y-8 max-w-full pb-12 px-3 sm:px-6">
      {/* Landing & Dashboard Hero Banner */}
      <motion.section
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          mockup-card
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-[#09090c]/95
          backdrop-blur-2xl
          shadow-2xl
        "
      >
        {/* Top Window Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-0.5 shadow-inner">
            <Layers className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-[11px] sm:text-xs font-semibold text-white/90">
              BuilderOS — Project Operating Workspace
            </span>
          </div>

          <div className="hidden sm:block w-16" />
        </div>

        {/* Hero Body Container */}
        <div className="relative p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1
              className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.02em" }}
            >
              Overview &{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                Analytics
              </span>
              .
            </h1>

            <p className="text-xs sm:text-sm text-[#8a8a93] max-w-xl">
              Real-time project health, task execution metrics, and AI specs analytics.
            </p>
          </div>

          {/* Dynamic Health Score Badge Card */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/[0.04] p-3.5 sm:p-4 backdrop-blur-xl shrink-0 shadow-lg">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05]">
              <Zap size={20} className={healthScore >= 75 ? "text-emerald-400 animate-pulse" : healthScore >= 40 ? "text-yellow-400" : "text-rose-400"} />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8a8a93]">
                Project Health
              </p>
              <p className="text-sm sm:text-lg font-extrabold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                {healthScore} / 100 Score
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Dynamic Realtime Stats Cards - 2 Columns on Mobile */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-4"
      >
        <motion.div variants={sectionHeaderVariants} className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
            <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
              Overview Metrics
            </h2>
            <p className="text-xs text-[#8a8a93]">Real-time execution metrics for this project workspace.</p>
          </div>
        </motion.div>

        <div className="grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-4">
          {/* Project Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -3 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#09090c]/90 p-3.5 sm:p-5 backdrop-blur-2xl shadow-xl transition-all duration-300 hover:border-orange-500/40 hover:bg-[#0c0c10]"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-[#8a8a93] truncate block">
                  Workspace
                </span>
                <h3 className="mt-0.5 sm:mt-2 text-base sm:text-xl font-extrabold text-white truncate" style={{ fontFamily: "var(--font-sora)" }}>
                  {project.title}
                </h3>
              </div>
              <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400 shadow-inner group-hover:scale-110 transition-transform">
                <FolderKanban size={18} className="sm:hidden" />
                <FolderKanban size={20} className="hidden sm:block" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center justify-between border-t border-white/[0.06] pt-2 sm:pt-2.5">
              <p className="text-[10px] sm:text-xs text-[#8a8a93] truncate">{project.category} Category</p>
            </div>
          </motion.div>

          {/* Progress Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -3 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#09090c]/90 p-3.5 sm:p-5 backdrop-blur-2xl shadow-xl transition-all duration-300 hover:border-emerald-500/40 hover:bg-[#0c0c10]"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-[#8a8a93] truncate block">
                  Completion
                </span>
                <h3 className="mt-0.5 sm:mt-2 text-xl sm:text-3xl font-extrabold text-white font-mono" style={{ fontFamily: "var(--font-sora)" }}>
                  {progress}%
                </h3>
              </div>
              <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
                <Target size={18} className="sm:hidden" />
                <Target size={20} className="hidden sm:block" />
              </div>
            </div>

            {/* Dynamic Animated Progress Bar */}
            <div className="mt-2.5 h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  backgroundColor: project.color || "#38BDF8",
                }}
              />
            </div>

            <div className="mt-2 sm:mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2 sm:pt-2.5">
              <p className="text-[10px] sm:text-xs text-[#8a8a93] truncate">
                {taskStats.total > 0
                  ? `${taskStats.completed}/${taskStats.total} Tasks`
                  : `${aiStatus.milestonesCompleted}/4 Specs`}
              </p>
              <span className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] sm:text-[11px] font-mono font-medium text-emerald-400">
                {project.status}
              </span>
            </div>
          </motion.div>

          {/* Created Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -3 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#09090c]/90 p-3.5 sm:p-5 backdrop-blur-2xl shadow-xl transition-all duration-300 hover:border-sky-500/40 hover:bg-[#0c0c10]"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-[#8a8a93] truncate block">
                  Created
                </span>
                <h3 className="mt-0.5 sm:mt-2 text-sm sm:text-base font-extrabold text-white truncate" style={{ fontFamily: "var(--font-sora)" }}>
                  {createdDateFormatted}
                </h3>
              </div>
              <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400 shadow-inner group-hover:scale-110 transition-transform">
                <CalendarDays size={18} className="sm:hidden" />
                <CalendarDays size={20} className="hidden sm:block" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center justify-between border-t border-white/[0.06] pt-2 sm:pt-2.5">
              <p className="text-[10px] sm:text-xs text-[#8a8a93] truncate">Workspace Created</p>
            </div>
          </motion.div>

          {/* Updated Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -3 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#09090c]/90 p-3.5 sm:p-5 backdrop-blur-2xl shadow-xl transition-all duration-300 hover:border-amber-500/40 hover:bg-[#0c0c10]"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-[#8a8a93] truncate block">
                  Updated
                </span>
                <h3 className="mt-0.5 sm:mt-2 text-sm sm:text-base font-extrabold text-white truncate" style={{ fontFamily: "var(--font-sora)" }}>
                  {updatedDateFormatted}
                </h3>
              </div>
              <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-inner group-hover:scale-110 transition-transform">
                <Clock3 size={18} className="sm:hidden" />
                <Clock3 size={20} className="hidden sm:block" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center justify-between border-t border-white/[0.06] pt-2 sm:pt-2.5">
              <p className="text-[10px] sm:text-xs text-[#8a8a93] truncate">Last Activity</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Actions & Spec Status Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-4"
      >
        <motion.div variants={sectionHeaderVariants} className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
              Quick Actions &amp; Spec Status
            </h2>
            <p className="text-xs text-[#8a8a93]">AI product specifications and task management modules.</p>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* AI Generation Status Card */}
          <motion.div variants={cardVariants} className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-5 sm:p-7 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                    <Sparkles className="text-orange-400" size={15} />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">AI Specifications</span>
                </div>
                <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-mono font-bold text-orange-400">
                  {aiStatus.milestonesCompleted} / 4 Generated
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                AI Generation Status
              </h3>
              <p className="mt-1 text-xs text-[#8a8a93]">
                Product specification &amp; planning assets status.
              </p>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2 text-xs">
                {/* Research */}
                <Link
                  href={`/projects/${projectId}/research`}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:bg-violet-500/10 hover:border-violet-500/40"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
                      <Zap size={13} />
                    </div>
                    <span className="text-zinc-200 font-semibold">Research</span>
                  </div>
                  {aiStatus.research.generated ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/15 px-2 py-0.5 text-[10px] font-mono font-bold text-violet-300">
                      <CheckCircle2 size={10} /> {aiStatus.research.count > 1 ? `(${aiStatus.research.count})` : "Done"}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#8a8a93] bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </Link>

                {/* PRD */}
                <Link
                  href={`/projects/${projectId}/prd`}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:bg-orange-500/10 hover:border-orange-500/40"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
                      <FileText size={13} />
                    </div>
                    <span className="text-zinc-200 font-semibold">PRD</span>
                  </div>
                  {aiStatus.prd.generated ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/15 px-2 py-0.5 text-[10px] font-mono font-bold text-orange-300">
                      <CheckCircle2 size={10} /> Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#8a8a93] bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </Link>

                {/* Roadmap */}
                <Link
                  href={`/projects/${projectId}/roadmap`}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:bg-amber-500/10 hover:border-amber-500/40"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                      <LayoutTemplate size={13} />
                    </div>
                    <span className="text-zinc-200 font-semibold">Roadmap</span>
                  </div>
                  {aiStatus.roadmap.generated ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                      <CheckCircle2 size={10} /> Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#8a8a93] bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </Link>

                {/* Architecture */}
                <Link
                  href={`/projects/${projectId}/architecture`}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:bg-emerald-500/10 hover:border-emerald-500/40"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                      <Brain size={13} />
                    </div>
                    <span className="text-zinc-200 font-semibold">Architecture</span>
                  </div>
                  {aiStatus.architecture.generated ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                      <CheckCircle2 size={10} /> Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#8a8a93] bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Task Management Card */}
          <motion.div variants={cardVariants}>
            <Link
              href={`/projects/${projectId}/tasks`}
              className="group rounded-2xl border border-white/10 bg-[#09090c]/90 p-5 sm:p-7 backdrop-blur-2xl shadow-xl transition-all hover:border-emerald-500/40 flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                      <CheckCircle2 className="text-emerald-400" size={15} />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Execution Hub</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
                    {taskStats.completed} / {taskStats.total} Completed
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>Task Execution Hub</h3>
                <p className="mt-1.5 text-xs leading-5 text-[#8a8a93]">
                  {taskStats.total === 0
                    ? "No tasks created yet. Click to add your first milestone task."
                    : `${taskStats.completed} of ${taskStats.total} tasks completed. ${taskStats.remaining} remaining.`}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs text-emerald-400 font-bold font-mono">
                    <CheckCircle2 size={12} /> {taskStats.completed} Completed
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 text-xs text-sky-400 font-bold font-mono">
                    <Activity size={12} /> {taskStats.inProgress} In Progress
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs text-amber-400 font-bold font-mono">
                    <Clock3 size={12} /> {taskStats.todo} To Do
                  </span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                <span className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">Manage Tasks Workspace</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-all">
                  <ArrowRight size={14} className="transition group-hover:translate-x-0.5 text-orange-400" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Analytics & Visual Charts Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-4"
      >
        <motion.div variants={sectionHeaderVariants} className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
            <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
              Project Analytics &amp; Visual Insights
            </h2>
            <p className="text-xs text-[#8a8a93]">Real-time visual breakdown of milestone completion and task distribution.</p>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Chart 1: Milestone Progress Bar Chart */}
          <ChartCard
            title="Milestone & Execution Completion (%)"
            sub="Status across planning pillars & task execution"
            icon={BarChart3}
            className="xl:col-span-2"
          >
            <div className="h-[210px] sm:h-[235px] w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.milestoneAnalytics}
                    margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
                    barSize={20}
                  >
                    <defs>
                      <linearGradient id="gradResearch" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.6} />
                      </linearGradient>
                      <linearGradient id="gradPRD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF6B35" stopOpacity={1} />
                        <stop offset="100%" stopColor="#FF6B35" stopOpacity={0.6} />
                      </linearGradient>
                      <linearGradient id="gradRoadmap" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.6} />
                      </linearGradient>
                      <linearGradient id="gradArchitecture" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34D399" stopOpacity={1} />
                        <stop offset="100%" stopColor="#34D399" stopOpacity={0.6} />
                      </linearGradient>
                      <linearGradient id="gradTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity={1} />
                        <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="name" stroke="#8a8a93" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#8a8a93" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="completion" name="Completion" radius={[6, 6, 0, 0]}>
                      {analytics.milestoneAnalytics.map((entry, index) => {
                        const config = MILESTONE_COLORS[entry.name] || { color: FALLBACK_PALETTE[index % FALLBACK_PALETTE.length], fill: FALLBACK_PALETTE[index % FALLBACK_PALETTE.length] };
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.completion === 0 ? "rgba(255,255,255,0.06)" : config.fill}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pillar Badges Legend */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 border-t border-white/[0.06] pt-3">
              {analytics.milestoneAnalytics.map((entry, i) => {
                const config = MILESTONE_COLORS[entry.name] || { color: FALLBACK_PALETTE[i % FALLBACK_PALETTE.length] };
                return (
                  <div key={entry.name} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: config.color }} />
                    <span className="text-[10px] text-[#8a8a93] font-semibold">{entry.name}:</span>
                    <span className="text-[10px] font-bold font-mono text-white">{entry.completion}%</span>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          {/* Chart 2: Task Status Donut Chart */}
          <ChartCard
            title="Task Distribution"
            sub="Current work execution breakdown"
            icon={PieChartIcon}
          >
            <div className="h-[210px] sm:h-[235px] w-full relative flex items-center justify-center">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  {taskStats.total === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-[#8a8a93]">
                        <CheckSquare size={18} />
                      </div>
                      <p className="mt-2 text-xs text-[#8a8a93]">No tasks created yet</p>
                    </div>
                  ) : (
                    <PieChart>
                      <Pie
                        data={analytics.taskStatusChart.filter((d) => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius="54%"
                        outerRadius="76%"
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {analytics.taskStatusChart
                          .filter((d) => d.value > 0)
                          .map((entry, index) => (
                            <Cell key={`pie-cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.6)" strokeWidth={2} />
                          ))}
                      </Pie>
                      <Tooltip content={<DarkTooltip />} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              )}
              {taskStats.total > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl sm:text-2xl font-extrabold text-white font-mono" style={{ fontFamily: "var(--font-sora)" }}>
                    {taskStats.total}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-[#8a8a93] tracking-wider">Total Tasks</span>
                </div>
              )}
            </div>

            {/* Task Legend */}
            <div className="grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3 text-center text-xs">
              <div>
                <span className="block text-[9px] text-[#8a8a93] font-bold uppercase">Done</span>
                <span className="font-bold text-emerald-400 font-mono">{taskStats.completed}</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#8a8a93] font-bold uppercase">Building</span>
                <span className="font-bold text-sky-400 font-mono">{taskStats.inProgress}</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#8a8a93] font-bold uppercase">To Do</span>
                <span className="font-bold text-amber-400 font-mono">{taskStats.todo}</span>
              </div>
            </div>
          </ChartCard>
        </div>
      </motion.section>

      {/* Dynamic Recent Activity Feed */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-4"
      >
        <motion.div variants={sectionHeaderVariants} className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
            <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
              Recent Project Activity
            </h2>
            <p className="text-xs text-[#8a8a93]">Timeline of recent actions within this project.</p>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-5 sm:p-7 backdrop-blur-2xl shadow-xl"
        >
          {recentActivity.length === 0 ? (
            <p className="text-xs text-[#8a8a93]">No activity recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((act, index) => {
                const IconComp =
                  act.type === "research"
                    ? Sparkles
                    : act.type === "prd"
                    ? FileText
                    : act.type === "roadmap"
                    ? LayoutTemplate
                    : act.type === "architecture"
                    ? Brain
                    : act.type === "task"
                    ? CheckCircle2
                    : FolderKanban;

                return (
                  <div key={act.id}>
                    {index > 0 && <div className="my-3 h-px bg-white/[0.05]" />}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                          <IconComp size={16} className="text-orange-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-white truncate">{act.title}</p>
                          <p className="text-[11px] text-[#8a8a93] truncate">{act.description}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#8a8a93] font-mono shrink-0">{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-white/[0.07] bg-[#050505] px-6 py-4 mt-8 text-xs text-[#8a8a93] rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-medium text-white/80 text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            Unified Project OS — Realtime Sync Active
          </span>

          <div className="flex gap-1.5 items-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="h-1.5 w-3.5 rounded-full bg-orange-400/80"
                animate={{ scaleX: [1, 0.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
