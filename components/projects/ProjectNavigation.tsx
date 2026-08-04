"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import {
  LayoutDashboard,
  Brain,
  FileText,
  Map,
  Boxes,
  CheckSquare,
  Settings,
} from "lucide-react";

interface ProjectNavigationProps {
  projectId: string;
  isOwner: boolean;
}

export default function ProjectNavigation({
  projectId,
  isOwner,
}: ProjectNavigationProps) {
  const pathname = usePathname();

  const navigation = [
    {
      title: "Overview",
      href: `/projects/${projectId}`,
      icon: LayoutDashboard,
      ownerOnly: false,
    },
    {
      title: "Research",
      href: `/projects/${projectId}/research`,
      icon: Brain,
      ownerOnly: false,
    },
    {
      title: "PRD",
      href: `/projects/${projectId}/prd`,
      icon: FileText,
      ownerOnly: false,
    },
    {
      title: "Roadmap",
      href: `/projects/${projectId}/roadmap`,
      icon: Map,
      ownerOnly: false,
    },
    {
      title: "Architecture",
      href: `/projects/${projectId}/architecture`,
      icon: Boxes,
      ownerOnly: false,
    },
    {
      title: "Tasks",
      href: `/projects/${projectId}/tasks`,
      icon: CheckSquare,
      ownerOnly: false,
    },
    {
      title: "Settings",
      href: `/projects/${projectId}/settings`,
      icon: Settings,
      ownerOnly: true,
    },
  ];

  const visibleNav = navigation.filter(
    (item) => !item.ownerOnly || isOwner
  );

  return (
    <nav className="sticky top-[86px] sm:top-[90px] z-30 flex justify-center px-4 py-2 mt-3 sm:mt-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto flex max-w-full items-center gap-1 sm:gap-2 overflow-x-auto rounded-full bg-[#121219]/90 p-1.5 backdrop-blur-2xl border border-white/10 shadow-xl shadow-black/80 no-scrollbar">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`
                relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors duration-200 select-none
                ${active ? "text-black" : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"}
              `}
            >
              {active && (
                <motion.div
                  layoutId="activeNavTabPill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={15}
                className={`relative z-10 transition-transform duration-200 ${
                  active ? "text-orange-600 scale-110" : "text-zinc-400"
                }`}
              />
              <span className="relative z-10">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}