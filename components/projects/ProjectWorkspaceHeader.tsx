"use client";

import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Share2,
  Clock3,
  Users,
} from "lucide-react";

interface ProjectWorkspaceHeaderProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    updatedAt: Date;
    createdAt: Date;
    membersCount?: number;
  };
  isOwner?: boolean;
}

export default function ProjectWorkspaceHeader({
  project,
}: ProjectWorkspaceHeaderProps) {
  const statusStyles: Record<string, string> = {
    Planning:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    Building:
      "border-sky-500/30 bg-sky-500/10 text-sky-400",
    Completed:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Project workspace link copied to clipboard!");
    } else {
      toast.info("Share feature ready");
    }
  };

  const formattedUpdateDate = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(project.updatedAt));

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 py-5 flex-wrap gap-4">
        <div className="space-y-3">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={14} className="text-orange-400 shrink-0" />
            <span>Back to Projects</span>
          </Link>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
                {project.title}
              </h1>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold ${
                  statusStyles[project.status] ??
                  "border-white/10 bg-white/5 text-white"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                {project.status}
              </span>
            </div>

            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-zinc-400">
              {project.description || "No description added yet."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Clock3 size={14} className="text-yellow-400" />
              <span>Updated {formattedUpdateDate}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-sky-400" />
              <span>
                {project.membersCount || 1} Member{(project.membersCount || 1) > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* ONLY Share Button As Requested */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleShare}
            className="
            btn-shimmer
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-white/15
            bg-white/[0.05]
            px-5
            py-2.5
            text-xs
            font-semibold
            text-white
            shadow-lg
            transition-all
            hover:bg-white/10
            hover:border-white/25
            active:scale-95
            cursor-pointer
            "
          >
            <Share2 size={15} className="text-orange-400" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </header>
  );
}