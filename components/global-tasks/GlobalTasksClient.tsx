"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  List,
  LayoutGrid,
  Calendar,
  AlignLeft,
  Search,
  Plus,
  Brain,
  ChevronDown,
  Check,
  X,
  SlidersHorizontal,
  Flag,
  FolderKanban,
} from "lucide-react";

import dynamic from "next/dynamic";

import MyDayView from "./MyDayView";
import ListView from "./ListView";
import KanbanView from "./KanbanView";
import CalendarView from "./CalendarView";
import TimelineView from "./TimelineView";
import TaskStatsBar from "./TaskStatsBar";
import TaskDrawer from "./TaskDrawer";
import GlobalCreateTaskModal from "./GlobalCreateTaskModal";
import AIGenerateModal from "./AIGenerateModal";

export type TaskView = "myDay" | "list" | "kanban" | "calendar" | "timeline";

export interface GlobalTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  estimatedHours: number | null;
  tags: string | null;
  subtasks: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  project: { id: string; title: string; color: string };
}

export interface TaskStats {
  today: number;
  inProgress: number;
  completed: number;
  overdue: number;
  highPriorityToday: number;
  totalFocusHours: number;
}

interface GlobalTasksClientProps {
  userName: string;
}

const VIEWS: { id: TaskView; label: string; icon: React.ElementType }[] = [
  { id: "myDay", label: "My Day", icon: Sun },
  { id: "list", label: "List", icon: AlignLeft },
  { id: "kanban", label: "Kanban", icon: LayoutGrid },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "timeline", label: "Timeline", icon: List },
];

const PRIORITY_FILTERS = ["all", "high", "medium", "low"];
const DATE_FILTERS = ["all", "today", "tomorrow", "this_week", "upcoming", "completed", "overdue"];

