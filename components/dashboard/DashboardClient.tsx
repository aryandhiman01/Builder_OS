"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Brain,
  Target,
  FolderPlus,
  Map,
  CheckSquare,
  Plus,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import RecentActivity, { ActivityItemData } from "@/components/dashboard/RecentActivity";
import AIHeroCard from "@/components/dashboard/AIHeroCard";
import CreateProjectModal from "@/components/projects/CreateProjectModal";

interface ProjectData {
  id: string;
  title: string;
  description: string;
  status: "Planning" | "Building" | "Completed";
  progress: number;
  updatedAt: string;
  members: number;
  color: string;
}

interface StatsData {
  projectsCount: number;
  tasksCount: number;
  totalTasksCount: number;
  aiRequestsCount: number;
  completionPercentage: number;
}

interface DashboardClientProps {
  initialUserName?: string;
}

export default function DashboardClient({ initialUserName = "Builder" }: DashboardClientProps) {
  const [userName, setUserName] = useState(initialUserName);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentProjects, setRecentProjects] = useState<ProjectData[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const fetchStats = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) return;

      const data = await res.json();
      if (data.user?.name) {
        setUserName(data.user.name);
      }
      setStats(data.stats);
      setRecentProjects(data.recentProjects || []);
      setRecentActivities(data.recentActivities || []);
    } catch (err) {
      console.error("Failed to fetch dashboard real-time data:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  // Initial fetch and 3-second real-time polling loop
  useEffect(() => {
    fetchStats(false);

    const interval = setInterval(() => {
      fetchStats(true);
    }, 3000);

    const handleFocus = () => fetchStats(true);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchStats]);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back, {userName}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Your workspace is ready. Start building something great.
        </p>
      </div>

      <AIHeroCard />

      {/* Dynamic Stats Cards */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Projects"
          value={loading && !stats ? "-" : (stats?.projectsCount ?? 0)}
          description="Active projects"
          icon={FolderKanban}
          trend={stats && stats.projectsCount > 0 ? `+${stats.projectsCount}` : "0"}
          trendColor="green"
        />

        <StatsCard
          title="Tasks"
          value={loading && !stats ? "-" : (stats?.tasksCount ?? 0)}
          description="Tasks remaining"
          icon={CheckCircle2}
          trend={stats && stats.tasksCount > 0 ? `${stats.tasksCount} open` : "0"}
          trendColor="blue"
        />

        <StatsCard
          title="AI Requests"
          value={loading && !stats ? "-" : (stats?.aiRequestsCount ?? 0)}
          description="Generated AI artifacts"
          icon={Brain}
          trend={stats && stats.aiRequestsCount > 0 ? `+${stats.aiRequestsCount}` : "0"}
          trendColor="yellow"
        />

        <StatsCard
          title="Completion"
          value={loading && !stats ? "-" : `${stats?.completionPercentage ?? 0}%`}
          description="Overall progress"
          icon={Target}
          trend={stats && stats.completionPercentage > 0 ? `${stats.completionPercentage}%` : "0%"}
          trendColor="green"
        />
      </section>

      {/* Quick Actions */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Jump into your most-used BuilderOS features.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <QuickActionCard
            title="New Project"
            description="Create and organize a new product."
            icon={FolderPlus}
            onClick={() => setIsCreateProjectOpen(true)}
          />

          <QuickActionCard
            title="AI Workspace"
            description="Research, plan and build with AI."
            href="/projects"
            icon={Brain}
          />

          <QuickActionCard
            title="Tasks"
            description="Track your work and deadlines."
            href="/projects"
            icon={CheckSquare}
          />

          <QuickActionCard
            title="Roadmaps"
            description="Generate a complete product roadmap."
            href="/projects"
            icon={Map}
          />
        </div>
      </section>

      {/* Dynamic Recent Projects */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Recent Projects</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Continue working on your latest products.
            </p>
          </div>
          {recentProjects.length > 0 && (
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              <Plus size={14} />
              New Project
            </button>
          )}
        </div>

        {loading && !stats ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-56 rounded-3xl border border-white/10 bg-white/[0.03] p-6 animate-pulse"
              >
                <div className="h-6 w-1/3 rounded bg-white/5 mb-4" />
                <div className="h-4 w-2/3 rounded bg-white/5 mb-2" />
                <div className="h-4 w-1/2 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <FolderPlus size={26} className="text-zinc-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              No projects created yet
            </h3>
            <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
              Start by creating your first product workspace to unlock research, PRDs, roadmaps, and tasks.
            </p>
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              <Plus size={16} />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {recentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                status={project.status}
                progress={project.progress}
                updatedAt={project.updatedAt}
                members={project.members}
                color={project.color}
              />
            ))}
          </div>
        )}
      </section>

      {/* Real-time Activity Feed */}
      <section className="mt-8">
        <RecentActivity activities={recentActivities} loading={loading && !stats} />
      </section>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={isCreateProjectOpen}
        onClose={() => {
          setIsCreateProjectOpen(false);
          fetchStats(true);
        }}
      />
    </div>
  );
}
