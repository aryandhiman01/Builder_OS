"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, ChevronRight, Layers } from "lucide-react";
import type { GlobalTask } from "./GlobalTasksClient";

interface ListViewProps {
  tasks: GlobalTask[];
  allTasks: GlobalTask[];
  loading: boolean;
  onTaskClick: (task: GlobalTask) => void;
  onTaskUpdate: (taskId: string, updates: Partial<GlobalTask>) => void;
  onTaskDelete: (taskId: string) => void;
  onRefresh: () => void;
}

const PRIORITY_CONFIG = {
  high: { color: "text-orange-400", dot: "bg-orange-400" },
  medium: { color: "text-yellow-400", dot: "bg-yellow-400" },
  low: { color: "text-green-400", dot: "bg-green-400" },
};

function getGroupLabel(task: GlobalTask): string {
  if (task.status === "completed") return "Completed";
  if (!task.dueDate) return "No Due Date";

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart); todayEnd.setDate(todayEnd.getDate() + 1);
  const tomorrowEnd = new Date(todayEnd); tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
  const weekEnd = new Date(todayStart); weekEnd.setDate(weekEnd.getDate() + 7);
  const d = new Date(task.dueDate);

  if (d < todayStart) return "Overdue";
  if (d < todayEnd) return "Today";
  if (d < tomorrowEnd) return "Tomorrow";
  if (d < weekEnd) return "This Week";
  return "Later";
}

const GROUP_ORDER = ["Overdue", "Today", "Tomorrow", "This Week", "Later", "No Due Date", "Completed"];

export default function ListView({ tasks, loading, onTaskClick, onTaskUpdate }: ListViewProps) {
  const grouped = useMemo(() => {
    const map: Record<string, GlobalTask[]> = {};
    tasks.forEach((t) => {
      const label = getGroupLabel(t);
      if (!map[label]) map[label] = [];
      map[label].push(t);
    });
    return GROUP_ORDER.filter((g) => map[g]).map((g) => ({ label: g, tasks: map[g] }));
  }, [tasks]);

  const toggleComplete = (task: GlobalTask) => {
    onTaskUpdate(task.id, { status: task.status === "completed" ? "todo" : "completed" });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="mb-3 h-4 w-24 rounded bg-white/[0.05] animate-pulse" />
            {[1, 2].map((j) => (
              <div key={j} className="mb-2 h-14 rounded-xl border border-white/[0.05] bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <Layers size={22} className="text-[#8a8a93]" />
        </div>
        <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
          No tasks found
        </h3>
        <p className="mt-2 max-w-sm text-xs text-[#8a8a93]">
          Create a task or adjust your filters to see tasks here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {grouped.map(({ label, tasks: groupTasks }, gi) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: gi * 0.05 }}
        >
          {/* Group header */}
          <div className="mb-3 flex items-center gap-3">
            <span
              className={`text-xs font-bold uppercase tracking-widest ${
                label === "Overdue"
                  ? "text-red-400"
                  : label === "Today"
                  ? "text-orange-400"
                  : label === "Completed"
                  ? "text-emerald-400"
                  : "text-[#8a8a93]"
              }`}
            >
              {label}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-[#8a8a93]">
              {groupTasks.length}
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Task rows */}
          <div className="space-y-1.5">
            {groupTasks.map((task) => {
              const isCompleted = task.status === "completed";
              const pCfg = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG];

              return (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 transition cursor-pointer hover:border-white/[0.12] hover:bg-white/[0.04]"
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleComplete(task); }}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      isCompleted
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-white/20 hover:border-orange-400"
                    }`}
                  >
                    {isCompleted && <CheckCircle2 size={12} className="text-white" />}
                  </button>

                  {/* Priority dot */}
                  {pCfg && (
                    <span className={`h-2 w-2 shrink-0 rounded-full ${pCfg.dot}`} />
                  )}

                  {/* Title */}
                  <span
                    className={`flex-1 truncate text-sm font-medium ${
                      isCompleted ? "line-through text-[#8a8a93]" : "text-white"
                    }`}
                  >
                    {task.title}
                  </span>

                  {/* Project */}
                  <span className="hidden sm:flex shrink-0 items-center gap-1.5 text-xs text-[#8a8a93]">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: task.project.color || "#8a8a93" }}
                    />
                    {task.project.title}
                  </span>

                  {/* Est hours */}
                  {task.estimatedHours && (
                    <span className="hidden md:flex shrink-0 items-center gap-1 text-[11px] text-[#8a8a93]">
                      <Clock size={11} /> {task.estimatedHours}h
                    </span>
                  )}

                  {/* Open arrow */}
                  <ChevronRight size={14} className="shrink-0 text-[#8a8a93] opacity-0 group-hover:opacity-100 transition" />
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
