"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sun, Sunrise, Sunset, Moon, Zap, AlertTriangle, Clock, ArrowRight, Plus, CheckCircle2 } from "lucide-react";
import type { GlobalTask, TaskStats } from "./GlobalTasksClient";

interface MyDayViewProps {
  tasks: GlobalTask[];
  allTasks: GlobalTask[];
  stats: TaskStats | null;
  userName: string;
  loading: boolean;
  onTaskClick: (task: GlobalTask) => void;
  onTaskUpdate: (taskId: string, updates: Partial<GlobalTask>) => void;
  onTaskDelete: (taskId: string) => void;
  onCreateTask: () => void;
  onRefresh: () => void;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return { text: "Good Night", icon: Moon };
  if (hour < 12) return { text: "Good Morning", icon: Sunrise };
  if (hour < 17) return { text: "Good Afternoon", icon: Sun };
  if (hour < 21) return { text: "Good Evening", icon: Sunset };
  return { text: "Good Night", icon: Moon };
}

const PRIORITY_CONFIG = {
  high: { label: "High", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  medium: { label: "Medium", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  low: { label: "Low", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
};

const STATUS_CONFIG = {
  todo: { label: "Todo", color: "text-[#8a8a93]" },
  "in-progress": { label: "In Progress", color: "text-blue-400" },
  completed: { label: "Done", color: "text-emerald-400" },
};

export default function MyDayView({
  tasks,
  allTasks,
  stats,
  userName,
  loading,
  onTaskClick,
  onTaskUpdate,
  onCreateTask,
}: MyDayViewProps) {
  const { text: greeting, icon: GreetingIcon } = getGreeting();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const todayTasks = useMemo(
    () =>
      tasks.filter((t) => {
        if (t.status === "completed") return false;
        // Due today
        if (t.dueDate) {
          const d = new Date(t.dueDate);
          if (d >= todayStart && d < todayEnd) return true;
        }
        // Created today (e.g. AI Generated tasks) or currently in-progress
        const created = new Date(t.createdAt);
        if (created >= todayStart && created < todayEnd) return true;
        if (t.status === "in-progress") return true;

        return false;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks]
  );

  const overdueTasks = useMemo(
    () =>
      tasks.filter((t) => {
        if (!t.dueDate || t.status === "completed") return false;
        return new Date(t.dueDate) < todayStart;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks]
  );

  // Smart suggestion: highest priority incomplete task
  const smartSuggestion = useMemo(() => {
    const priorityOrder = ["high", "medium", "low"];
    return allTasks
      .filter((t) => t.status !== "completed")
      .sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority))[0] ?? null;
  }, [allTasks]);

  const toggleComplete = (task: GlobalTask) => {
    const newStatus = task.status === "completed" ? "todo" : "completed";
    onTaskUpdate(task.id, { status: newStatus });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-2xl border border-white/[0.07] bg-white/[0.02] animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl border border-white/[0.07] bg-white/[0.02] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* ─── Hero Greeting ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-7"
      >
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <GreetingIcon size={20} className="text-orange-400" />
              <span className="text-sm font-medium text-[#8a8a93]">{greeting}</span>
            </div>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
              {userName.split(" ")[0]} 👋
            </h2>
            <p className="mt-2 text-sm text-[#8a8a93]">
              {stats?.today
                ? `You have ${stats.today} task${stats.today !== 1 ? "s" : ""} today`
                : "No tasks scheduled for today"}
              {stats?.highPriorityToday ? ` — ${stats.highPriorityToday} high priority` : ""}
              {stats?.overdue ? ` · ${stats.overdue} overdue` : ""}
            </p>
          </div>

          <div className="flex flex-col gap-3 text-right">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">Focus Time</div>
              <div className="mt-0.5 text-xl font-bold text-white">
                {stats?.totalFocusHours ? `${stats.totalFocusHours}h` : "—"}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── AI Smart Suggestion ───────────────── */}
      {smartSuggestion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center justify-between gap-4 rounded-xl border border-orange-500/20 bg-orange-500/[0.05] px-5 py-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 border border-orange-500/20">
              <Zap size={14} className="text-orange-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400/80">AI Recommendation</div>
              <p className="text-sm font-semibold text-white truncate">
                Continue:{" "}
                <span className="text-orange-300">{smartSuggestion.title}</span>
              </p>
              <p className="text-xs text-[#8a8a93]">
                {smartSuggestion.project.title}
                {smartSuggestion.estimatedHours ? ` · ~${smartSuggestion.estimatedHours}h estimated` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => onTaskClick(smartSuggestion)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400 transition hover:bg-orange-500/20"
          >
            Resume <ArrowRight size={12} />
          </button>
        </motion.div>
      )}

      {/* ─── Overdue Alert ──────────────────────── */}
      {overdueTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-sm font-semibold text-red-400">
              {overdueTasks.length} Overdue {overdueTasks.length === 1 ? "Task" : "Tasks"}
            </span>
          </div>
          <div className="space-y-2">
            {overdueTasks.slice(0, 3).map((task) => (
              <TaskRow key={task.id} task={task} onToggle={toggleComplete} onClick={() => onTaskClick(task)} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── Today's Tasks ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-blue-400" />
            <span className="text-sm font-semibold text-white">Today</span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] text-[#8a8a93]">
              {todayTasks.length}
            </span>
          </div>
          <button
            onClick={onCreateTask}
            className="flex items-center gap-1.5 text-xs text-[#8a8a93] transition hover:text-white"
          >
            <Plus size={12} /> Add task
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.08] p-8 text-center">
            <p className="text-sm text-[#8a8a93]">No tasks scheduled for today.</p>
            <button
              onClick={onCreateTask}
              className="mt-3 text-xs font-semibold text-orange-400 transition hover:text-orange-300"
            >
              + Schedule a task
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={toggleComplete} onClick={() => onTaskClick(task)} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onClick,
}: {
  task: GlobalTask;
  onToggle: (t: GlobalTask) => void;
  onClick: () => void;
}) {
  const isCompleted = task.status === "completed";
  const priority = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG];
  const statusCfg = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG];

  return (
    <div
      className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 transition hover:border-white/10 hover:bg-white/[0.04] cursor-pointer"
      onClick={onClick}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task);
        }}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          isCompleted
            ? "border-emerald-500 bg-emerald-500"
            : "border-white/20 hover:border-orange-400"
        }`}
      >
        {isCompleted && <CheckCircle2 size={12} className="text-white" />}
      </button>

      {/* Title */}
      <span
        className={`flex-1 truncate text-sm font-medium transition ${
          isCompleted ? "line-through text-[#8a8a93]" : "text-white group-hover:text-orange-50"
        }`}
      >
        {task.title}
      </span>

      {/* Project badge */}
      <span className="hidden sm:flex shrink-0 items-center gap-1.5 text-xs text-[#8a8a93]">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: task.project.color || "#8a8a93" }}
        />
        {task.project.title}
      </span>

      {/* Priority badge */}
      {priority && (
        <span
          className={`hidden md:inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${priority.bg} ${priority.color}`}
        >
          {priority.label}
        </span>
      )}

      {/* Estimated hours */}
      {task.estimatedHours && (
        <span className="hidden lg:flex shrink-0 items-center gap-1 text-[10px] text-[#8a8a93]">
          <Clock size={10} /> {task.estimatedHours}h
        </span>
      )}
    </div>
  );
}
