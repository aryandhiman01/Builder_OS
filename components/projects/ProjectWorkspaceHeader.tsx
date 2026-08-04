"use client";

import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Share2,
  Clock3,
  Users,
} from "lucide-react";

export interface MemberUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ProjectWorkspaceHeaderProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    updatedAt: Date;
    createdAt: Date;
    members?: MemberUser[];
    membersCount?: number;
  };
  isOwner?: boolean;
  onOpenMobileSidebar?: () => void;
}

export default function ProjectWorkspaceHeader({
  project,
  isOwner,
  onOpenMobileSidebar,
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

  const membersList = project.members && project.members.length > 0
    ? project.members
    : [];
  const totalMembers = membersList.length || project.membersCount || 1;
  const visibleAvatars = membersList.slice(0, 5);
  const extraCount = totalMembers - visibleAvatars.length;

  return (
    <header className="sticky top-2 sm:top-3 z-40 px-3 sm:px-6 w-full max-w-full pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-7xl rounded-full border border-white/[0.12] bg-[#0a0a0c]/90 backdrop-blur-xl px-3.5 sm:px-5 py-2.5 sm:py-3 shadow-2xl shadow-black/80 flex items-center justify-between flex-wrap gap-3">
        {/* Left Side: Mobile Toggle + Back Button + Breadcrumb + Title + Status + Updated Date */}
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          {onOpenMobileSidebar && (
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              className="lg:hidden flex h-8.5 w-8.5 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-zinc-400 hover:text-white transition hover:bg-white/10"
              title="Open Project Sidebar"
            >
              <ArrowLeft size={15} className="rotate-180 text-orange-400" />
            </button>
          )}

          <Link
            href="/projects"
            className="group flex h-8.5 w-8.5 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-zinc-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white shrink-0"
            title="Back to Projects"
          >
            <ArrowLeft size={15} className="text-orange-400 transition group-hover:-translate-x-0.5" />
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-zinc-400 shrink-0">
            <Link href="/projects" className="hover:text-zinc-200 transition">Projects</Link>
            <span className="text-zinc-600">/</span>
          </div>

          <h1
            className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            {project.title}
          </h1>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold shrink-0 ${
              statusStyles[project.status] ??
              "border-white/10 bg-white/5 text-white"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            {project.status}
          </span>

          <div className="hidden xl:flex items-center gap-1.5 text-xs text-zinc-400 pl-2.5 border-l border-white/10 shrink-0">
            <Clock3 size={13} className="text-yellow-400" />
            <span>Updated {formattedUpdateDate}</span>
          </div>
        </div>

        {/* Right Side: Members Avatar Stack + Share Button */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Members Badge with Circle Avatars */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-md shadow-sm">
            <div className="flex -space-x-2 overflow-hidden items-center">
              {visibleAvatars.length > 0 ? (
                visibleAvatars.map((user) => (
                  <div
                    key={user.id}
                    title={user.name || user.email || "Member"}
                    className="relative inline-flex h-6.5 w-6.5 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#0a0a0c] bg-zinc-800 text-[11px] font-bold text-white shadow-sm overflow-hidden"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "Member"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="uppercase text-orange-400">
                        {(user.name || user.email || "M").charAt(0)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div
                  title="Member"
                  className="relative inline-flex h-6.5 w-6.5 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#0a0a0c] bg-zinc-800 text-[11px] font-bold text-orange-400 shadow-sm"
                >
                  M
                </div>
              )}

              {extraCount > 0 && (
                <div className="relative inline-flex h-6.5 w-6.5 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#0a0a0c] bg-zinc-800 text-[10px] font-bold text-zinc-300">
                  +{extraCount}
                </div>
              )}
            </div>

            <span className="text-xs font-semibold text-zinc-300 hidden sm:block">
              {totalMembers}
            </span>
          </div>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="
              btn-shimmer
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-white/15
              bg-white/[0.08]
              px-3.5
              sm:px-4
              py-1.5
              text-xs
              font-semibold
              text-white
              shadow-md
              transition-all
              hover:bg-white/15
              hover:border-white/30
              active:scale-95
              cursor-pointer
            "
          >
            <Share2 size={14} className="text-orange-400" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </header>
  );
}