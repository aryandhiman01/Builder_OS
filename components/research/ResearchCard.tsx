"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Brain,
  CalendarDays,
  Clock3,
  ArrowRight,
  Trash2,
  Loader2,
  Pencil,
} from "lucide-react";

import { Research } from "./ResearchClient";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ActionMenu from "@/components/ui/ActionMenu";
import EditResearchModal from "./EditResearchModal";

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
  const [editOpen, setEditOpen] =useState(false);

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
      label: "Edit Research",

      icon: <Pencil size={16} />,

      onClick: () =>
        setEditOpen(true),

    },

    {
      label: "Delete Research",

      icon: <Trash2 size={16} />,

      danger: true,

      onClick: () =>
        setDeleteOpen(true),

    },

  ];

  const createdDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(research.createdAt));

  return (
    <>
      <div
        className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.03]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-white/20
        hover:bg-white/[0.05]
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
          bg-blue-500/10
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-blue-500/20
          "
        />

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div
                className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-blue-500/20
                bg-blue-500/10
                px-3
                py-1
                text-xs
                font-medium
                text-blue-400
                "
              >
                <Brain size={14} />
                {research.model ?? "AI"}
              </div>

              <h2
                className="
                mt-5
                text-xl
                font-semibold
                text-white
                "
              >
                {research.title}
              </h2>

              <p
                className="
                mt-3
                line-clamp-3
                text-sm
                leading-7
                text-zinc-500
                "
              >
                {research.prompt}
              </p>
            </div>

            <div
              className={`
                transition
                ${
                  loading
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              `}
            >
              <ActionMenu items={menuItems} />
            </div>
          </div>

          {/* Footer */}
          <div
            className="
            mt-8
            flex
            items-center
            justify-between
            border-t
            border-white/10
            pt-5
            "
          >
            <div className="space-y-3">
              <div
                className="
                flex
                items-center
                gap-2
                text-sm
                text-zinc-500
                "
              >
                <CalendarDays size={15} />
                <span>{createdDate}</span>
              </div>

              <div
                className="
                flex
                flex-wrap
                items-center
                gap-4
                text-sm
                text-zinc-500
                "
              >
                <div className="flex items-center gap-2">
                  <Clock3 size={15} />
                  <span>{research.generationTime ?? 0}s</span>
                </div>

                <span
                  className="
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-zinc-300
                  "
                >
                  {research.tokens ?? 0} Tokens
                </span>
              </div>
            </div>

            {loading && (
              <Loader2
                size={18}
                className="
                  mb-4
                  animate-spin
                  text-zinc-500
                "
              />
            )}

            <Link
              href={`/projects/${projectId}/research/${research.id}`}
              className={`
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                px-4
                py-2
                text-sm
                font-medium
                transition-all
                duration-300
                ${
                  loading
                    ? "pointer-events-none opacity-50"
                    : "text-white hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                }
              `}
            >
              View Research
              <ArrowRight
                size={16}
                className="
                transition-transform
                duration-300
                group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        </div>

        {/* AI Generated Badge */}
        {research.model && (
          <div
            className="
            pointer-events-none
            absolute
            right-5
            top-5
            rounded-full
            border
            border-blue-500/20
            bg-blue-500/10
            px-2.5
            py-1
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-blue-400
            "
          >
            AI Generated
          </div>
        )}
      </div>

      <EditResearchModal
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
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
    </>
  );
}