"use client";

import { CheckSquare, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { TaskStats } from "./GlobalTasksClient";

interface TaskStatsBarProps {
  stats: TaskStats | null;
  loading: boolean;
}

const statItems = [
  {
    key: "today" as keyof TaskStats,
    label: "Today's Tasks",
    icon: CheckSquare,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    accent: "bg-blue-400",
  },
  {
    key: "inProgress" as keyof TaskStats,
    label: "In Progress",
    icon: TrendingUp,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    accent: "bg-orange-400",
  },
  {
    key: "completed" as keyof TaskStats,
    label: "Completed",
    icon: CheckSquare,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    accent: "bg-emerald-400",
  },
  {
    key: "overdue" as keyof TaskStats,
    label: "Overdue",
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    accent: "bg-red-400",
  },
  {
    key: "totalFocusHours" as keyof TaskStats,
    label: "Focus Hours",
    icon: Clock,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    accent: "bg-violet-400",
    suffix: "h",
  },
];

export default function TaskStatsBar({ stats, loading }: TaskStatsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
      {statItems.map((item, i) => {
        const Icon = item.icon;
        const value = stats ? stats[item.key] : null;
        const isLoading = loading && !stats;

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="relative flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 overflow-hidden"
          >
            {/* subtle left accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl ${item.accent}`} />

            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${item.bg}`}>
              <Icon size={14} className={item.color} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-medium text-[#8a8a93] truncate leading-tight">{item.label}</div>
              <div className={`text-xl font-bold leading-tight mt-0.5 ${isLoading ? "text-[#8a8a93]" : "text-white"}`}>
                {isLoading ? "—" : `${value ?? 0}${item.suffix ?? ""}`}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
