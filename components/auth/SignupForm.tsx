"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Logo from "@/components/shared/Logo";
import SocialAuthButtons from "./SocialAuthButtons";

export default function SignupForm() {
const router = useRouter();
const searchParams = useSearchParams();
const inviteToken = searchParams.get("invite");

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSignup = async (
e: React.FormEvent<HTMLFormElement>
) => {
e.preventDefault();


setError("");

if (!name.trim()) {
  setError("Name is required");
  return;
}

if (password.length < 8) {
  setError("Password must be at least 8 characters");
  return;
}

if (password !== confirmPassword) {
  setError("Passwords do not match");
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
    setError(data.error);
    return;
  }

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    setError(result.error);
    return;
  }

  // If user came via invite link, accept invitation automatically
  if (inviteToken) {
    try {
      const inviteRes = await fetch(`/api/invitations/${inviteToken}`, {
        method: "POST",
      });
      const inviteData = await inviteRes.json();

      if (inviteRes.ok && inviteData.projectId) {
        router.push(`/projects/${inviteData.projectId}`);
        router.refresh();
        return;
      }
    } catch {
      // fallthrough to dashboard if invite fails
    }
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

return ( <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4">

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

    {/* HEADER */}

    <div className="mb-6 text-center">

      <div className="mb-5 flex justify-center">
        <Logo />
      </div>

      <h1 className="text-3xl font-bold text-white">
        Create Account
      </h1>

      <p className="mt-2 text-sm text-zinc-500">
        Start building products with BuilderOS
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
      onSubmit={handleSignup}
      className="space-y-5"
    >

      <div>

        <label className="mb-2 block text-sm font-medium text-zinc-400">
          Full Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Aryan Dhiman"
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

      <div>

        <label className="mb-2 block text-sm text-zinc-400">
          Confirm Password
        </label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
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
            rounded-xl
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
          ? "Creating Account..."
          : "Create Account"}
      </button>

    </form>

    <p className="mt-6 text-center text-sm text-zinc-500">

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
