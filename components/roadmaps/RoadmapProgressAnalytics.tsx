"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Target,
  CheckCircle2,
  Clock,
  Layers,
  TrendingUp,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Flag,
} from "lucide-react";

interface StepData {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours: number | null;
}

interface MilestoneData {
  id: string;
  title: string;
  description: string | null;
  order: number;
  steps: StepData[];
}

interface RoadmapProgressAnalyticsProps {
  milestones: MilestoneData[];
  roadmapProgress?: number;
  onNavigateToMilestones?: () => void;
}

export default function RoadmapProgressAnalytics({
  milestones,
  roadmapProgress = 0,
  onNavigateToMilestones,
}: RoadmapProgressAnalyticsProps) {
  // Comprehensive memoized progress metrics
  const analytics = useMemo(() => {
    let totalSteps = 0;
    let completedSteps = 0;
    let totalHours = 0;
    let completedHours = 0;
    let completedMilestones = 0;
    let inProgressMilestones = 0;

    const milestoneBreakdown = milestones.map((m, idx) => {
      const mSteps = m.steps.length;
      const mCompletedSteps = m.steps.filter((s) => s.completed).length;
      let mHours = 0;
      let mCompletedHours = 0;

      m.steps.forEach((s) => {
        const hrs = s.estimatedHours || 2;
        mHours += hrs;
        if (s.completed) mCompletedHours += hrs;
      });

      totalSteps += mSteps;
      completedSteps += mCompletedSteps;
      totalHours += mHours;
      completedHours += mCompletedHours;

      const mPercent = mSteps > 0 ? Math.round((mCompletedSteps / mSteps) * 100) : 0;
      const isCompleted = mSteps > 0 && mCompletedSteps === mSteps;
      const isInProgress = mCompletedSteps > 0 && !isCompleted;

      if (isCompleted) completedMilestones++;
      else if (isInProgress) inProgressMilestones++;

      return {
        id: m.id,
        order: m.order || idx + 1,
        title: m.title,
        description: m.description,
        totalSteps: mSteps,
        completedSteps: mCompletedSteps,
        totalHours: mHours,
        completedHours: mCompletedHours,
        progressPercent: mPercent,
        isCompleted,
        isInProgress,
      };
    });

    const overallPercent =
      totalSteps > 0
        ? Math.round((completedSteps / totalSteps) * 100)
        : Math.round(roadmapProgress);

    const remainingSteps = totalSteps - completedSteps;
    const remainingHours = totalHours - completedHours;

    // Find current active focus milestone (first uncompleted milestone)
    const activeMilestone = milestoneBreakdown.find((m) => !m.isCompleted);

    return {
      totalMilestones: milestones.length,
      completedMilestones,
      inProgressMilestones,
      remainingMilestones: milestones.length - completedMilestones,
      totalSteps,
      completedSteps,
      remainingSteps,
      totalHours,
      completedHours,
      remainingHours,
      overallPercent,
      milestoneBreakdown,
      activeMilestone,
    };
  }, [milestones, roadmapProgress]);

  // Overall status badge details
  const statusInfo = useMemo(() => {
    if (analytics.overallPercent === 100) {
      return { label: "Completed", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
    }
    if (analytics.overallPercent >= 50) {
      return { label: "On Track", color: "text-orange-400 border-orange-500/30 bg-orange-500/10" };
    }
    if (analytics.overallPercent > 0) {
      return { label: "In Progress", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" };
    }
    return { label: "Planning", color: "text-[#8a8a93] border-white/10 bg-white/5" };
  }, [analytics.overallPercent]);

  return (
    <div className="space-y-6">
      {/* ── 1. Top Core Analytics KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Progress Score */}
        <div className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-5 backdrop-blur-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
              Overall Progress
            </span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-medium ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-3xl font-extrabold text-white font-sora">
              {analytics.overallPercent}%
            </h2>
            <span className="text-xs text-[#8a8a93] font-mono">
              {analytics.completedSteps}/{analytics.totalSteps} steps
            </span>
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
              style={{ width: `${analytics.overallPercent}%` }}
            />
          </div>
        </div>

        {/* Card 2: Steps Completion */}
        <div className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-5 backdrop-blur-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[#8a8a93]">
            <span className="text-xs font-semibold uppercase tracking-wider">Steps Completed</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-sora">
            {analytics.completedSteps}{" "}
            <span className="text-sm font-normal text-[#8a8a93]">/ {analytics.totalSteps}</span>
          </h2>
          <p className="text-xs text-[#8a8a93]">
            {analytics.remainingSteps > 0
              ? `${analytics.remainingSteps} remaining step${analytics.remainingSteps > 1 ? "s" : ""}`
              : "All steps completed 🎉"}
          </p>
        </div>

        {/* Card 3: Estimated Effort */}
        <div className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-5 backdrop-blur-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[#8a8a93]">
            <span className="text-xs font-semibold uppercase tracking-wider">Estimated Effort</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <Clock size={16} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-sora">
            {analytics.completedHours}h{" "}
            <span className="text-sm font-normal text-[#8a8a93]">/ {analytics.totalHours}h</span>
          </h2>
          <p className="text-xs text-[#8a8a93]">
            {analytics.remainingHours > 0
              ? `~${analytics.remainingHours} hours left to complete`
              : "Effort goal achieved"}
          </p>
        </div>

        {/* Card 4: Milestones Health */}
        <div className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-5 backdrop-blur-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[#8a8a93]">
            <span className="text-xs font-semibold uppercase tracking-wider">Milestones</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <Flag size={16} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-sora">
            {analytics.completedMilestones}{" "}
            <span className="text-sm font-normal text-[#8a8a93]">/ {analytics.totalMilestones}</span>
          </h2>
          <p className="text-xs text-[#8a8a93]">
            {analytics.inProgressMilestones > 0
              ? `${analytics.inProgressMilestones} active milestone in progress`
              : analytics.remainingMilestones > 0
              ? `${analytics.remainingMilestones} milestone pending`
              : "All milestones completed"}
          </p>
        </div>
      </div>

      {/* ── 2. Next Active Focus Goal Banner ── */}
      {analytics.activeMilestone && (
        <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent p-5 backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/20 text-orange-400 mt-0.5">
              <Target size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 font-mono">
                Current Priority Goal
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                Milestone {analytics.activeMilestone.order}: {analytics.activeMilestone.title}
              </h4>
              <p className="text-xs text-[#8a8a93] mt-0.5">
                {analytics.activeMilestone.completedSteps}/{analytics.activeMilestone.totalSteps} steps completed
                ({analytics.activeMilestone.totalSteps - analytics.activeMilestone.completedSteps} remaining)
              </p>
            </div>
          </div>

          {onNavigateToMilestones && (
            <button
              onClick={onNavigateToMilestones}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-orange-600 transition-all self-start sm:self-auto"
            >
              <span>Go to Checklist</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}

      {/* ── 3. Per-Milestone Progress Breakdown ── */}
      <div className="rounded-2xl border border-white/10 bg-[#09090c] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-sora">Milestone Velocity</h3>
            <p className="text-xs text-[#8a8a93]">Individual completion progress for each milestone.</p>
          </div>
          <span className="text-xs font-mono text-[#8a8a93]">
            {analytics.totalMilestones} Milestones Total
          </span>
        </div>

        <div className="space-y-4">
          {analytics.milestoneBreakdown.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3 transition-all hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[11px] font-mono font-bold text-white">
                    {m.order}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {m.title}
                  </h4>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-xs font-mono text-[#8a8a93]">
                    {m.completedSteps}/{m.totalSteps} steps ({m.totalHours}h)
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-medium ${
                      m.isCompleted
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : m.isInProgress
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border-white/10 bg-white/5 text-[#8a8a93]"
                    }`}
                  >
                    {m.isCompleted ? "Completed" : m.isInProgress ? "In Progress" : "Pending"}
                  </span>
                </div>
              </div>

              {/* Individual Progress Bar */}
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      m.isCompleted
                        ? "bg-emerald-500"
                        : m.isInProgress
                        ? "bg-amber-400"
                        : "bg-white/20"
                    }`}
                    style={{ width: `${m.progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-white min-w-[36px] text-right">
                  {m.progressPercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
