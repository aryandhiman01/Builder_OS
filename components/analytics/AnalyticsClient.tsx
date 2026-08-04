"use client";

import { useState, useEffect, useCallback, startTransition, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  FolderKanban, CheckCircle2, Brain, Zap, TrendingUp, FileText,
  Map, Cpu, MessageSquare, Activity, RefreshCw,
  AlertCircle, BarChart2, Target, Flame, Layers, LayoutTemplate, Sparkles,
} from "lucide-react";

/* ─────────────────────────────────────────── Types ── */
interface KPIs {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  taskCompletionRate: number;
  totalAiRequests: number;
  totalAiConversations: number;
  totalTokensUsed: number;
  avgGenTime: number;
  totalResearches: number;
  totalPrds: number;
  totalRoadmaps: number;
  totalArchitectures: number;
  totalDocuments: number;
}

interface AnalyticsData {
  fetchedAt: string;
  kpis: KPIs;
  charts: {
    monthlyGrowth: { month: string; projects: number; tasks: number; aiRequests: number }[];
    monthlyAdditions?: { month: string; projects: number; tasks: number; aiRequests: number }[];
    taskStatusDistribution: { status: string; count: number }[];
    taskPriorityDistribution: { priority: string; count: number }[];
    aiBreakdown: { type: string; count: number; color: string }[];
    projectCategoryData: { category: string; count: number }[];
    projectProgressData: { project: string; progress: number }[];
    dailyActivity: { day: string; actions: number }[];
    weeklyTaskCompletion: { week: string; completed: number; created: number }[];
  };
}

/* ─────────────────────────────────────── Palette ── */
const COLORS = {
  orange: "#FF6B35",
  amber: "#F59E0B",
  emerald: "#34D399",
  blue: "#38BDF8",
  violet: "#8B5CF6",
  rose: "#F43F5E",
  indigo: "#6366F1",
  teal: "#14B8A6",
};

const STATUS_COLORS: Record<string, string> = {
  Todo: COLORS.blue, "In Progress": COLORS.amber, "In-progress": COLORS.amber,
  Review: COLORS.violet, Done: COLORS.emerald, Completed: COLORS.emerald, Blocked: COLORS.rose,
};
const PRIORITY_COLORS: Record<string, string> = {
  Low: COLORS.emerald, Medium: COLORS.amber, High: COLORS.orange,
  Critical: COLORS.rose, Urgent: COLORS.rose,
};
const PIE_PALETTE = Object.values(COLORS);

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
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: e.color }} />
          <span className="text-[#8a8a93]">{e.name}:</span>
          <span className="font-bold text-white font-mono">{e.value?.toLocaleString() ?? 0}</span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────── StatsCard ── */
