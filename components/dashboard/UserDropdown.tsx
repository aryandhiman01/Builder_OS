"use client";

import Image from "next/image";
import Link from "next/link";

import { signOut, useSession } from "next-auth/react";

import {
    ChevronDown,
    User,
    Settings,
    FolderPlus,
    LogOut,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserDropdown() {
    const { data: session } = useSession();

    if (!session) return null;

    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <button className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 transition-colors hover:bg-white/[0.06]">

                    {/* Avatar */}
                    {session.user?.image ? (
                        <Image
                            src={session.user.image}
                            alt="User"
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-black">
                            {session.user?.name?.charAt(0)}
                        </div>
                    )}

                    {/* Name */}
                    <div className="hidden text-left lg:block">
                        <p className="max-w-[140px] truncate text-[13px] font-semibold leading-none text-white">
                            {session.user?.name}
                        </p>
                        <p className="mt-0.5 max-w-[160px] truncate text-[11px] text-zinc-500">
                            {session.user?.email}
                        </p>
                    </div>

                    <ChevronDown size={14} className="shrink-0 text-zinc-600" />

                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-64 rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-1.5 shadow-2xl"
            >

                {/* User card inside dropdown */}
                <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                    {session.user?.image ? (
                        <Image
                            src={session.user.image}
                            alt="User"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                            {session.user?.name?.charAt(0)}
                        </div>
                    )}
                    <div>
                        <p className="text-[13px] font-semibold text-white">
                            {session.user?.name}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                            {session.user?.email}
                        </p>
                    </div>
                </div>

                <DropdownMenuSeparator className="mx-1 my-1 bg-white/[0.06]" />

                <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-zinc-300 hover:text-white">
                        <User size={15} className="shrink-0" />
                        Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-zinc-300 hover:text-white">
                        <Settings size={15} className="shrink-0" />
                        Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-zinc-300 hover:text-white">
                    <FolderPlus size={15} className="shrink-0" />
                    New Project
                </DropdownMenuItem>

                <DropdownMenuSeparator className="mx-1 my-1 bg-white/[0.06]" />

                <DropdownMenuItem
                    className="cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10 hover:text-red-400"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut size={15} className="shrink-0" />
                    Logout
                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>
    );
}