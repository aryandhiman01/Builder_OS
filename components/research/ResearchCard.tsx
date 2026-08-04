"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  Brain,
  CalendarDays,
  Clock3,
  ArrowRight,
  Trash2,
  Loader2,
  Pencil,
  Sparkles,
  Zap,
} from "lucide-react";

import { Research } from "./ResearchClient";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ActionMenu from "@/components/ui/ActionMenu";
import EditResearchModal from "./EditResearchModal";
import { GeneratePRDModal } from "@/components/prd/GeneratePRDModal";

interface ResearchCardProps {
  projectId: string;
  research: Research;
}

export default function ResearchCard({
  projectId,
  research,
}: ResearchCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [generatePrdOpen, setGeneratePrdOpen] = useState(false);

  async function deleteResearch() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/research/${research.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete research.");
      }

      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const menuItems = [
    {
      label: "Generate PRD from Research",
      icon: <Sparkles size={15} className="text-orange-400" />,
      onClick: () => setGeneratePrdOpen(true),
    },
    {
      label: "Edit Research Brief",
      icon: <Pencil size={15} />,
      onClick: () => setEditOpen(true),
    },
    {
      label: "Delete Research Brief",
      icon: <Trash2 size={15} />,
      danger: true,
      onClick: () => setDeleteOpen(true),
    },
  ];

  const createdDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(research.createdAt));

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#09090c]/90
        p-6
        sm:p-7
        backdrop-blur-2xl
        shadow-xl
        transition-all
        duration-300
        hover:border-orange-500/30
        hover:bg-[#0c0c10]
        "
      >
        {/* Glow */}
        <div
          className="
          absolute
          -right-10
          -top-10
          h-36
          w-36
          rounded-full
          bg-orange-500/10
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-orange-500/20
          "
        />

        {/* Content Container */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-mono font-semibold text-sky-400">
                  <Brain size={13} />
                  {research.model ?? "Gemini 3.6 Flash"}
                </span>

                {research.tokens && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-mono text-[#8a8a93]">
                    <Zap size={11} className="text-orange-400" />
                    {research.tokens} Tokens
                  </span>
                )}
              </div>

              <h2
                className="text-lg font-bold text-white tracking-tight line-clamp-1"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {research.title}
              </h2>

              <p className="line-clamp-2 text-xs text-[#8a8a93] leading-relaxed">
                {research.prompt}
              </p>
            </div>

            <div className={loading ? "pointer-events-none opacity-50" : ""}>
              <ActionMenu items={menuItems} />
            </div>
          </div>

          {/* Footer Metadata & Action Link */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-4 text-[#8a8a93]">
              <div className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-sky-400" />
                <span>{createdDate}</span>
              </div>

              {research.generationTime && (
                <div className="flex items-center gap-1.5">
                  <Clock3 size={14} className="text-yellow-400" />
                  <span>{research.generationTime}s</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin text-orange-400" />}

              <Link
                href={`/projects/${projectId}/research/${research.id}`}
                className="
                btn-shimmer
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-white/15
                bg-white/[0.05]
                px-4
                py-2
                text-xs
                font-bold
                text-white
                shadow-md
                transition-all
                hover:bg-white/10
                hover:border-white/25
                active:scale-95
                "
              >
                <span>View Research Brief</span>
                <ArrowRight size={13} className="text-orange-400 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <EditResearchModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        research={{
          id: research.id,
          title: research.title,
          prompt: research.prompt,
          content: research.content,
        }}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteResearch}
        title="Delete Research"
        description="Are you sure you want to delete this research? This action cannot be undone."
        confirmText="Delete Research"
        cancelText="Cancel"
        loading={loading}
        danger
      />

      <GeneratePRDModal
        open={generatePrdOpen}
        onOpenChange={setGeneratePrdOpen}
        projectId={projectId}
        researchId={research.id}
        researches={[{ id: research.id, title: research.title, prompt: research.prompt }]}
      />
    </>
  );
}