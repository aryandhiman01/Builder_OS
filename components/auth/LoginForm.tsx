"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        alert(result.error);
        return;
      }

      router.push("/dashboard");
      router.refresh();

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-zinc-400">
            Continue building products with BuilderOS
          </p>

        </div>

        {/* GOOGLE */}

        <div className="space-y-3">

          <button
            onClick={() =>
              signIn("google", {
                callbackUrl: "/dashboard",
              })
            }
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-4 py-3 font-medium text-black transition hover:bg-zinc-200"
          >
            <FcGoogle size={22} />

            Continue with Google
          </button>

          {/* GITHUB */}

          <button
            onClick={() =>
              signIn("github", {
                callbackUrl: "/dashboard",
              })
            }
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 font-medium text-white transition hover:bg-zinc-800"
          >
            <FaGithub size={20} />

            Continue with GitHub
          </button>

        </div>

        {/* DIVIDER */}

        <div className="my-8 flex items-center gap-4">

          <div className="h-px flex-1 bg-white/10" />

          <span className="text-sm text-zinc-500">
            OR
          </span>

          <div className="h-px flex-1 bg-white/10" />

        </div>

        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="aryan@example.com"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-white/30"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-white/30"
            />

          </div>

          <div className="flex justify-end">

            <Link
              href="/forgot-password"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Forgot Password?
            </Link>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">

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