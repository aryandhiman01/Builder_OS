"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SocialAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() =>
          signIn("github", {
            callbackUrl: "/dashboard",
          })
        }
        className="
          flex
          h-11
          items-center
          justify-center
          gap-2.5
          rounded-xl
          border
          border-white/10
          bg-white/[0.04]
          px-4
          text-xs
          font-semibold
          text-white
          transition-all
          duration-200
          hover:bg-white/10
          hover:border-white/20
          active:scale-95
          shadow-sm
        "
      >
        <FaGithub size={18} className="text-white shrink-0" />
        <span>GitHub</span>
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
          h-11
          items-center
          justify-center
          gap-2.5
          rounded-xl
          border
          border-white/10
          bg-white/[0.04]
          px-4
          text-xs
          font-semibold
          text-white
          transition-all
          duration-200
          hover:bg-white/10
          hover:border-white/20
          active:scale-95
          shadow-sm
        "
      >
        <FcGoogle size={18} className="shrink-0" />
        <span>Google</span>
      </button>
    </div>
  );
}