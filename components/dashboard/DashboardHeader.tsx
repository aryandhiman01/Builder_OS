"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Search, Plus, Menu } from "lucide-react";
import UserDropdown from "./UserDropdown";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  onNewProject?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenMobileSidebar?: () => void;
}

export default function DashboardHeader({
  onNewProject,
  searchQuery = "",
  onSearchChange,
  onOpenMobileSidebar,
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
      <header className="sticky top-0 z-30 flex h-[73px] shrink-0 items-center border-b border-white/[0.08] bg-[#09090c]/90 backdrop-blur-2xl shadow-lg shadow-black/40">
        <div className="flex w-full items-center justify-between gap-4 px-4 sm:px-8">
          {/* Left — Mobile Hamburger & Greeting */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={onOpenMobileSidebar}
              className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/[0.04]
              text-[#8a8a93]
              transition-colors
              hover:bg-white/10
              hover:text-white
              lg:hidden
              "
              aria-label="Open mobile navigation menu"
            >
              <Menu size={18} />
            </button>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <h1
                  className="text-base sm:text-lg font-bold tracking-tight text-white leading-none"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  {greeting}, {firstName} 👋
                </h1>
              </div>
              <p className="mt-1 text-xs text-[#8a8a93] hidden sm:block">
                Let&apos;s build something amazing today.
              </p>
            </div>
          </div>

          {/* Right — Landing Page Style Controls */}
          <div className="flex items-center gap-3">
            {/* New Project Button (Landing Page Shimmer Button) */}
            <button
              onClick={handleNewProjectClick}
              className="
              btn-shimmer
              flex
              cursor-pointer
              items-center
              gap-1.5
              rounded-full
              bg-white
              px-4
              py-2
              text-xs
              font-semibold
              text-black
              shadow-lg
              shadow-white/10
              transition-all
              hover:bg-zinc-100
              active:scale-95
              "
            >
              <Plus size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">New Project</span>
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