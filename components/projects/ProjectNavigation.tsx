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
}

export default function ProjectNavigation({
  projectId,
}: ProjectNavigationProps) {
  const pathname = usePathname();

  const navigation = [
    {
      title: "Overview",
      href: `/projects/${projectId}`,
      icon: LayoutDashboard,
    },
    {
      title: "Research",
      href: `/projects/${projectId}/research`,
      icon: Brain,
    },
    {
      title: "PRD",
      href: `/projects/${projectId}/prd`,
      icon: FileText,
    },
    {
      title: "Roadmap",
      href: `/projects/${projectId}/roadmap`,
      icon: Map,
    },
    {
      title: "Architecture",
      href: `/projects/${projectId}/architecture`,
      icon: Boxes,
    },
    {
      title: "Tasks",
      href: `/projects/${projectId}/tasks`,
      icon: CheckSquare,
    },
    {
      title: "Settings",
      href: `/projects/${projectId}/settings`,
      icon: Settings,
    },
  ];

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
        {navigation.map((item) => {
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