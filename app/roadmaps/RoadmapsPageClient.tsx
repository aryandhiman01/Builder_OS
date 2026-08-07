"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import RoadmapsHeader from "@/components/roadmaps/RoadmapsHeader";
import RoadmapsStats from "@/components/roadmaps/RoadmapsStats";
import RoadmapFilters, { FilterTab, ViewMode } from "@/components/roadmaps/RoadmapFilters";
import RoadmapsGrid from "@/components/roadmaps/RoadmapsGrid";
import { RoadmapCardData } from "@/components/roadmaps/RoadmapCard";
import CreateRoadmapModal from "@/components/roadmaps/CreateRoadmapModal";
import ConvertProjectModal from "@/components/roadmaps/ConvertProjectModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { toast } from "sonner";

interface RoadmapsPageClientProps {
  initialRoadmaps: RoadmapCardData[];
}

export default function RoadmapsPageClient({
  initialRoadmaps,
}: RoadmapsPageClientProps) {
  const [roadmaps, setRoadmaps] = useState<RoadmapCardData[]>(initialRoadmaps);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [loading, setLoading] = useState(false);

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [convertRoadmap, setConvertRoadmap] = useState<RoadmapCardData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoadmapCardData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRoadmaps = useCallback(async () => {
    try {
      setLoading(true);
      const url = new URL("/api/roadmaps", window.location.origin);
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setRoadmaps(data.roadmaps || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleDeleteRoadmap() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/roadmaps/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete roadmap");

      toast.success("Standalone Roadmap deleted successfully!");
      setRoadmaps((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete roadmap");
    } finally {
      setDeleting(false);
    }
  }

  // Compute live stats
  const stats = useMemo(() => {
    const total = roadmaps.length;
    const project = roadmaps.filter((r) => r.type === "PROJECT" || Boolean(r.projectId)).length;
    const standalone = roadmaps.filter((r) => r.type === "STANDALONE" && !r.projectId).length;
    const completed = roadmaps.filter((r) => r.status === "COMPLETED" || r.progress === 100).length;

    return { total, project, standalone, completed };
  }, [roadmaps]);

  // Filtered roadmaps array (Instant 0ms filtering)
  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((rm) => {
      const isRmStandalone = rm.type === "STANDALONE" && !rm.projectId;
      const isRmProject = rm.type === "PROJECT" || Boolean(rm.projectId);

      // Tab filter
      if (activeTab === "STANDALONE" && !isRmStandalone) return false;
      if (activeTab === "PROJECT" && !isRmProject) return false;
      if (activeTab === "COMPLETED" && rm.status !== "COMPLETED" && rm.progress !== 100) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = rm.title.toLowerCase().includes(q);
        const matchDesc = rm.description?.toLowerCase().includes(q);
        const matchProject = rm.projectTitle?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchProject) return false;
      }

      return true;
    });
  }, [roadmaps, activeTab, searchQuery]);

  const sectionAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" as const },
  };

  return (
    <div className="space-y-6 max-w-full pb-16">
      {/* Header Banner */}
      <motion.div {...sectionAnimation}>
        <RoadmapsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewModal={() => setIsNewModalOpen(true)}
        />
      </motion.div>

      {/* Stats Summary */}
      <motion.section {...sectionAnimation} transition={{ duration: 0.4, delay: 0.1 }}>
        <RoadmapsStats stats={stats} />
      </motion.section>

      {/* Filters Bar */}
      <motion.section className="relative z-30" {...sectionAnimation} transition={{ duration: 0.4, delay: 0.15 }}>
        <RoadmapFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </motion.section>

      {/* Main Library View */}
      <motion.section {...sectionAnimation} transition={{ duration: 0.4, delay: 0.2 }}>
        <RoadmapsGrid
          roadmaps={filteredRoadmaps}
          viewMode={viewMode}
          loading={loading}
          onOpenNewModal={() => setIsNewModalOpen(true)}
          onConvert={(rm) => setConvertRoadmap(rm)}
          onDelete={(rm) => setDeleteTarget(rm)}
        />
      </motion.section>

      {/* Modals */}
      <CreateRoadmapModal
        open={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          fetchRoadmaps();
        }}
      />

      <ConvertProjectModal
        open={Boolean(convertRoadmap)}
        roadmap={convertRoadmap}
        onClose={() => {
          setConvertRoadmap(null);
          fetchRoadmaps();
        }}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Standalone Roadmap"
        description={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Roadmap"
        cancelText="Cancel"
        danger={true}
        loading={deleting}
        onConfirm={handleDeleteRoadmap}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

