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
} from "lucide-react";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex items-center gap-3">

        <Link href="/login">
          <Button
            variant="ghost"
            className="text-zinc-400 hover:text-white"
          >
            Log in
          </Button>
        </Link>

        <Link href="/signup">
          <Button
            className="
            rounded-xl
            bg-white
            text-black
            hover:bg-zinc-200
            "
          >
            Start Building
          </Button>
        </Link>

      </div>
    );
  }

  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <button
          className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-white/10
          bg-white/[0.03]
          px-3
          py-2
          transition
          hover:bg-white/[0.06]
          "
        >

          <div
            className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-white
            font-semibold
            text-black
            "
          >

            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "User"}
                fill
                className="object-cover"
              />
            ) : (
              session.user?.name?.charAt(0).toUpperCase()
            )}

          </div>

          <div className="hidden text-left md:block">

            <p className="max-w-[140px] truncate text-sm font-medium text-white">
              {session.user?.name}
            </p>

            <p className="max-w-[180px] truncate text-xs text-zinc-500">
              {session.user?.email}
            </p>

          </div>

          <ChevronDown className="h-4 w-4 text-zinc-500" />

        </button>

      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
        w-60
        border
        border-white/10
        bg-zinc-950
        text-white
        "
      >

        <DropdownMenuLabel>

          <div>

            <p className="font-medium">
              {session.user?.name}
            </p>

            <p className="text-xs text-zinc-500">
              {session.user?.email}
            </p>

          </div>

        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Link href="/dashboard">

          <DropdownMenuItem>

            <LayoutDashboard className="mr-2 h-4 w-4" />

            Dashboard

          </DropdownMenuItem>

        </Link>

        <Link href="/profile">

          <DropdownMenuItem>

            <User className="mr-2 h-4 w-4" />

            Profile

          </DropdownMenuItem>

        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() =>
            signOut({
              callbackUrl: "/",
            })
          }
          className="text-red-400"
        >

          <LogOut className="mr-2 h-4 w-4" />

          Logout

        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}