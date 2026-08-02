"use client";

import Link from "next/link";

import {
  ArrowLeft,
  Share2,
  Sparkles,
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
  };
  isOwner?: boolean;
}

export default function ProjectWorkspaceHeader({
  project,
}: ProjectWorkspaceHeaderProps) {
  const statusStyles: Record<string, string> = {
    Planning:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",

    Building:
      "border-sky-500/20 bg-sky-500/10 text-sky-400",

    Completed:
      "border-green-500/20 bg-green-500/10 text-green-400",
  };

  return (
    <header
      className="
      sticky
      top-0
      z-40
      border-b
      border-white/10
      bg-[#050505]/90
      backdrop-blur-xl
      "
    >
      <div
        className="
        mx-auto
        flex
        max-w-7xl
        items-center
        justify-between
        px-8
        py-6
        "
      >
        <div className="space-y-4">

          <Link
            href="/projects"
            className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-zinc-500
            transition
            hover:text-white
            "
          >
            <ArrowLeft size={16} />

            Back to Projects
          </Link>

          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-3xl font-bold tracking-tight text-white">
                {project.title}
              </h1>

              <span
                className={`
                rounded-full
                border
                px-3
                py-1
                text-xs
                font-medium
                ${
                  statusStyles[project.status] ??
                  "border-white/10 bg-white/5 text-white"
                }
                `}
              >
                {project.status}
              </span>

            </div>

            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              {project.description || "No description added yet."}
            </p>

          </div>

          <div
            className="
            flex
            flex-wrap
            items-center
            gap-6
            text-sm
            text-zinc-500
            "
          >
            <div className="flex items-center gap-2">

              <Clock3 size={16} />

              Updated{" "}
              {new Date(project.updatedAt).toLocaleDateString()}

            </div>

            <div className="flex items-center gap-2">

              <Users size={16} />

              1 Member

            </div>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Project link copied to clipboard!");
              }
            }}
            className="
            inline-flex
            items-center
            gap-2
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-white/[0.05]
            cursor-pointer
            "
          >
            <Share2 size={18} />

            Share
          </button>

          <Link
            href={`/projects/${project.id}/research`}
            className="
            inline-flex
            items-center
            gap-2
            rounded-2xl
            bg-white
            px-5
            py-3
            text-sm
            font-semibold
            text-black
            transition
            hover:bg-zinc-200
            "
          >
            <Sparkles size={18} />

            AI Assistant
          </Link>

        </div>

      </div>

    </header>
  );
}