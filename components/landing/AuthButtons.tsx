"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

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
    <div className="flex items-center gap-4">

      {/* Avatar */}

      <div className="flex items-center gap-3">

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

        <div className="hidden md:block">

          <p className="max-w-[140px] truncate text-sm font-medium text-white">
            {session.user?.name}
          </p>

          <p className="max-w-[180px] truncate text-xs text-zinc-500">
            {session.user?.email}
          </p>

        </div>

      </div>

      {/* Logout */}

      <Button
        variant="outline"
        className="
        border-white/10
        bg-white/[0.03]
        text-white
        hover:bg-white/10
        "
        onClick={() =>
          signOut({
            callbackUrl: "/",
          })
        }
      >
        Logout
      </Button>

    </div>
  );
}