"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Logo from "@/components/shared/Logo";
import SocialAuthButtons from "./SocialAuthButtons";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/dashboard");
      router.refresh();

    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6">

      <div
        className="
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/10
        bg-white/[0.02]
        p-8
        backdrop-blur-xl
        "
      >

        {/* HEADER */}

        <div className="mb-10 text-center">

          <div className="mb-5 flex justify-center">
            <Logo />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Continue building products with BuilderOS
          </p>

        </div>

        {/* SOCIAL LOGIN */}

        <SocialAuthButtons />

        {/* DIVIDER */}

        <div className="my-7 flex items-center gap-4">

          <div className="h-px flex-1 bg-white/10" />

          <span className="font-medium text-zinc-600">
            or
          </span>

          <div className="h-px flex-1 bg-white/10" />

        </div>

        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              Email Address
            </label>

            <input
              type="email"
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

          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
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

          {error && (
            <div
              className="
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/10
              px-4
              py-3
              text-sm
              text-red-400
              "
            >
              {error}
            </div>
          )}

          <div className="flex justify-end">

            <Link
              href="/forgot-password"
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              Forgot Password?
            </Link>

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
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">

          Don&apos;t have an account?{" "}

          <Link
            href="/signup"
            className="font-medium text-white"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </main>
  );
}