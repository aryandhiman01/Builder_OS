"use client";

import { CheckSquare, Clock, AlertTriangle, TrendingUp, Sparkles, CheckCircle2, Flame, Layers } from "lucide-react";
import { motion } from "framer-motion";
import type { TaskStats } from "./GlobalTasksClient";

interface TaskStatsBarProps {
  stats: TaskStats | null;
  loading: boolean;
}

const statItems = [
  {
    key: "today" as keyof TaskStats,
    label: "TODAY'S TASKS",
    icon: CheckSquare,
    desc: "Scheduled for today",
    iconBg: "border-sky-500/30 bg-sky-500/10 text-sky-400",
    badgeStyle: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    borderHover: "hover:border-sky-500/40",
    badgeLabel: "today",
  },
  {
    key: "inProgress" as keyof TaskStats,
    label: "IN PROGRESS",
    icon: Flame,
    desc: "Active tasks building",
    iconBg: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    badgeStyle: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    borderHover: "hover:border-amber-500/40",
    badgeLabel: "active",
  },
  {
    key: "completed" as keyof TaskStats,
    label: "COMPLETED",
    icon: CheckCircle2,
    desc: "Successfully done",
    iconBg: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    badgeStyle: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    borderHover: "hover:border-emerald-500/40",
    badgeLabel: "done",
  },
  {
    key: "overdue" as keyof TaskStats,
    label: "OVERDUE",
    icon: AlertTriangle,
    desc: "Immediate attention",
    iconBg: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    badgeStyle: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    borderHover: "hover:border-rose-500/40",
    badgeLabel: "overdue",
  },
  {
    key: "totalFocusHours" as keyof TaskStats,
    label: "FOCUS HOURS",
    icon: Clock,
    desc: "Deep focus time",
    iconBg: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    badgeStyle: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    borderHover: "hover:border-purple-500/40",
    badgeLabel: "total",
    suffix: "h",
  },
];

export default function TaskStatsBar({ stats, loading }: TaskStatsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 w-full">
      {statItems.map((item, i) => {
        const Icon = item.icon;
        const value = stats ? stats[item.key] : null;
        const isLoading = loading && !stats;
        const isLastOnMobile = i === 4;

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className={`
              group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-[#09090c]/90 p-3 sm:p-4 shadow-md backdrop-blur-xl transition-all duration-200 ${item.borderHover} hover:bg-[#0c0c10]
              ${isLastOnMobile ? "col-span-2 sm:col-span-1 lg:col-span-1" : ""}
            `}
          >
            {/* Top Header & Icon Badge */}
            <div className="flex items-start justify-between gap-1.5">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8a8a93] line-clamp-1">
                {item.label}
              </span>
              <div className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border shadow-inner transition-transform duration-200 group-hover:scale-105 ${item.iconBg}`}>
                <Icon size={14} className="sm:w-[15px] sm:h-[15px]" />
              </div>
            </div>

            {/* Value Number */}
            <h2
              className={`mt-1 text-xl sm:text-2xl lg:text-3xl font-black tracking-tight ${
                isLoading ? "text-[#8a8a93] animate-pulse" : "text-white"
              }`}
              style={{ fontFamily: "var(--font-sora)" }}
            >
              {isLoading ? "—" : `${value ?? 0}${item.suffix ?? ""}`}
            </h2>

            {/* Bottom Description & Trend Badge */}
            <div className="mt-2.5 sm:mt-3 flex items-center justify-between pt-2 border-t border-white/[0.06] gap-1">
              <p className="text-[10px] sm:text-[11px] text-[#8a8a93] truncate min-w-0 pr-1 font-medium">
                {item.desc}
              </p>
              <div className={`flex items-center gap-1 rounded-full px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-semibold shrink-0 ${item.badgeStyle}`}>
                <TrendingUp size={9} className="sm:w-[10px] sm:h-[10px]" />
                <span className="truncate max-w-[80px] sm:max-w-none">{isLoading ? "0" : `${value ?? 0}${item.suffix ?? ""} ${item.badgeLabel}`}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

