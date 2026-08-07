"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban,
  CheckCircle2,
  Brain,
  Target,
  Plus,
  Layers,
  Filter,
  ChevronDown,
  Check,
  Map,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import dynamic from "next/dynamic";

import StatsCard from "@/components/dashboard/StatsCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import RecentActivity, { ActivityItemData } from "@/components/dashboard/RecentActivity";
import AIHeroCard from "@/components/dashboard/AIHeroCard";

const CreateProjectModal = dynamic(() => import("@/components/projects/CreateProjectModal"), {
  ssr: false,
});

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

interface RoadmapItemData {
  id: string;
  title: string;
  type: string;
  status: string;
  progress: number;
  updatedAt: string;
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
  const [recentRoadmaps, setRecentRoadmaps] = useState<RoadmapItemData[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState<"all" | "Building" | "Planning" | "Completed">("all");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const fetchStats = useCallback(async (isSilent = false, forceRefresh = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setIsRefreshing(true);

      const url = forceRefresh ? "/api/dashboard/stats?refresh=true" : "/api/dashboard/stats";
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return;

      const data = await res.json();
      if (data.user?.name) {
        setUserName(data.user.name);
      }
      setStats(data.stats);
      setRecentProjects(data.recentProjects || []);
      setRecentRoadmaps(data.recentRoadmaps || []);
      setRecentActivities(data.recentActivities || []);

      try {
        sessionStorage.setItem("builderos_dashboard_cache", JSON.stringify(data));
      } catch {
        // ignore quota errors
      }
    } catch (err) {
      console.error("Failed to fetch dashboard real-time data:", err);
    } finally {
      if (!isSilent) setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Instant SWR Render from cache + silent background revalidation on mount & focus
  useEffect(() => {
    let hasCache = false;
    try {
      const cached = sessionStorage.getItem("builderos_dashboard_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.stats) {
          if (parsed.user?.name) setUserName(parsed.user.name);
          setStats(parsed.stats);
          setRecentProjects(parsed.recentProjects || []);
          setRecentActivities(parsed.recentActivities || []);
          setLoading(false);
          hasCache = true;
        }
      }
    } catch {
      // ignore
    }

    fetchStats(hasCache, true);

    const handleFocus = () => fetchStats(true, true);
    window.addEventListener("focus", handleFocus);

    return () => {
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
    <div className="space-y-6 max-w-full pb-10">
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
            trendColor="orange"
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
            trendColor="amber"
          />

          <StatsCard
            title="Progress"
            value={loading && !stats ? "-" : `${stats?.completionPercentage ?? 0}%`}
            description="Overall completion rate"
            icon={Target}
            trend={stats && stats.completionPercentage > 0 ? `${stats.completionPercentage}%` : "0%"}
            trendColor="orange"
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

          {/* Filter Dropdown */}
          {recentProjects.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#09090c] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-white/[0.06] hover:border-white/20 active:scale-95 shadow-md"
              >
                <Filter size={13} className="text-orange-400" />
                <span>
                  {projectFilter === "all" ? "All Projects" : projectFilter}
                </span>
                <ChevronDown
                  size={13}
                  className={`text-[#8a8a93] transition-transform duration-200 ${
                    isFilterDropdownOpen ? "rotate-180 text-white" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isFilterDropdownOpen && (
                  <>
                    {/* Backdrop to close when clicking outside */}
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsFilterDropdownOpen(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full z-30 mt-2 w-44 rounded-xl border border-white/10 bg-[#09090c]/98 p-1.5 backdrop-blur-2xl shadow-2xl"
                    >
                      {(["all", "Building", "Planning", "Completed"] as const).map((filterVal) => {
                        const isSelected = projectFilter === filterVal;
                        return (
                          <button
                            key={filterVal}
                            onClick={() => {
                              setProjectFilter(filterVal);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                              isSelected
                                ? "bg-white/10 text-white font-semibold"
                                : "text-[#8a8a93] hover:bg-white/[0.06] hover:text-white"
                            }`}
                          >
                            <span className="capitalize">
                              {filterVal === "all" ? "All Projects" : filterVal}
                            </span>
                            {isSelected && <Check size={13} className="text-orange-400" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
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
