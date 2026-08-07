"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Settings,
} from "lucide-react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  // Show loading placeholder while checking session status
  if (status === "loading") {
    return (
      <div className="h-8 w-20 rounded-full bg-white/[0.04] animate-pulse border border-white/10" />
    );
  }

  // If not logged in, show Log In and Get Started buttons
  if (!session) {
    return (
      <div className="flex items-center gap-2.5">
        <Link
          href="/login"
          className="
          rounded-full
          border
          border-white/10
          bg-white/[0.04]
          px-4
          py-1.5
          text-xs
          font-medium
          text-white
          transition-all
          duration-200
          hover:bg-white/[0.08]
          hover:border-white/20
          "
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="
          rounded-full
          bg-white
          px-4
          py-1.5
          text-xs
          font-semibold
          text-black
          transition-all
          duration-200
          hover:bg-zinc-100
          active:scale-95
          shadow-lg
          shadow-white/10
          "
        >
          Get Started
        </Link>
      </div>
    );
  }

  // If logged in, show user dropdown with real session data
  const userName = session.user?.name || "User";
  const userEmail = session.user?.email || "";
  const userImage = session.user?.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-white/10
          bg-white/[0.04]
          px-3
          py-1.5
          transition-all
          duration-200
          hover:bg-white/[0.08]
          hover:border-white/20
          outline-none
          cursor-pointer
          "
        >
          <div
            className="
            relative
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            border
            border-white/10
            bg-zinc-800
            font-semibold
            text-white
            text-xs
            "
          >
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="hidden text-left md:block">
            <p className="max-w-[140px] truncate text-xs font-semibold text-white leading-tight">
              {userName}
            </p>
            <p className="max-w-[170px] truncate text-[10px] text-zinc-400 leading-tight">
              {userEmail}
            </p>
          </div>

          <ChevronDown className="h-3.5 w-3.5 text-zinc-400 transition-transform duration-200" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
        w-56
        rounded-xl
        border
        border-white/10
        bg-[#0c0c0e]
        p-1.5
        text-white
        shadow-2xl
        backdrop-blur-2xl
        "
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div>
            <p className="text-xs font-semibold text-white">
              {userName}
            </p>
            <p className="text-[11px] text-zinc-400 truncate">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        <Link href="/dashboard">
          <DropdownMenuItem className="rounded-lg text-xs hover:bg-white/[0.08] cursor-pointer">
            <LayoutDashboard className="mr-2 h-3.5 w-3.5 text-orange-400" />
            Dashboard
          </DropdownMenuItem>
        </Link>

        <Link href="/profile">
          <DropdownMenuItem className="rounded-lg text-xs hover:bg-white/[0.08] cursor-pointer">
            <User className="mr-2 h-3.5 w-3.5 text-blue-400" />
            Profile
          </DropdownMenuItem>
        </Link>

        <Link href="/settings">
          <DropdownMenuItem className="rounded-lg text-xs hover:bg-white/[0.08] cursor-pointer">
            <Settings className="mr-2 h-3.5 w-3.5 text-violet-400" />
            Settings
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-lg text-xs text-red-400 hover:bg-red-500/10 cursor-pointer"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}