function StatsCard({
  title, value, description, icon: Icon, trend, trendColor = "orange", compact = false,
}: {
  title: string; value: string | number; description: string;
  icon: React.ElementType; trend?: string;
  trendColor?: "orange" | "amber" | "emerald" | "blue" | "violet";
  compact?: boolean;
}) {
  const themes = {
    orange: { border: "hover:border-orange-500/40", iconBg: "border-orange-500/20 bg-orange-500/10 text-orange-400", badge: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    amber: { border: "hover:border-amber-500/40", iconBg: "border-amber-500/20 bg-amber-500/10 text-amber-400", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    emerald: { border: "hover:border-emerald-500/40", iconBg: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    blue: { border: "hover:border-sky-500/40", iconBg: "border-sky-500/20 bg-sky-500/10 text-sky-400", badge: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
    violet: { border: "hover:border-violet-500/40", iconBg: "border-violet-500/20 bg-violet-500/10 text-violet-400", badge: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  };
  const t = themes[trendColor];
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#09090c]/90 backdrop-blur-2xl shadow-xl transition-all duration-300 ${t.border} hover:bg-[#0c0c10] ${
        compact ? "p-3 sm:p-4" : "p-3.5 sm:p-5"
      }`}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-[#8a8a93] truncate block">
            {title}
          </span>
          <h2
            className={`mt-0.5 sm:mt-2 font-extrabold tracking-tight text-white truncate ${
              compact ? "text-lg sm:text-2xl" : "text-xl sm:text-3xl xl:text-4xl"
            }`}
            style={{ fontFamily: "var(--font-sora)" }}
          >
            {value}
          </h2>
        </div>
        <div className={`flex shrink-0 items-center justify-center rounded-xl border shadow-inner transition-transform duration-300 group-hover:scale-110 ${
          compact ? "h-7 w-7 sm:h-8 sm:w-8" : "h-8 w-8 sm:h-11 sm:w-11"
        } ${t.iconBg}`}>
          <Icon size={compact ? 14 : 18} className="sm:hidden" />
          <Icon size={compact ? 16 : 20} className="hidden sm:block" />
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/[0.06] pt-2 sm:pt-2.5 gap-1">
        <p className="text-[10px] sm:text-xs text-[#8a8a93] truncate">{description}</p>
        {trend && (
          <div className={`flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 sm:px-2 text-[9px] sm:text-[11px] font-mono font-medium self-start sm:self-auto ${t.badge}`}>
            <TrendingUp size={10} className="sm:hidden" />
            <TrendingUp size={11} className="hidden sm:block" />
            <span className="truncate">{trend}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ───────────────────────────────── Section Header ── */
function SectionHeader({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <motion.div variants={sectionHeaderVariants} className="flex items-start gap-2.5">
      <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 mt-0.5">
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-400" />
      </div>
      <div>
        <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-[#8a8a93]">{sub}</p>
      </div>
    </motion.div>
  );
}

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

/* ────────────────────────────────────── Skeleton ── */
function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.04] ${className}`} />;
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <Pulse key={i} className="h-36" />)}
      </div>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
        {[...Array(5)].map((_, i) => <Pulse key={i} className="h-28" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => <Pulse key={i} className="h-72" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => <Pulse key={i} className="h-64" />)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────── Empty Chart ── */
function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-44 flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
        <BarChart2 size={18} className="text-[#8a8a93]" />
      </div>
      <p className="text-xs text-[#8a8a93]">{label}</p>
    </div>
  );
}

/* ══════════════════════════════════ Main Component ══ */
export default function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [timeAgoText, setTimeAgoText] = useState<string>("just now");

  const fetchAnalytics = useCallback(async (silent = false, forceRefresh = false) => {
    try {
      if (!silent) setLoading(true);
      else setIsRefreshing(true);
      setError(null);
      const url = forceRefresh ? "/api/analytics?refresh=true" : "/api/analytics";
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const json: AnalyticsData = await res.json();

      startTransition(() => {
        setData(json);
        const now = new Date();
        setLastRefreshed(now);
        setTimeAgoText("just now");
      });

      try {
        sessionStorage.setItem("builderos_analytics_cache", JSON.stringify(json));
      } catch {
        // ignore quota errors
      }
    } catch {
      setError("Could not load analytics data.");
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load: SWR instant render from sessionStorage + 1-time fetch on mount
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("builderos_analytics_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.kpis) {
          setData(parsed);
          setLoading(false);
          if (parsed.fetchedAt) {
            setLastRefreshed(new Date(parsed.fetchedAt));
          }
        }
      }
    } catch {
      // ignore
    }

    // Fetch once on page mount (silent if SWR cached data exists)
    const hasCache = !!sessionStorage.getItem("builderos_analytics_cache");
    fetchAnalytics(hasCache);
  }, [fetchAnalytics]);

  // Relative time ago updater (Pure UI, zero DB calls)
  useEffect(() => {
    if (!lastRefreshed) return;
    const interval = setInterval(() => {
      const diffSec = Math.floor((new Date().getTime() - lastRefreshed.getTime()) / 1000);
      if (diffSec < 15) setTimeAgoText("just now");
      else if (diffSec < 60) setTimeAgoText(`${diffSec}s ago`);
      else {
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) setTimeAgoText(`${diffMin}m ago`);
        else setTimeAgoText(lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [lastRefreshed]);

  /* Memoized AI Breakdown Sub-metrics */
  const aiSubMetrics = useMemo(() => {
    if (!data?.kpis) return [];
    const kps = data.kpis;
    return [
      { label: "Research", value: kps.totalResearches, icon: Zap, color: "violet" as const },
      { label: "PRDs", value: kps.totalPrds, icon: FileText, color: "orange" as const },
      { label: "Roadmaps", value: kps.totalRoadmaps, icon: Map, color: "blue" as const },
      { label: "Architectures", value: kps.totalArchitectures, icon: Cpu, color: "emerald" as const },
      {
        label: "Tokens Used",
        value: kps.totalTokensUsed > 1000
          ? `${(kps.totalTokensUsed / 1000).toFixed(1)}K`
          : kps.totalTokensUsed,
        icon: LayoutTemplate,
        color: "amber" as const,
      },
    ];
  }, [data]);

  /* ── Error ── */
  if (error && !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10">
          <AlertCircle size={22} className="text-rose-400" />
        </div>
        <p className="text-sm font-semibold text-white">Failed to load analytics</p>
        <p className="text-xs text-[#8a8a93] text-center">{error}</p>
        <button
          onClick={() => fetchAnalytics(false)}
          className="btn-shimmer mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-100 active:scale-95 shadow-lg shadow-white/10"
        >
          <RefreshCw size={13} />
          Retry
        </button>
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="space-y-6 max-w-full pb-10 p-4 sm:p-6">
        <Pulse className="h-9 w-64 mb-1" />
        <Pulse className="h-4 w-48 mb-6" />
        <LoadingState />
      </div>
    );
  }

  if (!data) return null;
  const { kpis, charts } = data;

  return (
    <div className="space-y-8 max-w-full pb-12 px-3 sm:px-6">

      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-5"
      >
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1
              className="text-xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Analytics
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-orange-400">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              Live Workspace
            </span>
          </div>
          <p className="mt-1 text-xs text-[#8a8a93]">
            Real-time performance metrics across projects, tasks &amp; AI engine.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {lastRefreshed && (
            <span className="text-[11px] font-mono text-[#8a8a93]">
              Updated {timeAgoText}
            </span>
          )}
          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchAnalytics(true, true);
            }}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={12} className={isRefreshing ? "animate-spin text-orange-400" : ""} />
            {isRefreshing ? "Syncing…" : "Refresh"}
          </button>
        </div>
      </motion.div>

      {/* ── Tier-1 KPI Stats ── */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-4"
      >
        <SectionHeader
          icon={Target}
          title="Overview Metrics"
          sub="Top-level core KPIs calculated across your BuilderOS workspace."
        />
        <div className="grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Projects"
            value={kpis.totalProjects}
            description="Active product workspaces"
            icon={FolderKanban}
            trend={`${kpis.totalProjects} total`}
            trendColor="orange"
          />
          <StatsCard
            title="Tasks Completed"
            value={kpis.completedTasks}
            description={`${kpis.taskCompletionRate}% of all tasks done`}
            icon={CheckCircle2}
            trend={`${kpis.taskCompletionRate}% rate`}
            trendColor="emerald"
          />
          <StatsCard
            title="AI Generations"
            value={kpis.totalAiRequests}
            description="PRDs, roadmaps, research & more"
            icon={Brain}
            trend={`+${kpis.totalAiRequests} runs`}
            trendColor="amber"
          />
          <StatsCard
            title="AI Conversations"
            value={kpis.totalAiConversations}
            description="Workspace chat sessions"
            icon={MessageSquare}
            trend={`${kpis.totalAiConversations} chats`}
            trendColor="blue"
          />
        </div>
      </motion.section>

      {/* ── Tier-2 AI Sub-metrics ── */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-4"
      >
        <SectionHeader
          icon={Zap}
          title="AI Artifact Breakdown"
          sub="Granular details of every generated document and AI request."
        />
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {aiSubMetrics.map(({ label, value, icon: Ic, color }) => (
            <StatsCard
              key={label}
              title={label}
              value={value}
              description={label === "Tokens Used" && kpis.avgGenTime ? `~${kpis.avgGenTime}ms avg` : "Generated artifact"}
              icon={Ic}
              trendColor={color}
              compact
            />
          ))}
        </div>
      </motion.section>

      {/* ── Cumulative Growth & New Monthly Additions ── */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-4 sm:space-y-6"
      >
        <SectionHeader
          icon={TrendingUp}
          title="Growth & Monthly Velocity"
          sub="Cumulative workspace totals and month-by-month new build additions."
        />

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* 1. Cumulative Workspace Growth Chart */}
          <ChartCard
            title="Cumulative Workspace Growth"
            sub="Total accumulated Projects · Tasks · AI Assets"
            icon={TrendingUp}
          >
            <div className="h-[220px] sm:h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={150}>
                <AreaChart data={charts.monthlyGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {[["gradP", COLORS.orange], ["gradT", COLORS.blue], ["gradA", COLORS.violet]].map(([id, col]) => (
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={col} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={col} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend iconType="circle" iconSize={7} formatter={(v) => <span className="text-[11px] text-[#8a8a93]">{v}</span>} />
                  <Area type="monotone" dataKey="projects" name="Projects" stroke={COLORS.orange} fill="url(#gradP)" strokeWidth={2.5} dot={false} />
                  <Area type="monotone" dataKey="tasks" name="Tasks" stroke={COLORS.blue} fill="url(#gradT)" strokeWidth={2.5} dot={false} />
                  <Area type="monotone" dataKey="aiRequests" name="AI Requests" stroke={COLORS.violet} fill="url(#gradA)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* 2. New Monthly Additions Chart */}
          <ChartCard
            title="New Monthly Additions"
            sub="Specific new builds created per month"
            icon={BarChart2}
          >
            <div className="h-[220px] sm:h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={150}>
                <BarChart data={charts.monthlyAdditions || charts.monthlyGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend iconType="circle" iconSize={7} formatter={(v) => <span className="text-[11px] text-[#8a8a93]">{v}</span>} />
                  <Bar dataKey="projects" name="New Projects" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tasks" name="New Tasks" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="aiRequests" name="New AI Assets" fill={COLORS.violet} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </motion.section>

      {/* ── Task Distribution + Priority ── */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-4"
      >
        <SectionHeader icon={CheckCircle2} title="Task Analytics" sub="Status and priority distribution across all project tasks." />
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard title="Task Status Distribution" icon={Activity}>
            {charts.taskStatusDistribution.length === 0 ? (
              <EmptyChart label="No tasks created yet" />
            ) : (
              <div className="h-[230px] sm:h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={150}>
                  <PieChart>
                    <Pie
                      data={charts.taskStatusDistribution}
                      cx="50%" cy="50%"
                      innerRadius="50%" outerRadius="72%"
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="status"
                    >
                      {charts.taskStatusDistribution.map((e, i) => (
                        <Cell key={i} fill={STATUS_COLORS[e.status] || PIE_PALETTE[i % PIE_PALETTE.length]} stroke="rgba(0,0,0,0.4)" strokeWidth={1} />
                      ))}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                    <Legend iconType="circle" iconSize={7} formatter={(v) => <span className="text-[11px] text-[#8a8a93]">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          <ChartCard title="Task Priority Breakdown" icon={Flame}>
            {charts.taskPriorityDistribution.length === 0 ? (
              <EmptyChart label="No tasks created yet" />
            ) : (
              <div className="h-[230px] sm:h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={150}>
                  <PieChart>
                    <Pie
                      data={charts.taskPriorityDistribution}
                      cx="50%" cy="50%"
                      innerRadius="50%" outerRadius="72%"
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="priority"
                    >
                      {charts.taskPriorityDistribution.map((e, i) => (
                        <Cell key={i} fill={PRIORITY_COLORS[e.priority] || PIE_PALETTE[i % PIE_PALETTE.length]} stroke="rgba(0,0,0,0.4)" strokeWidth={1} />
                      ))}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                    <Legend iconType="circle" iconSize={7} formatter={(v) => <span className="text-[11px] text-[#8a8a93]">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
        </div>
      </motion.section>

      {/* ── Daily Activity + Weekly Tasks ── */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-4"
      >
        <SectionHeader icon={Activity} title="Activity Patterns" sub="Daily actions and weekly task completion over recent periods." />
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard title="Daily Activity — Last 14 Days" sub="All workspace actions per day" icon={Activity}>
            <div className="h-[210px] sm:h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={150}>
                <BarChart data={charts.dailyActivity} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#8a8a93", fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v.split(",")[0]}
                  />
                  <YAxis tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="actions" name="Actions" radius={[5, 5, 0, 0]}>
                    {charts.dailyActivity.map((_, i) => (
                      <Cell key={i} fill={`rgba(255,107,53,${0.35 + (i / Math.max(charts.dailyActivity.length - 1, 1)) * 0.65})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Weekly Task Completion" sub="Created vs completed tasks per week" icon={CheckCircle2}>
            <div className="h-[210px] sm:h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={150}>
                <LineChart data={charts.weeklyTaskCompletion} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend iconType="circle" iconSize={7} formatter={(v) => <span className="text-[11px] text-[#8a8a93]">{v}</span>} />
                  <Line type="monotone" dataKey="created" name="Created" stroke={COLORS.blue} strokeWidth={2.5} dot={{ fill: COLORS.blue, r: 3 }} />
                  <Line type="monotone" dataKey="completed" name="Completed" stroke={COLORS.emerald} strokeWidth={2.5} dot={{ fill: COLORS.emerald, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </motion.section>

      {/* ── AI Breakdown + Categories ── */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-4"
      >
        <SectionHeader icon={Brain} title="AI & Project Insights" sub="AI generation breakdown and project category distribution." />
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard title="AI Generation Breakdown" sub="Artifacts per type" icon={Brain}>
            {charts.aiBreakdown.every((a) => a.count === 0) ? (
              <EmptyChart label="No AI generations yet" />
            ) : (
              <>
                <div className="h-[200px] sm:h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={150}>
                    <BarChart data={charts.aiBreakdown} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 0 }} barSize={14}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="type" tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip content={<DarkTooltip />} />
                      <Bar dataKey="count" name="Count" radius={[0, 6, 6, 0]}>
                        {charts.aiBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex flex-wrap gap-2.5 sm:gap-3 border-t border-white/[0.06] pt-3">
                  {charts.aiBreakdown.map((a) => (
                    <div key={a.type} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: a.color }} />
                      <span className="text-[10px] sm:text-xs text-[#8a8a93]">
                        {a.type}: <span className="font-bold text-white font-mono">{a.count}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </ChartCard>

          <ChartCard title="Project Categories" sub="Distribution by project type" icon={FolderKanban}>
            {charts.projectCategoryData.length === 0 ? (
              <EmptyChart label="No projects yet" />
            ) : (
              <div className="h-[230px] sm:h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={150}>
                  <PieChart>
                    <Pie
                      data={charts.projectCategoryData}
                      dataKey="count"
                      nameKey="category"
                      cx="50%" cy="50%"
                      outerRadius="72%"
                      paddingAngle={4}
                    >
                      {charts.projectCategoryData.map((_, i) => (
                        <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} stroke="rgba(0,0,0,0.4)" strokeWidth={1} />
                      ))}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                    <Legend iconType="circle" iconSize={7} formatter={(v) => <span className="text-[11px] text-[#8a8a93]">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
        </div>
      </motion.section>

      {/* ── Project Progress Bars ── */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-4"
      >
        <SectionHeader icon={Target} title="Project Progress" sub="Completion scores calculated from tasks and AI milestones per project." />
        <motion.div
          variants={cardVariants}
          className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-4 sm:p-6 backdrop-blur-2xl shadow-xl w-full"
        >
          {charts.projectProgressData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Layers size={18} className="text-[#8a8a93]" />
              </div>
              <p className="mt-3 text-sm font-semibold text-white">No projects created yet</p>
              <p className="mt-1 text-xs text-[#8a8a93] max-w-sm">
                Create a project and add tasks or AI artifacts to see progress scores here.
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {charts.projectProgressData.map((p, i) => {
                const col = p.progress >= 80 ? COLORS.emerald : p.progress >= 40 ? COLORS.amber : COLORS.orange;
                const gradTo = p.progress >= 80 ? COLORS.teal : p.progress >= 40 ? COLORS.orange : COLORS.rose;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-md">{p.project}</span>
                      <span className="text-xs font-bold font-mono shrink-0" style={{ color: col }}>{p.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${p.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.05 + 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ background: `linear-gradient(90deg, ${col}, ${gradTo})` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.section>

      {/* ── Footer ── */}
      <AnimatePresence>
        {lastRefreshed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 py-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-center text-[11px] text-[#8a8a93]">
              Live data · Last synced {lastRefreshed.toLocaleTimeString()} · Cached SWR engine
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
