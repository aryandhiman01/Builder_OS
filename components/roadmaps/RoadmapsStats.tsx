"use client";

import { Layers, FolderKanban, CheckCircle2, Map } from "lucide-react";

interface RoadmapsStatsProps {
  stats: {
    total: number;
    project: number;
    standalone: number;
    completed: number;
  };
}

export default function RoadmapsStats({ stats }: RoadmapsStatsProps) {
  const cards = [
    {
      title: "Total Roadmaps",
      value: stats.total,
      description: "All active & archived plans",
      icon: Map,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
      trend: `${stats.total} total`,
      trendColor: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    },
    {
      title: "Project Roadmaps",
      value: stats.project,
      description: "Linked to active workspaces",
      icon: FolderKanban,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
      trend: `${stats.project} linked`,
      trendColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    },
    {
      title: "Standalone Roadmaps",
      value: stats.standalone,
      description: "Pure planning & concepts",
      icon: Layers,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
      trend: `${stats.standalone} standalone`,
      trendColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    },
    {
      title: "Completed Plans",
      value: stats.completed,
      description: "Finished roadmap plans",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      trend: `${stats.completed} done`,
      trendColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#09090c]/95 p-5 backdrop-blur-2xl shadow-xl transition-all duration-300 hover:border-white/20 hover:bg-[#0c0c10]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                {card.title}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl border ${card.bg} ${card.color} transition-transform duration-200 group-hover:scale-110 shadow-inner`}
              >
                <Icon size={18} />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span
                className="text-3xl font-extrabold text-white tracking-tight"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {card.value}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase ${card.trendColor}`}
              >
                {card.trend}
              </span>
            </div>

            <p className="mt-1.5 text-xs text-[#8a8a93]">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
}

