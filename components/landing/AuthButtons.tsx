"use client";

import Link from "next/link";
import Image from "next/image";

import { useSession, signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Settings,
} from "lucide-react";

export default function AuthButtons() {
  const { data: session } = useSession();

  // Demo user data matching image if session is null
  const userName = session?.user?.name || "Aryan Dhiman";
  const userEmail = session?.user?.email || "aryandhiman2605@gmail.com";
  const userImage = session?.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";

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
            <p className="text-[11px] text-zinc-400">
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

        {session ? (
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg text-xs text-red-400 hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Logout
          </DropdownMenuItem>
        ) : (
          <Link href="/login">
            <DropdownMenuItem className="rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/10 cursor-pointer">
              <User className="mr-2 h-3.5 w-3.5" />
              Log In / Register
            </DropdownMenuItem>
          </Link>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}