"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Brain,
  CheckSquare,
  Map,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Zap,
} from "lucide-react";

import Logo from "@/components/shared/Logo";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "AI Workspace",
    href: "/ai-workspace",
    icon: Brain,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Roadmaps",
    href: "/roadmaps",
    icon: Map,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (isCollapsed) {
          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={onCloseMobile}
              title={item.title}
              className={`
                group
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                mx-auto
                rounded-xl
                transition-all
                duration-200
                ${
                  isActive
                    ? "bg-white text-black shadow-lg shadow-white/10"
                    : "text-[#8a8a93] hover:bg-white/[0.06] hover:text-white"
                }
              `}
            >
              <Icon
                size={20}
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-black" : "text-[#8a8a93] group-hover:text-white"
                }`}
              />
            </Link>
          );
        }

        return (
          <Link
            key={item.title}
            href={item.href}
            onClick={onCloseMobile}
            className={`
              group
              flex
              items-center
              gap-3
              rounded-xl
              px-3.5
              py-2.5
              text-xs
              font-semibold
              transition-all
              duration-200
              ${
                isActive
                  ? "bg-white text-black shadow-lg shadow-white/10"
                  : "text-[#8a8a93] hover:bg-white/[0.06] hover:text-white"
              }
            `}
          >
            <Icon
              size={18}
              className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? "text-black" : "text-[#8a8a93] group-hover:text-white"
              }`}
            />

            <span className="truncate" style={{ fontFamily: "var(--font-sora)" }}>
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ------------------------------------------------ */}
      {/* DESKTOP SIDEBAR (Fixed, Collapsible)             */}
      {/* ------------------------------------------------ */}
      <motion.aside
        animate={{ width: isCollapsed ? 64 : 200 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="
        hidden
        h-screen
        shrink-0
        flex-col
        border-r
        border-white/10
        bg-[#09090c]/95
        backdrop-blur-2xl
        lg:flex
        z-40
        relative
        "
      >
        {/* Header Bar with Logo & Collapse Toggle */}
        <div
          className={`
          flex
          h-[73px]
          shrink-0
          items-center
          border-b
          border-white/[0.07]
          px-4
          ${isCollapsed ? "justify-center" : "justify-between"}
          `}
        >
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2 overflow-hidden">
                <Logo />
              </div>

              <button
                onClick={onToggleCollapse}
                className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                bg-white/[0.03]
                text-[#8a8a93]
                transition-colors
                hover:bg-white/10
                hover:text-white
                "
                title="Collapse Sidebar"
              >
                <PanelLeftClose size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={onToggleCollapse}
              className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/[0.04]
              text-white
              transition-all
              hover:border-violet-500/40
              hover:bg-violet-500/10
              hover:text-violet-300
              "
              title="Expand Sidebar"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}
        </div>

        {/* Nav Items */}
        {navContent}

        {/* Footer Card */}
        <div className="shrink-0 border-t border-white/[0.07] p-3">
          {!isCollapsed ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                  BuilderOS Plan
                </span>
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-violet-300">
                  Pro Free
                </span>
              </div>
              <p className="mt-1.5 text-xs font-semibold text-white">
                Unlimited Workspace
              </p>
            </div>
          ) : (
            <div
              className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"
              title="BuilderOS Pro Free Plan"
            >
              <Zap size={16} className="text-violet-400" />
            </div>
          )}
        </div>
      </motion.aside>

      {/* ------------------------------------------------ */}
      {/* MOBILE OVERLAY DRAWER (Slide-in for Mobile)       */}
      {/* ------------------------------------------------ */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Dark Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md lg:hidden"
            />

            {/* Slide-in Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
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
              backdrop-blur-2xl
              lg:hidden
              shadow-2xl
              "
            >
              {/* Top Header */}
              <div className="flex h-[73px] items-center justify-between border-b border-white/[0.07] px-5">
                <Logo />
                <button
                  onClick={onCloseMobile}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#8a8a93] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Nav Content */}
              {navContent}

              {/* Footer */}
              <div className="shrink-0 border-t border-white/[0.07] p-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                      BuilderOS Plan
                    </span>
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-violet-300">
                      Pro Free
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-white">
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