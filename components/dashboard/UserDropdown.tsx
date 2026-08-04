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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserDropdown() {
  const { data: session } = useSession();

  if (!session) return null;

  const userName = session.user?.name || "Builder";
  const userEmail = session.user?.email || "";
  const userImage = session.user?.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="
          flex
          cursor-pointer
          items-center
          gap-2.5
          rounded-full
          border
          border-white/10
          bg-white/[0.04]
          px-3
          py-1.5
          transition-all
          duration-200
          hover:border-white/20
          hover:bg-white/[0.08]
          outline-none
          shadow-inner
          "
        >
          {/* Avatar */}
          <div className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-800 font-semibold text-white text-xs">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={28}
                height={28}
                className="h-full w-full object-cover"
              />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>

          {/* Name & Email (Desktop) */}
          <div className="hidden text-left md:block">
            <p className="max-w-[130px] truncate text-xs font-semibold leading-tight text-white">
              {userName}
            </p>
            <p className="max-w-[150px] truncate text-[10px] leading-tight text-[#8a8a93]">
              {userEmail}
            </p>
          </div>

          <ChevronDown size={13} className="shrink-0 text-[#8a8a93]" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
        w-56
        rounded-xl
        border
        border-white/10
        bg-[#0c0c0e]/95
        p-1.5
        text-white
        shadow-2xl
        backdrop-blur-2xl
        "
      >
        {/* Header Label */}
        <DropdownMenuLabel className="px-3 py-2">
          <div>
            <p className="text-xs font-semibold text-white">
              {userName}
            </p>
            <p className="text-[11px] text-[#8a8a93] truncate">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex items-center rounded-lg px-3 py-2 text-xs font-medium text-[#8a8a93] hover:bg-white/[0.08] hover:text-white cursor-pointer"
          >
            <User className="mr-2.5 h-3.5 w-3.5 text-blue-400" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex items-center rounded-lg px-3 py-2 text-xs font-medium text-[#8a8a93] hover:bg-white/[0.08] hover:text-white cursor-pointer"
          >
            <Settings className="mr-2.5 h-3.5 w-3.5 text-violet-400" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/projects"
            className="flex items-center rounded-lg px-3 py-2 text-xs font-medium text-[#8a8a93] hover:bg-white/[0.08] hover:text-white cursor-pointer"
          >
            <FolderPlus className="mr-2.5 h-3.5 w-3.5 text-emerald-400" />
            New Project
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
        >
          <LogOut className="mr-2.5 h-3.5 w-3.5" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}