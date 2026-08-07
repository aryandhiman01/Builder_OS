"use client";

import RoadmapCard, { RoadmapCardData } from "./RoadmapCard";
import { ViewMode } from "./RoadmapFilters";
import { Map, Plus, ArrowRight, Layers, FolderKanban } from "lucide-react";
import Link from "next/link";

interface RoadmapsGridProps {
  roadmaps: RoadmapCardData[];
  viewMode: ViewMode;
  loading: boolean;
  onOpenNewModal: () => void;
  onConvert: (roadmap: RoadmapCardData) => void;
  onDelete?: (roadmap: RoadmapCardData) => void;
}

export default function RoadmapsGrid({
  roadmaps,
  viewMode,
  loading,
  onOpenNewModal,
  onConvert,
  onDelete,
}: RoadmapsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 rounded-2xl border border-white/10 bg-[#09090c]/95 p-6 backdrop-blur-2xl animate-pulse space-y-4 shadow-xl"
          >
            <div className="h-5 w-1/3 rounded-lg bg-white/5" />
            <div className="h-6 w-3/4 rounded-lg bg-white/5" />
            <div className="h-4 w-full rounded-lg bg-white/5" />
            <div className="h-10 w-full rounded-xl bg-white/5 mt-8" />
          </div>
        ))}
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#09090c]/95 p-12 text-center backdrop-blur-2xl shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400 shadow-inner">
          <Map size={26} />
        </div>
        <h3
          className="mt-4 text-xl font-extrabold text-white"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          No roadmaps found
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-[#8a8a93] max-w-md mx-auto leading-relaxed">
          Create your first standalone roadmap to map out milestones, timeline estimates, and convert your planning directly into active execution projects.
        </p>
        <button
          onClick={onOpenNewModal}
          className="btn-shimmer mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-100 active:scale-95 shadow-lg"
        >
          <Plus size={16} />
          <span>Create First Roadmap</span>
        </button>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {roadmaps.map((rm) => {
          const isRmStandalone = rm.type === "STANDALONE" && !rm.projectId;
          return (
            <div
              key={rm.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#09090c]/95 p-4 backdrop-blur-2xl shadow-lg transition-all duration-300 hover:border-white/20 hover:bg-[#0c0c10]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-orange-400">
                  {isRmStandalone ? <Layers size={18} /> : <FolderKanban size={18} />}
                </div>
                <div>
                  <h4
                    className="text-sm font-bold text-white flex items-center gap-2 group-hover:text-orange-400 transition-colors"
                    style={{ fontFamily: "var(--font-sora)" }}
                  >
                    {rm.title}
                    <span className="text-[10px] font-mono font-semibold uppercase text-orange-400 border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 rounded-full">
                      {isRmStandalone ? "STANDALONE" : "PROJECT"}
                    </span>
                  </h4>
                  <p className="text-xs text-[#8a8a93] line-clamp-1">{rm.description || "No description."}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  {isRmStandalone && (
                    <span className="text-xs font-mono font-bold text-orange-400">{rm.progress}%</span>
                  )}
                  <p className="text-[10px] text-[#8a8a93]">{rm.milestonesCount} Milestones</p>
                </div>

                {isRmStandalone && (
                  <button
                    onClick={() => onConvert(rm)}
                    className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-orange-400 hover:underline"
                  >
                    Convert
                  </button>
                )}

                <Link
                  href={
                    rm.projectId
                      ? `/projects/${rm.projectId}/roadmap/${rm.id}`
                      : `/roadmaps/${rm.id}`
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition"
                >
                  <span>{rm.projectId ? "View Roadmap" : "Open"}</span>
                  <ArrowRight size={13} className="text-orange-400" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (viewMode === "timeline") {
    return (
      <div className="relative border-l-2 border-orange-500/30 pl-6 space-y-6 my-4 ml-3">
        {roadmaps.map((rm, idx) => (
          <div key={rm.id} className="relative group">
            <div className="absolute -left-[31px] top-2 h-4 w-4 rounded-full border-2 border-orange-500 bg-[#09090c] group-hover:bg-orange-500 transition-colors shadow-md" />
            <div className="rounded-2xl border border-white/10 bg-[#09090c]/95 p-5 backdrop-blur-2xl shadow-xl transition-all duration-300 hover:border-white/20 hover:bg-[#0c0c10]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-orange-400 font-semibold uppercase">
                  Phase {idx + 1} • {rm.projectId ? "PROJECT" : "STANDALONE"}
                </span>
                {!rm.projectId && (
                  <span className="text-xs font-mono font-bold text-white">{rm.progress}% Done</span>
                )}
              </div>
              <h4
                className="mt-2 text-base font-bold text-white group-hover:text-orange-400 transition-colors"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {rm.title}
              </h4>
              <p className="mt-1 text-xs text-[#8a8a93]">{rm.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-[#8a8a93]">{rm.milestonesCount} Milestones</span>
                <Link
                  href={
                    rm.projectId
                      ? `/projects/${rm.projectId}/roadmap/${rm.id}`
                      : `/roadmaps/${rm.id}`
                  }
                  className="text-xs font-semibold text-orange-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>{rm.projectId ? "View Roadmap" : "View Detail"}</span> <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {roadmaps.map((rm) => (
        <RoadmapCard key={rm.id} roadmap={rm} onConvert={onConvert} onDelete={onDelete} />
      ))}
    </div>
  );
}

