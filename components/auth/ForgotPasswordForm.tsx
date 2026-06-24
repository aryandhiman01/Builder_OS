"use client";

import Link from "next/link";
import { useState } from "react";

import Logo from "@/components/shared/Logo";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await fetch(
      "/api/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    setSuccess(true);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4">

      <div
        className="
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/10
        bg-white/[0.02]
        p-8
        shadow-2xl
        backdrop-blur-xl
        "
      >

        {/* LOGO */}

        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        {/* HEADER */}

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-white">
            Forgot Password
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Enter your email and we'll send you a reset link.
          </p>

        </div>

        {success ? (

          <div
            className="
            rounded-xl
            border
            border-green-500/20
            bg-green-500/10
            p-4
            text-center
            "
          >
            <p className="text-sm text-green-400">
              Password reset link sent successfully.
            </p>
          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label
                className="
                mb-2
                block
                text-xs
                font-medium
                text-zinc-400
                "
              >
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="aryan@example.com"
                className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                px-4
                py-3
                text-white
                outline-none
                transition
                placeholder:text-zinc-600
                focus:border-white/20
                "
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              rounded-xl
              bg-white
              py-3
              font-semibold
              text-black
              transition
              hover:bg-zinc-200
              disabled:opacity-50
              "
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

          </form>

        )}

        <p className="mt-6 text-center text-sm text-zinc-500">

          Remember your password?{" "}

          <Link
            href="/login"
            className="font-medium text-white"
          >
            Back to Login
          </Link>

        </p>

      </div>

    </main>
  );
}