"use client";

import Link from "next/link";
import {
  ArrowRight,
  FolderKanban,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  Trash2,
} from "lucide-react";

export interface RoadmapCardData {
  id: string;
  title: string;
  description: string | null;
  type: "STANDALONE" | "PROJECT" | string;
  status: "PLANNING" | "COMPLETED" | "ARCHIVED" | string;
  progress: number;
  estimatedDuration?: string | null;
  milestonesCount: number;
  stepsCount: number;
  completedStepsCount: number;
  projectId?: string | null;
  projectTitle?: string | null;
  projectColor?: string | null;
}

interface RoadmapCardProps {
  roadmap: RoadmapCardData;
  onConvert?: (roadmap: RoadmapCardData) => void;
  onDelete?: (roadmap: RoadmapCardData) => void;
}

export default function RoadmapCard({ roadmap, onConvert, onDelete }: RoadmapCardProps) {
  const isStandalone = roadmap.type === "STANDALONE" && !roadmap.projectId;
  const progressPercent = Math.min(100, Math.max(0, Math.round(roadmap.progress || 0)));

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#09090c]/95 p-4 sm:p-5 backdrop-blur-md shadow-xl transition-all duration-200 ease-out hover:border-white/20 hover:bg-[#0c0c10] hover:shadow-2xl transform-gpu">
      {/* Top Banner & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2">
          {isStandalone ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
              <Layers size={13} />
              Standalone
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              <FolderKanban size={13} />
              {roadmap.projectTitle || "Project Roadmap"}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="mt-4">
          <Link
            href={
              roadmap.projectId
                ? `/projects/${roadmap.projectId}/roadmap/${roadmap.id}`
                : `/roadmaps/${roadmap.id}`
            }
            className="group-hover:text-orange-400 transition-colors"
          >
            <h3
              className="text-lg font-bold text-white line-clamp-1"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              {roadmap.title}
            </h3>
          </Link>
          <p className="mt-1.5 text-xs text-[#8a8a93] line-clamp-2 leading-relaxed">
            {roadmap.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-[#8a8a93]">
          <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] p-2">
            <MapPin size={14} className="text-orange-400 shrink-0" />
            <span>
              <strong className="text-white font-semibold">
                {roadmap.milestonesCount}
              </strong>{" "}
              Milestones
            </span>
          </div>

          {roadmap.estimatedDuration && (
            <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] p-2">
              <Clock size={14} className="text-blue-400 shrink-0" />
              <span className="truncate">
                {roadmap.estimatedDuration}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Progress & CTA */}
      <div className="mt-6 border-t border-white/[0.07] pt-4">
        {/* Progress Bar (Only for Standalone Roadmaps) */}
        {isStandalone && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Completion</span>
              <span className="font-mono text-orange-400 font-bold">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-between gap-2">
          {isStandalone && (
            <div className="flex items-center gap-1.5">
              {onDelete && (
                <button
                  onClick={() => onDelete(roadmap)}
                  title="Delete Standalone Roadmap"
                  className="flex items-center gap-1 rounded-xl border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/20 active:scale-95"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )}

          <Link
            href={
              roadmap.projectId
                ? `/projects/${roadmap.projectId}/roadmap/${roadmap.id}`
                : `/roadmaps/${roadmap.id}`
            }
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
          >
            <span>{roadmap.projectId ? "View Roadmap" : "Open Detail"}</span>
            <ArrowRight size={13} className="text-orange-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}

