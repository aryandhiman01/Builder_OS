"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Search, Plus } from "lucide-react";
import UserDropdown from "./UserDropdown";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  onNewProject?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export default function DashboardHeader({
  onNewProject,
  searchQuery = "",
  onSearchChange,
}: DashboardHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [internalModalOpen, setInternalModalOpen] = useState(false);

  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  const firstName = session?.user?.name?.split(" ")[0] ?? "Builder";

  const handleNewProjectClick = () => {
    if (onNewProject) {
      onNewProject();
    } else {
      setInternalModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[73px] shrink-0 items-center border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between gap-6 px-8">
          {/* Left — Greeting */}
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-semibold tracking-tight text-white leading-none">
              {greeting}, {firstName} 👋
            </h1>
            <p className="mt-0.5 text-xs text-zinc-500">
              Let&apos;s build something amazing today.
            </p>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5 lg:flex">
              <Search size={15} className="shrink-0 text-zinc-600" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-52 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </div>

            {/* New Project Button */}
            <button
              onClick={handleNewProjectClick}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-black transition-colors hover:bg-zinc-100 active:scale-[0.98]"
            >
              <Plus size={16} strokeWidth={2.5} />
              New Project
            </button>

            <UserDropdown />
          </div>
        </div>
      </header>

      <CreateProjectModal
        open={internalModalOpen}
        onClose={() => {
          setInternalModalOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}