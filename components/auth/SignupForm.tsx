"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Loader2,
  Sparkles,
} from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
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
          // fallthrough
        }
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#060606] px-4 py-12 text-white overflow-hidden">
      {/* Background Grid Noise & Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hairline-x absolute inset-x-0 top-0 opacity-50" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-orange-500/10 blur-[130px]" />
      </div>

      {/* Main Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          mockup-card
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-[#09090c]/95
          backdrop-blur-2xl
          shadow-2xl
        "
      >
        {/* Top Window Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-0.5 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-[11px] font-semibold text-white/90">
              BuilderOS Auth · New Account
            </span>
          </div>

          <div className="w-12" />
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8">
          {/* Header & Logo */}
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              <Logo />
            </div>

            <h1
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Create Account
            </h1>

            <p className="mt-1.5 text-xs text-[#8a8a93]">
              Start building products faster with AI copilot.
            </p>
          </div>

          {/* Social Auth */}
          <SocialAuthButtons />

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] font-mono uppercase text-[#8a8a93]">
              or register with email
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-300">
              <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User size={16} className="pointer-events-none absolute left-3.5 text-[#8a8a93]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aryan Dhiman"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/60
                    py-2.5
                    pl-10
                    pr-4
                    text-xs
                    text-white
                    placeholder:text-[#8a8a93]
                    outline-none
                    transition-all
                    duration-200
                    focus:border-orange-500/60
                    focus:bg-black/80
                    focus:ring-2
                    focus:ring-orange-500/20
                  "
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="pointer-events-none absolute left-3.5 text-[#8a8a93]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/60
                    py-2.5
                    pl-10
                    pr-4
                    text-xs
                    text-white
                    placeholder:text-[#8a8a93]
                    outline-none
                    transition-all
                    duration-200
                    focus:border-orange-500/60
                    focus:bg-black/80
                    focus:ring-2
                    focus:ring-orange-500/20
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="pointer-events-none absolute left-3.5 text-[#8a8a93]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/60
                    py-2.5
                    pl-10
                    pr-10
                    text-xs
                    text-white
                    placeholder:text-[#8a8a93]
                    outline-none
                    transition-all
                    duration-200
                    focus:border-orange-500/60
                    focus:bg-black/80
                    focus:ring-2
                    focus:ring-orange-500/20
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#8a8a93] hover:text-white transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <ShieldCheck size={16} className="pointer-events-none absolute left-3.5 text-[#8a8a93]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/60
                    py-2.5
                    pl-10
                    pr-10
                    text-xs
                    text-white
                    placeholder:text-[#8a8a93]
                    outline-none
                    transition-all
                    duration-200
                    focus:border-orange-500/60
                    focus:bg-black/80
                    focus:ring-2
                    focus:ring-orange-500/20
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-[#8a8a93] hover:text-white transition-colors"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                btn-shimmer
                mt-2
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-white
                py-3
                text-xs
                font-bold
                text-black
                shadow-lg
                shadow-white/10
                transition-all
                duration-200
                hover:bg-zinc-100
                active:scale-95
                disabled:opacity-50
              "
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-xs text-[#8a8a93]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-white hover:text-orange-400 transition-colors"
            >
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}

