"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SocialAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">

      <button
        type="button"
        onClick={() =>
          signIn("github", {
            callbackUrl: "/dashboard",
          })
        }
        className="
        flex
        h-14
        items-center
        justify-center
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        transition
        hover:bg-white/[0.06]
        "
      >
        <FaGithub
          size={24}
          className="text-white"
        />
      </button>

      <button
        type="button"
        onClick={() =>
          signIn("google", {
            callbackUrl: "/dashboard",
          })
        }
        className="
        flex
        h-14
        items-center
        justify-center
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        transition
        hover:bg-white/[0.06]
        "
      >
        <FcGoogle size={28} />
      </button>

    </div>
  );
}