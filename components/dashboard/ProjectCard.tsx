"use client";

import Link from "next/link";
import { CalendarDays, Users, ArrowRight, MoreHorizontal, Layers } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: "Planning" | "Building" | "Completed";
  progress: number;
  updatedAt: string;
  members: number;
  color: string;
  isShared?: boolean;
}

export default function ProjectCard({
  id,
  title,
  description,
  status,
  progress,
  updatedAt,
  members,
  color,
  isShared = false,
}: ProjectCardProps) {
  const statusStyles = {
    Planning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    Building: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" as const }}
      className="h-full"
    >
      <Link
        href={`/projects/${id}`}
        className="
        group
        relative
        flex
        h-full
        flex-col
        justify-between
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-[#09090c]/90
        p-6
        backdrop-blur-2xl
        transition-all
        duration-300
        hover:border-white/20
        hover:bg-[#0c0c10]
        hover:shadow-2xl
        "
      >
        {/* Glow Overlay using custom project color */}
        <div
          className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-36
          w-36
          rounded-full
          blur-3xl
          transition-all
          duration-500
          group-hover:scale-125
          "
          style={{
            backgroundColor: color || "#8B5CF6",
            opacity: 0.12,
          }}
        />

        <div>
          {/* Top Status & Menu Bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-2.5
                py-0.5
                text-[11px]
                font-mono
                font-medium
                ${statusStyles[status]}
                `}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: color || "#8B5CF6" }}
                />
                {status}
              </span>

              {isShared && (
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-mono font-medium text-indigo-300">
                  <Users size={10} />
                  Shared
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="
              rounded-lg
              p-1.5
              text-[#8a8a93]
              transition-colors
              hover:bg-white/10
              hover:text-white
              "
              aria-label="More options"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Title & Description */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Layers size={16} style={{ color: color || "#8B5CF6" }} className="shrink-0" />
              <h3
                className="text-lg font-bold tracking-tight text-white group-hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {title}
              </h3>
            </div>

            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#8a8a93]">
              {description || "No project description provided."}
            </p>
          </div>
        </div>

        <div>
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8a8a93]">Progress</span>
              <span className="font-mono text-[11px] font-bold text-white">{progress}%</span>
            </div>

            <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden p-0.5 border border-white/[0.04]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{
                  width: `${Math.max(progress, 4)}%`,
                  backgroundColor: color || "#8B5CF6",
                  boxShadow: `0 0 10px ${color || "#8B5CF6"}60`,
                }}
              />
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="mt-6 flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-4 text-xs text-[#8a8a93]">
              <div className="flex items-center gap-1.5">
                <Users size={13} />
                <span>{members} {members === 1 ? "member" : "members"}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <CalendarDays size={13} />
                <span>{updatedAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">
              <span>Open</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}