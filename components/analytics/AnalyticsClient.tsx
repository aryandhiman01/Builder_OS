"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

/* ─────────────────────────────────── Animation ── */
const sectionAnim = {
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

/* ─────────────────────────────── Custom Tooltip ── */
const DarkTooltip = ({
  active, payload, label,
}: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#09090c]/98 p-3 shadow-2xl backdrop-blur-2xl">
      {label && <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">{label}</p>}
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: e.color }} />
          <span className="text-[#8a8a93]">{e.name}:</span>
          <span className="font-bold text-white">{e.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────── StatsCard ── */
function StatsCard({
  title, value, description, icon: Icon, trend, trendColor = "orange",
}: {
  title: string; value: string | number; description: string;
  icon: React.ElementType; trend?: string;
  trendColor?: "orange" | "amber" | "emerald" | "blue" | "violet";
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#09090c]/90 p-6 backdrop-blur-2xl shadow-xl transition-all duration-300 ${t.border} hover:bg-[#0c0c10]`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">{title}</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
            {value}
          </h2>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border shadow-inner transition-transform duration-300 group-hover:scale-110 ${t.iconBg}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-3">
        <p className="text-xs text-[#8a8a93]">{description}</p>
        {trend && (
          <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-medium ${t.badge}`}>
            <TrendingUp size={12} />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ───────────────────────────────── Section Header ── */
function SectionHeader({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-orange-400" />
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-[#8a8a93]">{sub}</p>
      </div>
    </div>
  );
}

/* ───────────────────────────────────── Chart Card ── */
function ChartCard({
  title, sub, icon: Icon, children, className = "",
}: { title: string; sub?: string; icon: React.ElementType; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#09090c]/90 p-6 backdrop-blur-2xl shadow-xl ${className}`}>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
              <Icon size={15} className="text-orange-400" />
            </div>
            <h3 className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>{title}</h3>
          </div>
          {sub && <p className="mt-1 pl-10 text-[11px] text-[#8a8a93]">{sub}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ────────────────────────────────────── Skeleton ── */
function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.04] ${className}`} />;
}
function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => <Pulse key={i} className="h-36" />)}
      </div>
      <div className="grid gap-5 grid-cols-2 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => <Pulse key={i} className="h-24" />)}
      </div>
      <Pulse className="h-72 w-full" />
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => <Pulse key={i} className="h-64" />)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────── Empty Chart ── */
function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
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


  /* ── Error ── */
  if (error && !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10">
          <AlertCircle size={22} className="text-rose-400" />
        </div>
        <p className="text-sm font-semibold text-white">Failed to load analytics</p>
        <p className="text-xs text-[#8a8a93]">{error}</p>
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
        <Pulse className="h-4 w-48" />
        <LoadingState />
      </div>
    );
  }

  if (!data) return null;
  const { kpis, charts } = data;

  return (
    <div className="space-y-8 max-w-full pb-10">

      {/* ── Page Header ── */}
      <motion.div {...sectionAnim} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1
              className="text-xl sm:text-2xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Analytics
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-orange-400">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              Live
            </span>
          </div>
          <p className="mt-1 text-xs text-[#8a8a93]">
            Real-time insights across all your projects, tasks &amp; AI activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
      <motion.section {...sectionAnim} className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-orange-400" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
            Overview Metrics
          </h2>
        </div>
        <p className="text-xs text-[#8a8a93]">Top-level numbers across your entire BuilderOS workspace.</p>
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
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
      <motion.section {...sectionAnim} className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-orange-400" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
            AI Breakdown
          </h2>
        </div>
        <p className="text-xs text-[#8a8a93]">Detailed view of every AI artifact generated in your workspace.</p>
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
          {[
            { label: "Research", value: kpis.totalResearches, icon: Sparkles, color: "violet" as const },
            { label: "PRDs", value: kpis.totalPrds, icon: FileText, color: "orange" as const },
            { label: "Roadmaps", value: kpis.totalRoadmaps, icon: Map, color: "blue" as const },
            { label: "Architectures", value: kpis.totalArchitectures, icon: Cpu, color: "emerald" as const },
            {
              label: "Tokens Used",
              value: kpis.totalTokensUsed > 1000
                ? `${(kpis.totalTokensUsed / 1000).toFixed(1)}K`
                : kpis.totalTokensUsed,
              icon: LayoutTemplate,
              color: "amber" as const,
            },
          ].map(({ label, value, icon: Ic, color }) => (
            <StatsCard
              key={label}
              title={label}
              value={value}
              description={label === "Tokens Used" && kpis.avgGenTime ? `~${kpis.avgGenTime}ms avg` : "Generated artifact"}
              icon={Ic}
              trendColor={color}
            />
          ))}
        </div>
      </motion.section>

      {/* ── Cumulative Growth & New Monthly Additions ── */}
      <motion.section {...sectionAnim} className="space-y-6">
        <SectionHeader
          icon={TrendingUp}
          title="Growth & Monthly Velocity"
          sub="Cumulative workspace totals and month-by-month new build additions."
        />

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* 1. Cumulative Workspace Growth Chart */}
          <ChartCard
            title="Cumulative Workspace Growth"
            sub="Total accumulated Projects · Tasks · AI Assets"
            icon={TrendingUp}
          >
            <ResponsiveContainer width="100%" height={260} debounce={150}>
              <AreaChart data={charts.monthlyGrowth} margin={{ top: 5, right: 15, left: -15, bottom: 0 }}>
                <defs>
                  {[["gradP", COLORS.orange], ["gradT", COLORS.blue], ["gradA", COLORS.violet]].map(([id, col]) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={col} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={col} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-[11px] text-[#8a8a93]">{v}</span>} />
                <Area type="monotone" dataKey="projects" name="Projects" stroke={COLORS.orange} fill="url(#gradP)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="tasks" name="Tasks" stroke={COLORS.blue} fill="url(#gradT)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="aiRequests" name="AI Requests" stroke={COLORS.violet} fill="url(#gradA)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 2. New Monthly Additions Chart */}
          <ChartCard
            title="New Monthly Additions"
            sub="Specific new builds created per month"
            icon={BarChart2}
          >
            <ResponsiveContainer width="100%" height={260} debounce={150}>
              <BarChart data={charts.monthlyAdditions || charts.monthlyGrowth} margin={{ top: 5, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-[11px] text-[#8a8a93]">{v}</span>} />
                <Bar dataKey="projects" name="New Projects" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
                <Bar dataKey="tasks" name="New Tasks" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
                <Bar dataKey="aiRequests" name="New AI Assets" fill={COLORS.violet} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </motion.section>

      {/* ── Task Distribution + Priority ── */}
      <motion.section {...sectionAnim} className="space-y-4">
        <SectionHeader icon={CheckCircle2} title="Task Analytics" sub="Status and priority distribution across all project tasks." />
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard title="Task Status Distribution" icon={Activity}>
            {charts.taskStatusDistribution.length === 0 ? (
              <EmptyChart label="No tasks created yet" />
            ) : (
              <ResponsiveContainer width="100%" height={240} debounce={150}>
                <PieChart>
                  <Pie data={charts.taskStatusDistribution} cx="50%" cy="50%" innerRadius="52%" outerRadius="75%" paddingAngle={4} dataKey="count" nameKey="status">
                    {charts.taskStatusDistribution.map((e, i) => (
                      <Cell key={i} fill={STATUS_COLORS[e.status] || PIE_PALETTE[i % PIE_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-[11px] text-[#8a8a93]">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Task Priority Breakdown" icon={Flame}>
            {charts.taskPriorityDistribution.length === 0 ? (
              <EmptyChart label="No tasks created yet" />
            ) : (
              <ResponsiveContainer width="100%" height={240} debounce={150}>
                <PieChart>
                  <Pie data={charts.taskPriorityDistribution} cx="50%" cy="50%" innerRadius="52%" outerRadius="75%" paddingAngle={4} dataKey="count" nameKey="priority">
                    {charts.taskPriorityDistribution.map((e, i) => (
                      <Cell key={i} fill={PRIORITY_COLORS[e.priority] || PIE_PALETTE[i % PIE_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-[11px] text-[#8a8a93]">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </motion.section>

      {/* ── Daily Activity + Weekly Tasks ── */}
      <motion.section {...sectionAnim} className="space-y-4">
        <SectionHeader icon={Activity} title="Activity Patterns" sub="Daily actions and weekly task completion over recent periods." />
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard title="Daily Activity — Last 14 Days" sub="All workspace actions per day" icon={Activity}>
            <ResponsiveContainer width="100%" height={220} debounce={150}>
              <BarChart data={charts.dailyActivity} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#8a8a93", fontSize: 9 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v.split(",")[0]} />
                <YAxis tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="actions" name="Actions" radius={[6, 6, 0, 0]}>
                  {charts.dailyActivity.map((_, i) => (
                    <Cell key={i} fill={`rgba(255,107,53,${0.35 + (i / charts.dailyActivity.length) * 0.65})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Weekly Task Completion" sub="Created vs completed tasks per week" icon={CheckCircle2}>
            <ResponsiveContainer width="100%" height={220} debounce={150}>
              <LineChart data={charts.weeklyTaskCompletion} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="week" tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-[11px] text-[#8a8a93]">{v}</span>} />
                <Line type="monotone" dataKey="created" name="Created" stroke={COLORS.blue} strokeWidth={2} dot={{ fill: COLORS.blue, r: 3 }} />
                <Line type="monotone" dataKey="completed" name="Completed" stroke={COLORS.emerald} strokeWidth={2} dot={{ fill: COLORS.emerald, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </motion.section>

      {/* ── AI Breakdown + Categories ── */}
      <motion.section {...sectionAnim} className="space-y-4">
        <SectionHeader icon={Brain} title="AI & Project Insights" sub="AI generation breakdown and project category distribution." />
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard title="AI Generation Breakdown" sub="Artifacts per type" icon={Brain}>
            {charts.aiBreakdown.every((a) => a.count === 0) ? (
              <EmptyChart label="No AI generations yet" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200} debounce={150}>
                  <BarChart data={charts.aiBreakdown} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }} barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="type" tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="count" name="Count" radius={[0, 6, 6, 0]}>
                      {charts.aiBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex flex-wrap gap-3">
                  {charts.aiBreakdown.map((a) => (
                    <div key={a.type} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: a.color }} />
                      <span className="text-[10px] text-[#8a8a93]">
                        {a.type}: <span className="font-bold text-white">{a.count}</span>
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
              <ResponsiveContainer width="100%" height={240} debounce={150}>
                <PieChart>
                  <Pie data={charts.projectCategoryData} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius="72%" paddingAngle={4}>
                    {charts.projectCategoryData.map((_, i) => (
                      <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-[11px] text-[#8a8a93]">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </motion.section>

      {/* ── Project Progress Bars ── */}
      <motion.section {...sectionAnim} className="space-y-4">
        <SectionHeader icon={Target} title="Project Progress" sub="Completion scores calculated from tasks and AI milestones per project." />
        <div className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-6 backdrop-blur-2xl shadow-xl">
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
            <div className="space-y-5">
              {charts.projectProgressData.map((p, i) => {
                const col = p.progress >= 80 ? COLORS.emerald : p.progress >= 40 ? COLORS.amber : COLORS.orange;
                const gradTo = p.progress >= 80 ? COLORS.teal : p.progress >= 40 ? COLORS.orange : COLORS.rose;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{p.project}</span>
                      <span className="text-xs font-bold font-mono" style={{ color: col }}>{p.progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${p.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.06 + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ background: `linear-gradient(90deg, ${col}, ${gradTo})` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
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
              Live data · Last synced {lastRefreshed.toLocaleString()} · Auto-refreshes every 30s
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
