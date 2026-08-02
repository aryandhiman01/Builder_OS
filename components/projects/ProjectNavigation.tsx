"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Brain,
  FileText,
  Map,
  Boxes,
  CheckSquare,
  BookOpen,
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
    <nav
      className="
      sticky
      top-[104px]
      z-30
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
        gap-2
        overflow-x-auto
        px-8
        py-4
        "
      >
        {visibleNav.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`
                inline-flex
                shrink-0
                items-center
                gap-2
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-medium
                transition-all
                ${
                  active
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }
              `}
            >
              <Icon size={17} />

              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}