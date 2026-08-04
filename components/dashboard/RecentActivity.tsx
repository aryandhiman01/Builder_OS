"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  FolderKanban,
  CheckCircle2,
  Brain,
  FileText,
  LayoutTemplate,
  ArrowRight,
  Activity,
  Radio,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ActivityItemData {
  id: string;
  title: string;
  description: string;
  time: string;
  iconType?: "FolderKanban" | "Brain" | "CheckCircle2" | "Sparkles" | "FileText" | "LayoutTemplate";
}

interface RecentActivityProps {
  activities?: ActivityItemData[];
  loading?: boolean;
}

const ICON_MAP = {
  FolderKanban,
  Brain,
  CheckCircle2,
  Sparkles,
  FileText,
  LayoutTemplate,
};

const ICON_COLOR_MAP = {
  FolderKanban: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  Brain: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  CheckCircle2: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Sparkles: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  FileText: "border-sky-500/20 bg-sky-500/10 text-sky-400",
  LayoutTemplate: "border-amber-500/20 bg-amber-500/10 text-amber-400",
};

export default function RecentActivity({ activities = [], loading = false }: RecentActivityProps) {
  const [filter, setFilter] = useState<"all" | "ai" | "projects">("all");

  const filteredActivities = activities.filter((act) => {
    if (filter === "all") return true;
    if (filter === "ai") return act.iconType === "Brain" || act.iconType === "Sparkles" || act.iconType === "FileText";
    if (filter === "projects") return act.iconType === "FolderKanban" || act.iconType === "CheckCircle2" || act.iconType === "LayoutTemplate";
    return true;
  });

  return (
    <div
      className="
      rounded-2xl
      border
      border-white/10
      bg-[#09090c]/90
      p-6
      backdrop-blur-2xl
      shadow-xl
      "
    >
      {/* Header Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Recent Activity
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-orange-400">
              <Radio size={11} className="animate-pulse text-orange-400" />
              Live Feed
            </span>
          </div>
          <p className="mt-1 text-xs text-[#8a8a93]">
            Real-time activity log from your BuilderOS workspace.
          </p>
        </div>

        {/* Filter Chips & View All Link */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-white/10 bg-black/40 p-0.5">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                filter === "all"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-[#8a8a93] hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("ai")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                filter === "ai"
                  ? "bg-orange-500/20 text-orange-300 shadow-sm"
                  : "text-[#8a8a93] hover:text-white"
              }`}
            >
              AI Logs
            </button>
            <button
              onClick={() => setFilter("projects")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                filter === "projects"
                  ? "bg-amber-500/20 text-amber-300 shadow-sm"
                  : "text-[#8a8a93] hover:text-white"
              }`}
            >
              Projects
            </button>
          </div>

        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pt-2">
        {/* Vertical Timeline Line */}
        {!loading && filteredActivities.length > 0 && (
          <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-white/5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-white/5" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <Activity size={18} className="text-[#8a8a93]" />
            </div>
            <p className="mt-3 text-sm font-semibold text-white">
              No recent activity recorded.
            </p>
            <p className="mt-1 text-xs text-[#8a8a93] max-w-sm">
              Actions taken in AI Workspace, roadmaps, or tasks will automatically stream into this timeline.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity) => {
                const Icon = (activity.iconType && ICON_MAP[activity.iconType]) || Sparkles;
                const badgeStyle = (activity.iconType && ICON_COLOR_MAP[activity.iconType]) || ICON_COLOR_MAP.Sparkles;

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                    className="
                    group
                    relative
                    flex
                    items-start
                    gap-4
                    rounded-xl
                    p-2.5
                    transition-colors
                    hover:bg-white/[0.02]
                    "
                  >
                    {/* Icon Node */}
                    <div
                      className={`
                      relative
                      z-10
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      shadow-inner
                      transition-transform
                      duration-300
                      group-hover:scale-110
                      ${badgeStyle}
                      `}
                    >
                      <Icon size={17} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-orange-400 transition-colors">
                          {activity.title}
                        </h3>
                        <span className="text-[11px] font-mono text-[#8a8a93] shrink-0">
                          {activity.time}
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs text-[#8a8a93] line-clamp-1">
                        {activity.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}