"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="rounded-xl bg-white px-5 py-3 text-black"
    >
      Continue with Google
    </button>
  );
}