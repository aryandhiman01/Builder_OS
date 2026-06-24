"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      // Auto Login

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
            Create Account
          </h1>

          <p className="mt-2 text-zinc-400">
            Start building with BuilderOS
          </p>

        </div>

        {/* SOCIAL LOGIN */}

        <div className="space-y-3">

          <button
            onClick={() =>
              signIn("google", {
                callbackUrl: "/dashboard",
              })
            }
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-4 py-3 font-medium text-black hover:bg-zinc-200"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <button
            onClick={() =>
              signIn("github", {
                callbackUrl: "/dashboard",
              })
            }
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 font-medium text-white hover:bg-zinc-800"
          >
            <FaGithub size={20} />
            Continue with GitHub
          </button>

        </div>

        <div className="my-8 flex items-center gap-4">

          <div className="h-px flex-1 bg-white/10" />

          <span className="text-sm text-zinc-500">
            OR
          </span>

          <div className="h-px flex-1 bg-white/10" />

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSignup}
          className="space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Aryan Dhiman"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
            />

          </div>

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
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
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
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">

          Already have an account?{" "}

          <Link
            href="/login"
            className="font-medium text-white"
          >
            Log In
          </Link>

        </p>

      </div>

    </main>
  );
}