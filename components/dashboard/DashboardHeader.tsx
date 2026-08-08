"use client";

import { useState, useEffect } from "react";
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

function getGreetingInfo(hour: number) {
  if (hour >= 5 && hour < 12) {
    return { text: "Good Morning", emoji: "👋" };
  } else if (hour >= 12 && hour < 17) {
    return { text: "Good Afternoon", emoji: "☀️" };
  } else if (hour >= 17 && hour < 22) {
    return { text: "Good Evening", emoji: "🌆" };
  } else {
    return { text: "Good Night", emoji: "🌙" };
  }
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

  const [greetingInfo, setGreetingInfo] = useState<{ text: string; emoji: string }>({
    text: "Welcome",
    emoji: "👋",
  });

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      setGreetingInfo(getGreetingInfo(currentHour));
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

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
      <header className="sticky top-0 z-30 flex h-[70px] shrink-0 items-center border-b border-white/10 bg-[#09090c]/90 backdrop-blur-2xl shadow-lg shadow-black/40">
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
                  suppressHydrationWarning
                  className="text-base sm:text-lg font-bold tracking-tight text-white leading-none"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  {greetingInfo.text}, {firstName} {greetingInfo.emoji}
                </h1>
              </div>
              <p className="mt-1 text-xs text-[#8a8a93] hidden sm:block">
                Let&apos;s build something amazing today.
              </p>
            </div>
          </div>

          {/* Center / Right Controls */}
          <div className="flex items-center gap-3">
            {onSearchChange && (
              <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 shadow-inner focus-within:border-orange-500/50 transition-all">
                <Search size={14} className="text-[#8a8a93]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search workspace..."
                  className="w-36 bg-transparent text-xs text-white placeholder:text-[#8a8a93] outline-none"
                />
                <kbd className="rounded border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono text-[#8a8a93]">⌘K</kbd>
              </div>
            )}

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