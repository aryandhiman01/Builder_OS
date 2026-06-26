import Link from "next/link";

import {
    CalendarDays,
    Users,
    ArrowRight,
    MoreHorizontal
} from "lucide-react";

interface ProjectCardProps {
    id: string;
    title: string;
    description: string;
    status: "Planning" | "Building" | "Completed";
    progress: number;
    updatedAt: string;
    members: number;
}

export default function ProjectCard({ id, title, description, status, progress, updatedAt, members}: ProjectCardProps) {
    const statusStyles = {
        Planning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
        Building: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
        Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    };

    return (
    <Link
      href={`/projects/${id}`}
      className="
      group
      relative
      block
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
        h-32
        w-32
        rounded-full
        bg-white/5
        blur-3xl
        transition
        duration-500
        group-hover:bg-white/10
        "
      />

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <div
            className={`
            inline-flex
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            ${statusStyles[status]}
            `}
          >
            {status}
          </div>

          <h3 className="mt-4 text-xl font-semibold text-white">
            {title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
            {description}
          </p>

        </div>

        <button
          className="
          rounded-xl
          p-2
          text-zinc-500
          transition
          hover:bg-white/5
          hover:text-white
          "
        >
          <MoreHorizontal size={18} />
        </button>

      </div>

      {/* Progress */}

      <div className="mt-8">

        <div className="mb-2 flex justify-between">

          <span className="text-sm text-zinc-500">
            Progress
          </span>

          <span className="text-sm font-medium text-white">
            {progress}%
          </span>

        </div>

        <div className="h-2 rounded-full bg-white/10">

          <div
            className="
            h-full
            rounded-full
            bg-white
            transition-all
            duration-500
            "
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* Footer */}

      <div className="mt-8 flex items-center justify-between">

        <div className="flex items-center gap-5 text-sm text-zinc-500">

          <div className="flex items-center gap-2">

            <Users size={16} />

            {members}

          </div>

          <div className="flex items-center gap-2">

            <CalendarDays size={16} />

            {updatedAt}

          </div>

        </div>

        <div
          className="
          flex
          items-center
          gap-2
          text-sm
          font-medium
          text-white
          "
        >
          Open

          <ArrowRight
            size={16}
            className="
            transition
            group-hover:translate-x-1
            "
          />

        </div>

      </div>

    </Link>
  );
}