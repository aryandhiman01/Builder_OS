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
  Plus,
} from "lucide-react";

interface TaskStats {
  total: number;
  completed: number;
  remaining: number;
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

  const { project, progress, taskStats, aiStatus, recentActivity } = data;

  const createdDateFormatted = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(project.createdAt));

  const updatedDateFormatted = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(project.updatedAt));

  return (
    <div className="space-y-8">
      {/* Overview Heading */}
      <div>
        <h2 className="text-3xl font-bold text-white">Overview</h2>
        <p className="mt-2 text-zinc-500">
          Everything related to your project in one place.
        </p>
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

      {/* Quick Actions */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-white">Quick Actions</h2>
        <div className="grid gap-6 lg:grid-cols-3">
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

              <div className="mt-4 space-y-2.5 text-xs">
                <Link
                  href={`/projects/${projectId}/research`}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 transition hover:bg-white/[0.06]"
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
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 transition hover:bg-white/[0.06]"
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
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 transition hover:bg-white/[0.06]"
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
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 transition hover:bg-white/[0.06]"
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
              <CheckCircle2 className="mb-4 text-emerald-400" size={24} />
              <h3 className="text-lg font-semibold text-white">Task Management</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {taskStats.total === 0
                  ? "No tasks created yet. Click to add your first milestone task."
                  : `${taskStats.completed} of ${taskStats.total} tasks completed. ${taskStats.remaining} remaining.`}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white">
              Manage Tasks
              <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Documentation Card */}
          <Link
            href={`/projects/${projectId}/architecture`}
            className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.05] flex flex-col justify-between"
          >
            <div>
              <FolderKanban className="mb-4 text-sky-400" size={24} />
              <h3 className="text-lg font-semibold text-white">Documentation</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {aiStatus.documentsCount + (aiStatus.architecture.generated ? 1 : 0) > 0
                  ? `${aiStatus.documentsCount + (aiStatus.architecture.generated ? 1 : 0)} product documentation and architecture specs available.`
                  : "Keep all product documentation, architecture and technical notes in one place."}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white">
              View Specs & Docs
              <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </div>
          </Link>
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
