"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    FolderKanban,
    Brain,
    CheckSquare,
    Map,
    Settings,
} from "lucide-react";

import Logo from "@/components/shared/Logo";

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

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col border-r border-white/[0.06] bg-[#050505] lg:flex">

            {/* Logo */}
            <div className="flex h-[73px] shrink-0 items-center border-b border-white/[0.06] px-5">
                <Logo />
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`
                                group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium
                                transition-all duration-150
                                ${isActive
                                    ? "bg-white text-black"
                                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                                }
                            `}
                        >
                            <Icon
                                size={16}
                                className={`shrink-0 transition-colors duration-150 ${
                                    isActive ? "text-black" : "text-zinc-600 group-hover:text-zinc-300"
                                }`}
                            />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer — Plan badge */}
            <div className="shrink-0 border-t border-white/[0.06] p-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                        BuilderOS
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                        <p className="text-[13px] font-semibold text-white">Free Plan</p>
                        <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                            Free
                        </span>
                    </div>
                </div>
            </div>

        </aside>
    );
}