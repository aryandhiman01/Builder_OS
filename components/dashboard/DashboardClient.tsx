"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban,
  CheckCircle2,
  Brain,
  Target,
  FolderPlus,
  Map,
  CheckSquare,
  Plus,
  RefreshCw,
  Calendar,
  Layers,
  Zap,
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState<"all" | "Building" | "Planning" | "Completed">("all");

  const fetchStats = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setIsRefreshing(true);

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
      setIsRefreshing(false);
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

  // Current date formatting
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (projectFilter === "all") return recentProjects;
    return recentProjects.filter((p) => p.status === projectFilter);
  }, [recentProjects, projectFilter]);

  const sectionAnimation = {
    initial: { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* AI Hero Banner */}
      <motion.div {...sectionAnimation}>
        <AIHeroCard />
      </motion.div>

      {/* Dynamic Stats Cards */}
      <motion.section {...sectionAnimation} className="space-y-4">
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Projects"
            value={loading && !stats ? "-" : (stats?.projectsCount ?? 0)}
            description="Active product workspaces"
            icon={FolderKanban}
            trend={stats && stats.projectsCount > 0 ? `+${stats.projectsCount} total` : "0"}
            trendColor="blue"
          />

          <StatsCard
            title="Tasks"
            value={loading && !stats ? "-" : (stats?.tasksCount ?? 0)}
            description="Open tasks pending"
            icon={CheckCircle2}
            trend={stats && stats.tasksCount > 0 ? `${stats.tasksCount} active` : "0"}
            trendColor="emerald"
          />

          <StatsCard
            title="AI Artifacts"
            value={loading && !stats ? "-" : (stats?.aiRequestsCount ?? 0)}
            description="Generations & PRDs"
            icon={Brain}
            trend={stats && stats.aiRequestsCount > 0 ? `+${stats.aiRequestsCount} runs` : "0"}
            trendColor="violet"
          />

          <StatsCard
            title="Progress"
            value={loading && !stats ? "-" : `${stats?.completionPercentage ?? 0}%`}
            description="Overall completion rate"
            icon={Target}
            trend={stats && stats.completionPercentage > 0 ? `${stats.completionPercentage}%` : "0%"}
            trendColor="green"
          />
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section {...sectionAnimation} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-400" />
              <h2
                className="text-xl sm:text-2xl font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                Quick Actions
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#8a8a93]">
              Direct access to key BuilderOS product engineering tools.
            </p>
          </div>
        </div>

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <QuickActionCard
            title="New Project"
            description="Initialize a new product workspace with PRDs, tasks & roadmaps."
            icon={FolderPlus}
            onClick={() => setIsCreateProjectOpen(true)}
            shortcut="⌘ N"
            color="indigo"
          />

          <QuickActionCard
            title="AI Workspace"
            description="Deep market research, PRD generation, and strategy prompts."
            href="/ai-workspace"
            icon={Brain}
            shortcut="⌘ A"
            color="violet"
          />

          <QuickActionCard
            title="Tasks Board"
            description="Track, assign, and execute product tasks effortlessly."
            href="/projects"
            icon={CheckSquare}
            shortcut="⌘ T"
            color="emerald"
          />

          <QuickActionCard
            title="Product Roadmaps"
            description="Visualize milestones, timelines, and feature rollouts."
            href="/projects"
            icon={Map}
            shortcut="⌘ R"
            color="amber"
          />
        </div>
      </motion.section>

      {/* Recent Projects Section */}
      <motion.section {...sectionAnimation} className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2
              className="text-xl sm:text-2xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Recent Projects
            </h2>
            <p className="mt-1 text-xs text-[#8a8a93]">
              Continue working on your latest active product builds.
            </p>
          </div>

          {/* Filter Tabs */}
          {recentProjects.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-white/10 bg-black/40 p-0.5">
                {(["all", "Building", "Planning", "Completed"] as const).map((filterVal) => (
                  <button
                    key={filterVal}
                    onClick={() => setProjectFilter(filterVal)}
                    className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-all ${
                      projectFilter === filterVal
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-[#8a8a93] hover:text-white"
                    }`}
                  >
                    {filterVal === "all" ? "All" : filterVal}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsCreateProjectOpen(true)}
                className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                <Plus size={14} />
                New
              </button>
            </div>
          )}
        </div>

        {loading && !stats ? (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-56 rounded-2xl border border-white/10 bg-[#09090c]/90 p-6 animate-pulse"
              >
                <div className="h-6 w-1/3 rounded bg-white/5 mb-4" />
                <div className="h-4 w-2/3 rounded bg-white/5 mb-2" />
                <div className="h-4 w-1/2 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-10 text-center backdrop-blur-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
              <Layers size={22} className="text-[#8a8a93]" />
            </div>
            <h3
              className="mt-4 text-base font-bold text-white"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              {recentProjects.length === 0 ? "No projects created yet" : "No matching projects"}
            </h3>
            <p className="mt-2 text-xs text-[#8a8a93] max-w-md mx-auto leading-relaxed">
              {recentProjects.length === 0
                ? "Start by creating your first product workspace to unlock research, PRDs, roadmaps, and tasks."
                : "No projects found matching the selected status filter."}
            </p>
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="btn-shimmer mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-100 active:scale-95 shadow-lg shadow-white/10"
            >
              <Plus size={15} />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {filteredProjects.map((project) => (
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
      </motion.section>

      {/* Real-time Activity Feed */}
      <motion.section {...sectionAnimation} className="mt-8">
        <RecentActivity activities={recentActivities} loading={loading && !stats} />
      </motion.section>

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
