"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
  Activity,
  CheckSquare,
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
  AreaChart,
  Area,
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchOverview = useCallback(
    async (isSilent = false) => {
      try {
        if (!isSilent) setLoading(true);
        const res = await fetch(`/api/projects/${projectId}/overview`);
        if (!res.ok) return;
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching real-time project overview:", err);
      } finally {
        if (!isSilent) setLoading(false);
      }
    },
    [projectId]
  );

  useEffect(() => {
    fetchOverview(false);

    const interval = setInterval(() => {
      fetchOverview(true);
    }, 3000);

    const handleFocus = () => fetchOverview(true);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchOverview]);

  if (loading && !data) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-white/5" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-3xl border border-white/10 bg-white/[0.03] p-6" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-zinc-400">
        Failed to load project overview. Please refresh.
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
      {/* Overview Heading */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Overview & Analytics</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Real-time project health, analytics graphs, and workspace quick actions.
          </p>
        </div>

        {/* Dynamic Health Score Badge */}
        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2">
          <Zap size={18} className="text-yellow-400" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Project Health
            </p>
            <p className="text-sm font-bold text-white">{healthScore} / 100 Score</p>
          </div>
        </div>
      </div>

      {/* Dynamic Stats Section */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Project Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20">
          <div className="flex items-center justify-between">
            <FolderKanban className="text-white" size={22} />
            <span className="text-xs text-zinc-500">Project</span>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-white truncate">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-zinc-500">{project.category} Workspace</p>
        </div>

        {/* Progress Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20">
          <div className="flex items-center justify-between">
            <Target className="text-emerald-400" size={22} />
            <span className="text-xs text-zinc-500">Progress</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-bold text-white">{progress}%</h3>
            <span className="text-xs font-medium text-emerald-400">
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

          <p className="mt-3 text-xs text-zinc-400">
            {taskStats.total > 0
              ? `${taskStats.completed} / ${taskStats.total} Tasks Completed (${taskStats.remaining} remaining)`
              : aiStatus.milestonesCompleted > 0
              ? `${aiStatus.milestonesCompleted} / 4 Planning Milestones Completed`
              : "No tasks or AI specs created yet"}
          </p>
        </div>

        {/* Created Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20">
          <div className="flex items-center justify-between">
            <CalendarDays className="text-blue-400" size={22} />
            <span className="text-xs text-zinc-500">Created</span>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-white truncate">
            {createdDateFormatted}
          </h3>
          <p className="mt-2 text-sm text-zinc-500">Project Created</p>
        </div>

        {/* Updated Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20">
          <div className="flex items-center justify-between">
            <Clock3 className="text-yellow-400" size={22} />
            <span className="text-xs text-zinc-500">Updated</span>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-white truncate">
            {updatedDateFormatted}
          </h3>
          <p className="mt-2 text-sm text-zinc-500">Last Updated</p>
        </div>
      </section>

      {/* Quick Actions (DOCUMENTATION REMOVED AS REQUESTED) */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-white">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* AI Generation Status Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Sparkles className="text-sky-400" size={24} />
                <span className="text-xs font-semibold text-zinc-400">
                  {aiStatus.milestonesCompleted} / 4 Generated
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white">
                AI Generation Status
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Product specification & planning assets.
              </p>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 text-xs">
                <Link
                  href={`/projects/${projectId}/research`}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 transition hover:bg-white/[0.06]"
                >
                  <span className="text-zinc-300">Research</span>
                  <span
                    className={
                      aiStatus.research.generated
                        ? "text-emerald-400 font-semibold"
                        : "text-zinc-500"
                    }
                  >
                    {aiStatus.research.generated
                      ? `Generated (${aiStatus.research.count})`
                      : "Not Generated"}
                  </span>
                </Link>

                <Link
                  href={`/projects/${projectId}/prd`}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 transition hover:bg-white/[0.06]"
                >
                  <span className="text-zinc-300">PRD</span>
                  <span
                    className={
                      aiStatus.prd.generated
                        ? "text-emerald-400 font-semibold"
                        : "text-zinc-500"
                    }
                  >
                    {aiStatus.prd.generated ? "Generated" : "Not Generated"}
                  </span>
                </Link>

                <Link
                  href={`/projects/${projectId}/roadmap`}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 transition hover:bg-white/[0.06]"
                >
                  <span className="text-zinc-300">Roadmap</span>
                  <span
                    className={
                      aiStatus.roadmap.generated
                        ? "text-emerald-400 font-semibold"
                        : "text-zinc-500"
                    }
                  >
                    {aiStatus.roadmap.generated ? "Generated" : "Not Generated"}
                  </span>
                </Link>

                <Link
                  href={`/projects/${projectId}/architecture`}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 transition hover:bg-white/[0.06]"
                >
                  <span className="text-zinc-300">Architecture</span>
                  <span
                    className={
                      aiStatus.architecture.generated
                        ? "text-emerald-400 font-semibold"
                        : "text-zinc-500"
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
            className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.05] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <CheckCircle2 className="text-emerald-400" size={24} />
                <span className="text-xs font-semibold text-zinc-400">
                  {taskStats.completed} / {taskStats.total} Completed
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white">Task Management</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {taskStats.total === 0
                  ? "No tasks created yet. Click to add your first milestone task."
                  : `${taskStats.completed} of ${taskStats.total} tasks completed. ${taskStats.remaining} remaining.`}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs text-emerald-400 font-medium">
                  {taskStats.completed} Completed
                </span>
                <span className="rounded-lg bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 text-xs text-sky-400 font-medium">
                  {taskStats.inProgress} In Progress
                </span>
                <span className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 text-xs text-yellow-400 font-medium">
                  {taskStats.todo} To Do
                </span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white">
              Manage Tasks
              <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* NEW SECTION: Project Analytics & Visual Charts */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BarChart3 className="text-sky-400" size={20} />
            Project Analytics & Visual Insights
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Real-time visual breakdown of milestone completion, task distribution, and AI asset volume.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Chart 1: Milestone Progress Bar Chart */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Milestone & Execution Completion (%)
                </h3>
                <p className="text-xs text-zinc-500">
                  Status across planning pillars & task execution
                </p>
              </div>
              <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs text-sky-400 font-medium">
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
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
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

          {/* Chart 2: Task Status Donut/Pie Chart */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-semibold text-white">Task Distribution</h3>
                <p className="text-xs text-zinc-500">Current work status</p>
              </div>
              <PieChartIcon className="text-emerald-400" size={18} />
            </div>

            <div className="h-52 w-full flex items-center justify-center">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  {taskStats.total === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-500">
                        <CheckSquare size={18} />
                      </div>
                      <p className="mt-2 text-xs text-zinc-400">No tasks created yet</p>
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
                          borderColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
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
            <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-center text-xs">
              <div>
                <span className="block text-[10px] text-zinc-500">Completed</span>
                <span className="font-semibold text-emerald-400">{taskStats.completed}</span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-500">In Progress</span>
                <span className="font-semibold text-sky-400">{taskStats.inProgress}</span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-500">To Do</span>
                <span className="font-semibold text-yellow-400">{taskStats.todo}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Info & AI Workspace Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Information */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Project Information
          </h2>
          <div className="space-y-5">
            <div>
              <p className="text-xs text-zinc-500">Project Name</p>
              <p className="mt-1 text-sm font-medium text-white">{project.title}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Description</p>
              <p className="mt-1 text-sm text-zinc-300">
                {project.description || "No description added yet."}
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-zinc-500">Status</p>
                <span className="mt-1 inline-block rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-0.5 text-xs font-medium text-sky-400">
                  {project.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Category</p>
                <p className="mt-1 text-sm text-white">{project.category}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Workspace Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between">
          <div>
            <h2 className="mb-6 text-xl font-semibold text-white">
              AI Workspace
            </h2>
            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-5">
              <div className="flex items-center gap-3">
                <Sparkles className="text-sky-400" size={20} />
                <h3 className="font-semibold text-white text-sm">
                  {aiStatus.milestonesCompleted > 0
                    ? `AI Spec Workspace (${aiStatus.milestonesCompleted}/4 Milestones)`
                    : "AI Assistant Ready"}
                </h3>
              </div>
              <p className="mt-3 text-xs leading-6 text-zinc-300">
                {aiStatus.milestonesCompleted > 0
                  ? `Your project specification is ${Math.round((aiStatus.milestonesCompleted / 4) * 100)}% complete. Continue generating or refining PRDs, roadmaps, and architecture.`
                  : "No AI assets have been generated for this project yet. Start with Research to begin building your product."}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`/projects/${projectId}/research`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
            >
              <Sparkles size={15} />
              {aiStatus.research.generated ? "Open AI Research" : "Start AI Research"}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Recent Activity Feed */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Recent Project Activity
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-zinc-500">No activity recorded yet.</p>
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
                        <IconComp size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{act.title}</p>
                        <p className="text-xs text-zinc-500">{act.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
