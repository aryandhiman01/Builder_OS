"use client";

import { Map, Plus, Search, Sparkles, Zap, Layers } from "lucide-react";

interface RoadmapsHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNewModal: () => void;
}

export default function RoadmapsHeader({
  searchQuery,
  onSearchChange,
  onOpenNewModal,
}: RoadmapsHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#09090c]/95 backdrop-blur-2xl shadow-2xl">
      {/* Top Window Header (Dashboard Mockup UI Style) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 shadow-inner">
          <Layers className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-xs font-semibold text-white/90">
            BuilderOS — Roadmap Hub
          </span>
        </div>

        <div className="hidden sm:block w-16" />
      </div>

      {/* Hero Body */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 text-xs text-[#8a8a93] backdrop-blur-sm shadow-inner">
              <Zap className="h-3.5 w-3.5 text-orange-400" />
              <span className="font-semibold text-white/90">Strategic Planning Engine</span>
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-orange-400 font-mono">Standalone Roadmaps</span>
            </div>

            <h1
              className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight"
              style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.02em" }}
            >
              Architect & execute your{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                master roadmap
              </span>
              .
            </h1>
            <p className="text-xs sm:text-sm text-[#8a8a93] leading-relaxed">
              Define vision, track milestone progression, and transform standalone planning into executable tasks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Search Bar */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a93]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search roadmaps..."
                className="w-full rounded-xl border border-white/15 bg-black/60 pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#8a8a93] backdrop-blur-md transition-all duration-300 focus:border-orange-500/60 focus:bg-black/80 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* New Roadmap Button */}
            <button
              onClick={onOpenNewModal}
              className="btn-shimmer flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black shadow-lg transition-all hover:bg-zinc-100 active:scale-95"
            >
              <Plus size={16} />
              <span>New Roadmap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

