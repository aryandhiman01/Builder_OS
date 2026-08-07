"use client";

import { LayoutGrid, Calendar, ListFilter, Filter, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export type FilterTab = "ALL" | "STANDALONE" | "PROJECT" | "COMPLETED";
export type ViewMode = "grid" | "timeline" | "list";

interface RoadmapFiltersProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function RoadmapFilters({
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
}: RoadmapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "ALL", label: "All Roadmaps" },
    { id: "STANDALONE", label: "Standalone" },
    { id: "PROJECT", label: "Project Roadmaps" },
    { id: "COMPLETED", label: "Completed" },
  ];

  const activeLabel = tabs.find((t) => t.id === activeTab)?.label || "All Roadmaps";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-40 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#09090c]/90 p-2.5 backdrop-blur-2xl shadow-xl">
      {/* Filter Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white/[0.08] active:scale-95"
        >
          <Filter size={14} className="text-orange-400" />
          <span>
            Filter: <strong className="text-white">{activeLabel}</strong>
          </span>
          <ChevronDown
            size={14}
            className={`text-[#8a8a93] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-2 z-50 w-48 rounded-xl border border-white/10 bg-[#09090c] p-1.5 shadow-2xl backdrop-blur-xl">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-white text-black font-bold"
                      : "text-[#8a8a93] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/50 p-1">
        <button
          onClick={() => onViewModeChange("grid")}
          title="Grid View"
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-all ${
            viewMode === "grid"
              ? "bg-white/15 text-white shadow-sm"
              : "text-[#8a8a93] hover:text-white"
          }`}
        >
          <LayoutGrid size={15} />
        </button>
        <button
          onClick={() => onViewModeChange("timeline")}
          title="Timeline View"
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-all ${
            viewMode === "timeline"
              ? "bg-white/15 text-white shadow-sm"
              : "text-[#8a8a93] hover:text-white"
          }`}
        >
          <Calendar size={15} />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          title="List View"
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-all ${
            viewMode === "list"
              ? "bg-white/15 text-white shadow-sm"
              : "text-[#8a8a93] hover:text-white"
          }`}
        >
          <ListFilter size={15} />
        </button>
      </div>
    </div>
  );
}

