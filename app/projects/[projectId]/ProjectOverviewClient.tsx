"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
      <div className="space-y-8 animate-pulse">
        <div className="h-44 rounded-3xl border border-white/10 bg-[#09090c]/90 p-8" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-3xl border border-white/10 bg-[#09090c]/90 p-6" />
          ))}
        </div>
        <div className="h-80 rounded-3xl border border-white/10 bg-[#09090c]/90" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-12 text-center text-zinc-400">
        Failed to load real-time project overview. Please refresh.
      </div>
    );
  }

  const { project, progress, taskStats, aiStatus, analytics, recentActivity } = data;

  const createdDateFormatted = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(project.createdAt));

  const updatedDateFormatted = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(project.updatedAt));

  const healthScore = Math.min(
    100,
    Math.round(
      (aiStatus.milestonesCompleted / 4) * 50 +
        (taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 50 : 0)
    )
  );

  return (
    <div className="space-y-8">
      {/* Landing & Dashboard Mockup Card Hero Banner */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
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
        {/* Top Window Header (Landing Page Mockup UI Style) */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07] bg-white/[0.02]">
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
              BuilderOS — Project Operating Workspace
            </span>
          </div>

          <div className="hidden sm:block w-16" />
        </div>

        {/* Hero Body Container */}
        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">

            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.02em" }}
            >
              Overview &{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                Analytics
              </span>
              .
            </h1>

            <p className="text-xs sm:text-sm text-[#9a9a9f] max-w-xl">
              Real-time project health, task execution metrics, and AI specs analytics.
            </p>
          </div>

          {/* Dynamic Health Score Badge Card */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/[0.04] p-4 backdrop-blur-xl shrink-0 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05]">
              <Zap size={22} className={healthScore >= 75 ? "text-emerald-400 animate-pulse" : healthScore >= 40 ? "text-yellow-400" : "text-rose-400"} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a8a93]">
                Project Health
              </p>
              <p className="text-base sm:text-lg font-extrabold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                {healthScore} / 100 Score
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Dynamic Realtime Stats Cards */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Project Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 backdrop-blur-2xl shadow-xl transition-all hover:border-white/25"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05]">
              <FolderKanban className="text-orange-400" size={20} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a8a93]">Workspace</span>
          </div>
          <h3 className="mt-5 text-lg font-bold text-white truncate" style={{ fontFamily: "var(--font-sora)" }}>
            {project.title}
          </h3>
          <p className="mt-1 text-xs text-[#8a8a93]">{project.category} Category</p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 backdrop-blur-2xl shadow-xl transition-all hover:border-white/25"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
              <Target className="text-emerald-400" size={20} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a8a93]">Completion</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-white" style={{ fontFamily: "var(--font-sora)" }}>
              {progress}%
            </h3>
            <span className="text-xs font-bold text-emerald-400">
              {project.status}
            </span>
          </div>

          {/* Dynamic Animated Progress Bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: project.color || "#38bdf8",
              }}
            />
          </div>

          <p className="mt-2.5 text-[11px] text-[#8a8a93]">
            {taskStats.total > 0
              ? `${taskStats.completed} / ${taskStats.total} Tasks Completed`
              : aiStatus.milestonesCompleted > 0
              ? `${aiStatus.milestonesCompleted} / 4 AI Milestones`
              : "No tasks or AI specs created yet"}
          </p>
        </motion.div>

        {/* Created Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 backdrop-blur-2xl shadow-xl transition-all hover:border-white/25"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10">
              <CalendarDays className="text-sky-400" size={20} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a8a93]">Created</span>
          </div>
          <h3 className="mt-5 text-base font-bold text-white truncate" style={{ fontFamily: "var(--font-sora)" }}>
            {createdDateFormatted}
          </h3>
          <p className="mt-1 text-xs text-[#8a8a93]">Project Workspace Created</p>
        </motion.div>

        {/* Updated Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 backdrop-blur-2xl shadow-xl transition-all hover:border-white/25"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
              <Clock3 className="text-yellow-400" size={20} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a8a93]">Updated</span>
          </div>
          <h3 className="mt-5 text-base font-bold text-white truncate" style={{ fontFamily: "var(--font-sora)" }}>
            {updatedDateFormatted}
          </h3>
          <p className="mt-1 text-xs text-[#8a8a93]">Last Live Activity</p>
        </motion.div>
      </section>

      {/* Quick Actions & Spec Status Section */}
      <section>
        <h2 className="mb-5 text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
          Quick Actions & Spec Status
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* AI Generation Status Card */}
          <div className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-7 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-sky-400" size={20} />
                  <span className="text-xs font-bold text-white">AI Specifications</span>
                </div>
                <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-mono font-bold text-sky-400">
                  {aiStatus.milestonesCompleted} / 4 Generated
                </span>
              </div>
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                AI Generation Status
              </h3>
              <p className="mt-1 text-xs text-[#8a8a93]">
                Product specification & planning assets status.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 text-xs">
                <Link
                  href={`/projects/${projectId}/research`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:bg-white/[0.08] hover:border-orange-500/40"
                >
                  <span className="text-zinc-200 font-semibold">Research</span>
                  <span
                    className={
                      aiStatus.research.generated
                        ? "text-emerald-400 font-bold"
                        : "text-[#8a8a93]"
                    }
                  >
                    {aiStatus.research.generated
                      ? `Generated (${aiStatus.research.count})`
                      : "Not Generated"}
                  </span>
                </Link>

                <Link
                  href={`/projects/${projectId}/prd`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:bg-white/[0.08] hover:border-orange-500/40"
                >
                  <span className="text-zinc-200 font-semibold">PRD</span>
                  <span
                    className={
                      aiStatus.prd.generated
                        ? "text-emerald-400 font-bold"
                        : "text-[#8a8a93]"
                    }
                  >
                    {aiStatus.prd.generated ? "Generated" : "Not Generated"}
                  </span>
                </Link>

                <Link
                  href={`/projects/${projectId}/roadmap`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:bg-white/[0.08] hover:border-orange-500/40"
                >
                  <span className="text-zinc-200 font-semibold">Roadmap</span>
                  <span
                    className={
                      aiStatus.roadmap.generated
                        ? "text-emerald-400 font-bold"
                        : "text-[#8a8a93]"
                    }
                  >
                    {aiStatus.roadmap.generated ? "Generated" : "Not Generated"}
                  </span>
                </Link>

                <Link
                  href={`/projects/${projectId}/architecture`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:bg-white/[0.08] hover:border-orange-500/40"
                >
                  <span className="text-zinc-200 font-semibold">Architecture</span>
                  <span
                    className={
                      aiStatus.architecture.generated
                        ? "text-emerald-400 font-bold"
                        : "text-[#8a8a93]"
                    }
                  >
                    {aiStatus.architecture.generated ? "Generated" : "Not Generated"}
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Task Management Card */}
          <Link
            href={`/projects/${projectId}/tasks`}
            className="group rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-7 backdrop-blur-2xl shadow-xl transition-all hover:border-white/25 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <CheckCircle2 className="text-emerald-400" size={20} />
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-mono">
                  {taskStats.completed} / {taskStats.total} Completed
                </span>
              </div>
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>Task Execution Hub</h3>
              <p className="mt-1.5 text-xs leading-5 text-[#8a8a93]">
                {taskStats.total === 0
                  ? "No tasks created yet. Click to add your first milestone task."
                  : `${taskStats.completed} of ${taskStats.total} tasks completed. ${taskStats.remaining} remaining.`}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-400 font-bold">
                  {taskStats.completed} Completed
                </span>
                <span className="rounded-xl bg-sky-500/10 border border-sky-500/20 px-3 py-1 text-xs text-sky-400 font-bold">
                  {taskStats.inProgress} In Progress
                </span>
                <span className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs text-amber-400 font-bold">
                  {taskStats.todo} To Do
                </span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-white">
              <span>Manage Tasks Workspace</span>
              <ArrowRight size={14} className="transition group-hover:translate-x-1 text-orange-400" />
            </div>
          </Link>
        </div>
      </section>

      {/* Analytics & Visual Charts Section */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-sora)" }}>
            <BarChart3 className="text-sky-400" size={20} />
            Project Analytics & Visual Insights
          </h2>
          <p className="mt-1 text-xs text-[#8a8a93]">
            Real-time visual breakdown of milestone completion and task distribution.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Chart 1: Milestone Progress Bar Chart */}
          <div className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 backdrop-blur-2xl shadow-xl flex flex-col justify-between xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                  Milestone & Execution Completion (%)
                </h3>
                <p className="text-xs text-[#8a8a93]">
                  Status across planning pillars & task execution
                </p>
              </div>
              <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-400 font-bold font-mono">
                Live Status
              </span>
            </div>

            <div className="h-64 w-full mt-2">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.milestoneAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#71717A" fontSize={11} tickLine={false} />
                    <YAxis stroke="#71717A" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0d0d0d",
                        borderColor: "rgba(255,255,255,0.15)",
                        borderRadius: "14px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                      formatter={(val: any) => [`${val}%`, "Completion"]}
                    />
                    <Bar dataKey="completion" radius={[8, 8, 0, 0]}>
                      {analytics.milestoneAnalytics.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.completion === 100 ? "#22C55E" : entry.completion > 0 ? "#38BDF8" : "#3F3F46"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Task Status Donut Chart */}
          <div className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>Task Distribution</h3>
                <p className="text-xs text-[#8a8a93]">Current work execution</p>
              </div>
              <PieChartIcon className="text-emerald-400" size={18} />
            </div>

            <div className="h-52 w-full flex items-center justify-center">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  {taskStats.total === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#8a8a93]">
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
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analytics.taskStatusChart
                          .filter((d) => d.value > 0)
                          .map((entry, index) => (
                            <Cell key={`pie-cell-${index}`} fill={entry.color} />
                          ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0d0d0d",
                          borderColor: "rgba(255,255,255,0.15)",
                          borderRadius: "14px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>

            {/* Task Legend */}
            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center text-xs">
              <div>
                <span className="block text-[10px] text-[#8a8a93] font-bold uppercase">Done</span>
                <span className="font-bold text-emerald-400">{taskStats.completed}</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#8a8a93] font-bold uppercase">Building</span>
                <span className="font-bold text-sky-400">{taskStats.inProgress}</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#8a8a93] font-bold uppercase">To Do</span>
                <span className="font-bold text-amber-400">{taskStats.todo}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Recent Activity Feed */}
      <section className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-7 backdrop-blur-2xl shadow-xl">
        <h2 className="mb-5 text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
          Recent Project Activity
        </h2>
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
                  {index > 0 && <div className="my-3 h-px bg-white/5" />}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                        <IconComp size={16} className="text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-white">{act.title}</p>
                        <p className="text-[11px] text-[#8a8a93]">{act.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#8a8a93] font-mono">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom Status Bar matching Mockup Landing Style */}
      <footer className="border-t border-white/[0.07] bg-[#050505] px-6 py-4 mt-8 text-xs text-[#8a8a93] rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-medium text-white/80">
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