export default function GlobalTasksClient({ userName }: GlobalTasksClientProps) {
  const [activeView, setActiveView] = useState<TaskView>("myDay");
  const [tasks, setTasks] = useState<GlobalTask[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [projects, setProjects] = useState<{ id: string; title: string; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<GlobalTask | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [tasksRes, statsRes, projectsRes] = await Promise.all([
        fetch("/api/tasks", { cache: "no-store" }),
        fetch("/api/tasks/stats", { cache: "no-store" }),
        fetch("/api/projects", { cache: "no-store" }),
      ]);
      let fetchedTasks: GlobalTask[] = [];
      let fetchedStats: TaskStats | null = null;
      let fetchedProjects: { id: string; title: string; color: string }[] = [];

      if (tasksRes.ok) {
        const d = await tasksRes.json();
        fetchedTasks = d.tasks || [];
        setTasks(fetchedTasks);
      }
      if (statsRes.ok) {
        const d = await statsRes.json();
        fetchedStats = d;
        setStats(fetchedStats);
      }
      if (projectsRes.ok) {
        const d = await projectsRes.json();
        fetchedProjects = (d.projects || []).map((p: { id: string; title: string; color: string }) => ({
          id: p.id,
          title: p.title,
          color: p.color,
        }));
        setProjects(fetchedProjects);
      }

      try {
        sessionStorage.setItem("builderos_tasks_cache", JSON.stringify({
          tasks: fetchedTasks,
          stats: fetchedStats,
          projects: fetchedProjects,
        }));
      } catch {
        // ignore
      }
    } catch (e) {
      console.error("Failed to fetch tasks data:", e);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let hasCache = false;
    try {
      const cached = sessionStorage.getItem("builderos_tasks_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.tasks) {
          setTasks(parsed.tasks || []);
          if (parsed.stats) setStats(parsed.stats);
          if (parsed.projects) setProjects(parsed.projects);
          setLoading(false);
          hasCache = true;
        }
      }
    } catch {
      // ignore
    }

    fetchData(hasCache);
    const interval = setInterval(() => fetchData(true), 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Real-time dynamic stats calculation from tasks state (0ms latency update)
  const derivedStats: TaskStats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    let todayCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let overdueCount = 0;
    let highPriorityCount = 0;
    let focusHoursSum = 0;

    tasks.forEach((t) => {
      const isCompleted = t.status === "completed";
      const isInProgress = t.status === "in-progress";

      if (isInProgress) inProgressCount++;
      if (isCompleted) completedCount++;

      const due = t.dueDate ? new Date(t.dueDate) : null;
      const created = new Date(t.createdAt);

      const isDueToday = due && due >= todayStart && due < todayEnd;
      const isCreatedToday = created >= todayStart && created < todayEnd;
      const isOverdue = due && due < todayStart && !isCompleted;

      if (isOverdue) overdueCount++;

      if (!isCompleted && (isDueToday || isCreatedToday || isInProgress)) {
        todayCount++;
        if (t.priority === "high") highPriorityCount++;
      }

      if (!isCompleted && t.estimatedHours) {
        focusHoursSum += t.estimatedHours;
      }
    });

    return {
      today: todayCount,
      inProgress: inProgressCount,
      completed: completedCount,
      overdue: overdueCount,
      highPriorityToday: highPriorityCount,
      totalFocusHours: Math.round(focusHoursSum * 10) / 10,
    };
  }, [tasks]);

  // Filtered tasks (memoized to prevent re-renders on UI toggle)
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !task.title.toLowerCase().includes(q) &&
          !task.description?.toLowerCase().includes(q) &&
          !task.project.title.toLowerCase().includes(q)
        )
          return false;
      }
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
      if (projectFilter !== "all" && task.projectId !== projectFilter) return false;
      if (dateFilter !== "all") {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);
        const tomorrowEnd = new Date(todayEnd);
        tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
        const weekEnd = new Date(todayStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const due = task.dueDate ? new Date(task.dueDate) : null;

        if (dateFilter === "today") {
          if (!due || due < todayStart || due >= todayEnd) return false;
        } else if (dateFilter === "tomorrow") {
          if (!due || due < todayEnd || due >= tomorrowEnd) return false;
        } else if (dateFilter === "this_week") {
          if (!due || due < todayStart || due >= weekEnd) return false;
        } else if (dateFilter === "upcoming") {
          if (!due || due < todayEnd) return false;
        } else if (dateFilter === "completed") {
          if (task.status !== "completed") return false;
        } else if (dateFilter === "overdue") {
          if (!due || due >= todayStart || task.status === "completed") return false;
        }
      }
      return true;
    });
  }, [tasks, searchQuery, priorityFilter, projectFilter, dateFilter]);

  const handleTaskUpdate = useCallback(
    async (taskId: string, updates: Partial<GlobalTask>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        fetchData(true);
      } catch (e) {
        console.error("Failed to update task:", e);
        fetchData(true);
      }
    },
    [fetchData]
  );

  const handleTaskDelete = useCallback(
    async (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setSelectedTask(null);
      try {
        await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
        fetchData(true);
      } catch (e) {
        console.error("Failed to delete task:", e);
        fetchData(true);
      }
    },
    [fetchData]
  );

  const renderedView = useMemo(() => {
    const props = {
      tasks: filteredTasks,
      allTasks: tasks,
      onTaskClick: setSelectedTask,
      onTaskUpdate: handleTaskUpdate,
      onTaskDelete: handleTaskDelete,
      onRefresh: () => fetchData(true),
      loading,
    };

    switch (activeView) {
      case "myDay":
        return <MyDayView {...props} userName={userName} stats={derivedStats || stats} onCreateTask={() => setIsCreateOpen(true)} />;
      case "list":
        return <ListView {...props} />;
      case "kanban":
        return <KanbanView {...props} />;
      case "calendar":
        return <CalendarView {...props} />;
      case "timeline":
        return <TimelineView {...props} />;
    }
  }, [activeView, filteredTasks, tasks, loading, userName, derivedStats, stats, handleTaskUpdate, handleTaskDelete, fetchData]);

  return (
    <div className="flex flex-col h-full min-h-0 space-y-0">
      {/* ─── Page Header ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4 pb-4 sm:pb-5 border-b border-white/[0.07]"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
            Tasks
          </h1>
          <p className="mt-0.5 text-xs text-[#8a8a93]">
            Your developer command center — all projects, one place.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Search */}
          <div className="relative flex-1 sm:w-48 min-w-[130px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a93]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="h-9 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-8 pr-7 text-xs text-white placeholder-[#8a8a93] outline-none transition focus:border-white/20 focus:bg-white/[0.06]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8a93] hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setIsFilterOpen((v) => !v)}
            className={`flex h-9 shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl border px-2.5 sm:px-3 text-xs font-semibold transition touch-manipulation cursor-pointer select-none ${
              isFilterOpen
                ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                : "border-white/10 bg-white/[0.04] text-[#8a8a93] hover:text-white hover:bg-white/[0.07]"
            }`}
          >
            <SlidersHorizontal size={13} />
            <span className="hidden xs:inline">Filters</span>
          </button>

          {/* New Task */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn-shimmer flex h-9 shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl border border-white/15 bg-white/[0.07] px-3 sm:px-4 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-95 touch-manipulation cursor-pointer select-none"
          >
            <Plus size={14} />
            <span>New Task</span>
          </button>

          {/* AI Generate — white premium button */}
          <button
            onClick={() => setIsAIOpen(true)}
            className="btn-shimmer flex h-9 shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl bg-white px-3 sm:px-4 text-xs font-semibold text-black shadow-md transition hover:bg-zinc-100 active:scale-95 touch-manipulation cursor-pointer select-none"
          >
            <Brain size={14} className="text-orange-500" />
            <span className="hidden xs:inline">AI Generate</span>
            <span className="xs:hidden">AI</span>
          </button>
        </div>
      </motion.div>

      {/* ─── Filter Bar (collapsible) ──────────────── */}
      {isFilterOpen && (
        <div className="border-b border-white/[0.08] py-3.5 sm:py-4 overlay-animate-in">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
            {/* Date Filter Dropdown */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <span className="text-xs font-semibold text-[#8a8a93] flex items-center gap-1.5 shrink-0 min-w-[62px] sm:min-w-0">
                <Calendar size={13} className="text-orange-400" /> Date:
              </span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-9 flex-1 sm:flex-none sm:w-auto rounded-xl border border-white/10 bg-[#111115] px-3 text-xs font-semibold text-white outline-none focus:border-orange-500/40 transition cursor-pointer"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this_week">This Week</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Priority Filter Dropdown */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <span className="text-xs font-semibold text-[#8a8a93] flex items-center gap-1.5 shrink-0 min-w-[62px] sm:min-w-0">
                <Flag size={13} className="text-orange-400" /> Priority:
              </span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-9 flex-1 sm:flex-none sm:w-auto rounded-xl border border-white/10 bg-[#111115] px-3 text-xs font-semibold text-white outline-none focus:border-orange-500/40 transition cursor-pointer capitalize"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* Project Filter Dropdown */}
            {projects.length > 0 && (
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <span className="text-xs font-semibold text-[#8a8a93] flex items-center gap-1.5 shrink-0 min-w-[62px] sm:min-w-0">
                  <FolderKanban size={13} className="text-orange-400" /> Project:
                </span>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="h-9 flex-1 sm:flex-none sm:max-w-[200px] rounded-xl border border-white/10 bg-[#111115] px-3 text-xs font-semibold text-white outline-none focus:border-orange-500/40 transition cursor-pointer truncate"
                >
                  <option value="all">All Projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Clear Filters Button (if active) */}
            {(dateFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all" || searchQuery) && (
              <button
                onClick={() => {
                  setDateFilter("all");
                  setPriorityFilter("all");
                  setProjectFilter("all");
                  setSearchQuery("");
                }}
                className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-semibold transition py-2 px-3.5 rounded-xl border border-orange-500/20 bg-orange-500/10 hover:bg-orange-500/20 touch-manipulation cursor-pointer"
              >
                <X size={12} /> Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── Stats Bar ────────────────────────────── */}
      <div className="pt-4 pb-3 sm:pt-5 sm:pb-4">
        <TaskStatsBar stats={derivedStats || stats} loading={loading} />
      </div>

      {/* ─── View Tabs ───────────────────────────── */}
      <div className="overflow-x-auto scrollbar-none flex items-center gap-1 border-b border-white/[0.07] pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
        {VIEWS.map((view) => {
          const Icon = view.icon;
          const isActive = activeView === view.id;
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`relative flex h-9 shrink-0 whitespace-nowrap items-center gap-1.5 sm:gap-2 rounded-t-lg px-3.5 sm:px-4 text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "text-white bg-white/[0.06]"
                  : "text-[#8a8a93] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={14} />
              {view.label}
              {view.id === "myDay" && (
                <span className="ml-0.5 text-orange-400">⭐</span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeViewTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Active View ─────────────────────────── */}
      <div className="flex-1 min-h-0 pt-4 sm:pt-5 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderedView}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Modals ──────────────────────────────── */}
      <GlobalCreateTaskModal
        open={isCreateOpen}
        projects={projects}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => { fetchData(true); setIsCreateOpen(false); }}
      />

      <AIGenerateModal
        open={isAIOpen}
        projects={projects}
        onClose={() => setIsAIOpen(false)}
        onSuccess={() => { fetchData(true); setIsAIOpen(false); }}
      />

      {/* ─── Task Drawer ─────────────────────────── */}
      <TaskDrawer
        task={selectedTask}
        projects={projects}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </div>
  );
}
