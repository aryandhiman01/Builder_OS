"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Brain,
  CheckSquare,
  Map,
  Settings,
  BarChart2,
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

import Logo from "@/components/shared/Logo";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", href: "/projects", icon: FolderKanban },
  { title: "AI Workspace", href: "/ai-workspace", icon: Brain },
  { title: "Tasks", href: "/tasks", icon: CheckSquare },
  { title: "Roadmaps", href: "/roadmaps", icon: Map },
  { title: "Analytics", href: "/analytics", icon: BarChart2 },
  { title: "System Status", href: "/status", icon: Activity },
  { title: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({
  isCollapsed: controlledIsCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  const isCollapsed = controlledIsCollapsed ?? internalIsCollapsed;
  const handleToggle = onToggleCollapse ?? (() => setInternalIsCollapsed((prev) => !prev));

  // Prefetch all sidebar routes in background for 0ms instant tab clicks
  useEffect(() => {
    sidebarItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  return (
    <>
      {/* DESKTOP SIDEBAR (Pure CSS Hardware Accelerated) */}
      <aside
        className={`
          hidden
          lg:flex
          h-screen
          shrink-0
          flex-col
          border-r
          border-white/10
          bg-[#09090c]
          z-40
          relative
          select-none
          overflow-hidden
          transition-[width]
          duration-300
          ease-[cubic-bezier(0.2,0.8,0.2,1)]
          will-change-[width]
          ${isCollapsed ? "w-[68px]" : "w-[220px]"}
        `}
      >
        {/* Inner fixed-width wrapper to prevent DOM layout reflow during width transition */}
        <div className="flex flex-col h-full w-[220px] shrink-0">
          {/* Header Bar */}
          <div className="relative flex h-[70px] shrink-0 items-center justify-between border-b border-white/10 px-3.5">
            <div
              className={`flex items-center gap-2 overflow-hidden transition-opacity duration-200 ${
                isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <Logo />
            </div>

            <button
              onClick={handleToggle}
              className={`
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                bg-white/[0.04]
                text-[#8a8a93]
                transition-all
                duration-200
                hover:bg-white/10
                hover:text-white
                ${isCollapsed ? "absolute left-[18px]" : ""}
              `}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-4 scrollbar-none">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  prefetch={true}
                  title={isCollapsed ? item.title : undefined}
                  className={`
                    group
                    relative
                    flex
                    h-10
                    w-[194px]
                    items-center
                    gap-3
                    rounded-xl
                    px-2.5
                    text-xs
                    font-semibold
                    transition-colors
                    duration-150
                    ${
                      isActive
                        ? "bg-white/10 text-white border border-white/15 shadow-sm"
                        : "text-[#8a8a93] hover:bg-white/[0.06] hover:text-white"
                    }
                  `}
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                    <Icon
                      size={18}
                      className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-orange-400" : "text-[#8a8a93] group-hover:text-white"
                      }`}
                    />
                  </div>

                  <span
                    className={`truncate whitespace-nowrap transition-opacity duration-200 ${
                      isCollapsed ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ fontFamily: "var(--font-sora)" }}
                  >
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Plan Card */}
          <div className="shrink-0 border-t border-white/[0.07] p-2.5">
            <div
              className={`rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-opacity duration-200 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                  BuilderOS
                </span>
                <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-orange-400">
                  Pro Free
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-white truncate">
                Unlimited Workspace
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY DRAWER */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 35 }}
              style={{ willChange: "transform" }}
              className="
                fixed
                inset-y-0
                left-0
                z-50
                flex
                w-72
                flex-col
                border-r
                border-white/10
                bg-[#09090c]
                lg:hidden
                shadow-2xl
              "
            >
              <div className="flex h-[70px] items-center justify-between border-b border-white/10 px-4">
                <Logo />
                <button
                  onClick={onCloseMobile}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#8a8a93] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-4 scrollbar-none">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      prefetch={true}
                      onClick={onCloseMobile}
                      className={`
                        group
                        relative
                        flex
                        h-10
                        items-center
                        gap-3
                        rounded-xl
                        px-2.5
                        text-xs
                        font-semibold
                        transition-colors
                        duration-150
                        ${
                          isActive
                            ? "bg-white/10 text-white border border-white/15 shadow-sm"
                            : "text-[#8a8a93] hover:bg-white/[0.06] hover:text-white"
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? "text-orange-400" : "text-[#8a8a93] group-hover:text-white"
                        }`}
                      />
                      <span
                        className="truncate whitespace-nowrap"
                        style={{ fontFamily: "var(--font-sora)" }}
                      >
                        {item.title}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="shrink-0 border-t border-white/[0.07] p-3.5">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                      BuilderOS
                    </span>
                    <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-orange-400">
                      Pro Free
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-white truncate">
                    Unlimited Workspace
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}